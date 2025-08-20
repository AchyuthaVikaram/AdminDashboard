// File: /src/components/ui/StatsCards.jsx
import { motion } from 'framer-motion';
import { Users, Eye, TrendingUp, Activity, Clock, DollarSign } from 'lucide-react';

const StatsCard = ({ title, value, subtitle, icon, bgColor, textColor, delay = 0, loading }) => {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.2,
        type: "spring",
        stiffness: 400
      }
    }
  };

  if (loading) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white/5 rounded-lg p-4 sm:p-6 border border-gray-700/30 backdrop-blur-sm shadow-lg"
      >
        <div className="animate-pulse">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="h-6 sm:h-8 bg-gray-600 rounded mb-2 w-16 sm:w-20"></div>
              <div className="h-3 sm:h-4 bg-gray-700 rounded mb-1 w-20 sm:w-24"></div>
              <div className="h-3 bg-gray-700 rounded w-16 sm:w-20"></div>
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-600 rounded"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`
        ${bgColor} rounded-lg p-4 sm:p-6 
        border border-gray-700/30 dark:border-gray-600/30
        backdrop-blur-sm shadow-lg hover:shadow-xl
        transition-all duration-300 cursor-pointer
        min-h-[120px] sm:min-h-[140px]
      `}
    >
      <div className="flex items-start justify-between h-full">
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${textColor} mb-1 leading-tight`}>
              {value}
            </div>
            <div className="text-xs sm:text-sm text-gray-400 dark:text-gray-300 mb-1 font-medium">
              {title}
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {subtitle}
          </div>
        </div>
        <div className={`text-xl sm:text-2xl ${textColor} opacity-80 flex-shrink-0 ml-2`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const StatsCards = ({ data, loading }) => {
  // Default data structure when no data is provided
  const defaultStats = [
    {
      title: "Total Users",
      value: "0",
      subtitle: "Active users",
      icon: <Users />,
      bgColor: "bg-gradient-to-br from-blue-500/10 to-blue-600/5",
      textColor: "text-blue-400"
    },
    {
      title: "Page Views",
      value: "0",
      subtitle: "This month",
      icon: <Eye />,
      bgColor: "bg-gradient-to-br from-green-500/10 to-green-600/5",
      textColor: "text-green-400"
    },
    {
      title: "Conversion Rate",
      value: "0%",
      subtitle: "From last month",
      icon: <TrendingUp />,
      bgColor: "bg-gradient-to-br from-purple-500/10 to-purple-600/5",
      textColor: "text-purple-400"
    },
    {
      title: "Active Sessions",
      value: "0",
      subtitle: "Current sessions",
      icon: <Activity />,
      bgColor: "bg-gradient-to-br from-orange-500/10 to-orange-600/5",
      textColor: "text-orange-400"
    },
    {
      title: "Avg. Session Time",
      value: "0m",
      subtitle: "Per session",
      icon: <Clock />,
      bgColor: "bg-gradient-to-br from-cyan-500/10 to-cyan-600/5",
      textColor: "text-cyan-400"
    },
    {
      title: "Revenue",
      value: "$0",
      subtitle: "This month",
      icon: <DollarSign />,
      bgColor: "bg-gradient-to-br from-yellow-500/10 to-yellow-600/5",
      textColor: "text-yellow-400"
    }
  ];

  // Use provided data or default stats
  const statsToShow = data || defaultStats;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        {statsToShow.map((stat, index) => (
          <StatsCard
            key={stat.title || index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            bgColor={stat.bgColor}
            textColor={stat.textColor}
            delay={index * 0.1}
            loading={loading}
          />
        ))}
      </div>

      {/* Responsive breakpoint indicators for debugging (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          <span className="sm:hidden">XS (1 col)</span>
          <span className="hidden sm:inline lg:hidden">SM (2 cols)</span>
          <span className="hidden lg:inline xl:hidden">LG (3 cols)</span>
          <span className="hidden xl:inline">XL (6 cols)</span>
        </div>
      )}
    </div>
  );
};

export default StatsCards;