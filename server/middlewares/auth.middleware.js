// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Activity = require('../models/activity.model');

// Authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found'
      });
    }

    // FIXED: Check for both 'active' and 'Active' status (case insensitive)
    if (user.status.toLowerCase() !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is suspended or deleted'
      });
    }

    // Update user activity
    await User.findByIdAndUpdate(user._id, {
      lastActivity: new Date(),
      isOnline: true
    });

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token format'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        message: 'Token has expired'
      });
    }
    
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Require admin role
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // FIXED: Case insensitive role check
  if (req.user.role.toLowerCase() !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Generic authorization middleware (backward compatibility)
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    // FIXED: Case insensitive role checking
    if (!allowedRoles.some(role => role.toLowerCase() === req.user.role.toLowerCase())) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
      });
    }
    
    next();
  };
};

// Log activity middleware
const logActivity = (type, description) => {
  return async (req, res, next) => {
    try {
      if (req.user && Activity) {
        await Activity.create({
          userId: req.user._id,
          type,
          description: description || `User ${type}`,
          ip: req.ip || req.connection.remoteAddress,
          userAgent: req.get('User-Agent'),
          metadata: {
            endpoint: req.originalUrl,
            method: req.method,
            body: req.method !== 'GET' ? req.body : undefined
          }
        });
      }
      next();
    } catch (error) {
      console.error('Activity logging error:', error);
      next(); // Continue even if logging fails
    }
  };
};

// FIXED: More lenient rate limiting to prevent blocking legitimate requests
const createRateLimit = (windowMs, max, message) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!requests.has(key)) {
      requests.set(key, []);
    }
    
    const userRequests = requests.get(key);
    const recentRequests = userRequests.filter(time => time > windowStart);
    
    if (recentRequests.length >= max) {
      return res.status(429).json({
        success: false,
        message: message || 'Too many requests',
        retryAfter: Math.ceil((userRequests[0] + windowMs - now) / 1000)
      });
    }
    
    recentRequests.push(now);
    requests.set(key, recentRequests);
    
    // FIXED: More frequent cleanup to prevent memory issues
    if (Math.random() < 0.05) { // Increased from 0.01 to 0.05
      for (const [key, times] of requests.entries()) {
        const filtered = times.filter(time => time > windowStart);
        if (filtered.length === 0) {
          requests.delete(key);
        } else {
          requests.set(key, filtered);
        }
      }
    }
    
    next();
  };
};

module.exports = {
  authenticateToken,
  requireAdmin,
  authorize, // Keep for backward compatibility
  logActivity,
  createRateLimit
};