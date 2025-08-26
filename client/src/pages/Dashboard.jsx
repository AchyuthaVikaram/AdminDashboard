import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RecentActivity from "../components/ui/RecentActivity";
import QuickActions from "../components/ui/QuickActions";
import SystemStatusWidget from "../components/ui/SystemStatusWidget";
import StatsCards from "../components/ui/StatsCards";
import { BASE_URL } from "../utils/constant";
import { showErrorToast } from "../utils/toastUtil";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    activities: [],
    systemHealth: null,
    userGrowth: [],
    loginTrends: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // Redirect if not logged in
    if (!token || !user) {
      navigate("/login");
      return;
    }

    // Redirect non-admin users
    if (user?.role !== "admin") {
      navigate("/welcome");
      return;
    }

    // Fetch dashboard data
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log('Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'null');
      console.log('Token type:', typeof token);
      console.log('Token length:', token?.length);
      
      if (!token) {
        console.error('No token found in localStorage');
        navigate("/login");
        return;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      console.log('Authorization header:', config.headers.Authorization.substring(0, 30) + '...');

      // Fetch all dashboard data in parallel
      const [
        statsResponse,
        activitiesResponse,
        systemHealthResponse,
        userGrowthResponse,
        loginTrendsResponse,
      ] = await Promise.all([
        axios.get(`${BASE_URL}/api/dashboard/stats/overview`, config),
        axios.get(
          `${BASE_URL}/api/dashboard/activities/recent?limit=5`,
          config
        ),
        axios.get(`${BASE_URL}/api/dashboard/system/health`, config),
        axios.get(
          `${BASE_URL}/api/dashboard/analytics/user-growth?days=7`,
          config
        ),
        axios.get(
          `${BASE_URL}/api/dashboard/analytics/login-trends?timeRange=24h`,
          config
        ),
      ]);

      setDashboardData({
        stats: statsResponse.data.data,
        activities: activitiesResponse.data.data,
        systemHealth: systemHealthResponse.data.data,
        userGrowth: userGrowthResponse.data.data,
        loginTrends: loginTrendsResponse.data.data,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      showErrorToast("Failed to load dashboard data");

      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00FFFF] mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading dashboard...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-2xl font-bold text-white"
        >
          Welcome back, Admin 👋
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StatsCards data={dashboardData.stats} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <RecentActivity data={dashboardData.activities} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <QuickActions
              userGrowthData={dashboardData.userGrowth}
              onRefresh={fetchDashboardData}
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <SystemStatusWidget data={dashboardData.systemHealth} />
          </motion.div>
          {/* Optionally place more widgets here */}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Dashboard;
