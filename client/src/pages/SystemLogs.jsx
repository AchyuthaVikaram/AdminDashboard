// File: /src/pages/SystemLogs.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import StatsCard from "../components/ui/StatsCard";
import AlertItem from "../components/ui/AlertItem";
import SystemStatus from "../components/ui/SystemStatus";
import ActivityTrend from "../components/ui/ActivityTrend";
import LogFilters from "../components/ui/LogFilters";
import { BASE_URL } from "../utils/constant";

const SystemLogs = () => {
  const [statsData, setStatsData] = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [systemStatus, setSystemStatus] = useState({});
  const [activityTrend, setActivityTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    level: "All Levels",
    timeRange: "Last 24 Hours",
    search: "",
  });

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Axios config with auth
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      "Content-Type": "application/json",
    },
  };

  // Fetch system logs overview
  const fetchSystemLogsOverview = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/system-logs/overview`,
        axiosConfig
      );

      if (response.data.success) {
        const { stats, recentAlerts } = response.data.data;
        setStatsData(stats || []);
        setAlertsData(recentAlerts || []);
      }
    } catch (err) {
      console.error("Error fetching system logs overview:", err);
      // Fallback to static data if API fails
      setStatsData([
        {
          title: "Total Logs",
          value: "12,457",
          subtitle: "All recorded events",
          icon: "📊",
          bgColor: "bg-gradient-to-br from-blue-500/20 to-blue-600/30",
          textColor: "text-blue-400",
        },
        {
          title: "Errors Today",
          value: "27",
          subtitle: "Critical failures",
          icon: "⚠️",
          bgColor: "bg-gradient-to-br from-red-500/20 to-red-600/30",
          textColor: "text-red-400",
        },
        {
          title: "Warnings",
          value: "103",
          subtitle: "Moderate issues",
          icon: "⚠️",
          bgColor: "bg-gradient-to-br from-yellow-500/20 to-yellow-600/30",
          textColor: "text-yellow-400",
        },
        {
          title: "Uptime",
          value: "99.97%",
          subtitle: "System availability",
          icon: "✅",
          bgColor: "bg-gradient-to-br from-green-500/20 to-green-600/30",
          textColor: "text-green-400",
        },
      ]);

      setAlertsData([
        {
          type: "error",
          message: "Database connection failed",
          timestamp: "at 02:13 AM",
        },
        {
          type: "warning",
          message: "Slow response from /api/users",
          timestamp: "at 04:15 AM",
        },
        {
          type: "error",
          message: "Memory threshold exceeded",
          timestamp: "at 05:22 AM",
        },
      ]);
    }
  };

  // Fetch system status
  const fetchSystemStatus = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/system-logs/status`,
        axiosConfig
      );

      if (response.data.success) {
        setSystemStatus(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching system status:", err);
      // Fallback to static data
      setSystemStatus({
        services: [
          { name: "API Services", status: "online" },
          { name: "Database", status: "online" },
          { name: "Cache", status: "maintenance" },
        ],
        overallStatus: "All systems operational",
      });
    }
  };

  // Fetch activity trend
  const fetchActivityTrend = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/system-logs/activity-trend?hours=24`,
        axiosConfig
      );

      if (response.data.success) {
        setActivityTrend(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching activity trend:", err);
      // Fallback to static data
      setActivityTrend([
        { label: "12 AM", value: 30 },
        { label: "2 AM", value: 20 },
        { label: "4 AM", value: 15 },
        { label: "6 AM", value: 45 },
        { label: "8 AM", value: 80 },
        { label: "10 AM", value: 95 },
        { label: "12 PM", value: 85 },
        { label: "2 PM", value: 75 },
        { label: "4 PM", value: 90 },
        { label: "6 PM", value: 70 },
        { label: "8 PM", value: 60 },
        { label: "10 PM", value: 40 },
      ]);
    }
  };

  // Handle filter changes
  const handleFiltersChange = async (newFilters) => {
    setFilters(newFilters);
    setLoading(true);

    try {
      // Fetch filtered data
      const response = await axios.get(`${BASE_URL}/system-logs`, {
        ...axiosConfig,
        params: newFilters,
      });

      if (response.data.success) {
        // Update alerts based on filtered logs
        const filteredLogs = response.data.data.logs || [];
        const recentAlerts = filteredLogs
          .filter((log) => ["error", "warning"].includes(log.level))
          .slice(0, 5)
          .map((log) => ({
            type: log.level,
            message: log.message,
            timestamp: log.timeAgo || "Just now",
          }));

        setAlertsData(recentAlerts);
      }
    } catch (err) {
      console.error("Error applying filters:", err);
      setError("Failed to apply filters");
    } finally {
      setLoading(false);
    }
  };

  // Export logs
  const handleExportLogs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/system-logs/export`, {
        ...axiosConfig,
        params: { format: "json", ...filters },
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `system-logs-${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting logs:", err);
      setError("Failed to export logs");
    }
  };

  // Clear logs
  const handleClearLogs = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear logs? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/system-logs/clear`, {
        ...axiosConfig,
        data: {
          level: filters.level !== "All Levels" ? filters.level : undefined,
          olderThan: 7, // Clear logs older than 7 days
        },
      });

      // Refresh data
      await fetchData();
    } catch (err) {
      console.error("Error clearing logs:", err);
      setError("Failed to clear logs");
    }
  };

  // Refresh data
  const handleRefreshData = async () => {
    setLoading(true);
    await fetchData();
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      await Promise.all([
        fetchSystemLogsOverview(),
        fetchSystemStatus(),
        fetchActivityTrend(),
      ]);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load system logs data");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const statsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const alertsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (error) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">
            Error Loading System Logs
          </h2>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchData();
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen p-4 sm:p-6 lg:p-8"
    >
      {/* Page Header */}
      <motion.div variants={sectionVariants} className="mb-8">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2"
        >
          System Logs
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-gray-400 dark:text-gray-300 text-sm sm:text-base"
        >
          Monitor your application's critical logs and track system behavior.
        </motion.p>
      </motion.div>

      {/* Loading Indicator */}
      {loading && (
        <div className="mb-4">
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
            <div className="inline-flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-3"></div>
              <span className="text-blue-400">Loading system data...</span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards Grid */}
      <motion.div
        variants={statsContainerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
      >
        {statsData.map((stat, index) => (
          <StatsCard key={stat.title} {...stat} delay={index * 0.1} />
        ))}
      </motion.div>

      {/* Recent Alerts Section */}
      <motion.div variants={sectionVariants} className="mb-8">
        <motion.h2
          className="text-xl sm:text-2xl font-semibold text-white mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Recent Alerts
        </motion.h2>
        <motion.div variants={alertsContainerVariants} className="space-y-3">
          {alertsData.length > 0 ? (
            alertsData.map((alert, index) => (
              <AlertItem key={index} {...alert} delay={index * 0.1} />
            ))
          ) : (
            <div className="bg-gray-800/30 rounded-lg p-4 text-center text-gray-400">
              No recent alerts found
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* System Status and Activity Trend */}
      <motion.div
        variants={sectionVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        <SystemStatus systemStatus={systemStatus} />
        <ActivityTrend activityData={activityTrend} />
      </motion.div>

      {/* Log Filters Section */}
      <motion.div variants={sectionVariants}>
        <LogFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onExport={handleExportLogs}
          onClear={handleClearLogs}
          onRefresh={handleRefreshData}
          loading={loading}
        />
      </motion.div>
    </motion.div>
  );
};

export default SystemLogs;
