// routes/systemLogs.routes.js
const express = require("express");
const router = express.Router();
const SystemLogsController = require("../controllers/systemLogs.controller");
const {
  authenticateToken,
  requireAdmin,
} = require("../middlewares/auth.middleware");
const { body, query, param } = require("express-validator");

// Validation middlewares
const validateCreateLog = [
  body("level")
    .isIn(["error", "warning", "info", "debug"])
    .withMessage("Level must be one of: error, warning, info, debug"),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 1000 })
    .withMessage("Message must be less than 1000 characters"),
  body("source").trim().notEmpty().withMessage("Source is required"),
  body("category")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Category must be less than 50 characters"),
  body("details")
    .optional()
    .isObject()
    .withMessage("Details must be an object"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("tags.*")
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage("Each tag must be less than 30 characters"),
];

const validateLogQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("level")
    .optional()
    .isIn(["error", "warning", "info", "debug", "All Levels"])
    .withMessage("Invalid level filter"),
  query("timeRange")
    .optional()
    .isIn(["Last Hour", "Last 24 Hours", "Last 7 Days", "Last 30 Days"])
    .withMessage("Invalid time range"),
  query("resolved")
    .optional()
    .isBoolean()
    .withMessage("Resolved must be a boolean"),
  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search term must be less than 100 characters"),
];

const validateClearLogs = [
  body("level")
    .optional()
    .isIn(["error", "warning", "info", "debug", "All Levels"])
    .withMessage("Invalid level"),
  body("olderThan")
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage("olderThan must be between 1 and 365 days"),
];

// Public routes (with authentication)
router.use(authenticateToken);

/**
 * @route   GET /api/system-logs/overview
 * @desc    Get system logs overview for dashboard
 * @access  Private (Admin only)
 */
router.get(
  "/overview",
  requireAdmin,
  SystemLogsController.getSystemLogsOverview
);

/**
 * @route   GET /api/system-logs
 * @desc    Get system logs with filtering and pagination
 * @access  Private (Admin only)
 */
router.get(
  "/",
  requireAdmin,
  validateLogQuery,
  SystemLogsController.getSystemLogs
);

/**
 * @route   GET /api/system-logs/status
 * @desc    Get current system status
 * @access  Private (Admin only)
 */
router.get("/status", requireAdmin, SystemLogsController.getSystemStatus);

/**
 * @route   GET /api/system-logs/activity-trend
 * @desc    Get activity trend data
 * @access  Private (Admin only)
 */
router.get(
  "/activity-trend",
  requireAdmin,
  [
    query("hours")
      .optional()
      .isInt({ min: 1, max: 168 })
      .withMessage("Hours must be between 1 and 168 (7 days)"),
  ],
  SystemLogsController.getActivityTrend
);

/**
 * @route   POST /api/system-logs
 * @desc    Create a new system log entry
 * @access  Private (Admin only)
 */
router.post(
  "/",
  requireAdmin,
  validateCreateLog,
  SystemLogsController.createSystemLog
);

/**
 * @route   PUT /api/system-logs/:id/resolve
 * @desc    Resolve a system log entry
 * @access  Private (Admin only)
 */
router.put(
  "/:id/resolve",
  requireAdmin,
  [param("id").isMongoId().withMessage("Invalid log ID")],
  SystemLogsController.resolveSystemLog
);

/**
 * @route   GET /api/system-logs/export
 * @desc    Export system logs
 * @access  Private (Admin only)
 */
router.get(
  "/export",
  requireAdmin,
  [
    query("format")
      .optional()
      .isIn(["json", "csv"])
      .withMessage("Format must be json or csv"),
    ...validateLogQuery,
  ],
  SystemLogsController.exportSystemLogs
);

/**
 * @route   DELETE /api/system-logs/clear
 * @desc    Clear system logs (bulk delete)
 * @access  Private (Admin only)
 */
router.delete(
  "/clear",
  requireAdmin,
  validateClearLogs,
  SystemLogsController.clearSystemLogs
);

/**
 * @route   GET /api/system-logs/filters
 * @desc    Get available filter options
 * @access  Private (Admin only)
 */
router.get("/filters", requireAdmin, async (req, res) => {
  try {
    const SystemLog = require("../models/systemLogs.model");

    const [sources, categories] = await Promise.all([
      SystemLog.distinct("source"),
      SystemLog.distinct("category"),
    ]);

    res.json({
      success: true,
      data: {
        levels: ["Error", "Warning", "Info", "Debug"],
        timeRanges: [
          "Last Hour",
          "Last 24 Hours",
          "Last 7 Days",
          "Last 30 Days",
        ],
        sources: sources.map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
        categories: categories.map(
          (c) => c.charAt(0).toUpperCase() + c.slice(1)
        ),
        environments: ["development", "staging", "production"],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get filter options",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/system-logs/stats
 * @desc    Get system logs statistics
 * @access  Private (Admin only)
 */
router.get("/stats", requireAdmin, async (req, res) => {
  try {
    const SystemLog = require("../models/systemLogs.model");
    const stats = await SystemLog.getLogStatistics();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get statistics",
      error: error.message,
    });
  }
});

module.exports = router;
