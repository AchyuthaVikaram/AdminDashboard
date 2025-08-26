// File: /src/pages/Settings.jsx
import { motion } from 'framer-motion';
import ChangePassword from '../components/ui/ChangePassword';
import NotificationSettings from '../components/ui/NotificationSettings';
import ManageDevices from '../components/ui/ManageDevices';
import AccountInfo from '../components/ui/AccountInfo';
import SystemConfiguration from '../components/ui/SystemConfiguration';
import EmailTemplates from '../components/ui/EmailTemplates';
import SecuritySettings from '../components/ui/SecuritySettings';
import APIManagement from '../components/ui/APIManagement';
import BackupRestore from '../components/ui/BackupRestore';

const Settings = () => {
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen p-4 sm:p-6 lg:p-8"
    >
      {/* Page Header */}
      <motion.div variants={headerVariants} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">⚙️</span>
          <motion.h1 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
          >
            Settings
          </motion.h1>
        </div>
        <motion.p 
          className="text-gray-400 text-sm sm:text-base"
        >
          Comprehensive admin dashboard settings - manage system configuration, security, integrations, and more
        </motion.p>
      </motion.div>

      {/* Settings Grid */}
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Personal Settings Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
            👤 Personal Settings
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AccountInfo />
            <ChangePassword />
          </div>
        </div>

        {/* Security & Access Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
            🔐 Security & Access
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ManageDevices />
            <SecuritySettings />
          </div>
        </div>

        {/* System Administration Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
            ⚙️ System Administration
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SystemConfiguration />
            <BackupRestore />
          </div>
        </div>

        {/* Communication & Integration Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
            📡 Communication & Integration
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NotificationSettings />
            <EmailTemplates />
          </div>
        </div>

        {/* Developer Tools Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
            🛠️ Developer Tools
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <APIManagement />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;