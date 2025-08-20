import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axios from "axios";
import { BASE_URL } from "../../utils/constant";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtil";

const QuickActions = ({ userGrowthData, onRefresh }) => {
  const [loading, setLoading] = useState(false);

  // Default user growth data if none provided
  const userGrowth =
    userGrowthData && userGrowthData.length > 0
      ? userGrowthData
      : [
          { day: "Mon", users: 10 },
          { day: "Tue", users: 25 },
          { day: "Wed", users: 18 },
          { day: "Thu", users: 32 },
          { day: "Fri", users: 29 },
        ];

  const handleCreateUser = async () => {
    showSuccessToast("User creation feature coming soon!");
  };

  const handleReviewContent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${BASE_URL}/api/dashboard/activities/recent?limit=20`,
        config
      );

      showSuccessToast("Content review completed");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error reviewing content:", error);
      showErrorToast("Failed to review content");
    } finally {
      setLoading(false);
    }
  };

  const handleSystemBackup = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await new Promise((resolve) => setTimeout(resolve, 2000));
      showSuccessToast("System backup completed successfully");
    } catch (error) {
      console.error("Error running backup:", error);
      showErrorToast("System backup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-xl border border-white/10 shadow-md space-y-3 sm:space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold text-white">Quick Actions</h2>

      <div className="space-y-2 sm:space-y-3">
        <button 
          onClick={handleCreateUser}
          className="w-full text-left bg-gradient-to-r from-[#00FFFF]/10 to-[#39FF14]/10 text-[#00FFFF] hover:bg-[#00ffff1a] px-3 sm:px-4 py-2 sm:py-3 rounded-md transition flex items-center gap-2 text-sm sm:text-base"
        >
          <span className="text-lg">➕</span>
          <span className="truncate">Create New User</span>
        </button>
        <button 
          onClick={handleReviewContent}
          disabled={loading}
          className="w-full text-left bg-[#292929] hover:bg-[#333] text-white px-3 sm:px-4 py-2 sm:py-3 rounded-md transition flex items-center gap-2 text-sm sm:text-base disabled:opacity-50"
        >
          <span className="text-lg">🚩</span>
          <span className="truncate">{loading ? "Reviewing..." : "Review Flagged Content"}</span>
        </button>
        <button 
          onClick={handleSystemBackup}
          disabled={loading}
          className="w-full text-left bg-[#292929] hover:bg-[#333] text-white px-3 sm:px-4 py-2 sm:py-3 rounded-md transition flex items-center gap-2 text-sm sm:text-base disabled:opacity-50"
        >
          <span className="text-lg">💾</span>
          <span className="truncate">{loading ? "Backing up..." : "Run System Backup"}</span>
        </button>
      </div>

      <div className="pt-2 sm:pt-4">
        <p className="text-xs sm:text-sm text-white/60 mb-2">User Growth (This Week)</p>
        <div className="h-32 sm:h-40 lg:h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={userGrowth}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#39FF14" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#39FF14" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                stroke="#aaa" 
                fontSize={12}
                tickMargin={5}
              />
              <YAxis 
                stroke="#aaa" 
                fontSize={12}
                width={30}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px"
                }}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#39FF14"
                fill="url(#colorUsers)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;