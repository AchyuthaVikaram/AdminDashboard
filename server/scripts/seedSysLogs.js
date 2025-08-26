// scripts/seedSystemLogs.js
require("dotenv").config();
const mongoose = require("mongoose");
const SystemLog = require("../models/systemLogs.model");

const systemLogsData = [
  {
    level: "error",
    message: "Database connection timeout exceeded",
    source: "database",
    category: "database",
    details: {
      connectionString: "mongodb://localhost:27017/dashboard_db",
      timeout: 30000,
      retryAttempts: 3,
    },
    ip: "192.168.1.100",
    userAgent: "Node.js/18.17.0",
    stackTrace:
      "Error: Connection timeout\n    at Connection.timeout (/app/db.js:45:12)",
    tags: ["database", "timeout", "critical"],
    environment: "production",
    resolved: false,
  },
  {
    level: "warning",
    message: "API response time exceeded threshold",
    source: "api",
    category: "performance",
    details: {
      endpoint: "/api/users",
      responseTime: 2500,
      threshold: 2000,
      method: "GET",
    },
    ip: "10.0.0.15",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    tags: ["api", "performance", "slow"],
    environment: "production",
    resolved: true,
    resolvedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    level: "error",
    message: "Failed to authenticate user token",
    source: "auth",
    category: "security",
    details: {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      reason: "Token expired",
      endpoint: "/api/dashboard",
    },
    ip: "203.0.113.42",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    tags: ["auth", "security", "token"],
    environment: "production",
    resolved: false,
  },
  {
    level: "info",
    message: "User logged in successfully",
    source: "auth",
    category: "security",
    details: {
      username: "admin_user",
      loginMethod: "password",
      sessionId: "sess_1234567890",
    },
    ip: "192.168.1.50",
    userAgent: "Chrome/119.0.0.0",
    tags: ["auth", "login", "success"],
    environment: "production",
    resolved: true,
  },
  {
    level: "warning",
    message: "Memory usage above 80% threshold",
    source: "system",
    category: "performance",
    details: {
      currentUsage: 85.6,
      threshold: 80,
      totalMemory: "8GB",
      availableMemory: "1.2GB",
    },
    tags: ["memory", "performance", "threshold"],
    environment: "production",
    resolved: false,
  },
  {
    level: "error",
    message: "File upload failed - disk space insufficient",
    source: "file-system",
    category: "storage",
    details: {
      filename: "report_2024_Q4.pdf",
      fileSize: "25MB",
      availableSpace: "15MB",
      requiredSpace: "25MB",
    },
    ip: "172.16.0.10",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
    tags: ["file", "storage", "disk-space"],
    environment: "production",
    resolved: false,
  },
  {
    level: "info",
    message: "Database backup completed successfully",
    source: "database",
    category: "maintenance",
    details: {
      backupSize: "2.3GB",
      duration: "45 minutes",
      location: "/backups/db_backup_20241221.sql",
    },
    tags: ["database", "backup", "maintenance"],
    environment: "production",
    resolved: true,
  },
  {
    level: "warning",
    message: "SSL certificate expires in 7 days",
    source: "security",
    category: "security",
    details: {
      domain: "dashboard.example.com",
      expiryDate: "2024-12-28",
      issuer: "Let's Encrypt",
      daysRemaining: 7,
    },
    tags: ["ssl", "certificate", "expiry"],
    environment: "production",
    resolved: false,
  },
  {
    level: "error",
    message: "Redis cache connection lost",
    source: "cache",
    category: "database",
    details: {
      redisHost: "redis.internal.local",
      redisPort: 6379,
      lastConnected: new Date(Date.now() - 30 * 60 * 1000),
      reconnectAttempts: 5,
    },
    tags: ["redis", "cache", "connection"],
    environment: "production",
    resolved: false,
  },
  {
    level: "info",
    message: "Scheduled maintenance task completed",
    source: "system",
    category: "maintenance",
    details: {
      taskName: "log_cleanup",
      duration: "12 minutes",
      recordsProcessed: 15420,
      recordsDeleted: 8930,
    },
    tags: ["maintenance", "cleanup", "scheduled"],
    environment: "production",
    resolved: true,
  },
  {
    level: "warning",
    message: "High CPU usage detected",
    source: "system",
    category: "performance",
    details: {
      cpuUsage: 92.5,
      threshold: 85,
      duration: "15 minutes",
      topProcess: "node server.js",
    },
    tags: ["cpu", "performance", "threshold"],
    environment: "production",
    resolved: true,
    resolvedAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
  },
  {
    level: "error",
    message: "Email service failed to send notification",
    source: "email",
    category: "communication",
    details: {
      recipient: "admin@example.com",
      subject: "System Alert: Database Error",
      provider: "SendGrid",
      errorCode: "SMTP_AUTH_FAILED",
    },
    ip: "10.0.1.25",
    tags: ["email", "notification", "smtp"],
    environment: "production",
    resolved: false,
  },
  {
    level: "info",
    message: "User data export completed",
    source: "api",
    category: "data",
    details: {
      exportType: "CSV",
      recordCount: 1250,
      fileSize: "890KB",
      requestedBy: "data_analyst",
    },
    ip: "192.168.1.75",
    userAgent: "PostmanRuntime/7.33.0",
    tags: ["export", "data", "csv"],
    environment: "production",
    resolved: true,
  },
  {
    level: "warning",
    message: "Rate limit threshold reached for API endpoint",
    source: "api",
    category: "security",
    details: {
      endpoint: "/api/analytics-data",
      requests: 1000,
      timeWindow: "1 hour",
      clientIP: "203.0.113.15",
    },
    ip: "203.0.113.15",
    userAgent: "python-requests/2.28.1",
    tags: ["rate-limit", "api", "security"],
    environment: "production",
    resolved: true,
    resolvedAt: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
  },
  {
    level: "error",
    message: "WebSocket connection dropped unexpectedly",
    source: "websocket",
    category: "communication",
    details: {
      connectionId: "ws_conn_789456123",
      duration: "2 hours 15 minutes",
      reason: "Client timeout",
      activeUsers: 23,
    },
    tags: ["websocket", "connection", "timeout"],
    environment: "production",
    resolved: false,
  },
];

const seedSystemLogs = async () => {
  try {
    console.log("🌱 Starting system logs seeding...");

    // Connect to database
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Clear existing system logs
    const deleteResult = await SystemLog.deleteMany({});
    console.log(`🗑️ Cleared ${deleteResult.deletedCount} existing system logs`);

    // Generate timestamps for the logs (spread over last 24 hours)
    const now = new Date();
    const logsWithTimestamps = systemLogsData.map((log, index) => {
      const hoursAgo = Math.floor(Math.random() * 24); // Random time in last 24 hours
      const minutesAgo = Math.floor(Math.random() * 60);
      const createdAt = new Date(
        now.getTime() - hoursAgo * 60 * 60 * 1000 - minutesAgo * 60 * 1000
      );

      return {
        ...log,
        createdAt,
        updatedAt: createdAt,
        // Add some resolved timestamps for resolved logs
        ...(log.resolved &&
          !log.resolvedAt && {
            resolvedAt: new Date(
              createdAt.getTime() + Math.random() * 60 * 60 * 1000
            ), // Resolved within an hour
          }),
      };
    });

    // Insert the system logs
    const insertedLogs = await SystemLog.insertMany(logsWithTimestamps);
    console.log(`✅ Inserted ${insertedLogs.length} system logs`);

    // Display summary
    const summary = await SystemLog.aggregate([
      {
        $group: {
          _id: "$level",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    console.log("\n📊 Seeding Summary:");
    summary.forEach((item) => {
      console.log(`   ${item._id.toUpperCase()}: ${item.count} logs`);
    });

    console.log("\n🎉 System logs seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding system logs:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
};

// Run if called directly
if (require.main === module) {
  seedSystemLogs();
}

module.exports = {
  seedSystemLogs,
  systemLogsData,
};
