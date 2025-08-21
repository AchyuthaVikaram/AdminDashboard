// controllers/systemLogs.controller.js

const { validationResult } = require("express-validator");
const Activity = require("../models/activity.model");
const systemLog = require("../models/systemLogs.model");

class SystemLogsController {
  // Get system logs overview (for the main dashboard)
  static async getSystemLogsOverview(req, res) {
    try {
      const [stats, recentAlerts, systemHealth, activityTrend] =
        await Promise.all([
          SystemLog.getLogStatistics(),
          SystemLogsController.getRecentAlerts(10),
          SystemLog.getSystemHealth(),
          SystemLog.getActivityTrend(24),
        ]);

      // Calculate uptime percentage (mock calculation - you can implement based on your needs)
      const uptimePercentage = SystemLogsController.calculateUptime();

      // Format stats for frontend
      const formattedStats = [
        {
          title: "Total Logs",
          value: stats.totalLogs.toLocaleString(),
          subtitle: "All recorded events",
          icon: "📊",
          bgColor: "bg-gradient-to-br from-blue-500/20 to-blue-600/30",
          textColor: "text-blue-400",
        },
        {
          title: "Errors Today",
          value: stats.today.errors.toString(),
          subtitle: "Critical failures",
          icon: "⚠️",
          bgColor: "bg-gradient-to-br from-red-500/20 to-red-600/30",
          textColor: "text-red-400",
        },
        {
          title: "Warnings",
          value: stats.today.warnings.toString(),
          subtitle: "Moderate issues",
          icon: "⚠️",
          bgColor: "bg-gradient-to-br from-yellow-500/20 to-yellow-600/30",
          textColor: "text-yellow-400",
        },
        {
          title: "Uptime",
          value: `${uptimePercentage}%`,
          subtitle: "System availability",
          icon: "✅",
          bgColor: "bg-gradient-to-br from-green-500/20 to-green-600/30",
          textColor: "text-green-400",
        },
      ];

      res.json({
        success: true,
        data: {
          stats: formattedStats,
          recentAlerts,
          systemHealth,
          activityTrend:
            SystemLogsController.formatActivityTrend(activityTrend),
        },
      });
    } catch (error) {
      console.error("Error in getSystemLogsOverview:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve system logs overview",
        error: error.message,
      });
    }
  }

  // Get system logs with filtering and pagination
  static async getSystemLogs(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const skip = (page - 1) * limit;

      const {
        level,
        source,
        category,
        timeRange,
        search,
        resolved,
        environment,
      } = req.query;

      // Build filter
      const filter = {};

      if (level && level !== "All Levels") {
        filter.level = level.toLowerCase();
      }

      if (source) {
        filter.source = source;
      }

      if (category) {
        filter.category = category;
      }

      if (resolved !== undefined) {
        filter.resolved = resolved === "true";
      }

      if (environment) {
        filter.environment = environment;
      }

      // Time range filter
      if (timeRange) {
        const timeFilter = SystemLogsController.parseTimeRange(timeRange);
        if (timeFilter) {
          filter.createdAt = timeFilter;
        }
      }

      // Search filter
      if (search) {
        filter.$or = [
          { message: { $regex: search, $options: "i" } },
          { source: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
        ];
      }

      const [logs, total] = await Promise.all([
        SystemLog.find(filter)
          .populate("userId", "username email")
          .populate("resolvedBy", "username email")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        SystemLog.countDocuments(filter),
      ]);

      // Log the access for audit
      if (req.user) {
        await Activity.create({
          userId: req.user._id,
          type: "admin_action",
          description: `${req.user.username} accessed system logs`,
          ip: req.ip || req.connection.remoteAddress,
          userAgent: req.get("User-Agent"),
          metadata: {
            filters: { level, source, category, timeRange, search, resolved },
            totalResults: total,
          },
        });
      }

      res.json({
        success: true,
        data: {
          logs,
          pagination: {
            current: page,
            pages: Math.ceil(total / limit),
            total,
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1,
            limit,
          },
          filters: {
            level,
            source,
            category,
            timeRange,
            search,
            resolved,
            environment,
          },
        },
      });
    } catch (error) {
      console.error("Error in getSystemLogs:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve system logs",
        error: error.message,
      });
    }
  }

  // Get system status for the SystemStatus component
  static async getSystemStatus(req, res) {
    try {
      const health = await systemLog.getSystemHealth();

      // Mock service statuses (you can implement real service checks)
      const services = [
        {
          name: "API Services",
          status: health.recentErrors === 0 ? "online" : "error",
        },
        {
          name: "Database",
          status: SystemLogsController.checkDatabaseStatus(),
        },
        {
          name: "Cache",
          status: Math.random() > 0.2 ? "online" : "maintenance",
        },
      ];

      const overallStatus =
        health.status === "operational"
          ? "All systems operational"
          : "Some issues detected";

      res.json({
        success: true,
        data: {
          overallStatus,
          services,
          health,
        },
      });
    } catch (error) {
      console.error("Error in getSystemStatus:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve system status",
        error: error.message,
      });
    }
  }

  // Get activity trend data
  static async getActivityTrend(req, res) {
    try {
      const hours = parseInt(req.query.hours) || 24;
      const trend = await SystemLog.getActivityTrend(hours);

      const formattedTrend = SystemLogsController.formatActivityTrend(trend);

      res.json({
        success: true,
        data: formattedTrend,
      });
    } catch (error) {
      console.error("Error in getActivityTrend:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve activity trend",
        error: error.message,
      });
    }
  }

  // Create a new system log entry
  static async createSystemLog(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const logData = {
        ...req.body,
        userId: req.user ? req.user._id : undefined,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get("User-Agent"),
      };

      const log = await SystemLog.create(logData);

      res.status(201).json({
        success: true,
        message: "System log created successfully",
        data: log,
      });
    } catch (error) {
      console.error("Error in createSystemLog:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create system log",
        error: error.message,
      });
    }
  }

  // Resolve a system log entry
  static async resolveSystemLog(req, res) {
    try {
      const { id } = req.params;

      const log = await SystemLog.findById(id);

      if (!log) {
        return res.status(404).json({
          success: false,
          message: "System log not found",
        });
      }

      await log.resolve(req.user._id);

      // Log the resolution
      await Activity.create({
        userId: req.user._id,
        type: "admin_action",
        description: `${
          req.user.username
        } resolved system log: ${log.message.substring(0, 50)}...`,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get("User-Agent"),
        metadata: {
          logId: log._id,
          logLevel: log.level,
          logSource: log.source,
        },
      });

      res.json({
        success: true,
        message: "System log resolved successfully",
      });
    } catch (error) {
      console.error("Error in resolveSystemLog:", error);
      res.status(500).json({
        success: false,
        message: "Failed to resolve system log",
        error: error.message,
      });
    }
  }

  // Export system logs
  static async exportSystemLogs(req, res) {
    try {
      const { format = "json", ...filters } = req.query;

      // Build filter (same as getSystemLogs)
      const filter = {};

      if (filters.level && filters.level !== "All Levels") {
        filter.level = filters.level.toLowerCase();
      }

      if (filters.timeRange) {
        const timeFilter = SystemLogsController.parseTimeRange(
          filters.timeRange
        );
        if (timeFilter) {
          filter.createdAt = timeFilter;
        }
      }

      const logs = await SystemLog.find(filter)
        .populate("userId", "username email")
        .populate("resolvedBy", "username email")
        .sort({ createdAt: -1 })
        .limit(10000) // Limit for performance
        .lean();

      // Log the export
      await Activity.create({
        userId: req.user._id,
        type: "admin_action",
        description: `${req.user.username} exported ${logs.length} system logs`,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get("User-Agent"),
        metadata: {
          format,
          filters,
          exportCount: logs.length,
        },
        severity: "medium",
      });

      if (format === "json") {
        res.setHeader("Content-Type", "application/json");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=system-logs-${Date.now()}.json`
        );
        return res.json({
          exportInfo: {
            generatedAt: new Date(),
            exportedBy: req.user.username,
            totalLogs: logs.length,
            filters,
          },
          logs,
        });
      }

      // Default to JSON
      res.json({
        success: true,
        message: "System logs exported successfully",
        data: {
          logs,
          totalExported: logs.length,
        },
      });
    } catch (error) {
      console.error("Error in exportSystemLogs:", error);
      res.status(500).json({
        success: false,
        message: "Failed to export system logs",
        error: error.message,
      });
    }
  }

  // Clear system logs (admin only)
  static async clearSystemLogs(req, res) {
    try {
      const { level, olderThan } = req.body;

      let filter = {};

      if (level && level !== "All Levels") {
        filter.level = level.toLowerCase();
      }

      if (olderThan) {
        const date = new Date();
        date.setDate(date.getDate() - parseInt(olderThan));
        filter.createdAt = { $lt: date };
      }

      const result = await SystemLog.deleteMany(filter);

      // Log the clear action
      await Activity.create({
        userId: req.user._id,
        type: "admin_action",
        description: `${req.user.username} cleared ${result.deletedCount} system logs`,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get("User-Agent"),
        metadata: {
          deletedCount: result.deletedCount,
          filters: { level, olderThan },
        },
        severity: "high",
      });

      res.json({
        success: true,
        message: `Successfully cleared ${result.deletedCount} system logs`,
        data: {
          deletedCount: result.deletedCount,
        },
      });
    } catch (error) {
      console.error("Error in clearSystemLogs:", error);
      res.status(500).json({
        success: false,
        message: "Failed to clear system logs",
        error: error.message,
      });
    }
  }

  // Helper methods
  static async getRecentAlerts(limit = 10) {
    const alerts = await SystemLog.find({
      level: { $in: ["error", "warning"] },
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return alerts.map((alert) => ({
      type: alert.level,
      message: alert.message,
      timestamp: `at ${
        alert.formattedTime || new Date(alert.createdAt).toLocaleTimeString()
      }`,
    }));
  }

  static parseTimeRange(timeRange) {
    const now = new Date();
    let startTime;

    switch (timeRange) {
      case "Last Hour":
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case "Last 24 Hours":
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "Last 7 Days":
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "Last 30 Days":
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return null;
    }

    return { $gte: startTime };
  }

  static formatActivityTrend(trend) {
    // Generate 24 hours of data
    const hours = [];
    const now = new Date();

    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourValue = hour.getHours();

      // Find matching data from trend
      const trendData = trend.find((t) => t._id === hourValue) || { total: 0 };

      hours.push({
        label: `${hourValue}:00`,
        value: trendData.total || Math.floor(Math.random() * 100), // Mock data if no real data
      });
    }

    // Take every other hour for display (12 data points)
    return hours.filter((_, index) => index % 2 === 0);
  }

  static calculateUptime() {
    // Mock uptime calculation - implement real logic based on your needs
    return (99.97 + Math.random() * 0.03).toFixed(2);
  }

  static checkDatabaseStatus() {
    // Mock database status check - implement real logic
    return Math.random() > 0.1 ? "online" : "error";
  }
}

module.exports = SystemLogsController;
