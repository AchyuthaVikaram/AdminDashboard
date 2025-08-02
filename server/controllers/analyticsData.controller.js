// controllers/analyticsData.controller.js
const AnalyticsDataService = require('../services/analyticsDataService');
const { validationResult } = require('express-validator');

class AnalyticsDataController {

  // Get all analytics overview data
  static async getAnalyticsOverview(req, res) {
    try {
      const { timeRange = 'Last 7 Days', category = 'All Categories' } = req.query;
      
      // Log user activity
      await AnalyticsDataService.logActivity(
        req.user.id, 
        'view_changed', 
        { timeRange, category }, 
        req
      );

      // Generate fresh data
      const [
        statsData,
        contentPerformance,
        userDistribution,
        systemPerformance,
        filterOptions
      ] = await Promise.all([
        AnalyticsDataService.generateRealtimeStats(),
        AnalyticsDataService.generateContentPerformance(timeRange),
        AnalyticsDataService.generateUserDistribution(),
        AnalyticsDataService.generateSystemPerformance(),
        AnalyticsDataService.getFilterOptions()
      ]);

      res.json({
        success: true,
        message: 'Analytics overview retrieved successfully',
        data: {
          stats: statsData,
          contentPerformance,
          userDistribution,
          systemPerformance,
          filterOptions: {
            timeRanges: filterOptions.timeRanges,
            categories: filterOptions.categories
          },
          metadata: {
            lastUpdated: new Date(),
            timeRange,
            category,
            refreshRate: '30s' // indicating how often data refreshes
          }
        }
      });

    } catch (error) {
      console.error('Error in getAnalyticsOverview:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve analytics overview',
        error: error.message
      });
    }
  }

  // Get real-time stats only
  static async getRealtimeStats(req, res) {
    try {
      const statsData = await AnalyticsDataService.generateRealtimeStats();

      res.json({
        success: true,
        message: 'Real-time stats retrieved successfully',
        data: statsData,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Error in getRealtimeStats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve real-time stats',
        error: error.message
      });
    }
  }

  // Get content performance data
  static async getContentPerformance(req, res) {
    try {
      const { timeRange = 'Last 7 Days', category = 'All Categories' } = req.query;
      
      let contentData = await AnalyticsDataService.generateContentPerformance(timeRange);

      // Filter by category if specified
      if (category !== 'All Categories') {
        contentData = contentData.filter(item => 
          item.category === category || item.name.toLowerCase().includes(category.toLowerCase())
        );
      }

      res.json({
        success: true,
        message: 'Content performance data retrieved successfully',
        data: contentData,
        filters: { timeRange, category },
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Error in getContentPerformance:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve content performance data',
        error: error.message
      });
    }
  }

  // Get user distribution data
  static async getUserDistribution(req, res) {
    try {
      const userDistribution = await AnalyticsDataService.generateUserDistribution();

      res.json({
        success: true,
        message: 'User distribution data retrieved successfully',
        data: userDistribution,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Error in getUserDistribution:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user distribution data',
        error: error.message
      });
    }
  }

  // Get system performance data
  static async getSystemPerformance(req, res) {
    try {
      const systemPerformance = await AnalyticsDataService.generateSystemPerformance();

      res.json({
        success: true,
        message: 'System performance data retrieved successfully',
        data: systemPerformance,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Error in getSystemPerformance:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve system performance data',
        error: error.message
      });
    }
  }

  // Apply filters to analytics data
  static async applyFilters(req, res) {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { timeRange, category } = req.body;

      // Log filter application
      await AnalyticsDataService.logActivity(
        req.user.id, 
        'filter_applied', 
        { timeRange, category }, 
        req
      );

      // Get filtered data
      const [
        statsData,
        contentPerformance,
        userDistribution,
        systemPerformance
      ] = await Promise.all([
        AnalyticsDataService.generateRealtimeStats(),
        AnalyticsDataService.generateContentPerformance(timeRange),
        AnalyticsDataService.generateUserDistribution(),
        AnalyticsDataService.generateSystemPerformance()
      ]);

      // Apply category filter to content performance
      let filteredContentPerformance = contentPerformance;
      if (category !== 'All Categories') {
        filteredContentPerformance = contentPerformance.filter(item => 
          item.category === category
        );
      }

      res.json({
        success: true,
        message: 'Filters applied successfully',
        data: {
          stats: statsData,
          contentPerformance: filteredContentPerformance,
          userDistribution,
          systemPerformance,
          appliedFilters: { timeRange, category },
          timestamp: new Date()
        }
      });

    } catch (error) {
      console.error('Error in applyFilters:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to apply filters',
        error: error.message
      });
    }
  }

  // Get filter options
  static async getFilterOptions(req, res) {
    try {
      const filterOptions = await AnalyticsDataService.getFilterOptions();

      res.json({
        success: true,
        message: 'Filter options retrieved successfully',
        data: {
          timeRanges: filterOptions.timeRanges,
          categories: filterOptions.categories
        }
      });

    } catch (error) {
      console.error('Error in getFilterOptions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve filter options',
        error: error.message
      });
    }
  }

  // Get historical comparison data
  static async getHistoricalComparison(req, res) {
    try {
      const { timeRange = 'Last 7 Days' } = req.query;
      
      const historicalData = await AnalyticsDataService.getHistoricalComparison(timeRange);

      res.json({
        success: true,
        message: 'Historical comparison data retrieved successfully',
        data: historicalData,
        timeRange
      });

    } catch (error) {
      console.error('Error in getHistoricalComparison:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve historical comparison data',
        error: error.message
      });
    }
  }

  // Export analytics data
  static async exportAnalyticsData(req, res) {
    try {
      const { format = 'json', timeRange = 'Last 7 Days' } = req.query;

      // Log export activity
      await AnalyticsDataService.logActivity(
        req.user.id, 
        'export_data', 
        { format, timeRange }, 
        req
      );

      // Get comprehensive data
      const [
        statsData,
        contentPerformance,
        userDistribution,
        systemPerformance,
        historicalData
      ] = await Promise.all([
        AnalyticsDataService.generateRealtimeStats(),
        AnalyticsDataService.generateContentPerformance(timeRange),
        AnalyticsDataService.generateUserDistribution(),
        AnalyticsDataService.generateSystemPerformance(),
        AnalyticsDataService.getHistoricalComparison(timeRange)
      ]);

      const exportData = {
        exportInfo: {
          generatedAt: new Date(),
          exportedBy: req.user.username,
          timeRange,
          format
        },
        currentStats: statsData,
        contentPerformance,
        userDistribution,
        systemPerformance,
        historicalData: historicalData.summary
      };

      if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=analytics-${Date.now()}.json`);
        return res.json(exportData);
      }

      // Default to JSON if format not supported
      res.json({
        success: true,
        message: 'Analytics data exported successfully',
        data: exportData
      });

    } catch (error) {
      console.error('Error in exportAnalyticsData:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to export analytics data',
        error: error.message
      });
    }
  }

  // Refresh all analytics data
  static async refreshAnalyticsData(req, res) {
    try {
      // Log refresh activity
      await AnalyticsDataService.logActivity(
        req.user.id, 
        'refresh_data', 
        { timestamp: new Date() }, 
        req
      );

      // Generate fresh data for all components
      const [
        statsData,
        contentPerformance,
        userDistribution,
        systemPerformance
      ] = await Promise.all([
        AnalyticsDataService.generateRealtimeStats(),
        AnalyticsDataService.generateContentPerformance(),
        AnalyticsDataService.generateUserDistribution(),
        AnalyticsDataService.generateSystemPerformance()
      ]);

      res.json({
        success: true,
        message: 'Analytics data refreshed successfully',
        data: {
          stats: statsData,
          contentPerformance,
          userDistribution,
          systemPerformance,
          lastRefresh: new Date()
        }
      });

    } catch (error) {
      console.error('Error in refreshAnalyticsData:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to refresh analytics data',
        error: error.message
      });
    }
  }

  // Get analytics activity log
  static async getAnalyticsActivity(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      const activities = await AnalyticsDataService.getAnalyticsActivity(skip, limit);
      const totalActivities = await AnalyticsActivity.countDocuments();

      res.json({
        success: true,
        message: 'Analytics activity retrieved successfully',
        data: {
          activities,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalActivities / limit),
            totalItems: totalActivities,
            hasNext: skip + limit < totalActivities,
            hasPrev: page > 1
          }
        }
      });

    } catch (error) {
      console.error('Error in getAnalyticsActivity:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve analytics activity',
        error: error.message
      });
    }
  }
}

module.exports = AnalyticsDataController;