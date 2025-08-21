// routes/user.routes.js
const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users.controller');
const { authenticateToken, requireAdmin, createRateLimit } = require('../middlewares/auth.middleware');

// Rate limiting for user operations
//const userRateLimit = createRateLimit(
//  15 * 60 * 1000, // 15 minutes
//  50, // 50 requests per window
 // 'Too many user operations'
//);

// Apply rate limiting and authentication to all routes
//router.use(userRateLimit);
router.use(authenticateToken);

// Public routes (no admin required)
router.get('/stats', UsersController.getUserStats);
router.get('/activity', UsersController.getUserActivity);

// Admin only routes
router.use(requireAdmin);

// Get all users with pagination, search, and filters
router.get('/', UsersController.getAllUsers);

// Get single user by ID
router.get('/:id', UsersController.getUserById);

// Create new user
router.post('/', UsersController.createUser);

// Update user
router.put('/:id', UsersController.updateUser);

// Delete user (soft delete by default, ?permanent=true for hard delete)
router.delete('/:id', UsersController.deleteUser);

// Bulk actions on users
router.post('/bulk-action', UsersController.bulkAction);

// Toggle user online status (for testing/demo)
router.patch('/:id/toggle-status', UsersController.toggleUserStatus);

module.exports = router;