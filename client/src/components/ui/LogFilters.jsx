// File: /src/components/ui/LogFilters.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../../utils/constant";

const LogFilters = ({
  filters = {},
  onFiltersChange,
  onExport,
  onClear,
  onRefresh,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [selectedLevel, setSelectedLevel] = useState(
    filters.level || "All Levels"
  );
  const [selectedTime, setSelectedTime] = useState(
    filters.timeRange || "Last 24 Hours"
  );
  const [filterOptions, setFilterOptions] = useState({
    levels: ["All Levels", "Error", "Warning", "Info", "Debug"],
    timeRanges: ["Last Hour", "Last 24 Hours", "Last 7 Days", "Last 30 Days"],
    sources: [],
    categories: [],
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

  // Fetch filter options from API
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/system-logs/filters`,
          axiosConfig
        );

        if (response.data.success) {
          setFilterOptions({
            levels: ["All Levels", ...response.data.data.levels],
            timeRanges: response.data.data.timeRanges,
            sources: response.data.data.sources || [],
            categories: response.data.data.categories || [],
          });
        }
      } catch (err) {
        console.error("Error fetching filter options:", err);
        // Keep default options if API fails
      }
    };

    fetchFilterOptions();
  }, []);

  // Handle filter changes
  const handleFiltersChange = () => {
    const newFilters = {
      search: searchTerm.trim(),
      level: selectedLevel,
      timeRange: selectedTime,
    };

    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleFiltersChange();
  };

  // Handle level change
  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
    setTimeout(handleFiltersChange, 0); // Trigger after state update
  };

  // Handle time range change
  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
    setTimeout(handleFiltersChange, 0); // Trigger after state update
  };

  // Handle export
  const handleExport = () => {
    if (onExport) {
      onExport();
    }
  };

  // Handle clear
  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 120,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        type: "spring",
        stiffness: 400,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gray-800/50 dark:bg-gray-800/70 rounded-lg p-4 sm:p-6 border border-gray-700/30 dark:border-gray-600/30 space-y-4"
    >
      {/* Search and Filters Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        {/* Search Input */}
        <motion.div variants={itemVariants} className="flex-1">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-700/50 dark:bg-gray-900/50 border border-gray-600/50 dark:border-gray-500/50 rounded-lg text-gray-200 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                disabled={loading}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Level Dropdown */}
        <motion.div variants={itemVariants} className="w-full sm:w-auto">
          <select
            value={selectedLevel}
            onChange={handleLevelChange}
            className="w-full sm:w-auto px-4 py-2.5 bg-gray-700/50 dark:bg-gray-900/50 border border-gray-600/50 dark:border-gray-500/50 rounded-lg text-gray-200 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 cursor-pointer"
            disabled={loading}
          >
            {filterOptions.levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Time Dropdown */}
        <motion.div variants={itemVariants} className="w-full sm:w-auto">
          <select
            value={selectedTime}
            onChange={handleTimeChange}
            className="w-full sm:w-auto px-4 py-2.5 bg-gray-700/50 dark:bg-gray-900/50 border border-gray-600/50 dark:border-gray-500/50 rounded-lg text-gray-200 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 cursor-pointer"
            disabled={loading}
          >
            {filterOptions.timeRanges.map((timeRange) => (
              <option key={timeRange} value={timeRange}>
                {timeRange}
              </option>
            ))}
          </select>
        </motion.div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm ||
        selectedLevel !== "All Levels" ||
        selectedTime !== "Last 24 Hours") && (
        <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-400">Active filters:</span>
          {searchTerm && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
              Search: "{searchTerm}"
              <button
                onClick={() => {
                  setSearchTerm("");
                  setTimeout(handleFiltersChange, 0);
                }}
                className="ml-1 hover:text-blue-300"
              >
                ×
              </button>
            </span>
          )}
          {selectedLevel !== "All Levels" && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400">
              Level: {selectedLevel}
              <button
                onClick={() => {
                  setSelectedLevel("All Levels");
                  setTimeout(handleFiltersChange, 0);
                }}
                className="ml-1 hover:text-purple-300"
              >
                ×
              </button>
            </span>
          )}
          {selectedTime !== "Last 24 Hours" && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
              Time: {selectedTime}
              <button
                onClick={() => {
                  setSelectedTime("Last 24 Hours");
                  setTimeout(handleFiltersChange, 0);
                }}
                className="ml-1 hover:text-green-300"
              >
                ×
              </button>
            </span>
          )}
        </motion.div>
      )}

      {/* Action Buttons Row */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleExport}
          disabled={loading}
          className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export Logs
          </div>
        </motion.button>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleClear}
          disabled={loading}
          className="flex-1 sm:flex-none px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed"
        >
          Clear Logs
        </motion.button>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleRefresh}
          disabled={loading}
          className="flex-1 sm:flex-none px-6 py-2.5 bg-transparent border border-gray-600 hover:border-gray-500 hover:bg-gray-700/30 disabled:border-gray-600/50 disabled:hover:bg-transparent text-gray-300 hover:text-white disabled:text-gray-500 font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-center gap-2">
            <svg
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {loading ? "Refreshing..." : "Refresh"}
          </div>
        </motion.button>
      </div>

      {/* Stats Row */}
      <motion.div
        variants={itemVariants}
        className="border-t border-gray-700/30 pt-3"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-400">
              {filterOptions.levels.length - 1}
            </div>
            <div className="text-xs text-gray-400">Log Levels</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-400">
              {filterOptions.sources.length}
            </div>
            <div className="text-xs text-gray-400">Sources</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-400">
              {filterOptions.timeRanges.length}
            </div>
            <div className="text-xs text-gray-400">Time Ranges</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-400">Live</div>
            <div className="text-xs text-gray-400">Updates</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LogFilters;
