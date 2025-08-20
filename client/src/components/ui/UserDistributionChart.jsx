// File: /src/components/ui/UserDistributionChart.jsx
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const UserDistributionChart = ({ data, loading }) => {
  // Default data when no data is provided
  const defaultData = [
    { id: 'premium', name: 'Premium Users', value: 35, color: '#00FFFF' },
    { id: 'free', name: 'Free Users', value: 30, color: '#00FF7F' }, // updated green
    { id: 'trial', name: 'Trial Users', value: 25, color: '#FFD700' }, // updated yellow
    { id: 'inactive', name: 'Inactive', value: 10, color: '#FF4C4C' } // updated red
  ];

  const chartData = data || defaultData;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium text-sm">{payload[0].payload.name}</p>
          <p className="text-[#00FFFF] text-sm">
            {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-lg border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-white">User Distribution</h3>
          <div className="w-6 h-6 bg-gradient-to-r from-[#00FFFF] to-[#00FF7F] rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-black rounded-full"></div>
          </div>
        </div>
        
        <div className="h-64 sm:h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FFFF]"></div>
        </div>
      </div>
    );
  }

  // Calculate responsive dimensions
  const getChartDimensions = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) {
        return { innerRadius: 40, outerRadius: 80 };
      } else if (window.innerWidth < 1024) {
        return { innerRadius: 50, outerRadius: 100 };
      }
    }
    return { innerRadius: 60, outerRadius: 120 };
  };

  const { innerRadius, outerRadius } = getChartDimensions();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-lg border border-white/10 h-full"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-white">User Distribution</h3>
        <div className="w-6 h-6 bg-gradient-to-r from-[#00FFFF] to-[#00FF7F] rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-black rounded-full"></div>
        </div>
      </div>
     
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell key={entry.id} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
     
      {/* Responsive Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-4">
        {chartData.map((item) => (
          <motion.div 
            key={item.id} 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1 min-w-0">
              <span className="text-xs sm:text-sm text-white/70 truncate block">
                {item.name}
              </span>
              <span className="text-xs text-white/50">
                {item.value}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile summary */}
      <div className="mt-4 sm:hidden border-t border-white/10 pt-3">
        <div className="text-center">
          <div className="text-xs text-white/60">
            Total Users: {chartData.reduce((sum, item) => sum + item.value, 0)}%
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserDistributionChart;