// File: /src/pages/Analytics.jsx
import StatsCards from "../components/ui/StatsCards";
import ContentPerformanceChart from "../components/ui/ContentPerformanceChart";
import UserDistributionChart from "../components/ui/UserDistributionChart";
import SystemPerformanceChart from "../components/ui/SystemPerformanceChart";
import TopBar from "../components/ui/TopBar";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "../utils/toastUtil";
import { BASE_URL } from "../utils/constant";
import { motion, AnimatePresence } from "framer-motion";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    timeRange: "Last 7 Days",
    category: "All Categories",
  });
  const [filterOptions, setFilterOptions] = useState({
    timeRanges: [],
    categories: [],
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  // Auto-refresh interval (30 seconds)
  const REFRESH_INTERVAL = 30000;

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "null");

      // Redirect if not logged in
      if (!token || !user) {
        console.log("No token or user found, redirecting to login");
        navigate("/login", { replace: true });
        return false;
      }

      // Redirect non-admin users
      if (user?.role !== "admin") {
        console.log("User is not admin, redirecting to welcome");
        navigate("/welcome", { replace: true });
        return false;
      }

      return true;
    };

    if (checkAuth()) {
      setIsInitialized(true);
      // Initial data fetch only after auth check passes
      fetchAnalyticsData(false, true); // isInitial = true
    }
  }, [navigate]);

  // Set up auto-refresh only after initialization
  useEffect(() => {
    if (!isInitialized) return;

    const interval = setInterval(() => {
      fetchAnalyticsData(true); // Silent refresh
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [isInitialized]);

  const getAuthConfig = useCallback(() => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  }, []);

  const fetchAnalyticsData = async (silent = false, isInitial = false) => {
    try {
      if (!silent) setLoading(true);

      const config = getAuthConfig();
      const params = new URLSearchParams({
        timeRange: filters.timeRange,
        category: filters.category,
      });

      const response = await axios.get(
        `${BASE_URL}/api/analytics-data/overview?${params}`,
        config
      );

      if (response.data.success) {
        setAnalyticsData(response.data.data);
        setFilterOptions(response.data.data.filterOptions);
        setLastUpdated(new Date(response.data.data.metadata.lastUpdated));
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);

      // Only show error toast if not silent
      if (!silent) {
        showErrorToast("Failed to load analytics data");
      }

      // Handle authentication errors
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleFilterChange = async (newFilters) => {
    try {
      setLoading(true);
      setFilters(newFilters);

      const config = getAuthConfig();
      const response = await axios.post(
        `${BASE_URL}/api/analytics-data/apply-filters`,
        newFilters,
        config
      );

      if (response.data.success) {
        setAnalyticsData(response.data.data);
        setLastUpdated(new Date(response.data.data.timestamp));
      }
    } catch (error) {
      console.error("Error applying filters:", error);
      showErrorToast("Failed to apply filters");

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      const config = getAuthConfig();
      const response = await axios.post(
        `${BASE_URL}/api/analytics-data/refresh`,
        {},
        config
      );

      if (response.data.success) {
        setAnalyticsData(response.data.data);
        setLastUpdated(new Date(response.data.data.lastRefresh));
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      showErrorToast("Failed to refresh data");

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleExport = async (format = "json") => {
    try {
      const config = getAuthConfig();
      const params = new URLSearchParams({
        format,
        timeRange: filters.timeRange,
      });

      const response = await axios.get(
        `${BASE_URL}/api/analytics-data/export?${params}`,
        {
          ...config,
          responseType: "blob",
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `analytics-${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showSuccessToast("Analytics data exported successfully");
    } catch (error) {
      console.error("Error exporting data:", error);
      showErrorToast("Failed to export data");

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      }
    }
  };

  // Don't render anything until auth check is complete
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 md:h-32 md:w-32 border-b-2 border-[#00FFFF] mx-auto mb-4"></div>
          <div className="text-white text-lg sm:text-xl">Checking authentication...</div>
        </motion.div>
      </div>
    );
  }

  if (loading && !analyticsData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 md:h-32 md:w-32 border-b-2 border-[#00FFFF] mx-auto mb-4"></div>
          <div className="text-white text-lg sm:text-xl">Loading analytics...</div>
          <div className="text-white/60 text-sm mt-2">
            Fetching real-time data...
          </div>
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
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-4 sm:space-y-6 relative p-4 sm:p-6"
      >
        {/* ADDED: Motion wrapper for TopBar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <TopBar
            filters={filters}
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
            onRefresh={handleRefresh}
            onExport={handleExport}
            refreshing={refreshing}
            lastUpdated={lastUpdated}
          />
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StatsCards data={analyticsData?.stats} loading={loading} />
        </motion.div>
        
        {/* Charts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ContentPerformanceChart
              data={analyticsData?.contentPerformance}
              loading={loading}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <UserDistributionChart
              data={analyticsData?.userDistribution}
              loading={loading}
            />
          </motion.div>
        </motion.div>

        {/* Full Width Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <SystemPerformanceChart
            data={analyticsData?.systemPerformance}
            loading={loading}
          />
        </motion.div>

        {/* Real-time indicator - Made responsive */}
        {analyticsData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="fixed bottom-4 right-4 bg-white/5 backdrop-blur-md p-2 sm:p-3 rounded-lg border border-white/10 z-40 max-w-[200px] sm:max-w-none"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/70 text-xs sm:text-sm truncate">
                Live • {lastUpdated?.toLocaleTimeString()}
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Analytics;