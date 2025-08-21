// controllers/users.controller.js
const User = require('../models/user.model');
const UserService = require('../services/userService');
const bcrypt = require('bcryptjs');

class UsersController {
  
  // Get all users with pagination, search, and filters
  async getAllUsers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;
      const search = req.query.search || '';
      const status = req.query.status || '';
      const role = req.query.role || '';

      // Build filter object with case-insensitive matching
      const filter = {};
      
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Fix case sensitivity for status filter
      if (status && status !== 'All Status') {
        filter.status = { $regex: new RegExp(`^${status}$`, 'i') };
      }
      
      // Fix case sensitivity for role filter  
      if (role && role !== 'All Roles') {
        filter.role = { $regex: new RegExp(`^${role}$`, 'i') };
      }

      // Get users with pagination
      const [users, total] = await Promise.all([
        User.find(filter)
          .select('-password')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        User.countDocuments(filter)
      ]);

      // Process users to include all required fields
      const processedUsers = users.map(user => {
        const userDoc = new User(user);
        return {
          ...user,
          id: user._id.toString(),
          avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username)}&background=6366f1&color=fff`,
          lastActive: userDoc.formatLastActive(user.lastActivity || user.createdAt)
        };
      });

      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: {
          users: processedUsers,
          pagination: {
            current: page,
            pages: totalPages,
            total,
            hasNext: page < totalPages,
            hasPrev: page > 1,
            showing: {
              from: total > 0 ? skip + 1 : 0,
              to: Math.min(skip + limit, total),
              total
            }
          }
        }
      });

    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users',
        error: error.message
      });
    }
  }

  // Get user statistics for dashboard cards
  async getUserStats(req, res) {
    try {
      const stats = await UserService.getUserStatistics();
      
      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user statistics',
        error: error.message
      });
    }
  }

  // Get single user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      
      const user = await User.findById(id).select('-password').lean();
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Process user data
      const userDoc = new User(user);
      const processedUser = {
        ...user,
        id: user._id.toString(),
        avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username)}&background=6366f1&color=fff`,
        lastActive: userDoc.formatLastActive(user.lastActivity || user.createdAt)
      };

      res.json({
        success: true,
        data: processedUser
      });

    } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user',
        error: error.message
      });
    }
  }

  // Create new user
  async createUser(req, res) {
    try {
      const {
        name,
        username,
        email,
        password,
        role = 'User',
        status = 'Active'
      } = req.body;

      // Validation
      if (!name || !username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Name, username, email, and password are required'
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this email or username already exists'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const userData = {
        name,
        username,
        email,
        password: hashedPassword,
        role,
        status,
        lastActivity: new Date(),
        deviceInfo: {
          browser: req.get('User-Agent')?.split(' ')[0] || 'Unknown',
          ip: req.ip || req.connection.remoteAddress,
        },
        metadata: {
          registrationSource: 'web',
          totalSessions: 0,
          totalTimeSpent: 0
        }
      };

      const newUser = await User.create(userData);
      
      // Remove password from response
      const userResponse = newUser.toObject();
      delete userResponse.password;
      
      // Process response
      userResponse.id = userResponse._id.toString();
      userResponse.lastActive = newUser.formatLastActive(newUser.lastActivity);
      userResponse.avatar = userResponse.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.name)}&background=6366f1&color=fff`;

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: userResponse
      });

    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create user',
        error: error.message
      });
    }
  }

  // Update user
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Remove sensitive fields
      delete updates.password;
      delete updates._id;
      delete updates.id;
      delete updates.createdAt;
      delete updates.updatedAt;

      // Add activity update
      updates.lastActivity = new Date();

      const user = await User.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Process response
      const userResponse = user.toObject();
      userResponse.id = userResponse._id.toString();
      userResponse.lastActive = user.formatLastActive(user.lastActivity);
      userResponse.avatar = userResponse.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`;

      res.json({
        success: true,
        message: 'User updated successfully',
        data: userResponse
      });

    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user',
        error: error.message
      });
    }
  }

  // Delete user - FIXED to do permanent delete by default
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Prevent self-deletion
      if (req.user && id === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete yourself'
        });
      }

      // Permanently delete user (changed from soft delete)
      const user = await User.findByIdAndDelete(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'User deleted successfully'
      });

    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete user',
        error: error.message
      });
    }
  }

  // Bulk actions on users
  async bulkAction(req, res) {
    try {
      const { userIds, action, data = {} } = req.body;

      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'User IDs array is required'
        });
      }

      if (!action) {
        return res.status(400).json({
          success: false,
          message: 'Action is required'
        });
      }

      let updateData = { lastActivity: new Date() };
      let actionDescription = '';

      switch (action) {
        case 'activate':
          updateData.status = 'Active';
          actionDescription = 'activated';
          break;
        case 'deactivate':
          updateData.status = 'Inactive';
          updateData.isOnline = false;
          actionDescription = 'deactivated';
          break;
        case 'suspend':
          updateData.status = 'Suspended';
          updateData.isOnline = false;
          actionDescription = 'suspended';
          break;
        case 'update_role':
          if (!data.role || !['User', 'Admin'].includes(data.role)) {
            return res.status(400).json({
              success: false,
              message: 'Valid role is required'
            });
          }
          updateData.role = data.role;
          actionDescription = `role updated to ${data.role}`;
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid action'
          });
      }

      // Prevent admin from affecting themselves
      const currentUserId = req.user ? req.user._id.toString() : null;
      const filteredUserIds = userIds.filter(id => id !== currentUserId);

      const result = await User.updateMany(
        { _id: { $in: filteredUserIds } },
        updateData
      );

      res.json({
        success: true,
        message: `Bulk action completed: ${result.modifiedCount} users ${actionDescription}`,
        data: {
          modifiedCount: result.modifiedCount,
          matchedCount: result.matchedCount
        }
      });

    } catch (error) {
      console.error('Bulk action error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to perform bulk action',
        error: error.message
      });
    }
  }

  // Get user activity summary
  async getUserActivity(req, res) {
    try {
      const activities = await UserService.getRecentUserActivities();
      
      res.json({
        success: true,
        data: activities
      });

    } catch (error) {
      console.error('Get user activity error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user activities',
        error: error.message
      });
    }
  }

  // Toggle user online status (for testing)
  async toggleUserStatus(req, res) {
    try {
      const { id } = req.params;
      
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      user.isOnline = !user.isOnline;
      user.lastActivity = new Date();
      await user.save();

      const userResponse = user.toObject();
      delete userResponse.password;
      userResponse.id = userResponse._id.toString();
      userResponse.lastActive = user.formatLastActive(user.lastActivity);
      userResponse.avatar = userResponse.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`;

      res.json({
        success: true,
        message: `User ${user.isOnline ? 'online' : 'offline'} status updated`,
        data: userResponse
      });

    } catch (error) {
      console.error('Toggle user status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to toggle user status',
        error: error.message
      });
    }
  }
}

module.exports = new UsersController();