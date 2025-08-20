// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Activity = require('../models/activity.model');
const { createRateLimit } = require('../middlewares/auth.middleware');

// Rate limiting for auth routes
const loginRateLimit = createRateLimit(15 * 60 * 1000, 5, 'Too many login attempts');
const registerRateLimit = createRateLimit(60 * 60 * 1000, 3, 'Too many registration attempts');

class AuthController {
  static async register(req, res) {
    try {
      const { username, email, password, role } = req.body;
      // Validation
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username, email, and password are required'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: existingUser.email === email 
            ? 'Email already registered' 
            : 'Username already taken'
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Get device info
      const deviceInfo = AuthController.parseUserAgent(req.get('User-Agent'));

      // Create user
      const user = await User.create({
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: ( role && role =="admin" )  ? 'admin' : 'user',
        deviceInfo: {
          ...deviceInfo,
          ip: req.ip || req.connection.remoteAddress
        },
        metadata: {
          registrationSource: req.get('User-Agent')?.includes('Mobile') ? 'mobile' : 'web',
          country: req.get('CF-IPCountry') || 'Unknown',
          timezone: req.body.timezone || 'UTC'
        }
      });

      // Log registration activity
      await Activity.create({
        userId: user._id,
        type: 'register',
        description: `${username} joined the platform`,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        metadata: {
          registrationMethod: 'email',
          deviceInfo
        }
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: userResponse,
          token
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password, rememberMe = false } = req.body;
      console.log(req.body);

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Find user
      const user = await User.findOne({ 
        email: email.toLowerCase().trim() 
      }).select('+password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check account status
      if (user.status === 'suspended') {
        return res.status(403).json({
          success: false,
          message: 'Account is suspended. Please contact support.'
        });
      }

      if (user.status === 'deleted') {
        return res.status(403).json({
          success: false,
          message: 'Account not found'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Get device info
      const deviceInfo = AuthController.parseUserAgent(req.get('User-Agent'));

      // Update user login info
      await User.findByIdAndUpdate(user._id, {
        lastLogin: new Date(),
        isOnline: true,
        lastActivity: new Date(),
        $inc: { loginCount: 1 },
        deviceInfo: {
          ...deviceInfo,
          ip: req.ip || req.connection.remoteAddress
        }
      });

      // Log login activity
      await Activity.create({
        userId: user._id,
        type: 'login',
        description: `${user.username} logged in`,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        metadata: {
          loginMethod: 'password',
          deviceInfo,
          rememberMe
        }
      });

      // Generate JWT token
      const tokenExpiry = rememberMe ? '30d' : '7d';
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: tokenExpiry }
      );

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: userResponse,
          token,
          expiresIn: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async logout(req, res) {
    try {
      const userId = req.user._id;

      // Update user online status
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastActivity: new Date()
      });

      // Log logout activity
      await Activity.create({
        userId,
        type: 'logout',
        description: `${req.user.username} logged out`,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
      });

      res.json({
        success: true,
        message: 'Logout successful'
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token required'
        });
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user || user.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        });
      }

      // Generate new access token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        data: { token }
      });

    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user._id)
        .select('-password')
        .lean();

      // Get user statistics
      const [
        totalActivities,
        loginCount,
        lastActivities
      ] = await Promise.all([
        Activity.countDocuments({ userId: user._id }),
        Activity.countDocuments({ userId: user._id, type: 'login' }),
        Activity.find({ userId: user._id })
          .sort({ createdAt: -1 })
          .limit(5)
          .select('type description createdAt')
          .lean()
      ]);

      const userProfile = {
        ...user,
        statistics: {
          totalActivities,
          loginCount,
          memberSince: user.createdAt,
          lastLogin: user.lastLogin,
          activityStatus: user.activityStatus
        },
        recentActivities: lastActivities
      };

      res.json({
        success: true,
        data: userProfile
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch profile',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const userId = req.user._id;
      const allowedUpdates = ['username', 'preferences', 'metadata'];
      const updates = {};

      // Filter allowed updates
      Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updates[key] = req.body[key];
        }
      });

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid updates provided'
        });
      }

      // Validate username if being updated
      if (updates.username) {
        const existingUser = await User.findOne({
          username: updates.username,
          _id: { $ne: userId }
        });

        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'Username already taken'
          });
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { ...updates, lastActivity: new Date() },
        { new: true, runValidators: true }
      ).select('-password');

      // Log profile update activity
      await Activity.create({
        userId,
        type: 'profile_update',
        description: `${req.user.username} updated profile`,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        metadata: { updatedFields: Object.keys(updates) }
      });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long'
        });
      }

      const user = await User.findById(req.user._id).select('+password');

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(12);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      await User.findByIdAndUpdate(user._id, {
        password: hashedNewPassword,
        lastActivity: new Date()
      });

      // Log password change activity
      await Activity.create({
        userId: user._id,
        type: 'password_change',
        description: `${user.username} changed password`,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        severity: 'medium'
      });

      res.json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change password',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Helper method to parse user agent
  static parseUserAgent(userAgent) {
    if (!userAgent) return { browser: 'Unknown', os: 'Unknown', device: 'Unknown' };

    const browser = userAgent.includes('Chrome') ? 'Chrome' :
                   userAgent.includes('Firefox') ? 'Firefox' :
                   userAgent.includes('Safari') ? 'Safari' :
                   userAgent.includes('Edge') ? 'Edge' : 'Unknown';

    const os = userAgent.includes('Windows') ? 'Windows' :
              userAgent.includes('Mac') ? 'MacOS' :
              userAgent.includes('Linux') ? 'Linux' :
              userAgent.includes('Android') ? 'Android' :
              userAgent.includes('iOS') ? 'iOS' : 'Unknown';

    const device = userAgent.includes('Mobile') ? 'Mobile' :
                  userAgent.includes('Tablet') ? 'Tablet' : 'Desktop';

    return { browser, os, device };
  }
}

module.exports = {
  AuthController,
  loginRateLimit,
  registerRateLimit
};