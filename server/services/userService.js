// services/userService.js
const User = require('../models/user.model');

class UserService {
  
  // Get comprehensive user statistics
  async getUserStatistics() {
    try {
      const [
        totalUsers,
        activeUsers,
        adminUsers,
        inactiveUsers,
        suspendedUsers,
        onlineUsers,
        todayRegistrations,
        thisWeekRegistrations,
        thisMonthRegistrations
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ status: 'Active' }),
        User.countDocuments({ role: 'Admin' }),
        User.countDocuments({ status: 'Inactive' }),
        User.countDocuments({ status: 'Suspended' }),
        User.countDocuments({ isOnline: true }),
        User.countDocuments({
          createdAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }),
        User.countDocuments({
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }),
        User.countDocuments({
          createdAt: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        })
      ]);

      // Calculate growth rates
      const lastWeekRegistrations = await User.countDocuments({
        createdAt: {
          $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      });

      const weeklyGrowthRate = lastWeekRegistrations > 0 
        ? ((thisWeekRegistrations - lastWeekRegistrations) / lastWeekRegistrations * 100).toFixed(1)
        : 0;

      return {
        totalUsers,
        activeUsers,
        adminUsers,
        inactiveUsers: inactiveUsers + suspendedUsers, // Combine inactive and suspended for frontend display
        onlineUsers,
        todayRegistrations,
        thisWeekRegistrations,
        thisMonthRegistrations,
        weeklyGrowthRate,
        activePercentage: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0,
        adminPercentage: totalUsers > 0 ? ((adminUsers / totalUsers) * 100).toFixed(1) : 0
      };

    } catch (error) {
      console.error('Error getting user statistics:', error);
      throw error;
    }
  }

  // Get recent user activities (simulated)
  async getRecentUserActivities() {
    try {
      // Get recently active users
      const recentUsers = await User.find({
        lastActivity: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      })
      .select('name username lastActivity status role')
      .sort({ lastActivity: -1 })
      .limit(10)
      .lean();

      // Convert to activity format
      const activities = recentUsers.map(user => ({
        id: user._id,
        user: user.name,
        username: user.username,
        action: this.getRandomActivity(),
        time: this.formatTimeAgo(user.lastActivity),
        status: user.status,
        role: user.role
      }));

      return activities;

    } catch (error) {
      console.error('Error getting user activities:', error);
      throw error;
    }
  }

  // Get user registration trends
  async getRegistrationTrends(days = 30) {
    try {
      const trends = await User.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
            }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      return trends;

    } catch (error) {
      console.error('Error getting registration trends:', error);
      throw error;
    }
  }

  // Get users by role distribution
  async getRoleDistribution() {
    try {
      const distribution = await User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]);

      return distribution.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

    } catch (error) {
      console.error('Error getting role distribution:', error);
      throw error;
    }
  }

  // Get users by status distribution
  async getStatusDistribution() {
    try {
      const distribution = await User.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      return distribution.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

    } catch (error) {
      console.error('Error getting status distribution:', error);
      throw error;
    }
  }

  // Update user activity
  async updateUserActivity(userId, activityData = {}) {
    try {
      const updateData = {
        lastActivity: new Date(),
        isOnline: true,
        ...activityData
      };

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      );

      return user;

    } catch (error) {
      console.error('Error updating user activity:', error);
      throw error;
    }
  }

  // Bulk update users
  async bulkUpdateUsers(userIds, updateData) {
    try {
      const result = await User.updateMany(
        { _id: { $in: userIds } },
        { 
          ...updateData, 
          lastActivity: new Date() 
        }
      );

      return result;

    } catch (error) {
      console.error('Error in bulk update:', error);
      throw error;
    }
  }

  // Helper method to generate random activity
  getRandomActivity() {
    const activities = [
      'logged in',
      'updated profile',
      'changed password',
      'uploaded file',
      'posted content',
      'logged out',
      'viewed dashboard',
      'updated settings'
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  }

  // Helper method to format time ago
  formatTimeAgo(date) {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return new Date(date).toLocaleDateString();
  }

  // Clean inactive users (mark users as offline if inactive for more than 5 minutes)
  async cleanInactiveUsers() {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      const result = await User.updateMany(
        { 
          isOnline: true,
          lastActivity: { $lt: fiveMinutesAgo }
        },
        { isOnline: false }
      );

      return result.modifiedCount;

    } catch (error) {
      console.error('Error cleaning inactive users:', error);
      throw error;
    }
  }

  // Get user performance metrics
  async getUserPerformanceMetrics() {
    try {
      const metrics = await User.aggregate([
        {
          $group: {
            _id: null,
            avgLoginCount: { $avg: '$loginCount' },
            maxLoginCount: { $max: '$loginCount' },
            avgTotalSessions: { $avg: '$metadata.totalSessions' },
            avgTimeSpent: { $avg: '$metadata.totalTimeSpent' }
          }
        }
      ]);

      return metrics[0] || {
        avgLoginCount: 0,
        maxLoginCount: 0,
        avgTotalSessions: 0,
        avgTimeSpent: 0
      };

    } catch (error) {
      console.error('Error getting user performance metrics:', error);
      throw error;
    }
  }
}

module.exports = new UserService();