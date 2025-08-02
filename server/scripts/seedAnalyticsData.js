// scripts/seedAnalyticsData.js
require('dotenv').config();
const mongoose = require('mongoose');
const {
  RealtimeAnalytics,
  ContentPerformance,
  UserDistribution,
  SystemPerformance,
  FilterOptions,
  AnalyticsActivity
} = require('../models/analyticsData.model');

const seedAnalyticsData = async () => {
  try {
    console.log('🌱 Starting analytics data seeding...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('📊 Connected to MongoDB');
    
    // Clear existing analytics data
    console.log('🧹 Clearing existing analytics data...');
    await Promise.all([
      RealtimeAnalytics.deleteMany({}),
      ContentPerformance.deleteMany({}),
      UserDistribution.deleteMany({}),
      SystemPerformance.deleteMany({}),
      FilterOptions.deleteMany({}),
      AnalyticsActivity.deleteMany({})
    ]);
    
    // Seed Filter Options
    console.log('🔧 Seeding filter options...');
    const filterOptions = new FilterOptions({
      timeRanges: [
        { label: 'Last 24 Hours', value: 'Last 24 Hours', days: 1 },
        { label: 'Last 7 Days', value: 'Last 7 Days', days: 7 },
        { label: 'Last 30 Days', value: 'Last 30 Days', days: 30 },
        { label: 'Last 90 Days', value: 'Last 90 Days', days: 90 },
        { label: 'Last Year', value: 'Last Year', days: 365 }
      ],
      categories: [
        { label: 'All Categories', value: 'All Categories' },
        { label: 'Content', value: 'content' },
        { label: 'Video', value: 'video' },
        { label: 'Media', value: 'media' },
        { label: 'Audio', value: 'audio' },
        { label: 'Education', value: 'education' }
      ]
    });
    await filterOptions.save();
    
    // Seed Real-time Analytics (last 7 days)
    console.log('📈 Seeding real-time analytics...');
    const realtimeData = [];
    for (let i = 0; i < 7; i++) {
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - i);
      
      const baseEngagement = 7.1 + (Math.random() - 0.5) * 2;
      const baseBounce = 23.7 + (Math.random() - 0.5) * 4;
      const baseConversions = 1247 + Math.floor((Math.random() - 0.5) * 200);
      const baseActiveUsers = 14 + Math.floor((Math.random() - 0.5) * 10);
      
      realtimeData.push({
        timestamp,
        engagement: {
          value: `${baseEngagement.toFixed(1)}%`,
          change: `${((Math.random() - 0.5) * 20).toFixed(1)}%`,
          changeText: 'from last week',
          trend: Math.random() > 0.5 ? 'up' : 'down'
        },
        bounce: {
          value: `${baseBounce.toFixed(1)}%`,
          change: `${((Math.random() - 0.5) * 15).toFixed(1)}%`,
          changeText: 'from last week',
          trend: Math.random() > 0.4 ? 'up' : 'down'
        },
        conversions: {
          value: baseConversions.toLocaleString(),
          change: `${((Math.random() - 0.5) * 25).toFixed(1)}%`,
          changeText: 'from last week',
          trend: Math.random() > 0.6 ? 'up' : 'down'
        },
        activeUsers: {
          value: baseActiveUsers.toString(),
          change: `${((Math.random() - 0.5) * 30).toFixed(1)}%`,
          changeText: 'from yesterday',
          trend: Math.random() > 0.5 ? 'up' : 'down'
        },
        additional: {
          totalUsers: Math.floor(Math.random() * 1000) + 500,
          newUsersToday: Math.floor(Math.random() * 50) + 10,
          totalRevenue: Math.floor(Math.random() * 50000) + 25000,
          avgSessionDuration: Math.floor(Math.random() * 300) + 180
        }
      });
    }
    await RealtimeAnalytics.insertMany(realtimeData);
    
    // Seed Content Performance (last 30 days)
    console.log('📝 Seeding content performance...');
    const contentData = [];
    for (let i = 0; i < 30; i++) {
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - i);
      
      const baseData = [
        { id: 'blog-posts', name: 'Blog Posts', category: 'content' },
        { id: 'videos', name: 'Videos', category: 'video' },
        { id: 'images', name: 'Images', category: 'media' },
        { id: 'podcasts', name: 'Podcasts', category: 'audio' },
        { id: 'tutorials', name: 'Tutorials', category: 'education' }
      ];
      
      const data = baseData.map(item => ({
        ...item,
        value: Math.floor(Math.random() * 10000) + 5000
      }));
      
      contentData.push({ timestamp, data });
    }
    await ContentPerformance.insertMany(contentData);
    
    // Seed User Distribution (last 30 days)
    console.log('👥 Seeding user distribution...');
    const userDistData = [];
    for (let i = 0; i < 30; i++) {
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - i);
      
      const premiumPercentage = Math.floor(Math.random() * 15) + 30;
      const freePercentage = Math.floor(Math.random() * 15) + 25;
      const trialPercentage = Math.floor(Math.random() * 10) + 15;
      const inactivePercentage = 100 - premiumPercentage - freePercentage - trialPercentage;
      
      const data = [
        { id: 'premium', name: 'Premium Users', value: premiumPercentage, color: '#00FFFF' },
        { id: 'free', name: 'Free Users', value: freePercentage, color: '#39FF14' },
        { id: 'trial', name: 'Trial Users', value: trialPercentage, color: '#FF1493' },
        { id: 'inactive', name: 'Inactive', value: inactivePercentage, color: '#6B7280' }
      ];
      
      userDistData.push({ timestamp, data });
    }
    await UserDistribution.insertMany(userDistData);
    
    // Seed System Performance (last 7 days, hourly data)
    console.log('⚡ Seeding system performance...');
    const systemData = [];
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour += 4) { // Every 4 hours
        const timestamp = new Date();
        timestamp.setDate(timestamp.getDate() - day);
        timestamp.setHours(hour, 0, 0, 0);
        
        const timePoints = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
        const data = timePoints.map(time => {
          const hourNum = parseInt(time.split(':')[0]);
          const isBusinessHours = hourNum >= 8 && hourNum <= 18;
          
          const baseCPU = isBusinessHours ? 60 : 40;
          const baseMemory = isBusinessHours ? 55 : 35;
          const baseNetwork = isBusinessHours ? 50 : 30;
          
          return {
            id: time,
            time: time,
            CPU: Math.max(10, baseCPU + (Math.random() - 0.5) * 20),
            Memory: Math.max(10, baseMemory + (Math.random() - 0.5) * 20),
            Network: Math.max(10, baseNetwork + (Math.random() - 0.5) * 20)
          };
        });
        
        systemData.push({ timestamp, data });
      }
    }
    await SystemPerformance.insertMany(systemData);
    
    console.log('🎉 Analytics data seeding completed successfully!');
    console.log(`
📋 Analytics Data Summary:
   📈 Real-time Analytics: ${realtimeData.length} records
   📝 Content Performance: ${contentData.length} records  
   👥 User Distribution: ${userDistData.length} records
   ⚡ System Performance: ${systemData.length} records
   🔧 Filter Options: Configured
   
🚀 Analytics endpoints ready:
   📊 GET /api/analytics-data/overview
   📈 GET /api/analytics-data/stats/realtime
   📝 GET /api/analytics-data/content-performance
   👥 GET /api/analytics-data/user-distribution
   ⚡ GET /api/analytics-data/system-performance
   🔧 GET /api/analytics-data/filter-options
   🎯 POST /api/analytics-data/apply-filters
   📤 GET /api/analytics-data/export
   🔄 POST /api/analytics-data/refresh
    `);
    
  } catch (error) {
    console.error('❌ Error seeding analytics data:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedAnalyticsData();
}

module.exports = { seedAnalyticsData };