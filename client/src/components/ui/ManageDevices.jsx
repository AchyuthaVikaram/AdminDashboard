// File: /src/components/ui/ManageDevices.jsx
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  ComputerDesktopIcon, 
  DevicePhoneMobileIcon, 
  DeviceTabletIcon 
} from '@heroicons/react/24/outline';
import { BASE_URL } from '../../utils/constant';

const ManageDevices = () => {
  const [currentDevice, setCurrentDevice] = useState({ device: 'Desktop', os: 'Unknown', browser: 'Unknown' });
  const [lastLogin, setLastLogin] = useState(null);

  const getAuthToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        if (res.data?.success) {
          const { deviceInfo, lastLogin: last } = res.data.data || {};
          if (deviceInfo) setCurrentDevice(deviceInfo);
          if (last) setLastLogin(last);
        }
      } catch (error) {
        console.error('Failed to fetch profile for devices', error);
      }
    };
    fetchProfile();
  }, []);

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'mobile':
        return <DevicePhoneMobileIcon className="w-5 h-5" />;
      case 'tablet':
        return <DeviceTabletIcon className="w-5 h-5" />;
      default:
        return <ComputerDesktopIcon className="w-5 h-5" />;
    }
  };

  // No server endpoint present to manage other device sessions; show read-only info.

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
        type: "spring",
        stiffness: 100
      }
    }
  };

  const deviceVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (custom) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        delay: custom * 0.1,
        type: "spring",
        stiffness: 120
      }
    }),
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        type: "spring",
        stiffness: 400
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        type: "spring",
        stiffness: 400
      }
    },
    tap: {
      scale: 0.98
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
        <h3 className="text-xl font-semibold text-white mb-2">Manage Devices</h3>
        <p className="text-gray-400 text-sm">View and manage devices that have access to your account.</p>
      </div>

      <div className="space-y-3 mb-6">
        <motion.div
          variants={deviceVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-700 rounded-lg p-4 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-gray-300">
                {getDeviceIcon((currentDevice.device || 'desktop').toLowerCase())}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-200 font-medium">{currentDevice.os || 'Unknown OS'}</span>
                  <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30">
                    Current
                  </span>
                </div>
                <span className="text-gray-400 text-sm">Browser: {currentDevice.browser || 'Unknown'}{lastLogin ? ` • Last login: ${new Date(lastLogin).toLocaleString()}` : ''}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="text-gray-400 text-xs text-center">Device session management is read-only in this demo.</div>
    </motion.div>
  );
};

export default ManageDevices;