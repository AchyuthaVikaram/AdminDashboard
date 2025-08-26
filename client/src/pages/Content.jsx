import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Search,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  Video,
  Image,
  File,
  X,
  Save,
  AlertCircle,
  Loader,
  BarChart3,
  PieChart,
} from "lucide-react";
import {
  PieChart as RechartsPieChart,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Pie,
} from "recharts";
import { BASE_URL } from "../utils/constant";

// Replace with your actual base URL

// API Service
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color, delay, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white-800 rounded-xl p-6 border border-gray-700"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        {loading ? (
          <div className="flex items-center mt-1">
            <Loader className="w-4 h-4 animate-spin text-gray-400 mr-2" />
            <div className="w-12 h-6 bg-gray-700 rounded animate-pulse"></div>
          </div>
        ) : (
          <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
        )}
      </div>
      <div
        className={`p-3 rounded-lg ${
          color === "text-cyan-400"
            ? "bg-cyan-400/10"
            : color === "text-green-400"
            ? "bg-green-400/10"
            : color === "text-orange-400"
            ? "bg-orange-400/10"
            : "bg-red-400/10"
        }`}
      >
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  </motion.div>
);

// Toast Component
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, x: 300 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 300 }}
    className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border ${
      type === "success"
        ? "bg-green-900 border-green-500 text-green-100"
        : type === "error"
        ? "bg-red-900 border-red-500 text-red-100"
        : "bg-blue-900 border-blue-500 text-blue-100"
    }`}
  >
    <div className="flex items-center space-x-2">
      {type === "success" && <CheckCircle className="w-5 h-5" />}
      {type === "error" && <AlertCircle className="w-5 h-5" />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-4">
        <X className="w-4 h-4" />
      </button>
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
        className="bg-white-800 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm flex items-center justify-between min-w-[120px]"
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

// Modal Component
const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`bg-gray-500/10 rounded-xl border border-gray-700 shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Content Form Component
const ContentForm = ({ content, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: content?.title || "",
    description: content?.description || "",
    type: content?.type || "Article",
    status: content?.status || "Draft",
    category: content?.category || "General",
    tags: content?.tags?.join(", ") || "",
    content: content?.content || "",
    featured: content?.featured || false,
    visibility: content?.visibility || "public",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.title.length < 3)
      newErrors.title = "Title must be at least 3 characters";
    if (formData.description.length < 10)
      newErrors.description = "Description must be at least 10 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };
      onSubmit(submitData);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className={`w-full bg-white-700 border ${
              errors.title ? "border-red-500" : "border-gray-600"
            } rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500`}
            placeholder="Enter content title"
          />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="w-full bg-white-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="Article" className="text-black">Article</option>
            <option value="Video" className="text-black">Video</option>
            <option value="Document" className="text-black">Document</option>
            <option value="Image" className="text-black">Image</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full bg-white-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="Draft" className="text-black">Draft</option>
            <option value="Pending" className="text-black">Pending</option>
            <option value="Published" className="text-black">Published</option>
            <option value="Rejected" className="text-black">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full bg-white-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
            placeholder="Enter category"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
          className={`w-full bg-white-700 border ${
            errors.description ? "border-red-500" : "border-gray-600"
          } rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500`}
          placeholder="Enter content description"
        />
        {errors.description && (
          <p className="text-red-400 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => handleChange("tags", e.target.value)}
          className="w-full bg-white-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
          placeholder="react, javascript, tutorial"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Content
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => handleChange("content", e.target.value)}
          rows={8}
          className="w-full bg-white-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
          placeholder="Enter main content..."
        />
      </div>

      <div className="flex items-center space-x-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => handleChange("featured", e.target.checked)}
            className="w-4 h-4 text-cyan-600 bg-white-700 border-gray-600 rounded focus:ring-cyan-500"
          />
          <span className="ml-2 text-sm text-gray-300">Featured Content</span>
        </label>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Visibility
          </label>
          <select
            value={formData.visibility}
            onChange={(e) => handleChange("visibility", e.target.value)}
            className="bg-white-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-cyan-500"
          >
            <option value="public" className="text-black">Public</option>
            <option value="private" className="text-black">Private</option>
            <option value="restricted" className="text-black">Restricted</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
        >
          {loading && <Loader className="w-4 h-4 animate-spin" />}
          <Save className="w-4 h-4" />
          <span>{content ? "Update" : "Create"}</span>
        </button>
      </div>
    </form>
  );
};

// Content Details Component
const ContentDetails = ({ content }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case "Video":
        return Video;
      case "Document":
        return File;
      case "Image":
        return Image;
      case "Article":
      default:
        return FileText;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Pending":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const TypeIcon = getTypeIcon(content.type);

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg">
          <TypeIcon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">
            {content.title}
          </h3>
          <p className="text-gray-300 mb-4">{content.description}</p>
          <div className="flex items-center space-x-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                content.status
              )}`}
            >
              {content.status}
            </span>
            <span className="text-sm text-gray-400">
              Created: {new Date(content.createdAt).toLocaleDateString()}
            </span>
            {content.publishedAt && (
              <span className="text-sm text-gray-400">
                Published: {new Date(content.publishedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="text-2xl font-bold text-cyan-400">
            {content.views || 0}
          </div>
          <div className="text-sm text-gray-400">Views</div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">
            {content.likes || 0}
          </div>
          <div className="text-sm text-gray-400">Likes</div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-400">
            {content.shares || 0}
          </div>
          <div className="text-sm text-gray-400">Shares</div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-400">
            {content.comments || 0}
          </div>
          <div className="text-sm text-gray-400">Comments</div>
        </div>
      </div>

      {content.tags && content.tags.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {content.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {content.content && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Content</h4>
          <div className="bg-gray-700/30 rounded-lg p-4 max-h-64 overflow-y-auto">
            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">
              {content.content}
            </pre>
          </div>
        </div>
      )}

      <div className="border-t border-gray-700 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Category:</span>
            <span className="text-white ml-2">{content.category}</span>
          </div>
          <div>
            <span className="text-gray-400">Type:</span>
            <span className="text-white ml-2">{content.type}</span>
          </div>
          <div>
            <span className="text-gray-400">Visibility:</span>
            <span className="text-white ml-2 capitalize">
              {content.visibility}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Content Row Component
const ContentRow = ({ content, index, onAction, loading }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case "Video":
        return Video;
      case "Document":
        return File;
      case "Image":
        return Image;
      case "Article":
      default:
        return FileText;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Video":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Document":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Image":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Article":
      default:
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Pending":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const TypeIcon = getTypeIcon(content.type);

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="border-b bg-white-700 border-gray-700/50 hover:bg-gray-800/50 transition-colors"
    >
      <td className="p-4 text-gray-300 font-medium">{content.id}</td>
      <td className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getTypeColor(content.type)}`}>
            <TypeIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-white font-medium">{content.title}</div>
            <div className="text-gray-400 text-sm">{content.description}</div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(
            content.type
          )}`}
        >
          {content.type}
        </span>
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwiRqXhQGQGpAo3OPzxF0PKY-u1lm1Hg5c5w&s"
            alt={content.createdBy?.name || "User"}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-gray-300 text-sm">
            {content.createdBy?.name || "Unknown User"}
          </span>
        </div>
      </td>
      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            content.status
          )}`}
        >
          {content.status}
        </span>
      </td>
      <td className="p-4 text-gray-400">{content.createdOn}</td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAction("view", content)}
            disabled={loading}
            className="p-1 text-cyan-400 hover:bg-cyan-400/10 rounded disabled:opacity-50"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAction("edit", content)}
            disabled={loading}
            className="p-1 text-green-400 hover:bg-green-400/10 rounded disabled:opacity-50"
          >
            <Edit className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAction("delete", content)}
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
const Pagination = ({ currentPage, totalPages, onPageChange, loading }) => {
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
        Page {currentPage} of {totalPages}
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
                ? "bg-blue-600/20 text-white"
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

// Analytics Dashboard Component
const AnalyticsDashboard = ({ analytics, loading }) => {
  const COLORS = {
    article: "#06b6d4", // cyan
    video: "#8b5cf6", // purple
    document: "#f59e0b", // amber
    image: "#3b82f6", // blue
    published: "#10b981", // green
    pending: "#f59e0b", // amber
    draft: "#6b7280", // gray
    rejected: "#ef4444", // red
  };

  const typeData =
    analytics?.typeDistribution?.map((item) => ({
      name: item._id,
      value: item.count,
      color: COLORS[item._id.toLowerCase()] || "#6b7280",
    })) || [];

  console.log(typeData);

  const statusData =
    analytics?.statusDistribution?.map((item) => ({
      name: item._id,
      value: item.count,
      color: COLORS[item._id.toLowerCase()] || "#6b7280",
    })) || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="mt-8"
    >
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="w-6 h-6 text-cyan-400" />
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Type Distribution */}
        <div className="bg-white-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <PieChart className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">
              Content Type Distribution
            </h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="w-8 h-8 animate-spin text-cyan-400" />
            </div>
          ) : typeData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ color: "#d1d5db" }}
                    formatter={(value) =>
                      value.charAt(0).toUpperCase() + value.slice(1)
                    }
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              No type data available
            </div>
          )}
        </div>

        {/* Status Distribution */}
        <div className="bg-white-700 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">
              Status Distribution
            </h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="w-8 h-8 animate-spin text-green-400" />
            </div>
          ) : statusData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statusData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="name"
                    stroke="#9ca3af"
                    formatter={(value) =>
                      value.charAt(0).toUpperCase() + value.slice(1)
                    }
                  />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              No status data available
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
const AdminContentPage = () => {
  // State management
  const [content, setContent] = useState([]);
  const [stats, setStats] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({});

  // Modal states
  const [viewModal, setViewModal] = useState({ open: false, content: null });
  const [editModal, setEditModal] = useState({ open: false, content: null });
  const [createModal, setCreateModal] = useState({ open: false });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    content: null,
  });

  // Toast state
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const contentPerPage = 5;

  // Show toast function
  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await api.get("/content/stats");
      if (response.data.success) {
        setStats(response.data.data.overview);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      showToast("Failed to fetch statistics", "error");
    }
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await api.get("/content/getContentChartAnalytics");
      console.log(response.data.data);
      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      showToast("Failed to fetch analytics", "error");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Fetch content
  const fetchContent = async (
    page = 1,
    search = "",
    status = "",
    type = ""
  ) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: contentPerPage.toString(),
      });

      if (search) params.append("search", search);
      if (status && status !== "All Status") params.append("status", status);
      if (type && type !== "All Types") params.append("type", type);

      const response = await api.get(`/content?${params}`);
      if (response.data.success) {
        const { content: contentData, pagination: paginationData } =
          response.data.data;
        setContent(contentData);
        setPagination(paginationData);
        setTotalPages(Math.max(1, paginationData.pages));
        setCurrentPage(paginationData.current);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      showToast("Failed to fetch content", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch content by ID
  const fetchContentById = async (id) => {
    try {
      const response = await api.get(`/content/${id}`);
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error("Error fetching content by ID:", error);
      showToast("Failed to fetch content details", "error");
    }
    return null;
  };

  // Create content
  const createContent = async (contentData) => {
    try {
      setActionLoading(true);
      const response = await api.post("/content", contentData);
      if (response.data.success) {
        showToast("Content created successfully", "success");
        setCreateModal({ open: false });
        await Promise.all([
          fetchContent(currentPage, searchTerm, statusFilter, typeFilter),
          fetchStats(),
          fetchAnalytics(),
        ]);
      }
    } catch (error) {
      console.error("Error creating content:", error);
      showToast(
        error.response?.data?.message || "Failed to create content",
        "error"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Update content
  const updateContent = async (id, contentData) => {
    try {
      setActionLoading(true);
      const response = await api.put(`/content/${id}`, contentData);
      if (response.data.success) {
        showToast("Content updated successfully", "success");
        setEditModal({ open: false, content: null });
        await Promise.all([
          fetchContent(currentPage, searchTerm, statusFilter, typeFilter),
          fetchStats(),
          fetchAnalytics(),
        ]);
      }
    } catch (error) {
      console.error("Error updating content:", error);
      showToast(
        error.response?.data?.message || "Failed to update content",
        "error"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Delete content with improved pagination handling
  const deleteContent = async (id) => {
    try {
      setActionLoading(true);
      const response = await api.delete(`/content/${id}`);
      if (response.data.success) {
        showToast("Content deleted successfully", "success");
        setDeleteModal({ open: false, content: null });

        // Calculate if we need to adjust the current page
        const remainingItems = content.length - 1;
        let targetPage = currentPage;

        // If current page becomes empty and it's not the first page, go to previous page
        if (remainingItems === 0 && currentPage > 1) {
          targetPage = currentPage - 1;
          setCurrentPage(targetPage);
        }

        // Refresh data and update stats immediately
        await Promise.all([
          fetchContent(targetPage, searchTerm, statusFilter, typeFilter),
          fetchStats(),
          fetchAnalytics(),
        ]);
        
        // Update pagination state optimistically
        const newTotalContent = Math.max(0, (stats.totalContent || 0) - 1);
        const itemsPerPage = pagination.limit || 10;
        const newTotalPages = Math.max(1, Math.ceil(newTotalContent / itemsPerPage));
        
        setStats(prevStats => ({
          ...prevStats,
          totalContent: newTotalContent
        }));
        
        // Update total pages immediately
        setTotalPages(newTotalPages);
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      showToast(
        error.response?.data?.message || "Failed to delete content",
        "error"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Handle content actions
  const handleAction = async (action, contentItem) => {
    switch (action) {
      case "view":
        const fullContent = await fetchContentById(contentItem._id);
        if (fullContent) {
          setViewModal({ open: true, content: fullContent });
        }
        break;
      case "edit":
        const editContent = await fetchContentById(contentItem._id);
        if (editContent) {
          setEditModal({ open: true, content: editContent });
        }
        break;
      case "delete":
        setDeleteModal({ open: true, content: contentItem });
        break;
      default:
        break;
    }
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    if (filterType === "type") {
      setTypeFilter(value);
    } else if (filterType === "status") {
      setStatusFilter(value);
    }
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && !loading) {
      setCurrentPage(page);
    }
  };

  // Effects
  useEffect(() => {
    fetchStats();
    fetchAnalytics();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchContent(currentPage, searchTerm, statusFilter, typeFilter);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchTerm, statusFilter, typeFilter]);

  // Calculate display stats
  const displayStats = useMemo(
    () => ({
      totalContent: stats.totalContent || 0,
      published: stats.published || 0,
      pending: stats.pending || 0,
      rejected: stats.rejected || 0,
    }),
    [stats]
  );

  return (
    <div className="min-h-screen bg-white-900 text-white">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Content Management
          </h1>
          <p className="text-gray-400">
            Manage your digital content efficiently
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Content"
            value={displayStats.totalContent}
            icon={FileText}
            color="text-cyan-400"
            delay={0.1}
            loading={loading}
          />
          <StatsCard
            title="Published"
            value={displayStats.published}
            icon={CheckCircle}
            color="text-green-400"
            delay={0.2}
            loading={loading}
          />
          <StatsCard
            title="Pending"
            value={displayStats.pending}
            icon={Clock}
            color="text-orange-400"
            delay={0.3}
            loading={loading}
          />
          <StatsCard
            title="Rejected"
            value={displayStats.rejected}
            icon={XCircle}
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
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex gap-3">
            <Dropdown
              options={["All Types", "Article", "Video", "Document", "Image"]}
              value={typeFilter}
              onChange={(value) => handleFilterChange("type", value)}
              placeholder="All Types"
            />
            <Dropdown
              options={[
                "All Status",
                "Published",
                "Pending",
                "Rejected",
                "Draft",
              ]}
              value={statusFilter}
              onChange={(value) => handleFilterChange("status", value)}
              placeholder="All Status"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCreateModal({ open: true })}
              className="bg-blue-600/10 hover:bg-blue-600/20 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Content</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white-800 rounded-xl border border-gray-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white-700">
                <tr>
                  <th className="p-4 text-left text-gray-300 font-medium">
                    ID
                  </th>
                  <th className="p-4 text-left text-gray-300 font-medium">
                    Title
                  </th>
                  <th className="p-4 text-left text-gray-300 font-medium">
                    Type
                  </th>
                  <th className="p-4 text-left text-gray-300 font-small">
                    CreatedBy
                  </th>
                  <th className="p-4 text-left text-gray-300 font-medium">
                    Status
                  </th>
                  <th className="p-4 text-left text-gray-300 font-medium">
                    CreatedOn
                  </th>
                  <th className="p-4 text-left text-gray-300 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader className="w-6 h-6 animate-spin text-cyan-400" />
                        <span className="text-gray-400">
                          Loading content...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : content.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-400">
                      No content found
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {content.map((contentItem, index) => (
                      <ContentRow
                        key={contentItem._id}
                        content={contentItem}
                        index={index}
                        onAction={handleAction}
                        loading={actionLoading}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>

          {!loading && content.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              loading={loading}
            />
          )}
        </motion.div>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard analytics={analytics} loading={analyticsLoading} />

        {/* Modals */}
        {/* View Content Modal */}
        <Modal
          isOpen={viewModal.open}
          onClose={() => setViewModal({ open: false, content: null })}
          title="Content Details"
          size="lg"
        >
          {viewModal.content && <ContentDetails content={viewModal.content} />}
        </Modal>

        {/* Edit Content Modal */}
        <Modal
          isOpen={editModal.open}
          onClose={() => setEditModal({ open: false, content: null })}
          title="Edit Content"
          size="lg"
        >
          {editModal.content && (
            <ContentForm
              content={editModal.content}
              onSubmit={(data) => updateContent(editModal.content._id, data)}
              onCancel={() => setEditModal({ open: false, content: null })}
              loading={actionLoading}
            />
          )}
        </Modal>

        {/* Create Content Modal */}
        <Modal
          isOpen={createModal.open}
          onClose={() => setCreateModal({ open: false })}
          title="Create New Content"
          size="lg"
        >
          <ContentForm
            onSubmit={createContent}
            onCancel={() => setCreateModal({ open: false })}
            loading={actionLoading}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, content: null })}
          title="Delete Content"
          size="sm"
        >
          {deleteModal.content && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Confirm Deletion</h4>
                  <p className="text-gray-300 text-sm mt-1">
                    Are you sure you want to delete "{deleteModal.content.title}
                    "? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setDeleteModal({ open: false, content: null })}
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteContent(deleteModal.content._id)}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                >
                  {actionLoading && <Loader className="w-4 h-4 animate-spin" />}
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast.show && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast({ show: false, message: "", type: "" })}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminContentPage;
