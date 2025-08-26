// File: /src/components/ui/SystemConfiguration.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { BASE_URL } from '../../utils/constant';

const SystemConfiguration = () => {
  const [config, setConfig] = useState({
    maintenanceMode: false,
    allowRegistrations: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireTwoFactor: false,
    backupFrequency: 'daily',
    logRetentionDays: 30,
    emailVerificationRequired: true,
    apiRateLimit: 1000
  });
  
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Fetch current system configuration
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/admin/system-config`, {
          headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        if (response.data.success) {
          setConfig(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching system config:', err);
      }
    };
    fetchConfig();
  }, []);

  const handleToggle = (key) => {
    setConfig(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleInputChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`${BASE_URL}/api/admin/system-config`, config, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });
      
      if (response.data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Error saving system config:', err);
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, delay: 0.4 }
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
          ⚙️ System Configuration
        </h3>
        <p className="text-gray-400 text-sm">Configure global system settings and security policies.</p>
      </div>

      <div className="space-y-6">
        {/* Security Settings */}
        <div>
          <h4 className="text-lg font-medium text-white mb-4 border-b border-gray-700 pb-2">Security</h4>
          <div className="space-y-2">
            <ToggleSwitch
              isOn={config.maintenanceMode}
              onToggle={() => handleToggle('maintenanceMode')}
              label="Maintenance Mode"
              description="Temporarily disable public access to the system"
            />
            
            <ToggleSwitch
              isOn={config.allowRegistrations}
              onToggle={() => handleToggle('allowRegistrations')}
              label="Allow New Registrations"
              description="Enable new users to register accounts"
            />
            
            <ToggleSwitch
              isOn={config.requireTwoFactor}
              onToggle={() => handleToggle('requireTwoFactor')}
              label="Require Two-Factor Authentication"
              description="Enforce 2FA for all user accounts"
            />
            
            <ToggleSwitch
              isOn={config.emailVerificationRequired}
              onToggle={() => handleToggle('emailVerificationRequired')}
              label="Email Verification Required"
              description="Require email verification for new accounts"
            />
          </div>
        </div>

        {/* Session & Authentication */}
        <div>
          <h4 className="text-lg font-medium text-white mb-4 border-b border-gray-700 pb-2">Authentication</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={config.sessionTimeout}
                onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="5"
                max="480"
              />
            </div>
            
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                value={config.maxLoginAttempts}
                onChange={(e) => handleInputChange('maxLoginAttempts', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="3"
                max="10"
              />
            </div>
            
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Password Min Length
              </label>
              <input
                type="number"
                value={config.passwordMinLength}
                onChange={(e) => handleInputChange('passwordMinLength', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="6"
                max="20"
              />
            </div>
            
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                API Rate Limit (per hour)
              </label>
              <input
                type="number"
                value={config.apiRateLimit}
                onChange={(e) => handleInputChange('apiRateLimit', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="100"
                max="10000"
              />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div>
          <h4 className="text-lg font-medium text-white mb-4 border-b border-gray-700 pb-2">Data Management</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Backup Frequency
              </label>
              <select
                value={config.backupFrequency}
                onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Log Retention (days)
              </label>
              <input
                type="number"
                value={config.logRetentionDays}
                onChange={(e) => handleInputChange('logRetentionDays', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="7"
                max="365"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={loading}
          className={`w-full font-medium py-3 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
            saved 
              ? 'bg-green-600 text-white focus:ring-green-500'
              : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : saved ? (
            '✅ Configuration Saved'
          ) : (
            'Save Configuration'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SystemConfiguration;
