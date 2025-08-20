import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCards = ({data}) => {
  const IconComponents = {
    Eye: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
      </svg>
    ),
    Mouse: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C9.79 2 8 3.79 8 6v12c0 2.21 1.79 4 4 4s4-1.79 4-4V6c0-2.21-1.79-4-4-4zm0 2c1.1 0 2 .9 2 2v2h-4V6c0-1.1.9-2 2-2zm-2 6h4v8c0 1.1-.9 2-2 2s-2-.9-2-2v-8z"/>
      </svg>
    ),
    Cart: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>
    ),
    Users: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.99 1.99 0 0 0 18.05 7h-.01c-.8 0-1.54.5-1.85 1.26l-1.92 5.77A2 2 0 0 0 16.18 16H18v6h2zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zm1.5 1h-2c-1.1 0-2 .9-2 2v7h6v-7c0-1.1-.9-2-2-2zM6 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm2.5 7.5c.83 0 1.5-.67 1.5-1.5S9.33 8.5 8.5 8.5 7 9.17 7 10s.67 1.5 1.5 1.5zm1.5 1h-2c-1.1 0-2 .9-2 2v7h6v-7c0-1.1-.9-2-2-2z"/>
      </svg>
    )
  };

  // Default values if data is not loaded
  if (!data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/5 backdrop-blur-md p-4 sm:p-6 rounded-xl lg:rounded-2xl shadow-lg border border-white/10 animate-pulse">
            <div className="h-12 sm:h-16 bg-white/10 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      id: 'engagement',
      title: 'Engagement Rate',
      value: data.engagement?.value || '0%',
      change: data.engagement?.change || '0%',
      changeText: data.engagement?.changeText || 'from last week',
      trend: data.engagement?.trend || 'up',
      icon: IconComponents.Eye,
      gradient: 'from-green-400 to-green-600',
      bgGradient: 'from-green-400/20 to-green-600/20'
    },
    {
      id: 'bounce',
      title: 'Bounce Rate',
      value: data.bounce?.value || '0%',
      change: data.bounce?.change || '0%',
      changeText: data.bounce?.changeText || 'from last week',
      trend: data.bounce?.trend || 'up',
      icon: IconComponents.Mouse,
      gradient: 'from-pink-400 to-pink-600',
      bgGradient: 'from-pink-400/20 to-pink-600/20'
    },
    {
      id: 'conversions',
      title: 'Conversions',
      value: data.conversions?.value || '0',
      change: data.conversions?.change || '0%',
      changeText: data.conversions?.changeText || 'from last week',
      trend: data.conversions?.trend || 'down',
      icon: IconComponents.Cart,
      gradient: 'from-blue-400 to-blue-600',
      bgGradient: 'from-blue-400/20 to-blue-600/20'
    },
    {
      id: 'active-users',
      title: 'Active Users',
      value: data.activeUsers?.value || data.additional?.totalUsers?.toLocaleString() || '0',
      change: data.activeUsers?.change || '0%',
      changeText: data.activeUsers?.changeText || 'from yesterday',
      trend: data.activeUsers?.trend || 'up',
      icon: IconComponents.Users,
      gradient: 'from-[#39FF14] to-green-500',
      bgGradient: 'from-[#39FF14]/20 to-green-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {stats.map((stat) => {
        const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
        const trendColor = stat.trend === 'up' ? 'text-green-400' : 'text-red-400';
        
        return (
          <div
            key={stat.id}
            className="bg-white/5 backdrop-blur-md p-4 sm:p-6 rounded-xl lg:rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 border border-white/10"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-full bg-gradient-to-r ${stat.bgGradient}`}>
                <stat.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            
            <div>
              <p className="text-white/60 text-xs sm:text-sm font-medium truncate">{stat.title}</p>
              <p className="text-white text-lg sm:text-2xl font-bold mt-1 truncate">{stat.value}</p>
              <div className={`flex items-center gap-1 mt-2 ${trendColor}`}>
                <TrendIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium truncate">{stat.change} {stat.changeText}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;