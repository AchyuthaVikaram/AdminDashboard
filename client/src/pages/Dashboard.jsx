import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RecentActivity from "../components/ui/RecentActivity";
import QuickActions from "../components/ui/QuickActions";
import SystemStatusWidget from "../components/ui/SystemStatusWidget";
import StatsCards from "../components/ui/StatsCards";
import { BASE_URL } from "../utils/constant";
import { showErrorToast } from "../utils/toastUtil";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    activities: [],
    systemHealth: null,
    userGrowth: [],
    loginTrends: []
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
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Fetch all dashboard data in parallel
      const [
        statsResponse,
        activitiesResponse,
        systemHealthResponse,
        userGrowthResponse,
        loginTrendsResponse
      ] = await Promise.all([
        axios.get(`${BASE_URL}/api/dashboard/stats/overview`, config),
        axios.get(`${BASE_URL}/api/dashboard/activities/recent?limit=5`, config),
        axios.get(`${BASE_URL}/api/dashboard/system/health`, config),
        axios.get(`${BASE_URL}/api/dashboard/analytics/user-growth?days=7`, config),
        axios.get(`${BASE_URL}/api/dashboard/analytics/login-trends?timeRange=24h`, config)
      ]);

      setDashboardData({
        stats: statsResponse.data.data,
        activities: activitiesResponse.data.data,
        systemHealth: systemHealthResponse.data.data,
        userGrowth: userGrowthResponse.data.data,
        loginTrends: loginTrendsResponse.data.data
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showErrorToast('Failed to load dashboard data');
      
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
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Welcome back, Admin 👋</h1>
      
      <StatsCards data={dashboardData.stats} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentActivity data={dashboardData.activities} />
        <QuickActions 
          userGrowthData={dashboardData.userGrowth}
          onRefresh={fetchDashboardData}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SystemStatusWidget data={dashboardData.systemHealth} />
        {/* Optionally place more widgets here */}
      </div>
    </div>
  );
};

export default Dashboard;