// scripts/seedUsersData.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const seedUsersData = async () => {
  console.log("🌱 Seeding users data for admin dashboard...");

  // Sample user data matching your frontend design
  const usersData = [
    {
      name: "Sarah Johnson",
      username: "sarah.johnson",
      email: "sarah.j@company.com",
      role: "Admin",
      status: "Active",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b332c2cd?w=40&h=40&fit=crop&crop=face",
    },
    {
      name: "Mike Chen",
      username: "mike.chen",
      email: "mike.chen@company.com",
      role: "User",
      status: "Active",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    },
    {
      name: "Emma Davis",
      username: "emma.davis",
      email: "emma.davis@company.com",
      role: "User",
      status: "Inactive",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    },
    {
      name: "John Smith",
      username: "john.smith",
      email: "john.smith@company.com",
      role: "User",
      status: "Active",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    },
    {
      name: "Lisa Wong",
      username: "lisa.wong",
      email: "lisa.wong@company.com",
      role: "User",
      status: "Active",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face",
    },
    {
      name: "Alex Turner",
      username: "alex.turner",
      email: "alex.turner@company.com",
      role: "User",
      status: "Inactive",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    },
    {
      name: "Maria Garcia",
      username: "maria.garcia",
      email: "maria.garcia@company.com",
      role: "Admin",
      status: "Active",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face",
    },
    {
      name: "David Kim",
      username: "david.kim",
      email: "david.kim@company.com",
      role: "User",
      status: "Active",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face",
    },
  ];

  // Add more random users to reach a good number for pagination testing
  const additionalUsers = [];
  const firstNames = [
    "James",
    "Jennifer",
    "Robert",
    "Linda",
    "Michael",
    "Elizabeth",
    "William",
    "Barbara",
    "Richard",
    "Susan",
    "Joseph",
    "Jessica",
    "Thomas",
    "Karen",
    "Christopher",
    "Nancy",
    "Daniel",
    "Betty",
    "Matthew",
    "Helen",
    "Anthony",
    "Sandra",
    "Mark",
    "Donna",
    "Donald",
    "Carol",
    "Steven",
    "Ruth",
    "Paul",
    "Sharon",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
    "Lee",
    "Perez",
    "Thompson",
    "White",
    "Harris",
    "Sanchez",
    "Clark",
    "Ramirez",
    "Lewis",
    "Robinson",
  ];
  const domains = [
    "company.com",
    "business.org",
    "corp.net",
    "enterprise.com",
    "office.co",
  ];
  const avatarPhotos = [
    "https://images.unsplash.com/photo-1494790108755-2616b332c2cd?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face",
  ];

  for (let i = 0; i < 20; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];

    additionalUsers.push({
      name: `${firstName} ${lastName}`,
      username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
      role: Math.random() > 0.85 ? "Admin" : "User", // 85% Users, 15% Admins
      status:
        Math.random() > 0.15
          ? "Active"
          : Math.random() > 0.5
          ? "Inactive"
          : "Suspended", // 85% Active
      avatar: avatarPhotos[Math.floor(Math.random() * avatarPhotos.length)],
    });
  }

  const allUsers = [...usersData, ...additionalUsers];
  const createdUsers = [];

  for (let i = 0; i < allUsers.length; i++) {
    const userData = allUsers[i];

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 12);

    // Calculate realistic time data
    const daysAgo = Math.floor(Math.random() * 90); // Random registration up to 90 days ago
    const hoursAgo = Math.floor(Math.random() * 72); // Last activity up to 72 hours ago
    const minutesAgo = Math.floor(Math.random() * 60); // More precise last activity

    const registrationDate = new Date(
      Date.now() - daysAgo * 24 * 60 * 60 * 1000
    );
    const lastActivityDate = new Date(
      Date.now() - hoursAgo * 60 * 60 * 1000 - minutesAgo * 60 * 1000
    );

    // Generate unique ID - Choose ONE of these approaches based on your User model:

    // SOLUTION 1: If your model expects a custom string ID
    const customId = `user_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // SOLUTION 2: If your model expects a numeric ID
    const numericId = Date.now() + i; // Ensures uniqueness

    // SOLUTION 3: If your model expects MongoDB ObjectId as custom id field
    const objectId = new mongoose.Types.ObjectId();

    const user = {
      // ADD ONE OF THESE ID FIELDS - uncomment the one that matches your User model:

      id: customId, // Use this if your model expects a custom string ID
      // id: numericId,          // Use this if your model expects a numeric ID
      // id: objectId,           // Use this if your model expects ObjectId as custom id field

      ...userData,
      password: hashedPassword,
      isOnline: Math.random() > 0.7, // 30% online
      lastLogin: new Date(
        lastActivityDate.getTime() - Math.random() * 24 * 60 * 60 * 1000
      ),
      loginCount: Math.floor(Math.random() * 150) + 5,
      lastActivity: lastActivityDate,
      deviceInfo: {
        browser: ["Chrome", "Firefox", "Safari", "Edge"][
          Math.floor(Math.random() * 4)
        ],
        os: ["Windows", "macOS", "Linux", "iOS", "Android"][
          Math.floor(Math.random() * 5)
        ],
        device: ["Desktop", "Mobile", "Tablet"][Math.floor(Math.random() * 3)],
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(
          Math.random() * 255
        )}`,
      },
      location: {
        country: ["US", "UK", "CA", "AU", "DE", "FR", "JP", "IN"][
          Math.floor(Math.random() * 8)
        ],
        city: [
          "New York",
          "London",
          "Toronto",
          "Sydney",
          "Berlin",
          "Paris",
          "Tokyo",
          "Mumbai",
        ][Math.floor(Math.random() * 8)],
        timezone: "UTC",
      },
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
        totalSessions: Math.floor(Math.random() * 500) + 10,
        totalTimeSpent: Math.floor(Math.random() * 10000) + 100, // minutes
      },
      twoFactorEnabled: Math.random() > 0.7,
      createdAt: registrationDate,
      updatedAt: lastActivityDate,
    };

    try {
      const newUser = await User.create(user);
      createdUsers.push(newUser);
      console.log(`✅ Created user: ${userData.email}`);
    } catch (error) {
      if (error.code === 11000) {
        console.log(`⚠️  Skipping duplicate user: ${userData.email}`);
      } else {
        console.error(
          `❌ Error creating user ${userData.email}:`,
          error.message
        );

        // Debug: Log the validation errors in detail
        if (error.name === "ValidationError") {
          console.error(
            "Validation errors:",
            Object.keys(error.errors).map((key) => ({
              field: key,
              message: error.errors[key].message,
              value: error.errors[key].value,
            }))
          );
        }
      }
    }
  }

  console.log(`✅ Successfully created ${createdUsers.length} users`);
  return createdUsers;
};

// Generate realistic last active times based on activity patterns
const generateLastActiveTime = (lastActivity) => {
  const now = new Date();
  const diffInMs = now - lastActivity;
  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (minutes < 5) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (days < 30)
    return `${Math.floor(days / 7)} week${
      Math.floor(days / 7) > 1 ? "s" : ""
    } ago`;

  return lastActivity.toLocaleDateString();
};

// Main function to run seeding
const runUserSeeding = async () => {
  try {
    console.log("🚀 Starting users data seeding...");

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("📊 Connected to MongoDB");

    // Clear existing users (optional - be careful in production!)
    const shouldClearExisting = process.argv.includes("--clear");
    if (shouldClearExisting) {
      console.log("🧹 Clearing existing users...");
      await User.deleteMany({});
      console.log("✅ Existing users cleared");
    }

    // Seed users
    await seedUsersData();

    // Display summary
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] } },
          admins: { $sum: { $cond: [{ $eq: ["$role", "Admin"] }, 1, 0] } },
          online: { $sum: { $cond: ["$isOnline", 1, 0] } },
        },
      },
    ]);

    const summary = stats[0] || { total: 0, active: 0, admins: 0, online: 0 };

    console.log("🎉 Users seeding completed successfully!");
    console.log(`
📋 Summary:
   👥 Total Users: ${summary.total}
   ✅ Active Users: ${summary.active}
   🛡️  Admins: ${summary.admins}  
   🟢 Online: ${summary.online}
   
🔑 Test Credentials:
   Email: sarah.j@company.com
   Password: password123
   Role: Admin
   
🌐 Ready for your admin dashboard!
    `);
  } catch (error) {
    console.error("❌ Error seeding users data:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
    process.exit(0);
  }
};

// Run seeding if called directly
if (require.main === module) {
  runUserSeeding();
}

module.exports = { seedUsersData, runUserSeeding };
