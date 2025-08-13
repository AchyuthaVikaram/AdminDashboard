// scripts/seedingData.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Activity = require("../models/activity.model");
const {
  DailyAnalytics,
  SystemHealth,
  RealtimeStats,
} = require("../models/analytics.model");

const seedUsers = async () => {
  console.log("🌱 Seeding users...");

  // Create admin user with proper field mapping
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await User.create({
    id: `admin_${Date.now()}`, // Add required custom ID
    name: "Administrator", // Use 'name' instead of 'username'
    username: "admin",
    email: "admin@dashboard.com",
    password: adminPassword,
    role: "Admin", // Use proper enum value (likely 'Admin' not 'admin')
    status: "Active", // Use proper enum value (likely 'Active' not 'active')
    lastLogin: new Date(),
    loginCount: 15,
    isOnline: true,
    preferences: {
      theme: "dark",
      language: "en",
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
    },
    metadata: {
      registrationSource: "web",
      country: "US",
      timezone: "UTC",
    },
  });

  // Create sample users with proper field mapping
  const users = [];
  const usernames = [
    "alice",
    "john",
    "sarah",
    "mike",
    "emma",
    "david",
    "lisa",
    "tom",
    "anna",
    "chris",
  ];
  const names = [
    "Alice Johnson",
    "John Smith",
    "Sarah Davis",
    "Mike Chen",
    "Emma Wilson",
    "David Brown",
    "Lisa Garcia",
    "Tom Miller",
    "Anna Taylor",
    "Chris Anderson",
  ];

  for (let i = 0; i < usernames.length; i++) {
    const password = await bcrypt.hash("password123", 12);

    try {
      const user = await User.create({
        id: `user_${Date.now()}_${i}`, // Add required custom ID with uniqueness
        name: names[i], // Use 'name' field (required)
        username: usernames[i],
        email: `${usernames[i]}@example.com`,
        password,
        role: "User", // Use proper enum value (likely 'User' not 'user')
        status: Math.random() > 0.1 ? "Active" : "Suspended", // Use proper enum values
        lastLogin: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ), // Last 7 days
        loginCount: Math.floor(Math.random() * 50) + 1,
        isOnline: Math.random() > 0.7, // 30% online
        lastActivity: new Date(
          Date.now() - Math.random() * 24 * 60 * 60 * 1000
        ), // Last 24 hours
        preferences: {
          theme: Math.random() > 0.5 ? "dark" : "light",
          language: "en",
          notifications: {
            email: Math.random() > 0.3,
            push: Math.random() > 0.5,
            sms: Math.random() > 0.8,
          },
        },
        metadata: {
          registrationSource: Math.random() > 0.6 ? "web" : "mobile",
          country: ["US", "UK", "CA", "AU", "DE"][
            Math.floor(Math.random() * 5)
          ],
          timezone: "UTC",
        },
        createdAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ), // Last 30 days
      });
      users.push(user);
      console.log(`✅ Created user: ${names[i]} (${usernames[i]})`);

      // Add small delay to ensure unique timestamps for IDs
      await new Promise((resolve) => setTimeout(resolve, 1));
    } catch (error) {
      console.error(`❌ Error creating user ${usernames[i]}:`, error.message);

      // Log validation errors in detail
      if (error.name === "ValidationError") {
        console.error(
          "Validation errors:",
          Object.keys(error.errors).map((key) => ({
            field: key,
            message: error.errors[key].message,
            value: error.errors[key].value,
            kind: error.errors[key].kind,
          }))
        );
      }
    }
  }

  console.log(
    `✅ Created ${users.length + 1} users (1 admin, ${
      users.length
    } regular users)`
  );
  return { admin, users };
};

const seedActivities = async (users) => {
  console.log("🌱 Seeding activities...");

  const activityTypes = [
    { type: "login", description: "logged in", weight: 0.3 },
    { type: "logout", description: "logged out", weight: 0.2 },
    { type: "profile_update", description: "updated profile", weight: 0.1 },
    { type: "password_change", description: "changed password", weight: 0.05 },
    { type: "post_create", description: "created a post", weight: 0.15 },
    { type: "comment_create", description: "added a comment", weight: 0.1 },
    { type: "like", description: "liked a post", weight: 0.05 },
    { type: "file_upload", description: "uploaded a file", weight: 0.05 },
  ];

  const activities = [];

  // Only proceed if we have users
  if (users.length === 0) {
    console.log("⚠️  No users available for creating activities");
    return [];
  }

  // Generate activities for the last 30 days
  for (let day = 0; day < 30; day++) {
    const activitiesPerDay = Math.floor(Math.random() * 50) + 20; // 20-70 activities per day

    for (let i = 0; i < activitiesPerDay; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const activityType = getWeightedRandom(activityTypes);

      const activity = {
        userId: user._id,
        type: activityType.type,
        description: `${user.name || user.username} ${
          activityType.description
        }`, // Use name if available
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        location: {
          country: user.metadata?.country || "US",
          city: ["New York", "London", "Toronto", "Sydney", "Berlin"][
            Math.floor(Math.random() * 5)
          ],
        },
        severity: getSeverity(activityType.type),
        createdAt: new Date(
          Date.now() -
            day * 24 * 60 * 60 * 1000 +
            Math.random() * 24 * 60 * 60 * 1000
        ),
        metadata: {
          source: Math.random() > 0.5 ? "web" : "mobile",
          sessionId: `session_${Math.random().toString(36).substr(2, 9)}`,
        },
      };

      activities.push(activity);
    }
  }

  try {
    await Activity.insertMany(activities);
    console.log(`✅ Created ${activities.length} activities`);
  } catch (error) {
    console.error("❌ Error creating activities:", error.message);
  }

  return activities;
};

const seedAnalytics = async () => {
  console.log("🌱 Seeding analytics...");

  const analytics = [];

  // Generate daily analytics for the last 30 days
  for (let day = 0; day < 30; day++) {
    const date = new Date();
    date.setDate(date.getDate() - day);
    date.setHours(0, 0, 0, 0);

    const baseUsers = 1000 + day * 10; // Growing user base

    const dailyAnalytic = {
      date,
      metrics: {
        totalUsers: baseUsers + Math.floor(Math.random() * 100),
        activeUsers:
          Math.floor(baseUsers * 0.3) + Math.floor(Math.random() * 50),
        newUsers: Math.floor(Math.random() * 20) + 5,
        totalLogins: Math.floor(Math.random() * 200) + 100,
        uniqueLogins: Math.floor(Math.random() * 150) + 80,
        pageViews: Math.floor(Math.random() * 5000) + 2000,
        uniquePageViews: Math.floor(Math.random() * 3000) + 1500,
        bounceRate: Math.random() * 20 + 15, // 15-35%
        avgSessionDuration: Math.random() * 300 + 180, // 3-8 minutes
        conversionRate: Math.random() * 5 + 2, // 2-7%
        revenue: Math.random() * 10000 + 5000,
        errors: Math.floor(Math.random() * 20),
        apiCalls: Math.floor(Math.random() * 10000) + 5000,
      },
      hourlyBreakdown: generateHourlyBreakdown(),
    };

    analytics.push(dailyAnalytic);
  }

  try {
    await DailyAnalytics.insertMany(analytics);
    console.log(`✅ Created ${analytics.length} daily analytics records`);
  } catch (error) {
    console.error("❌ Error creating analytics:", error.message);
  }
};

const seedSystemHealth = async () => {
  console.log("🌱 Seeding system health data...");

  const healthRecords = [];

  // Generate system health records for the last 24 hours (every hour)
  for (let hour = 0; hour < 24; hour++) {
    const timestamp = new Date();
    timestamp.setHours(timestamp.getHours() - hour);

    const healthRecord = {
      timestamp,
      services: {
        database: {
          status: Math.random() > 0.05 ? "healthy" : "warning", // 95% healthy
          responseTime: Math.random() * 50 + 10,
          connections: Math.floor(Math.random() * 50) + 10,
        },
        api: {
          status: Math.random() > 0.03 ? "healthy" : "warning", // 97% healthy
          responseTime: Math.random() * 100 + 50,
          requestsPerMinute: Math.floor(Math.random() * 200) + 100,
        },
        storage: {
          status: "healthy",
          usedSpace: Math.random() * 30 + 40, // 40-70% used
          totalSpace: 100,
        },
        cache: {
          status: Math.random() > 0.02 ? "healthy" : "warning", // 98% healthy
          hitRate: Math.random() * 10 + 90, // 90-100%
          memoryUsage: Math.random() * 40 + 30, // 30-70%
        },
      },
      serverMetrics: {
        cpuUsage: Math.random() * 50 + 20, // 20-70%
        memoryUsage: Math.random() * 40 + 30, // 30-70%
        diskUsage: Math.random() * 30 + 40, // 40-70%
        loadAverage: [Math.random() * 2, Math.random() * 2, Math.random() * 2],
        uptime: (24 - hour) * 3600, // Uptime in seconds
      },
    };

    healthRecords.push(healthRecord);
  }

  try {
    await SystemHealth.insertMany(healthRecords);
    console.log(`✅ Created ${healthRecords.length} system health records`);
  } catch (error) {
    console.error("❌ Error creating system health records:", error.message);
  }
};

// Helper functions
const getWeightedRandom = (items) => {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of items) {
    random -= item.weight;
    if (random <= 0) {
      return item;
    }
  }

  return items[0]; // Fallback
};

const getSeverity = (type) => {
  const severityMap = {
    login: "low",
    logout: "low",
    profile_update: "low",
    password_change: "medium",
    post_create: "low",
    comment_create: "low",
    like: "low",
    file_upload: "low",
    admin_action: "high",
    system_alert: "critical",
    error: "high",
  };

  return severityMap[type] || "low";
};

const generateHourlyBreakdown = () => {
  const breakdown = [];

  for (let hour = 0; hour < 24; hour++) {
    // Simulate realistic usage patterns (more activity during day hours)
    const baseActivity = hour >= 9 && hour <= 17 ? 20 : 5; // Business hours

    breakdown.push({
      hour,
      logins:
        Math.floor(Math.random() * baseActivity) + Math.floor(baseActivity / 2),
      activeUsers: Math.floor(Math.random() * baseActivity * 2) + baseActivity,
      pageViews:
        Math.floor(Math.random() * baseActivity * 10) + baseActivity * 5,
    });
  }

  return breakdown;
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log("🚀 Starting database seeding...");

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("📊 Connected to MongoDB");

    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Activity.deleteMany({}),
      DailyAnalytics.deleteMany({}),
      SystemHealth.deleteMany({}),
      RealtimeStats.deleteMany({}),
    ]);

    // Seed data with error handling
    console.log("🌱 Starting data seeding...");

    let admin,
      users = [];

    try {
      const seedResult = await seedUsers();
      admin = seedResult.admin;
      users = seedResult.users;
    } catch (error) {
      console.error("❌ Error seeding users:", error.message);
      // Continue with other seeding if users fail
    }

    if (admin && users.length > 0) {
      await seedActivities([admin, ...users]);
    } else {
      console.log(
        "⚠️  Skipping activities seeding due to user creation issues"
      );
    }

    await seedAnalytics();
    await seedSystemHealth();

    console.log("🎉 Database seeding completed!");
    console.log(`
📋 Summary:
   👤 Users: ${users.length + (admin ? 1 : 0)} ${admin ? "(1 admin)" : ""}
   📈 Activities: Generated for last 30 days
   📊 Analytics: Generated for last 30 days
   🏥 System Health: Generated for last 24 hours
   
🔑 Admin Credentials:
   Email: admin@dashboard.com
   Password: admin123
   
🌐 Ready to start the server!
    `);

    // Show final user count from database
    const userCount = await User.countDocuments();
    console.log(`📊 Total users in database: ${userCount}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);

    // Additional debugging
    if (error.name === "ValidationError") {
      console.error("\n🔍 Detailed Validation Errors:");
      Object.keys(error.errors).forEach((key) => {
        const err = error.errors[key];
        console.error(`   Field: ${key}`);
        console.error(`   Message: ${err.message}`);
        console.error(`   Value: ${err.value}`);
        console.error(`   Kind: ${err.kind}`);
        console.error("   ---");
      });
    }

    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
    process.exit(0);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
