// scripts/createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      console.log('Admin details:', {
        username: existingAdmin.username,
        email: existingAdmin.email,
        role: existingAdmin.role,
        status: existingAdmin.status
      });
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      status: 'active'
    };

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    const adminUser = await User.create({
      username: adminData.username,
      email: adminData.email,
      password: hashedPassword,
      role: adminData.role,
      status: adminData.status,
      deviceInfo: {
        browser: 'Script',
        os: 'Server',
        device: 'Server',
        ip: '127.0.0.1'
      },
      metadata: {
        registrationSource: 'script',
        country: 'Local',
        timezone: 'UTC'
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('Login credentials:');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    console.log('Role:', adminUser.role);
    console.log('Status:', adminUser.status);

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run the script
createAdminUser();
