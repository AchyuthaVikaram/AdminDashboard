// File: /src/components/ui/EmailTemplates.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { BASE_URL } from '../../utils/constant';

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([
    {
      id: 'welcome',
      name: 'Welcome Email',
      subject: 'Welcome to {{app_name}}!',
      enabled: true,
      lastModified: new Date().toISOString()
    },
    {
      id: 'password_reset',
      name: 'Password Reset',
      subject: 'Reset Your Password',
      enabled: true,
      lastModified: new Date().toISOString()
    },
    {
      id: 'account_locked',
      name: 'Account Locked',
      subject: 'Your Account Has Been Locked',
      enabled: true,
      lastModified: new Date().toISOString()
    },
    {
      id: 'weekly_report',
      name: 'Weekly Report',
      subject: 'Your Weekly Activity Report',
      enabled: false,
      lastModified: new Date().toISOString()
    }
  ]);

  const [loading, setLoading] = useState(false);

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Fetch email templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/admin/email-templates`, {
          headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        if (response.data.success) {
          setTemplates(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching email templates:', err);
      }
    };
    fetchTemplates();
  }, []);

  const handleToggleTemplate = async (templateId) => {
    setLoading(true);
    try {
      const template = templates.find(t => t.id === templateId);
      const updatedTemplate = { ...template, enabled: !template.enabled };
      
      const response = await axios.put(`${BASE_URL}/api/admin/email-templates/${templateId}`, updatedTemplate, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });

      if (response.data.success) {
        setTemplates(prev => prev.map(t => 
          t.id === templateId ? { ...t, enabled: !t.enabled } : t
        ));
      }
    } catch (err) {
      console.error('Error updating template:', err);
    } finally {
      setLoading(false);
    }
  };

  // Edit functionality is not supported; only enable/disable is available.

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, delay: 0.5 }
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
          📧 Email Templates
        </h3>
        <p className="text-gray-400 text-sm">Manage automated email templates and notifications.</p>
      </div>

      <div className="space-y-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-gray-700 rounded-lg p-4 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="text-gray-200 font-medium">{template.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    template.enabled 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {template.enabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-1">{template.subject}</p>
                <p className="text-gray-500 text-xs mt-1">
                  Last modified: {new Date(template.lastModified).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleTemplate(template.id)}
                  disabled={loading}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                    template.enabled
                      ? 'text-red-400 hover:text-red-300'
                      : 'text-green-400 hover:text-green-300'
                  } disabled:opacity-50`}
                >
                  {template.enabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/*reomved edit functionality */}
      {/* Creating templates is not supported by the API; actions limited to enable/disable. */}
    </motion.div>
  );
};

export default EmailTemplates;
