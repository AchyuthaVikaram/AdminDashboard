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
  X,
  Save,
  User as UserIcon,
  Mail,
  Calendar,
  Globe,
  Monitor,
  Clock,
} from "lucide-react";
import { BASE_URL } from "../utils/constant";

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

// Modal Backdrop Component
const ModalBackdrop = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-gray-800 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "User":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Inactive":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Suspended":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-lg">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`;
              }}
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{user.name}</h3>
              <p className="text-gray-400">{user.email}</p>
              <p className="text-gray-500 text-sm">@{user.username}</p>
            </div>
            <div className="flex space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                {user.role}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                {user.status}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <UserIcon className="w-4 h-4 text-cyan-400" />
                <span className="text-gray-400 text-sm">User ID</span>
              </div>
              <p className="text-white font-medium">{user.id}</p>
            </div>

            <div className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-green-400" />
                <span className="text-gray-400 text-sm">Last Active</span>
              </div>
              <p className="text-white font-medium">{user.lastActive}</p>
            </div>

            <div className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400 text-sm">Joined</span>
              </div>
              <p className="text-white font-medium">
                {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
              </p>
            </div>

            <div className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Monitor className="w-4 h-4 text-orange-400" />
                <span className="text-gray-400 text-sm">Device</span>
              </div>
              <p className="text-white font-medium">
                {user.deviceInfo?.browser || 'Unknown'}
              </p>
            </div>
          </div>

          {/* Additional Info */}
          {user.metadata && (
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">Activity Statistics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Login Count:</span>
                  <span className="text-white ml-2">{user.loginCount || 0}</span>
                </div>
                <div>
                  <span className="text-gray-400">Total Sessions:</span>
                  <span className="text-white ml-2">{user.metadata.totalSessions || 0}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-700">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
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
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Edit User</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500`}
              placeholder="Enter full name"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500`}
              placeholder="Enter email address"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              className={`w-full bg-gray-700 border ${errors.username ? 'border-red-500' : 'border-gray-600'} rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500`}
              placeholder="Enter username"
            />
            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
          </div>

          {/* Role and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
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
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Create New User</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500`}
              placeholder="Enter full name"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500`}
              placeholder="Enter email address"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Username *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              className={`w-full bg-gray-700 border ${errors.username ? 'border-red-500' : 'border-gray-600'} rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500`}
              placeholder="Enter username"
            />
            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className={`w-full bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500`}
              placeholder="Enter password (min 6 characters)"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Role and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
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
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Delete User</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-red-200">This action cannot be undone</span>
            </div>
          </div>

          <p className="text-gray-300">
            Are you sure you want to delete the user{" "}
            <span className="font-semibold text-white">{user.name}</span>?
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Email: {user.email}
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
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

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color, delay, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-gray-800 rounded-xl p-6 border border-gray-700"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <p className={`text-2xl font-bold ${color} mt-1`}>
          {loading ? (
            <RefreshCw className="w-6 h-6 animate-spin" />
          ) : (
            value
          )}
        </p>
      </div>
      <div
        className={`p-3 rounded-lg ${
          color === "text-cyan-400"
            ? "bg-cyan-400/10"
            : color === "text-green-400"
            ? "bg-green-400/10"
            : color === "text-purple-400"
            ? "bg-purple-400/10"
            : "bg-red-400/10"
        }`}
      >
        <Icon className={`w-6 h-6 ${color}`} />
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
        className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm flex items-center justify-between min-w-[120px]"
      >
        {value || placeholder}
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-[120px]"
          >
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
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
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "User":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Inactive":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Suspended":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="border-b border-gray-700/50 hover:bg-gray-800/50 transition-colors"
    >
      <td className="p-4 text-gray-300 font-medium">{user.id}</td>
      <td className="p-4">
        <div className="flex items-center space-x-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`;
            }}
          />
          <div>
            <div className="text-white font-medium">{user.name}</div>
            <div className="text-gray-400 text-sm">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(
            user.role
          )}`}
        >
          {user.role}
        </span>
      </td>
      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            user.status
          )}`}
        >
          {user.status}
        </span>
      </td>
      <td className="p-4 text-gray-400">{user.lastActive}</td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAction("view", user)}
            disabled={loading}
            className="p-1 text-cyan-400 hover:bg-cyan-400/10 rounded disabled:opacity-50"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAction("edit", user)}
            disabled={loading}
            className="p-1 text-green-400 hover:bg-green-400/10 rounded disabled:opacity-50"
          >
            <Edit className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAction("delete", user)}
            disabled={loading}
            className="p-1 text-red-400 hover:bg-red-400/10 rounded disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
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
    <div className="flex items-center justify-between mt-6 mb-6">
      <p className="text-gray-400 text-sm ml-4">
        {pagination ? 
          `Showing ${pagination.showing.from} to ${pagination.showing.to} of ${pagination.showing.total} results` :
          'Loading...'
        }
      </p>
      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="px-3 py-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
            className={`w-8 h-8 rounded ${
              currentPage === page
                ? "bg-cyan-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            } disabled:opacity-50`}
          >
            {page}
          </motion.button>
        ))}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="px-3 py-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
      className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6 flex items-center justify-between"
    >
      <div className="flex items-center space-x-3">
        <AlertTriangle className="w-5 h-5 text-red-400" />
        <span className="text-red-200">{error}</span>
      </div>
      <button
        onClick={onClose}
        className="text-red-400 hover:text-red-300"
      >
        ×
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

  // Modal states
  const [modals, setModals] = useState({
    view: { isOpen: false, user: null },
    edit: { isOpen: false, user: null },
    create: { isOpen: false },
    delete: { isOpen: false, user: null }
  });

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

  const fetchUserById = async (userId) => {
    try {
      const response = await axios.get(`/users/${userId}`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch user details');
    } catch (err) {
      console.error('Fetch user by ID error:', err);
      setError(err.response?.data?.message || 'Failed to fetch user details');
      return null;
    }
  };

  const createUser = async (userData) => {
    try {
      const response = await axios.post('/users', userData);
      if (response.data.success) {
        // Refresh current page and stats
        await Promise.all([
          fetchUsers(currentPage, searchTerm, roleFilter, statusFilter),
          fetchStats()
        ]);
        return true;
      }
      throw new Error(response.data.message || 'Failed to create user');
    } catch (err) {
      console.error('Create user error:', err);
      setError(err.response?.data?.message || 'Failed to create user');
      return false;
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      const response = await axios.put(`/users/${userId}`, userData);
      if (response.data.success) {
        // Update users state optimistically
        setUsers(prevUsers => 
          prevUsers.map(user => 
            (user._id === userId || user.id === userId) 
              ? { ...user, ...userData, lastActive: response.data.data.lastActive }
              : user
          )
        );
        // Refresh stats
        await fetchStats();
        return true;
      }
      throw new Error(response.data.message || 'Failed to update user');
    } catch (err) {
      console.error('Update user error:', err);
      setError(err.response?.data?.message || 'Failed to update user');
      return false;
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`/users/${userId}`);
      if (response.data.success) {
        // Remove user from state optimistically
        setUsers(prevUsers => 
          prevUsers.filter(user => user._id !== userId && user.id !== userId)
        );
        // If current page becomes empty, go to previous page
        if (users.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
          await fetchUsers(currentPage - 1, searchTerm, roleFilter, statusFilter);
        } else {
          await fetchUsers(currentPage, searchTerm, roleFilter, statusFilter);
        }
        // Refresh stats
        await fetchStats();
        return true;
      }
      throw new Error(response.data.message || 'Failed to delete user');
    } catch (err) {
      console.error('Delete user error:', err);
      setError(err.response?.data?.message || 'Failed to delete user');
      return false;
    }
  };

  // Modal handlers
  const openModal = (type, user = null) => {
    setModals(prev => ({
      ...prev,
      [type]: { isOpen: true, user }
    }));
  };

  const closeModal = (type) => {
    setModals(prev => ({
      ...prev,
      [type]: { isOpen: false, user: null }
    }));
  };

  const handleViewUser = async (user) => {
    const userDetails = await fetchUserById(user._id || user.id);
    if (userDetails) {
      openModal('view', userDetails);
    }
  };

  const handleEditUser = (user) => {
    openModal('edit', user);
  };

  const handleDeleteUser = (user) => {
    openModal('delete', user);
  };

  const handleCreateUser = () => {
    openModal('create');
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
    switch (action) {
      case "view":
        await handleViewUser(user);
        break;
      case "edit":
        handleEditUser(user);
        break;
      case "delete":
        handleDeleteUser(user);
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  };

  // Calculate totals for display
  const totalPages = pagination?.pages || 1;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                User Management
              </h1>
              <p className="text-gray-400">Manage system users and permissions</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={Users}
            color="text-cyan-400"
            delay={0.1}
            loading={loading}
          />
          <StatsCard
            title="Active Users"
            value={stats.activeUsers.toLocaleString()}
            icon={UserCheck}
            color="text-green-400"
            delay={0.2}
            loading={loading}
          />
          <StatsCard
            title="Admins"
            value={stats.adminUsers.toLocaleString()}
            icon={Shield}
            color="text-purple-400"
            delay={0.3}
            loading={loading}
          />
          <StatsCard
            title="Inactive"
            value={stats.inactiveUsers.toLocaleString()}
            icon={UserX}
            color="text-red-400"
            delay={0.4}
            loading={loading}
          />
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex gap-3">
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
              onClick={handleCreateUser}
              className="bg-cyan-500 hover:bg-cyan-600 border border-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add User</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-4 text-left text-gray-300 font-medium">
                    ID
                  </th>
                  <th className="p-4 text-left text-gray-300 font-medium">
                    User
                  </th>
                  <th className="p-4 text-left text-gray-300 font-medium">
                    Role
                  </th>
                  <th className="p-4 text-left text-gray-300 font-medium">
                    Status
                  </th>
                  <th className="p-4 text-left text-gray-300 font-medium">
                    Last Active
                  </th>
                  <th className="p-4 text-left text-gray-300 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-400">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-400">
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

        {/* Modals */}
        <AnimatePresence>
          {/* View User Modal */}
          {modals.view.isOpen && modals.view.user && (
            <ViewUserModal
              user={modals.view.user}
              onClose={() => closeModal('view')}
            />
          )}

          {/* Edit User Modal */}
          {modals.edit.isOpen && modals.edit.user && (
            <EditUserModal
              user={modals.edit.user}
              onClose={() => closeModal('edit')}
              onSave={async (userData) => {
                const success = await updateUser(modals.edit.user._id || modals.edit.user.id, userData);
                return success;
              }}
            />
          )}

          {/* Create User Modal */}
          {modals.create.isOpen && (
            <CreateUserModal
              onClose={() => closeModal('create')}
              onSave={createUser}
            />
          )}

          {/* Delete Confirmation Modal */}
          {modals.delete.isOpen && modals.delete.user && (
            <DeleteConfirmModal
              user={modals.delete.user}
              onClose={() => closeModal('delete')}
              onConfirm={async () => {
                const success = await deleteUser(modals.delete.user._id || modals.delete.user.id);
                return success;
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminUsersPage;