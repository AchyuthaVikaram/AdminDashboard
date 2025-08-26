// scripts/checkUsers.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');

const checkUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({}).select('username email role status createdAt');
    
    console.log('\n📊 User Database Status:');
    console.log('='.repeat(50));
    
    if (users.length === 0) {
      console.log('No users found in database');
      return;
    }

    users.forEach((user, index) => {
      console.log(`${index + 1}. Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: ${user.status}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('-'.repeat(30));
    });

    // Count by role
    const adminCount = users.filter(u => u.role === 'admin').length;
    const userCount = users.filter(u => u.role === 'user').length;
    
    console.log('\n📈 Summary:');
    console.log(`Total Users: ${users.length}`);
    console.log(`Admin Users: ${adminCount}`);
    console.log(`Regular Users: ${userCount}`);
    
    if (adminCount === 0) {
      console.log('\n⚠️  WARNING: No admin users found!');
      console.log('Run "node scripts/createAdmin.js" to create an admin user.');
    }

  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  }
};

// Run the script
checkUsers();
