import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Search,
  Users,
  UserCheck,
  Shield,
  UserX,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  AlertTriangle,
<<<<<<< HEAD
=======
  X,
  Save,
  User as UserIcon,
  Mail,
  Calendar,
  Globe,
  Monitor,
  Clock,
  Menu,
  ChevronDown,
>>>>>>> b4251fc (made it responsive)
} from "lucide-react";
import { BASE_URL } from "../utils/constant";

// Color constants - Using only specified colors
const COLORS = {
  primary: '#00FF7F',    // Green
  secondary: '#FFD700',  // Gold
  danger: '#FF4C4C',     // Red
  background: '#000000', // Black
};

// Configure axios defaults
axios.defaults.baseURL = `${BASE_URL}/api`;

// Add auth token to requests if available
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

<<<<<<< HEAD
=======
// Modal Backdrop Component
const ModalBackdrop = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-[#1a1a1a] border border-white/10 shadow-md/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-[#1a1a1a] border border-white/10 shadow-md border border-white/20 rounded-xl w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[95vh] overflow-y-auto my-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </motion.div>
  </motion.div>
);

// View User Modal
const ViewUserModal = ({ user, onClose }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return `bg-[${COLORS.secondary}]/20 text-[${COLORS.secondary}] border-[${COLORS.secondary}]/30`;
      case "User":
        return `bg-[${COLORS.primary}]/20 text-[${COLORS.primary}] border-[${COLORS.primary}]/30`;
      default:
        return "bg-white/20 text-white/60 border-white/30";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return `bg-[${COLORS.primary}]/20 text-[${COLORS.primary}] border-[${COLORS.primary}]/30`;
      case "Inactive":
        return `bg-[${COLORS.danger}]/20 text-[${COLORS.danger}] border-[${COLORS.danger}]/30`;
      case "Suspended":
        return `bg-[${COLORS.secondary}]/20 text-[${COLORS.secondary}] border-[${COLORS.secondary}]/30`;
      default:
        return "bg-white/20 text-white/60 border-white/30";
    }
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white">User Details</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="space-y-4 sm:space-y-6">
          {/* Profile Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover flex-shrink-0"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=00FF7F&color=000`;
              }}
            />
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-white truncate">{user.name}</h3>
              <p className="text-white/60 text-sm truncate">{user.email}</p>
              <p className="text-white/40 text-xs sm:text-sm">@{user.username}</p>
            </div>
            <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 flex-shrink-0">
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                {user.role}
              </span>
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                {user.status}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <UserIcon className="w-4 h-4 text-[#00FF7F]" />
                <span className="text-white/60 text-xs sm:text-sm">User ID</span>
              </div>
              <p className="text-white font-medium text-sm sm:text-base truncate">{user.id}</p>
            </div>

            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-[#00FF7F]" />
                <span className="text-white/60 text-xs sm:text-sm">Last Active</span>
              </div>
              <p className="text-white font-medium text-sm sm:text-base">{user.lastActive}</p>
            </div>

            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-[#FFD700]" />
                <span className="text-white/60 text-xs sm:text-sm">Joined</span>
              </div>
              <p className="text-white font-medium text-sm sm:text-base">
                {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <Monitor className="w-4 h-4 text-[#FFD700]" />
                <span className="text-white/60 text-xs sm:text-sm">Device</span>
              </div>
              <p className="text-white font-medium text-sm sm:text-base">
                {user.deviceInfo?.browser || 'Unknown'}
              </p>
            </div>
          </div>

          {/* Additional Info */}
          {user.metadata && (
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
              <h4 className="text-white font-medium mb-3 text-sm sm:text-base">Activity Statistics</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="flex justify-between sm:block">
                  <span className="text-white/60">Login Count:</span>
                  <span className="text-white sm:ml-2">{user.loginCount || 0}</span>
                </div>
                <div className="flex justify-between sm:block">
                  <span className="text-white/60">Total Sessions:</span>
                  <span className="text-white sm:ml-2">{user.metadata.totalSessions || 0}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-4 sm:mt-6 pt-4 border-t border-white/10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors border border-white/20 text-sm sm:text-base"
          >
            Close
          </motion.button>
        </div>
      </div>
    </ModalBackdrop>
  );
};

// Edit User Modal
const EditUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    username: user.username || '',
    role: user.role || 'User',
    status: user.status || 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const success = await onSave(formData);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white">Edit User</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full bg-[#1a1a1a] border border-white/10 shadow-md border ${errors.name ? 'border-[#FF4C4C]' : 'border-white/20'} rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#00FF7F] text-sm`}
              placeholder="Enter full name"
            />
            {errors.name && <p className="text-[#FF4C4C] text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full bg-[#1a1a1a] border border-white/10 shadow-md border ${errors.email ? 'border-[#FF4C4C]' : 'border-white/20'} rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#00FF7F] text-sm`}
              placeholder="Enter email address"
            />
            {errors.email && <p className="text-[#FF4C4C] text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              className={`w-full bg-[#1a1a1a] border border-white/10 shadow-md border ${errors.username ? 'border-[#FF4C4C]' : 'border-white/20'} rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#00FF7F] text-sm`}
              placeholder="Enter username"
            />
            {errors.username && <p className="text-[#FF4C4C] text-xs mt-1">{errors.username}</p>}
          </div>

          {/* Role and Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 shadow-md border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00FF7F] text-sm"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 shadow-md border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00FF7F] text-sm"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors border border-white/20 text-sm"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="bg-[#00FF7F] hover:bg-[#00FF7F]/80 text-black px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </motion.button>
          </div>
        </form>
      </div>
    </ModalBackdrop>
  );
};

// Create User Modal
const CreateUserModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'User',
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const success = await onSave(formData);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white">Create New User</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full bg-[#1a1a1a] border border-white/10 shadow-md border ${errors.name ? 'border-[#FF4C4C]' : 'border-white/20'} rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#00FF7F] text-sm`}
              placeholder="Enter full name"
            />
            {errors.name && <p className="text-[#FF4C4C] text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full bg-[#1a1a1a] border border-white/10 shadow-md border ${errors.email ? 'border-[#FF4C4C]' : 'border-white/20'} rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#00FF7F] text-sm`}
              placeholder="Enter email address"
            />
            {errors.email && <p className="text-[#FF4C4C] text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Username *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              className={`w-full bg-[#1a1a1a] border border-white/10 shadow-md border ${errors.username ? 'border-[#FF4C4C]' : 'border-white/20'} rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#00FF7F] text-sm`}
              placeholder="Enter username"
            />
            {errors.username && <p className="text-[#FF4C4C] text-xs mt-1">{errors.username}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className={`w-full bg-[#1a1a1a] border border-white/10 shadow-md border ${errors.password ? 'border-[#FF4C4C]' : 'border-white/20'} rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#00FF7F] text-sm`}
              placeholder="Enter password (min 6 characters)"
            />
            {errors.password && <p className="text-[#FF4C4C] text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Role and Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 shadow-md border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00FF7F] text-sm"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 shadow-md border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00FF7F] text-sm"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors border border-white/20 text-sm"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="bg-[#00FF7F] hover:bg-[#00FF7F]/80 text-black px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{loading ? 'Creating...' : 'Create User'}</span>
            </motion.button>
          </div>
        </form>
      </div>
    </ModalBackdrop>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ user, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const success = await onConfirm();
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white">Delete User</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-[#FF4C4C]/20 border border-[#FF4C4C]/30 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-[#FF4C4C]" />
              <span className="text-[#FF4C4C]/90">This action cannot be undone</span>
            </div>
          </div>

          <p className="text-white/80">
            Are you sure you want to delete the user{" "}
            <span className="font-semibold text-white">{user.name}</span>?
          </p>
          <p className="text-white/60 text-sm mt-2">
            Email: {user.email}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-white/20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleConfirm}
            disabled={loading}
            className="bg-[#FF4C4C] hover:bg-[#FF4C4C]/80 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>{loading ? 'Deleting...' : 'Delete User'}</span>
          </motion.button>
        </div>
      </div>
    </ModalBackdrop>
  );
};

>>>>>>> b4251fc (made it responsive)
// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color, delay, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-[#1a1a1a] border border-white/10 shadow-md rounded-xl p-4 sm:p-6 border border-white/20"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/60 text-xs sm:text-sm font-medium">{title}</p>
        <p className={`text-xl sm:text-2xl font-bold ${color} mt-1`}>
          {loading ? (
            <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
          ) : (
            value
          )}
        </p>
      </div>
      <div
        className={`p-2 sm:p-3 rounded-lg ${
          color === "text-[#00FF7F]"
            ? "bg-[#00FF7F]/10"
            : color === "text-[#FFD700]"
            ? "bg-[#FFD700]/10"
            : "bg-[#FF4C4C]/10"
        }`}
      >
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
      </div>
    </div>
  </motion.div>
);

// Dropdown Component
const Dropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#1a1a1a] border border-white/10 shadow-md border border-white/20 rounded-lg px-3 py-2 text-white text-sm flex items-center justify-between min-w-[110px] sm:min-w-[120px]"
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-1 bg-[#1a1a1a] border border-white/10 shadow-md border border-white/20 rounded-lg shadow-lg z-10 min-w-[110px] sm:min-w-[120px] w-full"
          >
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 first:rounded-t-lg last:rounded-b-lg transition-colors"
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// User Row Component
const UserRow = ({ user, index, onAction, loading }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/30";
      case "User":
        return "bg-[#00FF7F]/20 text-[#00FF7F] border-[#00FF7F]/30";
      default:
        return "bg-white/20 text-white/60 border-white/30";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-[#00FF7F]/20 text-[#00FF7F] border-[#00FF7F]/30";
      case "Inactive":
        return "bg-[#FF4C4C]/20 text-[#FF4C4C] border-[#FF4C4C]/30";
      case "Suspended":
        return "bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/30";
      default:
        return "bg-white/20 text-white/60 border-white/30";
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="border-b border-white/10 hover:bg-white/5 transition-colors"
    >
      <td className="p-3 sm:p-4 text-white/80 font-medium text-sm">{user.id}</td>
      <td className="p-3 sm:p-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=00FF7F&color=000`;
            }}
          />
          <div className="min-w-0 flex-1">
            <div className="text-white font-medium text-sm truncate">{user.name}</div>
            <div className="text-white/60 text-xs truncate">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="p-3 sm:p-4">
        <span
          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(
            user.role
          )}`}
        >
          {user.role}
        </span>
      </td>
      <td className="p-3 sm:p-4">
        <span
          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            user.status
          )}`}
        >
          {user.status}
        </span>
      </td>
      <td className="p-3 sm:p-4 text-white/60 text-sm">{user.lastActive}</td>
      <td className="p-3 sm:p-4">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAction("view", user)}
            disabled={loading}
            className="p-1 sm:p-1.5 text-[#00FF7F] hover:bg-[#00FF7F]/10 rounded disabled:opacity-50 transition-colors"
            title="View User"
          >
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAction("edit", user)}
            disabled={loading}
            className="p-1 sm:p-1.5 text-[#FFD700] hover:bg-[#FFD700]/10 rounded disabled:opacity-50 transition-colors"
            title="Edit User"
          >
            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAction("delete", user)}
            disabled={loading}
            className="p-1 sm:p-1.5 text-[#FF4C4C] hover:bg-[#FF4C4C]/10 rounded disabled:opacity-50 transition-colors"
            title="Delete User"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange, pagination, loading }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, 3);
      } else if (currentPage >= totalPages - 1) {
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-6 mb-4 sm:mb-6 px-4 space-y-2 sm:space-y-0">
      <p className="text-white/60 text-xs sm:text-sm">
        {pagination ? 
          `Showing ${pagination.showing.from} to ${pagination.showing.to} of ${pagination.showing.total} results` :
          'Loading...'
        }
      </p>
      <div className="flex items-center space-x-1 sm:space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-white/60 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </motion.button>

        {getPageNumbers().map((page) => (
          <motion.button
            key={page}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onPageChange(page)}
            disabled={loading}
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded text-xs sm:text-sm ${
              currentPage === page
                ? "bg-[#00FF7F] text-black"
                : "text-white/60 hover:text-white hover:bg-white/10"
            } disabled:opacity-50 transition-colors`}
          >
            {page}
          </motion.button>
        ))}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-white/60 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </motion.button>
      </div>
    </div>
  );
};

// Error Alert Component
const ErrorAlert = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-[#FF4C4C]/20 border border-[#FF4C4C]/30 rounded-lg p-4 mb-6 flex items-center justify-between"
    >
      <div className="flex items-center space-x-3">
        <AlertTriangle className="w-5 h-5 text-[#FF4C4C] flex-shrink-0" />
        <span className="text-[#FF4C4C]/90 text-sm">{error}</span>
      </div>
      <button
        onClick={onClose}
        className="text-[#FF4C4C]/70 hover:text-[#FF4C4C] flex-shrink-0 ml-2"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Main Component
const AdminUsersPage = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    inactiveUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const usersPerPage = 5;

  // API Functions
  const fetchUsers = async (page = 1, search = "", role = "", status = "") => {
    try {
      setLoading(page === 1); // Only show loading for first page
      const params = new URLSearchParams({
        page: page.toString(),
        limit: usersPerPage.toString(),
        ...(search && { search }),
        ...(role && role !== "All Roles" && { role }),
        ...(status && status !== "All Status" && { status })
      });

      const response = await axios.get(`/users?${params}`);
      
      if (response.data.success) {
        setUsers(response.data.data.users);
        setPagination(response.data.data.pagination);
        setError(null);
      } else {
        throw new Error(response.data.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Fetch users error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch users');
      setUsers([]);
      setPagination(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/users/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Fetch stats error:', err);
      // Don't show error for stats, just keep old data
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`/users/${userId}`);
      if (response.data.success) {
        // Refresh current page
        await fetchUsers(currentPage, searchTerm, roleFilter, statusFilter);
        await fetchStats();
        return true;
      }
    } catch (err) {
      console.error('Delete user error:', err);
      setError(err.response?.data?.message || 'Failed to delete user');
      return false;
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      const response = await axios.patch(`/users/${userId}/toggle-status`);
      if (response.data.success) {
        // Refresh current page
        await fetchUsers(currentPage, searchTerm, roleFilter, statusFilter);
        await fetchStats();
        return true;
      }
    } catch (err) {
      console.error('Toggle user status error:', err);
      setError(err.response?.data?.message || 'Failed to update user status');
      return false;
    }
  };

  // Effect hooks
  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers(1, searchTerm, roleFilter, statusFilter);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, roleFilter, statusFilter]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchUsers(currentPage, searchTerm, roleFilter, statusFilter);
        fetchStats();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentPage, searchTerm, roleFilter, statusFilter, loading]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchUsers(page, searchTerm, roleFilter, statusFilter);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchUsers(currentPage, searchTerm, roleFilter, statusFilter),
      fetchStats()
    ]);
  };

  // Handle user actions
  const handleAction = async (action, user) => {
    console.log(`${action} user:`, user);
    
    switch (action) {
      case "view":
        // Implement view user details
        alert(`Viewing user: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nStatus: ${user.status}`);
        break;
        
      case "edit":
        // Implement edit user (could open a modal)
        const newRole = user.role === "Admin" ? "User" : "Admin";
        if (confirm(`Change ${user.name}'s role from ${user.role} to ${newRole}?`)) {
          try {
            const response = await axios.put(`/users/${user.id || user._id}`, {
              role: newRole
            });
            if (response.data.success) {
              await fetchUsers(currentPage, searchTerm, roleFilter, statusFilter);
              await fetchStats();
            }
          } catch (err) {
            setError(err.response?.data?.message || 'Failed to update user');
          }
        }
        break;
        
      case "delete":
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
          await deleteUser(user.id || user._id);
        }
        break;
        
      default:
        console.log(`Unknown action: ${action}`);
    }
  };

  const handleAddUser = () => {
    // Implement add user functionality
    const name = prompt("Enter user name:");
    if (!name) return;
    
    const email = prompt("Enter user email:");
    if (!email) return;
    
    const username = prompt("Enter username:");
    if (!username) return;

    // Create user
    axios.post('/users', {
      name,
      email,
      username,
      password: 'password123', // Default password
      role: 'User',
      status: 'Active'
    }).then(response => {
      if (response.data.success) {
        fetchUsers(currentPage, searchTerm, roleFilter, statusFilter);
        fetchStats();
        alert('User created successfully!');
      }
    }).catch(err => {
      setError(err.response?.data?.message || 'Failed to create user');
    });
  };

  // Calculate totals for display
  const totalPages = pagination?.pages || 1;

  return (
    <div className="min-h-screen bg-transperant text-white">
      <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                User Management
              </h1>
              <p className="text-white/60 text-sm sm:text-base">Manage system users and permissions</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          <ErrorAlert error={error} onClose={() => setError(null)} />
        </AnimatePresence>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={Users}
            color="text-[#00FF7F]"
            delay={0.1}
            loading={loading}
          />
          <StatsCard
            title="Active Users"
            value={stats.activeUsers.toLocaleString()}
            icon={UserCheck}
            color="text-[#00FF7F]"
            delay={0.2}
            loading={loading}
          />
          <StatsCard
            title="Admins"
            value={stats.adminUsers.toLocaleString()}
            icon={Shield}
            color="text-[#FFD700]"
            delay={0.3}
            loading={loading}
          />
          <StatsCard
            title="Inactive"
            value={stats.inactiveUsers.toLocaleString()}
            icon={UserX}
            color="text-[#FF4C4C]"
            delay={0.4}
            loading={loading}
          />
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-3 lg:gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 shadow-md border border-white/20 rounded-lg pl-8 sm:pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#00FF7F] text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Dropdown
              options={["All Roles", "Admin", "User"]}
              value={roleFilter}
              onChange={setRoleFilter}
              placeholder="All Roles"
            />
            <Dropdown
              options={["All Status", "Active", "Inactive", "Suspended"]}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="All Status"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
<<<<<<< HEAD
              onClick={handleAddUser}
              className="bg-cyan-500 hover:bg-cyan-600 border border-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
=======
              onClick={handleCreateUser}
              className="bg-[#00FF7F] hover:bg-[#00FF7F]/80 text-black px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm font-medium"
>>>>>>> b4251fc (made it responsive)
            >
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-[#1a1a1a] border border-white/10 shadow-md rounded-xl border border-white/20 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-3 sm:p-4 text-left text-white/80 font-medium text-sm">
                    ID
                  </th>
                  <th className="p-3 sm:p-4 text-left text-white/80 font-medium text-sm">
                    User
                  </th>
                  <th className="p-3 sm:p-4 text-left text-white/80 font-medium text-sm">
                    Role
                  </th>
                  <th className="p-3 sm:p-4 text-left text-white/80 font-medium text-sm">
                    Status
                  </th>
                  <th className="p-3 sm:p-4 text-left text-white/80 font-medium text-sm">
                    Last Active
                  </th>
                  <th className="p-3 sm:p-4 text-left text-white/80 font-medium text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-white/60">
                      <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 animate-spin mx-auto mb-2" />
                      <span className="text-sm">Loading users...</span>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-white/60 text-sm">
                      No users found
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {users.map((user, index) => (
                      <UserRow
                        key={user._id || user.id}
                        user={user}
                        index={index}
                        onAction={handleAction}
                        loading={loading}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, totalPages)}
            onPageChange={handlePageChange}
            pagination={pagination}
            loading={loading}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AdminUsersPage;