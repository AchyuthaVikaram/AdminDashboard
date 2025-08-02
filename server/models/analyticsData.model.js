// models/analyticsData.model.js
const mongoose = require('mongoose');

// Real-time Analytics Stats Schema
const RealtimeAnalyticsSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  engagement: {
    value: { type: String, required: true }, // e.g., "7.1%"
    change: { type: String, required: true }, // e.g., "+12.5%"
    changeText: { type: String, default: 'from last week' },
    trend: { type: String, enum: ['up', 'down'], default: 'up' }
  },
  bounce: {
    value: { type: String, required: true }, // e.g., "23.7%"
    change: { type: String, required: true }, // e.g., "+5.2%"
    changeText: { type: String, default: 'from last week' },
    trend: { type: String, enum: ['up', 'down'], default: 'up' }
  },
  conversions: {
    value: { type: String, required: true }, // e.g., "1,247"
    change: { type: String, required: true }, // e.g., "-15.3%"
    changeText: { type: String, default: 'from last week' },
    trend: { type: String, enum: ['up', 'down'], default: 'down' }
  },
  activeUsers: {
    value: { type: String, required: true }, // e.g., "14"
    change: { type: String, required: true }, // e.g., "+0%"
    changeText: { type: String, default: 'from yesterday' },
    trend: { type: String, enum: ['up', 'down'], default: 'up' }
  },
  additional: {
    totalUsers: { type: Number, default: 0 },
    newUsersToday: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    avgSessionDuration: { type: Number, default: 0 } // in seconds
  }
}, {
  timestamps: true,
  collection: 'realtimeAnalytics'
});

// Content Performance Schema
const ContentPerformanceSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  data: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    value: { type: Number, required: true },
    category: { type: String, default: 'content' }
  }]
}, {
  timestamps: true,
  collection: 'contentPerformance'
});

// User Distribution Schema
const UserDistributionSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  data: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    value: { type: Number, required: true }, // percentage
    color: { type: String, required: true }
  }]
}, {
  timestamps: true,
  collection: 'userDistribution'
});

// System Performance Schema
const SystemPerformanceSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  data: [{
    id: { type: String, required: true },
    time: { type: String, required: true },
    CPU: { type: Number, required: true },
    Memory: { type: Number, required: true },
    Network: { type: Number, required: true }
  }]
}, {
  timestamps: true,
  collection: 'systemPerformance'
});

// Filter Options Schema
const FilterOptionsSchema = new mongoose.Schema({
  timeRanges: [{
    label: { type: String, required: true },
    value: { type: String, required: true },
    days: { type: Number, required: true }
  }],
  categories: [{
    label: { type: String, required: true },
    value: { type: String, required: true }
  }]
}, {
  timestamps: true,
  collection: 'filterOptions'
});

// Analytics Activity Log Schema (for tracking user interactions)
const AnalyticsActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['filter_applied', 'view_changed', 'export_data', 'refresh_data']
  },
  details: {
    timeRange: String,
    category: String,
    timestamp: { type: Date, default: Date.now }
  },
  ip: String,
  userAgent: String
}, {
  timestamps: true,
  collection: 'analyticsActivity'
});

// Create indexes for better performance
RealtimeAnalyticsSchema.index({ timestamp: -1 });
ContentPerformanceSchema.index({ timestamp: -1 });
UserDistributionSchema.index({ timestamp: -1 });
SystemPerformanceSchema.index({ timestamp: -1 });
AnalyticsActivitySchema.index({ userId: 1, timestamp: -1 });

// Create models
const RealtimeAnalytics = mongoose.model('RealtimeAnalytics', RealtimeAnalyticsSchema);
const ContentPerformance = mongoose.model('ContentPerformance', ContentPerformanceSchema);
const UserDistribution = mongoose.model('UserDistribution', UserDistributionSchema);
const SystemPerformance = mongoose.model('SystemPerformance', SystemPerformanceSchema);
const FilterOptions = mongoose.model('FilterOptions', FilterOptionsSchema);
const AnalyticsActivity = mongoose.model('AnalyticsActivity', AnalyticsActivitySchema);

module.exports = {
  RealtimeAnalytics,
  ContentPerformance,
  UserDistribution,
  SystemPerformance,
  FilterOptions,
  AnalyticsActivity
};