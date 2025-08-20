import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import { BASE_URL } from '../../utils/constant';

const COLORS = ['#00FF7F', '#FFD700', '#FF4C4C'];

const SystemStatusWidget = ({data}) => {
  const [systemHealth, setSystemHealth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (data) {
      processSystemHealthData(data);
    } else {
      fetchSystemHealth();
    }
  }, [data]);

  const fetchSystemHealth = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get(
        `${BASE_URL}/api/dashboard/system/health`,
        config
      );

      processSystemHealthData(response.data.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching system health:', error);
      setSystemHealth([
        { name: 'Healthy', value: 80 },
        { name: 'Warnings', value: 15 },
        { name: 'Errors', value: 5 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const processSystemHealthData = (healthData) => {
    if (healthData && healthData.health) {
      setSystemHealth(healthData.health);
    } else {
      if (healthData && healthData.services) {
        const services = healthData.services;
        const serviceStatuses = Object.values(services);
        
        const healthyCount = serviceStatuses.filter(service => service.status === 'healthy').length;
        const warningCount = serviceStatuses.filter(service => service.status === 'warning').length;
        const errorCount = serviceStatuses.filter(service => service.status === 'error').length;
        
        const total = healthyCount + warningCount + errorCount;
        
        setSystemHealth([
          { 
            name: 'Healthy', 
            value: total > 0 ? Math.round((healthyCount / total) * 100) : 80 
          },
          { 
            name: 'Warnings', 
            value: total > 0 ? Math.round((warningCount / total) * 100) : 15 
          },
          { 
            name: 'Errors', 
            value: total > 0 ? Math.round((errorCount / total) * 100) : 5 
          },
        ]);
      }
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const refreshHealth = () => {
    setLoading(true);
    fetchSystemHealth();
  };

  return (
    <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-xl border border-white/10 shadow-md space-y-3 sm:space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold text-white">System Health</h2>
        <button
          onClick={refreshHealth}
          disabled={loading}
          className="text-xs sm:text-sm text-[#00FFFF] hover:text-[#39FF14] transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="h-48 sm:h-56 lg:h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={systemHealth}
              cx="50%"
              cy="50%"
              outerRadius="60%"
              label={(entry) => `${entry.value}%`}
              labelStyle={{ 
                fontSize: '12px', 
                fill: '#fff',
                fontWeight: 'bold'
              }}
              dataKey="value"
            >
              {systemHealth.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} stroke="#222" strokeWidth={1} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "12px"
              }}
            />
            <Legend 
              iconType="circle" 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              wrapperStyle={{
                fontSize: '12px',
                color: '#fff'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {lastUpdated && (
        <div className="text-xs text-white/50 text-center">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default SystemStatusWidget;