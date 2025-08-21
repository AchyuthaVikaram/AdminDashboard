// File: /src/components/ui/SystemStatus.jsx
import React from "react";
import { motion } from "framer-motion";

const SystemStatus = ({ systemStatus = {} }) => {
  // Default services if none provided
  const defaultServices = [
    { name: "API Services", status: "online" },
    { name: "Database", status: "online" },
    { name: "Cache", status: "maintenance" },
  ];

  const services = systemStatus.services || defaultServices;
  const overallStatus = systemStatus.overallStatus || "All systems operational";
  const health = systemStatus.health || {};

  const getStatusConfig = (status) => {
    switch (status) {
      case "online":
      case "healthy":
        return {
          color: "bg-green-500",
          text: "Online",
          textColor: "text-green-400",
          animate: false,
        };
      case "maintenance":
      case "warning":
        return {
          color: "bg-yellow-500",
          text: "Maintenance",
          textColor: "text-yellow-400",
          animate: true,
        };
      case "error":
      case "offline":
        return {
          color: "bg-red-500",
          text: "Error",
          textColor: "text-red-400",
          animate: true,
        };
      default:
        return {
          color: "bg-gray-500",
          text: "Unknown",
          textColor: "text-gray-400",
          animate: false,
        };
    }
  };

  const getOverallStatusColor = () => {
    const hasErrors = services.some(
      (service) => service.status === "error" || service.status === "offline"
    );
    const hasWarnings = services.some(
      (service) =>
        service.status === "maintenance" || service.status === "warning"
    );

    if (hasErrors) return "text-red-400";
    if (hasWarnings) return "text-yellow-400";
    return "text-green-400";
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 120,
      },
    },
  };

  const blinkVariants = {
    blink: {
      opacity: [1, 0.3, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gray-800/50 dark:bg-gray-800/70 rounded-lg p-4 sm:p-6 border border-gray-700/30 dark:border-gray-600/30"
    >
      <motion.h3
        variants={itemVariants}
        className="text-lg font-semibold text-gray-200 dark:text-gray-100 mb-4"
      >
        System Status
      </motion.h3>

      <motion.div variants={itemVariants} className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-3 h-3 rounded-full ${getOverallStatusColor().replace(
              "text-",
              "bg-"
            )}`}
          />
          <span className={`text-sm font-medium ${getOverallStatusColor()}`}>
            {overallStatus}
          </span>
        </div>

        {/* Health Metrics */}
        {(health.recentErrors !== undefined ||
          health.recentWarnings !== undefined) && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {health.recentErrors !== undefined && (
              <div className="bg-red-500/10 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-red-400">
                  {health.recentErrors}
                </div>
                <div className="text-xs text-red-300">Recent Errors</div>
              </div>
            )}
            {health.recentWarnings !== undefined && (
              <div className="bg-yellow-500/10 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-yellow-400">
                  {health.recentWarnings}
                </div>
                <div className="text-xs text-yellow-300">Recent Warnings</div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      <div className="space-y-3">
        {services.map((service, index) => {
          const config = getStatusConfig(service.status);

          return (
            <motion.div
              key={`${service.name}-${index}`}
              variants={itemVariants}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className={`w-2 h-2 rounded-full ${config.color}`}
                  animate={config.animate ? "blink" : ""}
                  variants={blinkVariants}
                />
                <span className="text-sm text-gray-300 dark:text-gray-200">
                  {service.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${config.textColor}`}>
                  {config.text}
                </span>

                {/* Additional service metrics */}
                {service.responseTime && (
                  <span className="text-xs text-gray-400">
                    ({service.responseTime}ms)
                  </span>
                )}

                {service.uptime && (
                  <span className="text-xs text-gray-400">
                    {service.uptime}% uptime
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Last Updated */}
      <div className="mt-4 pt-3 border-t border-gray-700/30">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Last updated</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-3 flex gap-2">
        <button className="flex-1 px-3 py-1 text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded transition-colors">
          View Details
        </button>
        <button className="flex-1 px-3 py-1 text-xs bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 rounded transition-colors">
          Refresh
        </button>
      </div>
    </motion.div>
  );
};

export default SystemStatus;
