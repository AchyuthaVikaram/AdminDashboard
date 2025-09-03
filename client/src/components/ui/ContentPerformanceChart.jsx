import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';
import { TrendingUp, Eye, Heart, Share2, MessageCircle } from 'lucide-react';

const ContentPerformanceChart = () => {
  const [viewMode, setViewMode] = useState('views');
  const [timeRange, setTimeRange] = useState('week');

  const contentData = {
    views: [
      { id: 'blog-posts', name: 'Blog Posts', value: 12500, growth: 15.2, engagement: 8.5 },
      { id: 'videos', name: 'Videos', value: 18900, growth: 22.8, engagement: 12.3 },
      { id: 'images', name: 'Images', value: 15600, growth: -5.1, engagement: 6.7 },
      { id: 'podcasts', name: 'Podcasts', value: 7200, growth: 8.9, engagement: 15.2 },
      { id: 'tutorials', name: 'Tutorials', value: 9800, growth: 18.5, engagement: 11.8 }
    ],
    engagement: [
      { id: 'blog-posts', name: 'Blog Posts', value: 8.5, growth: 12.1, likes: 1250, shares: 340 },
      { id: 'videos', name: 'Videos', value: 12.3, growth: 18.7, likes: 2890, shares: 780 },
      { id: 'images', name: 'Images', value: 6.7, growth: -2.3, likes: 1560, shares: 220 },
      { id: 'podcasts', name: 'Podcasts', value: 15.2, growth: 25.4, likes: 720, shares: 180 },
      { id: 'tutorials', name: 'Tutorials', value: 11.8, growth: 15.9, likes: 980, shares: 450 }
    ]
  };

  const trendData = [
    { period: 'Week 1', blogPosts: 2100, videos: 3200, images: 2800, podcasts: 1200, tutorials: 1800 },
    { period: 'Week 2', blogPosts: 2400, videos: 3600, images: 2600, podcasts: 1400, tutorials: 2000 },
    { period: 'Week 3', blogPosts: 2800, videos: 4100, images: 2900, podcasts: 1600, tutorials: 2200 },
    { period: 'Week 4', blogPosts: 3200, videos: 4800, images: 3100, podcasts: 1800, tutorials: 2400 }
  ];

  const currentData = contentData[viewMode] || contentData.views;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 shadow-lg">
          <p className="text-white font-medium mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-[#00FFFF] text-sm">
              {viewMode === 'views' ? 'Views' : 'Engagement Rate'}: {payload[0].value.toLocaleString()}{viewMode === 'engagement' ? '%' : ''}
            </p>
            <p className={`text-sm ${data.growth >= 0 ? 'text-[#39FF14]' : 'text-[#FF6B6B]'}`}>
              Growth: {data.growth >= 0 ? '+' : ''}{data.growth}%
            </p>
            {viewMode === 'engagement' && (
              <>
                <p className="text-white/60 text-xs">Likes: {data.likes}</p>
                <p className="text-white/60 text-xs">Shares: {data.shares}</p>
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Content Performance</h3>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#1a1a1a] rounded-lg p-1">
            <button
              onClick={() => setViewMode('views')}
              className={`px-3 py-1 text-xs rounded transition ${
                viewMode === 'views' 
                  ? 'bg-[#00FFFF] text-black' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Eye size={12} className="inline mr-1" />
              Views
            </button>
            <button
              onClick={() => setViewMode('engagement')}
              className={`px-3 py-1 text-xs rounded transition ${
                viewMode === 'engagement' 
                  ? 'bg-[#00FFFF] text-black' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Heart size={12} className="inline mr-1" />
              Engagement
            </button>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {currentData.slice(0, 2).map((item) => (
          <div key={item.id} className="bg-[#1a1a1a]/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/60">{item.name}</span>
              <div className={`flex items-center text-xs ${
                item.growth >= 0 ? 'text-[#39FF14]' : 'text-[#FF6B6B]'
              }`}>
                <TrendingUp size={10} className="mr-1" />
                {item.growth >= 0 ? '+' : ''}{item.growth}%
              </div>
            </div>
            <div className="text-white font-semibold">
              {viewMode === 'views' ? item.value.toLocaleString() : `${item.value}%`}
            </div>
          </div>
        ))}
      </div>
      
      <div className="h-80">
         <ResponsiveContainer width="100%" height="100%">
          <BarChart data={currentData} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
             
              type="category" 
              stroke="rgba(255,255,255,0.6)" 
              fontSize={12}
              tickFormatter={(value) => viewMode === 'views' ? `${value/1000}k` : `${value}%`}
            />
            <YAxis 
              dataKey="name" 
               type="number" 
              stroke="rgba(255,255,255,0.6)" 
              width={80}
              fontSize={12}
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

      {/* Trend Chart */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <h4 className="text-sm font-medium text-white/80 mb-3">Content Trends (Last 4 Weeks)</h4>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="period" stroke="rgba(255,255,255,0.6)" fontSize={10} />
              <YAxis stroke="rgba(255,255,255,0.6)" fontSize={10} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Line type="monotone" dataKey="videos" stroke="#00FFFF" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="blogPosts" stroke="#39FF14" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="tutorials" stroke="#FF1493" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ContentPerformanceChart;