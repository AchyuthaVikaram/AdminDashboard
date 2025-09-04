// File: /src/components/ui/SecuritySettings.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { BASE_URL } from '../../utils/constant';
import { useNavigate } from 'react-router-dom';

const SecuritySettings = () => {
  const [securityConfig, setSecurityConfig] = useState({
    enableAuditLog: true,
    enableIpWhitelist: false,
    enableBruteForceProtection: true,
    enableSuspiciousActivityDetection: true,
    autoLockoutDuration: 30,
    maxConcurrentSessions: 3,
    requireStrongPasswords: true,
    passwordExpiryDays: 90,
    enableCaptcha: false,
    enableDeviceTracking: true
  });

  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Fetch security settings
  useEffect(() => {
    const fetchSecuritySettings = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/admin/security-settings`, {
          headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        if (response.data.success) {
          setSecurityConfig(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching security settings:', err);
      }
    };

    const fetchAuditLogs = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/admin/audit-logs?limit=5`, {
          headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        if (response.data.success) {
          setAuditLogs(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching audit logs:', err);
        // Fallback data
        setAuditLogs([
          { id: 1, action: 'User Login', user: 'admin@example.com', timestamp: new Date().toISOString(), ip: '192.168.1.100' },
          { id: 2, action: 'Settings Changed', user: 'admin@example.com', timestamp: new Date(Date.now() - 3600000).toISOString(), ip: '192.168.1.100' },
          { id: 3, action: 'User Created', user: 'admin@example.com', timestamp: new Date(Date.now() - 7200000).toISOString(), ip: '192.168.1.100' }
        ]);
      }
    };

    fetchSecuritySettings();
    fetchAuditLogs();
  }, []);

  const handleToggle = (key) => {
    setSecurityConfig(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleInputChange = (key, value) => {
    setSecurityConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`${BASE_URL}/api/admin/security-settings`, securityConfig, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });
      
      if (response.data.success) {
        console.log('Security settings saved successfully');
      }
    } catch (err) {
      console.error('Error saving security settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, delay: 0.6 }
    }
  };

  const ToggleSwitch = ({ isOn, onToggle, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <div className="text-gray-200 font-medium">{label}</div>
        {description && (
          <div className="text-gray-400 text-sm mt-1">{description}</div>
        )}
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
          isOn ? 'bg-green-500' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
            isOn ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-gray-800 rounded-lg p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
          🔒 Security & Audit
        </h3>
        <p className="text-gray-400 text-sm">Advanced security settings and audit trail monitoring.</p>
      </div>

      <div className="space-y-6">
        {/* Security Toggles */}
        <div>
          <h4 className="text-lg font-medium text-white mb-4 border-b border-gray-700 pb-2">Security Features</h4>
          <div className="space-y-2">
            <ToggleSwitch
              isOn={securityConfig.enableAuditLog}
              onToggle={() => handleToggle('enableAuditLog')}
              label="Enable Audit Logging"
              description="Track all administrative actions and user activities"
            />
            
            <ToggleSwitch
              isOn={securityConfig.enableBruteForceProtection}
              onToggle={() => handleToggle('enableBruteForceProtection')}
              label="Brute Force Protection"
              description="Automatically block repeated failed login attempts"
            />
            
            <ToggleSwitch
              isOn={securityConfig.enableSuspiciousActivityDetection}
              onToggle={() => handleToggle('enableSuspiciousActivityDetection')}
              label="Suspicious Activity Detection"
              description="Monitor and alert on unusual user behavior patterns"
            />
            
            <ToggleSwitch
              isOn={securityConfig.enableIpWhitelist}
              onToggle={() => handleToggle('enableIpWhitelist')}
              label="IP Whitelist"
              description="Restrict admin access to specific IP addresses"
            />
            
            <ToggleSwitch
              isOn={securityConfig.enableDeviceTracking}
              onToggle={() => handleToggle('enableDeviceTracking')}
              label="Device Tracking"
              description="Monitor and manage user device sessions"
            />
          </div>
        </div>

        {/* Security Parameters */}
        <div>
          <h4 className="text-lg font-medium text-white mb-4 border-b border-gray-700 pb-2">Security Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Auto Lockout Duration (minutes)
              </label>
              <input
                type="number"
                value={securityConfig.autoLockoutDuration}
                onChange={(e) => handleInputChange('autoLockoutDuration', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="5"
                max="1440"
              />
            </div>
            
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Max Concurrent Sessions
              </label>
              <input
                type="number"
                value={securityConfig.maxConcurrentSessions}
                onChange={(e) => handleInputChange('maxConcurrentSessions', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="10"
              />
            </div>
            
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Password Expiry (days)
              </label>
              <input
                type="number"
                value={securityConfig.passwordExpiryDays}
                onChange={(e) => handleInputChange('passwordExpiryDays', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="30"
                max="365"
              />
            </div>
          </div>
        </div>

        {/* Recent Audit Logs */}
        <div>
          <h4 className="text-lg font-medium text-white mb-4 border-b border-gray-700 pb-2">Recent Audit Logs</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="bg-gray-700 rounded p-3 text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-white font-medium">{log.action}</span>
                    <div className="text-gray-400 mt-1">
                      User: {log.user} • IP: {log.ip}
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button
            className="mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium"
            onClick={() => navigate('/admin/system-logs')}
          >
            View Full Audit Log →
          </button>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : (
            'Save Security Settings'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SecuritySettings;
