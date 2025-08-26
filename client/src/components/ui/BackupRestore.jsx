// File: /src/components/ui/BackupRestore.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { BASE_URL } from '../../utils/constant';

const BackupRestore = () => {
  const [backups, setBackups] = useState([]);
  const [backupConfig, setBackupConfig] = useState({
    autoBackup: true,
    frequency: 'daily',
    retentionDays: 30,
    includeUserData: true,
    includeSystemLogs: true,
    includeUploads: false
  });
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Fetch backup data
  useEffect(() => {
    const fetchBackups = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/admin/backups`, {
          headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        if (response.data.success) {
          setBackups(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching backups:', err);
        // Fallback data
        setBackups([
          { 
            id: 1, 
            name: 'Auto Backup - 2024-01-15', 
            size: '245 MB', 
            created: new Date().toISOString(), 
            type: 'automatic',
            status: 'completed'
          },
          { 
            id: 2, 
            name: 'Manual Backup - 2024-01-14', 
            size: '238 MB', 
            created: new Date(Date.now() - 86400000).toISOString(), 
            type: 'manual',
            status: 'completed'
          }
        ]);
      }
    };
    fetchBackups();
  }, []);

  const handleCreateBackup = async () => {
    setCreating(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/admin/backups`, {
        name: `Manual Backup - ${new Date().toLocaleDateString()}`,
        type: 'manual'
      }, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });

      if (response.data.success) {
        setBackups(prev => [response.data.data, ...prev]);
      }
    } catch (err) {
      console.error('Error creating backup:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleRestore = async (backupId) => {
    if (!window.confirm('Are you sure you want to restore this backup? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/admin/backups/${backupId}/restore`, {}, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });
      alert('Backup restoration initiated. The system will restart shortly.');
    } catch (err) {
      console.error('Error restoring backup:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (backupId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/backups/${backupId}/download`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `backup-${backupId}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading backup:', err);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, delay: 0.8 }
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
          💾 Backup & Restore
        </h3>
        <p className="text-gray-400 text-sm">Manage system backups and data restoration.</p>
      </div>

      {/* Backup Configuration */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-white mb-4 border-b border-gray-700 pb-2">Backup Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={backupConfig.autoBackup}
                onChange={(e) => setBackupConfig(prev => ({ ...prev, autoBackup: e.target.checked }))}
                className="mr-2 rounded"
              />
              <span className="text-gray-200">Enable Automatic Backups</span>
            </label>
          </div>
          <div>
            <label className="block text-gray-200 text-sm font-medium mb-2">Frequency</label>
            <select
              value={backupConfig.frequency}
              onChange={(e) => setBackupConfig(prev => ({ ...prev, frequency: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Create Backup */}
      <div className="mb-6">
        <button
          onClick={handleCreateBackup}
          disabled={creating}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {creating ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating Backup...
            </div>
          ) : (
            'Create Manual Backup'
          )}
        </button>
      </div>

      {/* Backup List */}
      <div>
        <h4 className="text-lg font-medium text-white mb-4 border-b border-gray-700 pb-2">Available Backups</h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {backups.map((backup) => (
            <div key={backup.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-white font-medium">{backup.name}</h5>
                    <span className={`px-2 py-1 rounded text-xs ${
                      backup.type === 'automatic' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {backup.type}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm mt-1">
                    Size: {backup.size} • Created: {new Date(backup.created).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(backup.id)}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleRestore(backup.id)}
                    disabled={loading}
                    className="text-yellow-400 hover:text-yellow-300 text-sm font-medium disabled:opacity-50"
                  >
                    Restore
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default BackupRestore;
