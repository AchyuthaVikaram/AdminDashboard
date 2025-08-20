// File: /src/components/ui/ContentPerformanceChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const ContentPerformanceChart = ({ data, loading }) => {
  // Default data when no data is provided
  const defaultData = [
    { id: 'blog-posts', name: 'Blog Posts', value: 12500 },
    { id: 'videos', name: 'Videos', value: 8900 },
    { id: 'images', name: 'Images', value: 15600 },
    { id: 'podcasts', name: 'Podcasts', value: 4200 },
    { id: 'tutorials', name: 'Tutorials', value: 9800 }
  ];

  const chartData = data || defaultData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium text-sm">{label}</p>
          <p className="text-[#00FFFF] text-sm">
            Views: {payload[0].value.toLocaleString()}
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
          <h3 className="text-lg sm:text-xl font-bold text-white">Content Performance</h3>
          <div className="w-6 h-6 bg-gradient-to-r from-[#00FFFF] to-[#39FF14] rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-black rounded-full"></div>
          </div>
        </div>
        
        <div className="h-64 sm:h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FFFF]"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-lg border border-white/10 h-full"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-white">Content Performance</h3>
        <div className="w-6 h-6 bg-gradient-to-r from-[#00FFFF] to-[#39FF14] rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-black rounded-full"></div>
        </div>
      </div>
     
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            layout="horizontal" 
            margin={{ 
              top: 20, 
              right: window.innerWidth < 640 ? 10 : 30, 
              left: window.innerWidth < 640 ? 10 : 20, 
              bottom: 5 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              type="number"
              stroke="rgba(255,255,255,0.6)"
              fontSize={window.innerWidth < 640 ? 10 : 12}
              tickFormatter={(value) => {
                if (window.innerWidth < 640) {
                  return value >= 1000 ? `${Math.round(value/1000)}k` : value;
                }
                return `${Math.round(value/1000)}k`;
              }}
            />
            <YAxis
              dataKey="name"
              type="category"
              stroke="rgba(255,255,255,0.6)"
              width={window.innerWidth < 640 ? 60 : 80}
              fontSize={window.innerWidth < 640 ? 10 : 12}
              tickFormatter={(value) => {
                if (window.innerWidth < 640 && value.length > 8) {
                  return value.substring(0, 6) + '...';
                }
                return value;
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              fill="url(#contentGradient)"
              radius={[0, 4, 4, 0]}
            />
            <defs>
              <linearGradient id="contentGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00FFFF" />
                <stop offset="100%" stopColor="#39FF14" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mobile-friendly legend */}
      <div className="mt-4 sm:hidden">
        <div className="text-xs text-white/60 text-center">
          Content views in thousands (k)
        </div>
      </div>
    </motion.div>
  );
};

export default ContentPerformanceChart;