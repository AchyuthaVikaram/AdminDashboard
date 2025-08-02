// services/analyticsDataService.js
const {
  RealtimeAnalytics,
  ContentPerformance,
  UserDistribution,
  SystemPerformance,
  FilterOptions,
  AnalyticsActivity
} = require('../models/analyticsData.model');
const User = require('../models/user.model');

class AnalyticsDataService {
  
  // Generate real-time stats data with more realistic variations
  static async generateRealtimeStats() {
    try {
      // Get actual user count from database
      const actualUserCount = await User.countDocuments({ status: 'active' }) || 0;
      
      // Base values that change throughout the day
      const hour = new Date().getHours();
      const isBusinessHours = hour >= 8 && hour <= 18;
      const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
      
      // Business hours have higher engagement, lower bounce
      const baseEngagement = isBusinessHours && !isWeekend ? 8.5 : 6.2;
      const baseBounce = isBusinessHours && !isWeekend ? 22.0 : 28.5;
      const baseConversions = isBusinessHours && !isWeekend ? 1400 : 980;
      const baseActiveUsers = Math.max(1, Math.floor(actualUserCount * 0.1) || 12);

      // Add realistic variations
      const engagementVariation = (Math.random() - 0.5) * 1.5;
      const bounceVariation = (Math.random() - 0.5) * 3.0;
      const conversionsVariation = Math.floor((Math.random() - 0.5) * 150);
      const activeUsersVariation = Math.floor((Math.random() - 0.5) * 8);

      const newEngagement = Math.max(0.1, baseEngagement + engagementVariation);
      const newBounce = Math.max(1.0, baseBounce + bounceVariation);
      const newConversions = Math.max(10, baseConversions + conversionsVariation);
      const newActiveUsers = Math.max(1, baseActiveUsers + activeUsersVariation);

      // Calculate change percentages (simulate week-over-week changes)
      const weeklyEngagementTrend = 15 + (Math.random() - 0.5) * 20; // -5% to +35%
      const weeklyBounceTrend = -8 + (Math.random() - 0.5) * 16; // -16% to +0%
      const weeklyConversionsTrend = 5 + (Math.random() - 0.5) * 30; // -10% to +20%
      const dailyActiveUsersTrend = (Math.random() - 0.5) * 40; // -20% to +20%

      const statsData = {
        engagement: {
          value: `${newEngagement.toFixed(1)}%`,
          change: `${weeklyEngagementTrend >= 0 ? '+' : ''}${weeklyEngagementTrend.toFixed(1)}%`,
          changeText: 'from last week',
          trend: weeklyEngagementTrend >= 0 ? 'up' : 'down'
        },
        bounce: {
          value: `${newBounce.toFixed(1)}%`,
          change: `${weeklyBounceTrend >= 0 ? '+' : ''}${weeklyBounceTrend.toFixed(1)}%`,
          changeText: 'from last week',
          trend: weeklyBounceTrend <= 0 ? 'up' : 'down' // Lower bounce rate is better
        },
        conversions: {
          value: newConversions.toLocaleString(),
          change: `${weeklyConversionsTrend >= 0 ? '+' : ''}${weeklyConversionsTrend.toFixed(1)}%`,
          changeText: 'from last week',
          trend: weeklyConversionsTrend >= 0 ? 'up' : 'down'
        },
        activeUsers: {
          value: newActiveUsers.toString(),
          change: `${dailyActiveUsersTrend >= 0 ? '+' : ''}${dailyActiveUsersTrend.toFixed(1)}%`,
          changeText: 'from yesterday',
          trend: dailyActiveUsersTrend >= 0 ? 'up' : 'down'
        },
        additional: {
          totalUsers: actualUserCount,
          newUsersToday: Math.floor(Math.random() * 25) + 5,
          totalRevenue: Math.floor(45000 + Math.random() * 15000), // $45k-$60k
          avgSessionDuration: Math.floor(180 + Math.random() * 240) // 3-7 minutes
        }
      };

      // Don't save to database for every call - only periodically
      const shouldSave = Math.random() < 0.1; // 10% chance
      if (shouldSave) {
        try {
          const realtimeStats = new RealtimeAnalytics(statsData);
          await realtimeStats.save();
        } catch (saveError) {
          console.warn('Could not save realtime stats:', saveError.message);
        }
      }

      return statsData;
    } catch (error) {
      console.error('Error generating real-time stats:', error);
      
      // Return fallback data
      return {
        engagement: { value: "7.8%", change: "+12.3%", changeText: "from last week", trend: "up" },
        bounce: { value: "24.1%", change: "-5.2%", changeText: "from last week", trend: "up" },
        conversions: { value: "1,247", change: "+8.7%", changeText: "from last week", trend: "up" },
        activeUsers: { value: "14", change: "+0%", changeText: "from yesterday", trend: "up" },
        additional: { totalUsers: 150, newUsersToday: 12, totalRevenue: 52000, avgSessionDuration: 280 }
      };
    }
  }

  // Generate content performance data with time-based variations
  static async generateContentPerformance(timeRange = 'Last 7 Days') {
    try {
      const baseData = [
        { id: 'blog-posts', name: 'Blog Posts', value: 12500, category: 'content' },
        { id: 'videos', name: 'Videos', value: 8900, category: 'video' },
        { id: 'images', name: 'Images', value: 15600, category: 'media' },
        { id: 'podcasts', name: 'Podcasts', value: 4200, category: 'audio' },
        { id: 'tutorials', name: 'Tutorials', value: 9800, category: 'education' },
        { id: 'infographics', name: 'Infographics', value: 6300, category: 'media' },
        { id: 'webinars', name: 'Webinars', value: 3400, category: 'education' },
        { id: 'case-studies', name: 'Case Studies', value: 5100, category: 'content' }
      ];

      // Apply time range variations
      const multiplier = this.getTimeRangeMultiplier(timeRange);
      
      const data = baseData.map(item => {
        const variation = (Math.random() - 0.4) * 0.3; // Slight bias towards positive
        const finalValue = Math.floor(item.value * multiplier * (1 + variation));
        return {
          ...item,
          value: Math.max(100, finalValue) // Minimum 100 views
        };
      });

      // Sort by value for better visualization
      data.sort((a, b) => b.value - a.value);

      return data;
    } catch (error) {
      console.error('Error generating content performance:', error);
      
      // Return fallback data
      return [
        { id: 'blog-posts', name: 'Blog Posts', value: 12500, category: 'content' },
        { id: 'videos', name: 'Videos', value: 8900, category: 'video' },
        { id: 'images', name: 'Images', value: 15600, category: 'media' },
        { id: 'podcasts', name: 'Podcasts', value: 4200, category: 'audio' },
        { id: 'tutorials', name: 'Tutorials', value: 9800, category: 'education' }
      ];
    }
  }

  // Generate user distribution data with realistic percentages
  static async generateUserDistribution() {
    try {
      // Get actual user data if available
      let totalUsers = 150;
      try {
        totalUsers = await User.countDocuments() || 150;
      } catch (dbError) {
        console.warn('Could not fetch user count from database:', dbError.message);
      }

      // Generate realistic distribution with some variation
      const baseDistribution = {
        premium: 35 + (Math.random() - 0.5) * 10, // 30-40%
        free: 40 + (Math.random() - 0.5) * 10,    // 35-45%
        trial: 15 + (Math.random() - 0.5) * 6,    // 12-18%
      };

      // Calculate inactive to make total 100%
      const activeTotal = baseDistribution.premium + baseDistribution.free + baseDistribution.trial;
      const inactive = Math.max(5, 100 - activeTotal);

      // Normalize to ensure total is exactly 100%
      const total = baseDistribution.premium + baseDistribution.free + baseDistribution.trial + inactive;
      const normalizedData = [
        {
          id: 'premium',
          name: 'Premium Users',
          value: Math.round((baseDistribution.premium / total) * 100),
          color: '#00FFFF'
        },
        {
          id: 'free',
          name: 'Free Users',
          value: Math.round((baseDistribution.free / total) * 100),
          color: '#39FF14'
        },
        {
          id: 'trial',
          name: 'Trial Users',
          value: Math.round((baseDistribution.trial / total) * 100),
          color: '#FF1493'
        },
        {
          id: 'inactive',
          name: 'Inactive',
          value: Math.round((inactive / total) * 100),
          color: '#6B7280'
        }
      ];

      // Ensure total is exactly 100% by adjusting the largest segment
      const currentTotal = normalizedData.reduce((sum, item) => sum + item.value, 0);
      if (currentTotal !== 100) {
        const largest = normalizedData.reduce((max, item) => item.value > max.value ? item : max);
        largest.value += (100 - currentTotal);
      }

      return normalizedData;
    } catch (error) {
      console.error('Error generating user distribution:', error);
      
      // Return fallback data
      return [
        { id: 'premium', name: 'Premium Users', value: 35, color: '#00FFFF' },
        { id: 'free', name: 'Free Users', value: 42, color: '#39FF14' },
        { id: 'trial', name: 'Trial Users', value: 15, color: '#FF1493' },
        { id: 'inactive', name: 'Inactive', value: 8, color: '#6B7280' }
      ];
    }
  }

  // Generate system performance data with realistic patterns
  static async generateSystemPerformance() {
    try {
      const timePoints = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
      const currentHour = new Date().getHours();
      
      const data = timePoints.map(time => {
        const hour = parseInt(time.split(':')[0]);
        const isBusinessHours = hour >= 8 && hour <= 18;
        const isCurrentTime = Math.abs(hour - currentHour) <= 2;
        
        // Higher load during business hours
        const baseCPU = isBusinessHours ? 65 : 35;
        const baseMemory = isBusinessHours ? 60 : 40;
        const baseNetwork = isBusinessHours ? 55 : 25;
        
        // Add current time spike
        const currentTimeMultiplier = isCurrentTime ? 1.2 : 1.0;
        
        // Add some realistic variation
        const cpuVariation = (Math.random() - 0.5) * 15;
        const memoryVariation = (Math.random() - 0.5) * 12;
        const networkVariation = (Math.random() - 0.5) * 20;

        return {
          id: time,
          time: time,
          CPU: Math.max(5, Math.min(95, (baseCPU + cpuVariation) * currentTimeMultiplier)),
          Memory: Math.max(5, Math.min(90, (baseMemory + memoryVariation) * currentTimeMultiplier)),
          Network: Math.max(5, Math.min(100, (baseNetwork + networkVariation) * currentTimeMultiplier))
        };
      });

      return data;
    } catch (error) {
      console.error('Error generating system performance:', error);
      
      // Return fallback data
      return [
        { id: '00:00', time: '00:00', CPU: 35, Memory: 40, Network: 25 },
        { id: '04:00', time: '04:00', CPU: 30, Memory: 38, Network: 20 },
        { id: '08:00', time: '08:00', CPU: 65, Memory: 60, Network: 55 },
        { id: '12:00', time: '12:00', CPU: 78, Memory: 70, Network: 65 },
        { id: '16:00', time: '16:00', CPU: 72, Memory: 65, Network: 58 },
        { id: '20:00', time: '20:00', CPU: 45, Memory: 50, Network: 35 }
      ];
    }
  }

  // Get filter options with error handling
  static async getFilterOptions() {
    try {
      let filterOptions = await FilterOptions.findOne();
      
      if (!filterOptions) {
        filterOptions = {
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
        };
        
        // Try to save to database, but don't fail if it doesn't work
        try {
          const newFilterOptions = new FilterOptions(filterOptions);
          await newFilterOptions.save();
        } catch (saveError) {
          console.warn('Could not save filter options to database:', saveError.message);
        }
      }

      return filterOptions;
    } catch (error) {
      console.error('Error getting filter options:', error);
      
      // Return fallback filter options
      return {
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
      };
    }
  }

  // Log analytics activity with error handling
  static async logActivity(userId, action, details, req) {
    try {
      if (!AnalyticsActivity) {
        console.warn('AnalyticsActivity model not available');
        return null;
      }

      const activity = new AnalyticsActivity({
        userId,
        action,
        details,
        ip: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown'
      });

      await activity.save();
      return activity;
    } catch (error) {
      console.warn('Could not log analytics activity:', error.message);
      return null; // Don't throw error, just log warning
    }
  }

  // Get historical data for comparison
  static async getHistoricalComparison(timeRange) {
    try {
      const days = this.getTimeRangeDays(timeRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Try to get data from database, but provide fallback
      let realtimeData = [];
      let contentData = [];

      try {
        [realtimeData, contentData] = await Promise.all([
          RealtimeAnalytics.find({
            timestamp: { $gte: startDate }
          }).sort({ timestamp: -1 }).limit(100),
          ContentPerformance.find({
            timestamp: { $gte: startDate }
          }).sort({ timestamp: -1 }).limit(50)
        ]);
      } catch (dbError) {
        console.warn('Could not fetch historical data from database:', dbError.message);
      }

      return {
        realtimeData,
        contentData,
        summary: {
          totalDataPoints: realtimeData.length,
          dateRange: {
            start: startDate,
            end: new Date()
          }
        }
      };
    } catch (error) {
      console.error('Error getting historical comparison:', error);
      
      return {
        realtimeData: [],
        contentData: [],
        summary: {
          totalDataPoints: 0,
          dateRange: {
            start: new Date(),
            end: new Date()
          }
        }
      };
    }
  }

  // Get analytics activity with pagination
  static async getAnalyticsActivity(skip = 0, limit = 20) {
    try {
      if (!AnalyticsActivity) {
        return [];
      }

      const activities = await AnalyticsActivity.find()
        .populate('userId', 'username email')
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);

      return activities;
    } catch (error) {
      console.warn('Could not fetch analytics activity:', error.message);
      return [];
    }
  }

  // Helper methods
  static getTimeRangeMultiplier(timeRange) {
    const multipliers = {
      'Last 24 Hours': 0.7,
      'Last 7 Days': 1.0,
      'Last 30 Days': 1.3,
      'Last 90 Days': 1.8,
      'Last Year': 2.5
    };
    return multipliers[timeRange] || 1.0;
  }

  static getTimeRangeDays(timeRange) {
    const days = {
      'Last 24 Hours': 1,
      'Last 7 Days': 7,
      'Last 30 Days': 30,
      'Last 90 Days': 90,
      'Last Year': 365
    };
    return days[timeRange] || 7;
  }

  // Clean old data (call this periodically)
  static async cleanOldData() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const cleanupPromises = [];

      if (RealtimeAnalytics) {
        cleanupPromises.push(
          RealtimeAnalytics.deleteMany({ timestamp: { $lt: thirtyDaysAgo } })
        );
      }

      if (ContentPerformance) {
        cleanupPromises.push(
          ContentPerformance.deleteMany({ timestamp: { $lt: thirtyDaysAgo } })
        );
      }

      if (UserDistribution) {
        cleanupPromises.push(
          UserDistribution.deleteMany({ timestamp: { $lt: thirtyDaysAgo } })
        );
      }

      if (SystemPerformance) {
        cleanupPromises.push(
          SystemPerformance.deleteMany({ timestamp: { $lt: thirtyDaysAgo } })
        );
      }

      if (AnalyticsActivity) {
        cleanupPromises.push(
          AnalyticsActivity.deleteMany({ timestamp: { $lt: thirtyDaysAgo } })
        );
      }

      await Promise.all(cleanupPromises);
      console.log('Old analytics data cleaned successfully');
    } catch (error) {
      console.warn('Error cleaning old data:', error.message);
    }
  }
}

module.exports = AnalyticsDataService;