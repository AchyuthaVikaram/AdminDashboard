// models/systemLog.model.js
const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['error', 'warning', 'info', 'debug'],
    required: true,
    index: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  source: {
    type: String, // e.g., 'database', 'api', 'auth', 'file-system'
    required: true,
    index: true
  },
  category: {
    type: String, // e.g., 'system', 'security', 'performance', 'database'
    default: 'system',
    index: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true
  },
  ip: {
    type: String,
    sparse: true
  },
  userAgent: {
    type: String,
    sparse: true
  },
  stackTrace: {
    type: String
  },
  requestId: {
    type: String, // For tracing requests
    sparse: true
  },
  environment: {
    type: String,
    enum: ['development', 'staging', 'production'],
    default: process.env.NODE_ENV || 'development'
  },
  resolved: {
    type: Boolean,
    default: false
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
systemLogSchema.index({ createdAt: -1 });
systemLogSchema.index({ level: 1, createdAt: -1 });
systemLogSchema.index({ source: 1, createdAt: -1 });
systemLogSchema.index({ category: 1, createdAt: -1 });
systemLogSchema.index({ resolved: 1, createdAt: -1 });
systemLogSchema.index({ environment: 1 });

// Text search index
systemLogSchema.index({ 
  message: 'text', 
  source: 'text',
  category: 'text',
  tags: 'text'
});

// Virtual for time ago
systemLogSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffInMs = now - this.createdAt;
  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
});

// Virtual for formatted timestamp
systemLogSchema.virtual('formattedTime').get(function() {
  return this.createdAt.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
});

// Static methods
systemLogSchema.statics.getLogStatistics = async function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [totalLogs, todayStats, levelStats, sourceStats, recentErrors] = await Promise.all([
    this.countDocuments(),
    this.aggregate([
      {
        $match: {
          createdAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 }
        }
      }
    ]),
    this.aggregate([
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]),
    this.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]),
    this.find({ level: 'error' })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
  ]);

  // Process today's stats
  const todayStatsMap = {};
  todayStats.forEach(stat => {
    todayStatsMap[stat._id] = stat.count;
  });

  return {
    totalLogs,
    today: {
      errors: todayStatsMap.error || 0,
      warnings: todayStatsMap.warning || 0,
      info: todayStatsMap.info || 0,
      debug: todayStatsMap.debug || 0
    },
    levelDistribution: levelStats,
    topSources: sourceStats,
    recentErrors
  };
};

systemLogSchema.statics.getSystemHealth = async function() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  const [recentErrors, recentWarnings, systemStatus] = await Promise.all([
    this.countDocuments({
      level: 'error',
      createdAt: { $gte: fiveMinutesAgo }
    }),
    this.countDocuments({
      level: 'warning',
      createdAt: { $gte: oneHourAgo }
    }),
    this.aggregate([
      {
        $match: {
          createdAt: { $gte: oneHourAgo }
        }
      },
      {
        $group: {
          _id: {
            source: '$source',
            level: '$level'
          },
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  // Determine overall system status
  let overallStatus = 'operational';
  if (recentErrors > 10) {
    overallStatus = 'major_issues';
  } else if (recentErrors > 0 || recentWarnings > 20) {
    overallStatus = 'minor_issues';
  }

  return {
    status: overallStatus,
    recentErrors,
    recentWarnings,
    systemStatus
  };
};

systemLogSchema.statics.getActivityTrend = async function(hours = 24) {
  const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
  
  const trend = await this.aggregate([
    {
      $match: {
        createdAt: { $gte: startTime }
      }
    },
    {
      $group: {
        _id: {
          hour: { $hour: '$createdAt' },
          level: '$level'
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.hour',
        total: { $sum: '$count' },
        errors: {
          $sum: {
            $cond: [{ $eq: ['$_id.level', 'error'] }, '$count', 0]
          }
        },
        warnings: {
          $sum: {
            $cond: [{ $eq: ['$_id.level', 'warning'] }, '$count', 0]
          }
        }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return trend;
};

// Instance methods
systemLogSchema.methods.resolve = function(userId) {
  this.resolved = true;
  this.resolvedBy = userId;
  this.resolvedAt = new Date();
  return this.save();
};

systemLogSchema.methods.addTag = function(tag) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
    return this.save();
  }
  return Promise.resolve(this);
};

// Pre-save middleware
systemLogSchema.pre('save', function(next) {
  // Auto-resolve info and debug logs after 7 days
  if ((this.level === 'info' || this.level === 'debug') && !this.resolved) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    if (this.createdAt < sevenDaysAgo) {
      this.resolved = true;
      this.resolvedAt = new Date();
    }
  }
  
  next();
});

module.exports = mongoose.model('SystemLog', systemLogSchema);