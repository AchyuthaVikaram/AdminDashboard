// services/systemLogsService.js
const SystemLog = require("../models/systemLogs.model");

class SystemLogsService {
  /**
   * Log system events automatically
   */
  static async logEvent(level, message, source, options = {}) {
    try {
      const logData = {
        level: level.toLowerCase(),
        message,
        source,
        category: options.category || "system",
        details: options.details || {},
        userId: options.userId,
        ip: options.ip,
        userAgent: options.userAgent,
        stackTrace: options.stackTrace,
        requestId: options.requestId,
        tags: options.tags || [],
      };

      const log = await SystemLog.create(logData);

      // If it's a critical error, you might want to send alerts
      if (level === "error" && options.alert) {
        await this.sendAlert(log);
      }

      return log;
    } catch (error) {
      console.error("Failed to create system log:", error);
      // Don't throw error to avoid infinite loops in logging
      return null;
    }
  }

  /**
   * Log API requests and responses
   */
  static async logAPIRequest(req, res, responseTime, error = null) {
    try {
      const level = error
        ? "error"
        : res.statusCode >= 400
        ? "warning"
        : "info";
      const message = error
        ? `API Error: ${req.method} ${req.path} - ${error.message}`
        : `API Request: ${req.method} ${req.path} - ${res.statusCode}`;

      await this.logEvent(level, message, "api", {
        category: "api",
        details: {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          responseTime: `${responseTime}ms`,
          userAgent: req.get("User-Agent"),
          query: req.query,
          params: req.params,
          error: error?.message,
        },
        userId: req.user?._id,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get("User-Agent"),
        requestId: req.headers["x-request-id"],
        stackTrace: error?.stack,
        tags: ["api", req.method.toLowerCase()],
      });
    } catch (logError) {
      console.error("Failed to log API request:", logError);
    }
  }

  /**
   * Log database operations
   */
  static async logDatabaseOperation(
    operation,
    collection,
    details = {},
    error = null
  ) {
    try {
      const level = error ? "error" : "info";
      const message = error
        ? `Database Error: ${operation} on ${collection} - ${error.message}`
        : `Database Operation: ${operation} on ${collection}`;

      await this.logEvent(level, message, "database", {
        category: "database",
        details: {
          operation,
          collection,
          ...details,
          error: error?.message,
        },
        stackTrace: error?.stack,
        tags: ["database", operation.toLowerCase(), collection],
      });
    } catch (logError) {
      console.error("Failed to log database operation:", logError);
    }
  }

  /**
   * Log authentication events
   */
  static async logAuthEvent(event, userId, details = {}, req = null) {
    try {
      const level = [
        "failed_login",
        "suspicious_activity",
        "account_locked",
      ].includes(event)
        ? "warning"
        : "info";

      const message = this.getAuthMessage(event, details);

      await this.logEvent(level, message, "auth", {
        category: "security",
        details: {
          event,
          ...details,
          timestamp: new Date(),
        },
        userId,
        ip: req?.ip || req?.connection.remoteAddress,
        userAgent: req?.get("User-Agent"),
        tags: ["auth", event],
      });
    } catch (logError) {
      console.error("Failed to log auth event:", logError);
    }
  }

  /**
   * Log system health checks
   */
  static async logHealthCheck(service, status, metrics = {}) {
    try {
      const level =
        status === "healthy"
          ? "info"
          : status === "warning"
          ? "warning"
          : "error";
      const message = `Health Check: ${service} - ${status}`;

      await this.logEvent(level, message, "health", {
        category: "system",
        details: {
          service,
          status,
          metrics,
          timestamp: new Date(),
        },
        tags: ["health", service, status],
      });
    } catch (logError) {
      console.error("Failed to log health check:", logError);
    }
  }

  /**
   * Log file operations
   */
  static async logFileOperation(
    operation,
    filename,
    size = null,
    error = null
  ) {
    try {
      const level = error ? "error" : "info";
      const message = error
        ? `File Error: ${operation} ${filename} - ${error.message}`
        : `File Operation: ${operation} ${filename}`;

      await this.logEvent(level, message, "file-system", {
        category: "file",
        details: {
          operation,
          filename,
          size,
          error: error?.message,
        },
        stackTrace: error?.stack,
        tags: ["file", operation.toLowerCase()],
      });
    } catch (logError) {
      console.error("Failed to log file operation:", logError);
    }
  }

  /**
   * Log performance metrics
   */
  static async logPerformanceMetric(metric, value, threshold = null) {
    try {
      const level = threshold && value > threshold ? "warning" : "info";
      const message = `Performance: ${metric} = ${value}${
        threshold ? ` (threshold: ${threshold})` : ""
      }`;

      await this.logEvent(level, message, "performance", {
        category: "performance",
        details: {
          metric,
          value,
          threshold,
          timestamp: new Date(),
        },
        tags: ["performance", metric],
      });
    } catch (logError) {
      console.error("Failed to log performance metric:", logError);
    }
  }

  /**
   * Clean up old logs
   */
  static async cleanupOldLogs(daysToKeep = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      // Keep errors longer, clean up info/debug logs more aggressively
      const [infoDeleted, errorDeleted] = await Promise.all([
        SystemLog.deleteMany({
          level: { $in: ["info", "debug"] },
          createdAt: { $lt: cutoffDate },
        }),
        SystemLog.deleteMany({
          level: { $in: ["error", "warning"] },
          createdAt: {
            $lt: new Date(cutoffDate.getTime() - 30 * 24 * 60 * 60 * 1000),
          }, // Keep errors 30 days longer
        }),
      ]);

      const totalDeleted = infoDeleted.deletedCount + errorDeleted.deletedCount;

      if (totalDeleted > 0) {
        await this.logEvent(
          "info",
          `Cleaned up ${totalDeleted} old log entries`,
          "system",
          {
            category: "maintenance",
            details: {
              infoLogsDeleted: infoDeleted.deletedCount,
              errorLogsDeleted: errorDeleted.deletedCount,
              cutoffDate,
            },
            tags: ["cleanup", "maintenance"],
          }
        );
      }

      return totalDeleted;
    } catch (error) {
      console.error("Failed to cleanup old logs:", error);
      return 0;
    }
  }

  /**
   * Send alert for critical errors
   */
  static async sendAlert(log) {
    try {
      // Implement your alerting mechanism here
      // This could be email, Slack, SMS, etc.
      console.warn(`CRITICAL ERROR ALERT: ${log.message}`, {
        level: log.level,
        source: log.source,
        timestamp: log.createdAt,
      });

      // You could integrate with services like:
      // - Email service
      // - Slack webhook
      // - SMS service
      // - PagerDuty
      // - Discord webhook
    } catch (error) {
      console.error("Failed to send alert:", error);
    }
  }

  /**
   * Get authentication event messages
   */
  static getAuthMessage(event, details) {
    const messages = {
      login: `User logged in: ${details.username || details.email}`,
      logout: `User logged out: ${details.username || details.email}`,
      register: `New user registered: ${details.username || details.email}`,
      failed_login: `Failed login attempt: ${
        details.username || details.email
      }`,
      password_change: `Password changed: ${details.username || details.email}`,
      password_reset: `Password reset requested: ${
        details.username || details.email
      }`,
      account_locked: `Account locked due to multiple failed attempts: ${
        details.username || details.email
      }`,
      suspicious_activity: `Suspicious activity detected: ${details.activity}`,
      token_expired: `Authentication token expired: ${
        details.username || "unknown"
      }`,
      unauthorized_access: `Unauthorized access attempt to: ${details.resource}`,
    };

    return messages[event] || `Authentication event: ${event}`;
  }

  /**
   * Get system statistics
   */
  static async getSystemStatistics() {
    try {
      const stats = await SystemLog.getLogStatistics();
      const health = await SystemLog.getSystemHealth();

      return {
        ...stats,
        health,
      };
    } catch (error) {
      console.error("Failed to get system statistics:", error);
      return null;
    }
  }

  /**
   * Search logs with advanced criteria
   */
  static async searchLogs(criteria) {
    try {
      const {
        query,
        levels = [],
        sources = [],
        dateRange = {},
        limit = 100,
        page = 1,
      } = criteria;

      const filter = {};

      if (query) {
        filter.$text = { $search: query };
      }

      if (levels.length > 0) {
        filter.level = { $in: levels };
      }

      if (sources.length > 0) {
        filter.source = { $in: sources };
      }

      if (dateRange.start || dateRange.end) {
        filter.createdAt = {};
        if (dateRange.start) filter.createdAt.$gte = new Date(dateRange.start);
        if (dateRange.end) filter.createdAt.$lte = new Date(dateRange.end);
      }

      const skip = (page - 1) * limit;

      const [logs, total] = await Promise.all([
        SystemLog.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate("userId", "username email")
          .lean(),
        SystemLog.countDocuments(filter),
      ]);

      return {
        logs,
        total,
        page,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      };
    } catch (error) {
      console.error("Failed to search logs:", error);
      throw error;
    }
  }
}

module.exports = SystemLogsService;
