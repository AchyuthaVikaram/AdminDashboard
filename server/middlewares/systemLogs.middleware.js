// middlewares/systemLogging.middleware.js
const SystemLogsService = require("../services/systemLogsService");

/**
 * Middleware to log all API requests and responses
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Store original end function
  const originalEnd = res.end;

  // Override end function to capture response details
  res.end = function (chunk, encoding) {
    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Call original end function
    originalEnd.call(this, chunk, encoding);

    // Skip logging for health check endpoints to reduce noise
    if (!req.path.includes("/health") && !req.path.includes("/ping")) {
      // Log the request asynchronously to avoid blocking
      setImmediate(() => {
        SystemLogsService.logAPIRequest(req, res, responseTime);
      });
    }
  };

  next();
};

/**
 * Error logging middleware
 */
const errorLogger = (err, req, res, next) => {
  const responseTime = Date.now() - (req.startTime || Date.now());

  // Log the error asynchronously
  setImmediate(() => {
    SystemLogsService.logAPIRequest(req, res, responseTime, err);
  });

  next(err);
};

/**
 * Database operation logging middleware
 */
const databaseLogger = {
  /**
   * Log successful database operations
   */
  logSuccess: (operation, collection, details = {}) => {
    setImmediate(() => {
      SystemLogsService.logDatabaseOperation(operation, collection, details);
    });
  },

  /**
   * Log database errors
   */
  logError: (operation, collection, error, details = {}) => {
    setImmediate(() => {
      SystemLogsService.logDatabaseOperation(
        operation,
        collection,
        details,
        error
      );
    });
  },
};

/**
 * Authentication event logging middleware
 */
const authLogger = {
  /**
   * Log login attempts
   */
  logLogin: (req, res, next) => {
    const originalJson = res.json;

    res.json = function (data) {
      // Check if login was successful
      if (data.success && data.data && data.data.user) {
        setImmediate(() => {
          SystemLogsService.logAuthEvent(
            "login",
            data.data.user._id,
            {
              username: data.data.user.username,
              email: data.data.user.email,
            },
            req
          );
        });
      } else if (!data.success) {
        setImmediate(() => {
          SystemLogsService.logAuthEvent(
            "failed_login",
            null,
            {
              email: req.body.email,
              reason: data.message,
            },
            req
          );
        });
      }

      return originalJson.call(this, data);
    };

    next();
  },

  /**
   * Log logout events
   */
  logLogout: (req, res, next) => {
    if (req.user) {
      setImmediate(() => {
        SystemLogsService.logAuthEvent(
          "logout",
          req.user._id,
          {
            username: req.user.username,
            email: req.user.email,
          },
          req
        );
      });
    }

    next();
  },

  /**
   * Log registration events
   */
  logRegister: (req, res, next) => {
    const originalJson = res.json;

    res.json = function (data) {
      if (data.success && data.data && data.data.user) {
        setImmediate(() => {
          SystemLogsService.logAuthEvent(
            "register",
            data.data.user._id,
            {
              username: data.data.user.username,
              email: data.data.user.email,
            },
            req
          );
        });
      }

      return originalJson.call(this, data);
    };

    next();
  },
};

/**
 * Security event logging middleware
 */
const securityLogger = {
  /**
   * Log unauthorized access attempts
   */
  logUnauthorized: (req, res, next) => {
    if (res.statusCode === 401 || res.statusCode === 403) {
      setImmediate(() => {
        SystemLogsService.logAuthEvent(
          "unauthorized_access",
          req.user?._id,
          {
            resource: req.path,
            method: req.method,
            reason: "Unauthorized access attempt",
          },
          req
        );
      });
    }
    next();
  },

  /**
   * Log rate limit violations
   */
  logRateLimit: (req, res, next) => {
    if (res.statusCode === 429) {
      setImmediate(() => {
        SystemLogsService.logEvent(
          "warning",
          `Rate limit exceeded: ${req.ip}`,
          "security",
          {
            category: "security",
            details: {
              ip: req.ip,
              userAgent: req.get("User-Agent"),
              path: req.path,
              method: req.method,
            },
            ip: req.ip,
            userAgent: req.get("User-Agent"),
            tags: ["rate-limit", "security"],
          }
        );
      });
    }
    next();
  },
};

/**
 * Performance monitoring middleware
 */
const performanceLogger = (threshold = 1000) => {
  return (req, res, next) => {
    const startTime = Date.now();

    const originalEnd = res.end;
    res.end = function (chunk, encoding) {
      const responseTime = Date.now() - startTime;

      // Log slow requests
      if (responseTime > threshold) {
        setImmediate(() => {
          SystemLogsService.logPerformanceMetric(
            `slow_request_${req.method}_${req.path.replace(/\//g, "_")}`,
            responseTime,
            threshold
          );
        });
      }

      originalEnd.call(this, chunk, encoding);
    };

    next();
  };
};

/**
 * System health monitoring
 */
const healthMonitor = {
  /**
   * Check and log database connectivity
   */
  checkDatabase: async () => {
    try {
      const mongoose = require("mongoose");
      const isConnected = mongoose.connection.readyState === 1;

      await SystemLogsService.logHealthCheck(
        "database",
        isConnected ? "healthy" : "error",
        {
          readyState: mongoose.connection.readyState,
          connectionString: mongoose.connection.host,
        }
      );

      return isConnected;
    } catch (error) {
      await SystemLogsService.logHealthCheck("database", "error", {
        error: error.message,
      });
      return false;
    }
  },

  /**
   * Check and log memory usage
   */
  checkMemory: async () => {
    try {
      const memUsage = process.memoryUsage();
      const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
      const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
      const usage = (heapUsedMB / heapTotalMB) * 100;

      const status = usage > 90 ? "error" : usage > 70 ? "warning" : "healthy";

      await SystemLogsService.logHealthCheck("memory", status, {
        heapUsedMB,
        heapTotalMB,
        usagePercentage: usage.toFixed(2),
        rss: Math.round(memUsage.rss / 1024 / 1024),
      });

      return status === "healthy";
    } catch (error) {
      await SystemLogsService.logHealthCheck("memory", "error", {
        error: error.message,
      });
      return false;
    }
  },

  /**
   * Start periodic health checks
   */
  startHealthChecks: (interval = 5 * 60 * 1000) => {
    // Default 5 minutes
    setInterval(async () => {
      await Promise.all([
        healthMonitor.checkDatabase(),
        healthMonitor.checkMemory(),
      ]);
    }, interval);
  },
};

/**
 * File operation logging
 */
const fileLogger = {
  /**
   * Log file uploads
   */
  logUpload: (filename, size) => {
    setImmediate(() => {
      SystemLogsService.logFileOperation("upload", filename, size);
    });
  },

  /**
   * Log file downloads
   */
  logDownload: (filename) => {
    setImmediate(() => {
      SystemLogsService.logFileOperation("download", filename);
    });
  },

  /**
   * Log file deletion
   */
  logDelete: (filename) => {
    setImmediate(() => {
      SystemLogsService.logFileOperation("delete", filename);
    });
  },

  /**
   * Log file operation errors
   */
  logError: (operation, filename, error) => {
    setImmediate(() => {
      SystemLogsService.logFileOperation(operation, filename, null, error);
    });
  },
};

module.exports = {
  requestLogger,
  errorLogger,
  databaseLogger,
  authLogger,
  securityLogger,
  performanceLogger,
  healthMonitor,
  fileLogger,
};
