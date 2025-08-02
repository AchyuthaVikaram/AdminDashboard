// routes/analyticsData.routes.js
const express = require('express');
const { body, query } = require('express-validator');
const AnalyticsDataController = require('../controllers/analyticsData.controller');
const { authenticateToken, requireAdmin, createRateLimit } = require('../middlewares/auth.middleware');

const router = express.Router();

// Rate limiting for analytics endpoints
const analyticsRateLimit = createRateLimit(
  1 * 60 * 1000, // 1 minute
  30, // 30 requests per minute
  'Too many analytics requests'
);

// Validation middlewares
const validateFilters = [
  body('timeRange')
    .optional()
    .isIn(['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Last Year'])
    .withMessage('Invalid time range'),
  body('category')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters')
];

const validateQuery = [
  query('timeRange')
    .optional()
    .isIn(['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Last Year'])
    .withMessage('Invalid time range'),
  query('category')
    .optional()
    .isString()
    .trim()
    .withMessage('Invalid category'),
  query('format')
    .optional()
    .isIn(['json', 'csv'])
    .withMessage('Invalid export format'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// Apply middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);  // Changed from authorize('admin') to requireAdmin
router.use(analyticsRateLimit);

// Main analytics overview endpoint
router.get('/overview', 
  validateQuery,
  AnalyticsDataController.getAnalyticsOverview
);

// Real-time stats endpoint
router.get('/stats/realtime', 
  AnalyticsDataController.getRealtimeStats
);

// Content performance endpoint
router.get('/content-performance', 
  validateQuery,
  AnalyticsDataController.getContentPerformance
);

// User distribution endpoint
router.get('/user-distribution', 
  AnalyticsDataController.getUserDistribution
);

// System performance endpoint
router.get('/system-performance', 
  AnalyticsDataController.getSystemPerformance
);

// Filter options endpoint
router.get('/filter-options', 
  AnalyticsDataController.getFilterOptions
);

// Apply filters endpoint
router.post('/apply-filters', 
  validateFilters,
  AnalyticsDataController.applyFilters
);

// Historical comparison endpoint
router.get('/historical-comparison', 
  validateQuery,
  AnalyticsDataController.getHistoricalComparison
);

// Export data endpoint
router.get('/export', 
  validateQuery,
  AnalyticsDataController.exportAnalyticsData
);

// Refresh data endpoint
router.post('/refresh', 
  AnalyticsDataController.refreshAnalyticsData
);

// Analytics activity log endpoint
router.get('/activity', 
  validateQuery,
  AnalyticsDataController.getAnalyticsActivity
);

// Health check for analytics service
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Analytics service is healthy',
    timestamp: new Date(),
    endpoints: {
      overview: '/api/analytics-data/overview',
      realtimeStats: '/api/analytics-data/stats/realtime',
      contentPerformance: '/api/analytics-data/content-performance',
      userDistribution: '/api/analytics-data/user-distribution',
      systemPerformance: '/api/analytics-data/system-performance',
      filterOptions: '/api/analytics-data/filter-options',
      applyFilters: '/api/analytics-data/apply-filters',
      export: '/api/analytics-data/export',
      refresh: '/api/analytics-data/refresh'
    }
  });
});

module.exports = router;