// scripts/fixAdminStatus.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');

const fixAdminStatus = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Find and update admin user status
    const result = await User.updateMany(
      { role: 'admin' },
      { status: 'active' }
    );

    console.log(`Updated ${result.modifiedCount} admin user(s) to active status`);

    // Verify the update
    const adminUsers = await User.find({ role: 'admin' }).select('username email role status');
    
    console.log('\n✅ Admin users after update:');
    adminUsers.forEach(user => {
      console.log(`- ${user.username} (${user.email}): ${user.role} - ${user.status}`);
    });

  } catch (error) {
    console.error('Error fixing admin status:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  }
};

// Run the script
fixAdminStatus();
