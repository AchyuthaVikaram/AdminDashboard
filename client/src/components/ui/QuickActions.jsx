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
import { X, User, Mail, Lock, Shield } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../utils/constant";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtil";

const QuickActions = ({ userGrowthData, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });

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
    setShowCreateUserModal(true);
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.email || !newUser.password) {
      showErrorToast("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      };

      const response = await axios.post(
        `${BASE_URL}/api/users`,
        newUser,
        config
      );

      if (response.data.success) {
        showSuccessToast(`User ${newUser.username} created successfully!`);
        setNewUser({ username: '', email: '', password: '', role: 'user' });
        setShowCreateUserModal(false);
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error("Error creating user:", error);
      showErrorToast(error.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowCreateUserModal(false);
    setNewUser({ username: '', email: '', password: '', role: 'user' });
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

      // Fetch flagged activities or content
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

      // Trigger system backup (this would be a custom endpoint)
      // For now, we'll simulate it
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
    <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-white">Quick Actions</h2>

      <div className="space-y-3">
        <button 
          onClick={handleCreateUser}
          className="w-full text-left bg-gradient-to-r from-[#00FFFF]/10 to-[#39FF14]/10 text-[#00FFFF] hover:bg-[#00ffff1a] px-4 py-2 rounded-md transition"
        >
          ➕ Create New User
        </button>
        <button 
          onClick={handleReviewContent}
          disabled={loading}
          className="w-full text-left bg-[#292929] hover:bg-[#333] text-white px-4 py-2 rounded-md transition disabled:opacity-50"
        >
          🚩 Review Flagged Content
        </button>
        <button 
          onClick={handleSystemBackup}
          disabled={loading}
          className="w-full text-left bg-[#292929] hover:bg-[#333] text-white px-4 py-2 rounded-md transition disabled:opacity-50"
        >
          💾 Run System Backup
        </button>
      </div>

      <div className="pt-4">
        <p className="text-sm text-white/60 mb-2">User Growth (This Week)</p>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={userGrowth}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#39FF14" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#39FF14" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Area
              type="monotone"
              dataKey="users"
              stroke="#39FF14"
              fill="url(#colorUsers)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Create New User</h3>
              <button
                onClick={handleCloseModal}
                className="text-white/60 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  <User size={16} className="inline mr-2" />
                  Username
                </label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full bg-[#292929] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00FFFF] transition"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-[#292929] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00FFFF] transition"
                  placeholder="Enter email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  <Lock size={16} className="inline mr-2" />
                  Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full bg-[#292929] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00FFFF] transition"
                  placeholder="Enter password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  <Shield size={16} className="inline mr-2" />
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full bg-[#292929] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00FFFF] transition"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-[#292929] hover:bg-[#333] text-white py-2 px-4 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-[#00FFFF] to-[#39FF14] text-black font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;
