import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Users, UserCheck, UserX, AlertTriangle } from "lucide-react";

const UserDistributionChart = () => {
  const [totalUsers, setTotalUsers] = useState(12450);

  const data = [
    {
      id: "active",
      name: "Active Users",
      value: 68,
      count: Math.round(totalUsers * 0.68),
      color: "#39FF14",
      icon: UserCheck,
      description: "Users active in last 30 days",
    },
    {
      id: "inactive",
      name: "Inactive Users",
      value: 22,
      count: Math.round(totalUsers * 0.22),
      color: "#6B7280",
      icon: UserX,
      description: "Users inactive for 30+ days",
    },
    {
      id: "suspended",
      name: "Suspended Users",
      value: 8,
      count: Math.round(totalUsers * 0.08),
      color: "#FF6B6B",
      icon: AlertTriangle,
      description: "Temporarily suspended accounts",
    },
    {
      id: "pending",
      name: "Pending Verification",
      value: 2,
      count: Math.round(totalUsers * 0.02),
      color: "#FFB800",
      icon: Users,
      description: "Awaiting email verification",
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 shadow-lg">
          <p className="text-white font-medium mb-2">{data.name}</p>
          <div className="space-y-1">
            <p className="text-[#00FFFF] text-sm">
              {data.value}% ({data.count.toLocaleString()} users)
            </p>
            <p className="text-white/60 text-xs">{data.description}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">User Distribution</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {totalUsers.toLocaleString()}
          </div>
          <div className="text-xs text-white/60">Total Users</div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {data.slice(0, 2).map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.id} className="bg-[#1a1a1a]/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <IconComponent size={16} style={{ color: item.color }} />
                <span className="text-xs text-white/60">{item.name}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold text-white">
                  {item.count.toLocaleString()}
                </span>
                <span className="text-xs text-white/40">({item.value}%)</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={entry.id} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Enhanced Legend */}
      <div className="space-y-2 mt-4">
        {data.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <IconComponent size={14} style={{ color: item.color }} />
                </div>
                <div>
                  <span className="text-sm font-medium text-white">
                    {item.name}
                  </span>
                  <p className="text-xs text-white/50">{item.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-white">
                  {item.value}%
                </div>
                <div className="text-xs text-white/60">
                  {item.count.toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserDistributionChart;
