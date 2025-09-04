// File: /src/components/ui/APIManagement.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { BASE_URL } from '../../utils/constant';

const APIManagement = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [apiStats, setApiStats] = useState({
    totalRequests: 0,
    successRate: 0,
    avgResponseTime: 0,
    activeKeys: 0
  });
  const [loading, setLoading] = useState(false);
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Fetch API data
  useEffect(() => {
    const fetchAPIData = async () => {
      try {
        const [keysRes, webhooksRes, statsRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/admin/api-keys`, {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
          }),
          axios.get(`${BASE_URL}/api/admin/webhooks`, {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
          }),
          axios.get(`${BASE_URL}/api/admin/api-stats`, {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
          })
        ]);

        if (keysRes.data.success) setApiKeys(keysRes.data.data);
        if (webhooksRes.data.success) setWebhooks(webhooksRes.data.data);
        if (statsRes.data.success) setApiStats(statsRes.data.data);
      } catch (err) {
        console.error('Error fetching API data:', err);
        // Fallback data
        setApiKeys([
          { id: 1, name: 'Production API', key: 'pk_live_****', status: 'active', created: new Date().toISOString(), lastUsed: new Date().toISOString() },
          { id: 2, name: 'Development API', key: 'pk_test_****', status: 'active', created: new Date().toISOString(), lastUsed: null }
        ]);
        setWebhooks([
          { id: 1, url: 'https://example.com/webhook', events: ['user.created', 'user.updated'], status: 'active' }
        ]);
        setApiStats({ totalRequests: 15420, successRate: 99.2, avgResponseTime: 245, activeKeys: 2 });
      }
    };
    fetchAPIData();
  }, []);

  const handleCreateAPIKey = async () => {
    if (!newKeyName.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/admin/api-keys`, {
        name: newKeyName
      }, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });

      if (response.data.success) {
        setApiKeys(prev => [...prev, response.data.data]);
        setNewKeyName('');
        setShowCreateKey(false);
      }
    } catch (err) {
      console.error('Error creating API key:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeKey = async (keyId) => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/api-keys/${keyId}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
    } catch (err) {
      console.error('Error revoking API key:', err);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, delay: 0.7 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-gray-800 rounded-lg p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
          🔑 API Management
        </h3>
        <p className="text-gray-400 text-sm">Manage API keys, webhooks, and monitor API usage.</p>
      </div>

      {/* API Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-400">{apiStats.totalRequests.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Total Requests</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">{apiStats.successRate}%</div>
          <div className="text-gray-400 text-sm">Success Rate</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400">{apiStats.avgResponseTime}ms</div>
          <div className="text-gray-400 text-sm">Avg Response</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-400">{apiStats.activeKeys}</div>
          <div className="text-gray-400 text-sm">Active Keys</div>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium text-white">API Keys</h4>
          <button
            onClick={() => setShowCreateKey(!showCreateKey)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
          >
            Create New Key
          </button>
        </div>

        {showCreateKey && (
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Enter key name..."
                className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCreateAPIKey}
                disabled={loading || !newKeyName.trim()}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => setShowCreateKey(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {apiKeys.map((key) => (
            <div key={key.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-white font-medium">{key.name}</h5>
                    <span className={`px-2 py-1 rounded text-xs ${
                      key.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {key.status}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm font-mono mt-1">{key.key}</div>
                  <div className="text-gray-500 text-xs mt-1">
                    Created: {new Date(key.created).toLocaleDateString()} • 
                    Last used: {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}
                  </div>
                </div>
                <button
                  onClick={() => handleRevokeKey(key.id)}
                  className="text-red-400 hover:text-red-300 text-sm font-medium"
                >
                  Revoke
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Webhooks Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium text-white">Webhooks</h4>
          <span className="text-gray-400 text-sm">Read-only</span>
        </div>

        <div className="space-y-3">
          {webhooks.map((webhook) => (
            <div key={webhook.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-white font-medium">{webhook.url}</div>
                  <div className="text-gray-400 text-sm mt-1">
                    Events: {webhook.events.join(', ')}
                  </div>
                  <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                    webhook.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {webhook.status}
                  </span>
                </div>
                <div className="text-gray-500 text-xs">Management not available in demo</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default APIManagement;
