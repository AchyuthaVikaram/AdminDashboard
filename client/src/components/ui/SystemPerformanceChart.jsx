import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const SystemPerformanceChart = () => {
  const data = [
    { id: '00:00', time: '00:00', CPU: 45, Memory: 32, Network: 28 },
    { id: '04:00', time: '04:00', CPU: 52, Memory: 38, Network: 35 },
    { id: '08:00', time: '08:00', CPU: 68, Memory: 55, Network: 42 },
    { id: '12:00', time: '12:00', CPU: 75, Memory: 68, Network: 58 },
    { id: '16:00', time: '16:00', CPU: 65, Memory: 52, Network: 48 },
    { id: '20:00', time: '20:00', CPU: 58, Memory: 45, Network: 38 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex justify-center gap-6 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-white/70">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">System Performance Metrics</h3>
        <div className="w-6 h-6 bg-gradient-to-r from-[#00FF7F] to-[#FFD700] rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-black rounded-full"></div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255,255,255,0.6)" 
              fontSize={12}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.6)" 
              fontSize={12}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Line 
              type="monotone" 
              dataKey="CPU" 
              stroke="#00FF7F" 
              strokeWidth={3}
              dot={{ fill: '#00FF7F', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#00FF7F', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="Memory" 
              stroke="#FFD700" 
              strokeWidth={3}
              dot={{ fill: '#FFD700', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#FFD700', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="Network" 
              stroke="#FF4C4C" 
              strokeWidth={3}
              dot={{ fill: '#FF4C4C', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#FF4C4C', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SystemPerformanceChart;