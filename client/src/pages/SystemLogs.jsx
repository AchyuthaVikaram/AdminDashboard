// File: /src/pages/SystemLogs.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import StatsCard from "../components/ui/StatsCard";
import AlertItem from "../components/ui/AlertItem";
import SystemStatus from "../components/ui/SystemStatus";
import LogFilters from "../components/ui/LogFilters";
import { BASE_URL } from "../utils/constant";

const SystemLogs = () => {
  const [statsData, setStatsData] = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [systemStatus, setSystemStatus] = useState({});
  const [activityTrend, setActivityTrend] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [allSystemLogs, setAllSystemLogs] = useState([]); // Store all logs for filtering
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

  // Calculate dynamic stats from current logs
  const calculateDynamicStats = (logs) => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const todayLogs = logs.filter(log => new Date(log.createdAt) >= todayStart);
    const errorsToday = todayLogs.filter(log => log.level === 'error').length;
    const warningsToday = todayLogs.filter(log => log.level === 'warning').length;
    const totalErrors = logs.filter(log => log.level === 'error').length;
    
    // Calculate health score based on error ratio
    const healthScore = Math.max(0, 100 - (totalErrors / Math.max(logs.length, 1)) * 100);
    
    return {
      totalLogs: logs.length,
      errorsToday,
      warningsToday,
      healthScore: Math.round(healthScore)
    };
  };

  // Update stats based on current logs
  const updateStatsFromLogs = (logsToUse = null) => {
    const logs = logsToUse || allSystemLogs;
    console.log("Updating stats from logs:", logs.length, logs); // Debug log
    
    if (logs.length > 0) {
      const dynamicStats = calculateDynamicStats(logs);
      console.log("Calculated stats:", dynamicStats); // Debug log
      
      const formattedStats = [
        {
          title: "Total Logs",
          value: dynamicStats.totalLogs.toLocaleString(),
          subtitle: "All recorded events",
          icon: "📊",
          bgColor: "bg-gradient-to-br from-blue-500/20 to-blue-600/30",
          textColor: "text-blue-400",
        },
        {
          title: "Errors Today",
          value: dynamicStats.errorsToday.toString(),
          subtitle: "Critical failures",
          icon: "⚠️",
          bgColor: "bg-gradient-to-br from-red-500/20 to-red-600/30",
          textColor: "text-red-400",
        },
        {
          title: "Warnings Today",
          value: dynamicStats.warningsToday.toString(),
          subtitle: "Moderate issues",
          icon: "⚠️",
          bgColor: "bg-gradient-to-br from-yellow-500/20 to-yellow-600/30",
          textColor: "text-yellow-400",
        },
        {
          title: "Health Score",
          value: `${dynamicStats.healthScore}%`,
          subtitle: "System health",
          icon: "✅",
          bgColor: "bg-gradient-to-br from-green-500/20 to-green-600/30",
          textColor: "text-green-400",
        },
      ];
      
      setStatsData(formattedStats);
      
      // Generate recent alerts from current logs
      const recentAlerts = logs
        .filter(log => ['error', 'warning'].includes(log.level))
        .slice(0, 5)
        .map(log => ({
          type: log.level,
          message: log.message,
          timestamp: log.timeAgo || new Date(log.createdAt).toLocaleTimeString(),
        }));
      
      setAlertsData(recentAlerts);
    } else {
      console.log("No logs available for stats calculation");
    }
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
        
        if (stats && stats.totalLogs > 0) {
          // Use backend stats if available and valid
          const formattedStats = [
            {
              title: "Total Logs",
              value: stats.totalLogs.toLocaleString(),
              subtitle: "All recorded events",
              icon: "📊",
              bgColor: "bg-gradient-to-br from-blue-500/20 to-blue-600/30",
              textColor: "text-blue-400",
            },
            {
              title: "Errors Today",
              value: (stats.today?.errors || 0).toString(),
              subtitle: "Critical failures",
              icon: "⚠️",
              bgColor: "bg-gradient-to-br from-red-500/20 to-red-600/30",
              textColor: "text-red-400",
            },
            {
              title: "Warnings Today",
              value: (stats.today?.warnings || 0).toString(),
              subtitle: "Moderate issues",
              icon: "⚠️",
              bgColor: "bg-gradient-to-br from-yellow-500/20 to-yellow-600/30",
              textColor: "text-yellow-400",
            },
            {
              title: "Health Score",
              value: `${stats.healthScore || 100}%`,
              subtitle: "System health",
              icon: "✅",
              bgColor: "bg-gradient-to-br from-green-500/20 to-green-600/30",
              textColor: "text-green-400",
            },
          ];
          
          setStatsData(formattedStats);
          setAlertsData(recentAlerts || []);
        } else {
          // Use calculated stats from logs
          updateStatsFromLogs();
        }
      }
    } catch (err) {
      console.error("Error fetching system logs overview:", err);
      // Always use calculated stats as fallback
      updateStatsFromLogs();
    }
  };

  // Fetch system status
  const fetchSystemStatus = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/system-logs/status`,
        axiosConfig
      );

      if (response.data.success) {
        setSystemStatus(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching system status:", err);
      // Calculate dynamic status from current logs
      const recentErrors = allSystemLogs.filter(log => {
        const logTime = new Date(log.createdAt);
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return log.level === 'error' && logTime > oneHourAgo;
      }).length;

      const status = recentErrors > 5 ? "degraded" : recentErrors > 0 ? "maintenance" : "online";
      const overallStatus = recentErrors > 5 ? "System experiencing issues" : 
                           recentErrors > 0 ? "Minor issues detected" : "All systems operational";

      setSystemStatus({
        services: [
          { name: "API Services", status: status },
          { name: "Database", status: recentErrors > 3 ? "degraded" : "online" },
          { name: "Cache", status: "online" },
        ],
        overallStatus,
      });
    }
  };

  // Generate dynamic activity trend from current logs
  const generateActivityTrend = (logs) => {
    const hours = [];
    const now = new Date();

    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourValue = hour.getHours();
      const hourStart = new Date(hour);
      hourStart.setMinutes(0, 0, 0);
      const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);

      // Count logs in this hour
      const logsInHour = logs.filter(log => {
        const logTime = new Date(log.createdAt);
        return logTime >= hourStart && logTime < hourEnd;
      });

      const errors = logsInHour.filter(log => log.level === 'error').length;
      const warnings = logsInHour.filter(log => log.level === 'warning').length;
      const total = logsInHour.length;

      hours.push({
        label: hourValue === 0 ? "12 AM" : hourValue === 12 ? "12 PM" : 
               hourValue > 12 ? `${hourValue - 12} PM` : `${hourValue} AM`,
        value: total,
        errors,
        warnings,
        hour: hourValue,
      });
    }

    return hours;
  };

  // Fetch activity trend
  const fetchActivityTrend = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/system-logs/activity-trend?hours=24`,
        axiosConfig
      );

      if (response.data.success) {
        setActivityTrend(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching activity trend:", err);
      // Generate dynamic trend from current logs
      const dynamicTrend = generateActivityTrend(allSystemLogs);
      setActivityTrend(dynamicTrend);
    }
  };

  // Filter logs based on current filters
  const filterLogs = (logs, currentFilters) => {
    return logs.filter(log => {
      // Search filter
      if (currentFilters.search && currentFilters.search.trim()) {
        const searchTerm = currentFilters.search.toLowerCase();
        const matchesSearch = 
          log.message?.toLowerCase().includes(searchTerm) ||
          log.source?.toLowerCase().includes(searchTerm) ||
          log.level?.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // Level filter
      if (currentFilters.level && currentFilters.level !== "All Levels") {
        if (log.level?.toLowerCase() !== currentFilters.level.toLowerCase()) {
          return false;
        }
      }

      // Time range filter
      if (currentFilters.timeRange && currentFilters.timeRange !== "Last 24 Hours") {
        const logDate = new Date(log.createdAt);
        const now = new Date();
        let timeLimit;

        switch (currentFilters.timeRange) {
          case "Last Hour":
            timeLimit = new Date(now.getTime() - 60 * 60 * 1000);
            break;
          case "Last 6 Hours":
            timeLimit = new Date(now.getTime() - 6 * 60 * 60 * 1000);
            break;
          case "Last 12 Hours":
            timeLimit = new Date(now.getTime() - 12 * 60 * 60 * 1000);
            break;
          case "Last 24 Hours":
            timeLimit = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case "Last 7 Days":
            timeLimit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          default:
            timeLimit = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        }

        if (logDate < timeLimit) return false;
      }

      return true;
    });
  };

  // Handle filters change
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Apply filters to the logs
    const filteredLogs = filterLogs(allSystemLogs, newFilters);
    setSystemLogs(filteredLogs);
  };

  // Handle filter changes
  const handleFiltersChangeAsync = async (newFilters) => {
    setFilters(newFilters);
    setLoading(true);

    try {
      // Fetch filtered data
      const response = await axios.get(`${BASE_URL}/api/system-logs`, {
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
      const response = await axios.get(`${BASE_URL}/api/system-logs/export`, {
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
      await axios.delete(`${BASE_URL}/api/system-logs/clear`, {
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

  // Refresh data and update stats dynamically
  const handleRefreshData = async () => {
    setLoading(true);
    await fetchData();
    
    // After refresh, recalculate stats to ensure consistency
    if (allSystemLogs.length > 0) {
      const dynamicStats = calculateDynamicStats(allSystemLogs);
      const formattedStats = [
        {
          title: "Total Logs",
          value: dynamicStats.totalLogs.toLocaleString(),
          subtitle: "All recorded events",
          icon: "📊",
          bgColor: "bg-gradient-to-br from-blue-500/20 to-blue-600/30",
          textColor: "text-blue-400",
        },
        {
          title: "Errors Today",
          value: dynamicStats.errorsToday.toString(),
          subtitle: "Critical failures",
          icon: "⚠️",
          bgColor: "bg-gradient-to-br from-red-500/20 to-red-600/30",
          textColor: "text-red-400",
        },
        {
          title: "Warnings Today",
          value: dynamicStats.warningsToday.toString(),
          subtitle: "Moderate issues",
          icon: "⚠️",
          bgColor: "bg-gradient-to-br from-yellow-500/20 to-yellow-600/30",
          textColor: "text-yellow-400",
        },
        {
          title: "Health Score",
          value: `${dynamicStats.healthScore}%`,
          subtitle: "System health",
          icon: "✅",
          bgColor: "bg-gradient-to-br from-green-500/20 to-green-600/30",
          textColor: "text-green-400",
        },
      ];
      setStatsData(formattedStats);
    }
  };

  // Fetch system logs list
  const fetchSystemLogsList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/system-logs`, {
        ...axiosConfig,
        params: {
          page: 1,
          limit: 50, // Increase limit to get more logs
          ...filters,
        },
      });

      if (response.data.success) {
        const logs = response.data.data.logs || [];
        console.log("Fetched logs:", logs.length, logs); // Debug log
        setAllSystemLogs(logs); // Store all logs
        setSystemLogs(logs); // Initially show all logs
        
        // Update stats immediately with the fetched logs
        updateStatsFromLogs(logs);
      }
    } catch (err) {
      console.error("Error fetching system logs list:", err);
    }
  };

  // Fetch all data in proper order for dynamic calculations
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // First fetch the logs list to have data for dynamic calculations
      await fetchSystemLogsList();
      
      // Then fetch other data that might depend on logs
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
        
        {/* Enhanced Activity Trend with Recharts */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            📈 Activity Trend (24h)
          </h3>
          {activityTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={activityTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="label" 
                  stroke="#9CA3AF" 
                  fontSize={12}
                  interval="preserveStartEnd"
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#06B6D4" 
                  strokeWidth={2}
                  dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#0891B2' }}
                />
                {activityTrend[0]?.errors !== undefined && (
                  <Line 
                    type="monotone" 
                    dataKey="errors" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
                  />
                )}
                {activityTrend[0]?.warnings !== undefined && (
                  <Line 
                    type="monotone" 
                    dataKey="warnings" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-2"></div>
                <p>Loading activity data...</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Log Filters Section with Integrated System Logs */}
      <motion.div variants={sectionVariants}>
        <LogFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onExport={handleExportLogs}
          onClear={handleClearLogs}
          onRefresh={handleRefreshData}
          loading={loading}
          systemLogs={systemLogs}
        />
      </motion.div>
    </motion.div>
  );
};

export default SystemLogs;
