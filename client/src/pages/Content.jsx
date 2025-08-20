import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Filter,
  Menu,
  ChevronDown,
} from "lucide-react";

// Mock API service for demonstration
const mockApi = {
  get: async (url) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (url.includes('/stats')) {
      return {
        data: {
          success: true,
          data: {
            overview: {
              totalContent: 156,
              published: 89,
              pending: 42,
              rejected: 25
            }
          }
        }
      };
    }
    
    if (url.includes('/getContentChartAnalytics')) {
      return {
        data: {
          success: true,
          data: {
            typeDistribution: [
              { _id: 'Article', count: 45 },
              { _id: 'Video', count: 32 },
              { _id: 'Document', count: 28 },
              { _id: 'Image', count: 51 }
            ],
            statusDistribution: [
              { _id: 'Published', count: 89 },
              { _id: 'Pending', count: 42 },
              { _id: 'Draft', count: 15 },
              { _id: 'Rejected', count: 25 }
            ]
          }
        }
      };
    }
    
    // Mock content list
    const mockContent = Array.from({ length: 12 }, (_, i) => ({
      _id: `content_${i + 1}`,
      id: i + 1,
      title: `Sample Content ${i + 1}`,
      description: `This is a sample description for content item ${i + 1}. It contains relevant information about the content.`,
      type: ['Article', 'Video', 'Document', 'Image'][i % 4],
      status: ['Published', 'Pending', 'Draft', 'Rejected'][i % 4],
      category: 'General',
      tags: ['react', 'javascript', 'tutorial'],
      content: `Sample content body for item ${i + 1}...`,
      featured: i % 3 === 0,
      visibility: 'public',
      views: Math.floor(Math.random() * 1000) + 50,
      likes: Math.floor(Math.random() * 200) + 10,
      shares: Math.floor(Math.random() * 50) + 5,
      comments: Math.floor(Math.random() * 30) + 2,
      createdBy: { name: `User ${i + 1}` },
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      createdOn: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
      publishedAt: i % 4 === 0 ? new Date().toISOString() : null
    }));
    
    return {
      data: {
        success: true,
        data: {
          content: mockContent.slice(0, 5),
          pagination: {
            current: 1,
            pages: 3,
            total: mockContent.length
          }
        }
      }
    };
  },
  post: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data: { success: true } };
  },
  put: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data: { success: true } };
  },
  delete: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data: { success: true } };
  }
};

// Stats Card Component - Fixed for laptop screens
const StatsCard = ({ title, value, icon: Icon, color, delay, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
     >
    <div className="flex items-center justify-between h-full">
      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-gray-400 text-xs sm:text-sm font-medium mb-1 sm:mb-2 group-hover:text-gray-300 transition-colors">
          {title}
        </p>
        {loading ? (
          <div className="flex items-center space-x-2">
            <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-gray-500" />
            <div className="w-8 sm:w-12 lg:w-16 h-3 sm:h-4 bg-gray-700 rounded animate-pulse" />
          </div>
        ) : (
          <p className={`text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold ${color} transition-all duration-300`}>
            {value.toLocaleString()}
          </p>
        )}
      </div>

      {/* Icon */}
      <div className={`p-2 sm:p-2.5 lg:p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${
        color === "text-yellow-400"
          ? "bg-yellow-500/10 group-hover:bg-yellow-500/20"
          : color === "text-green-400"
          ? "bg-green-500/10 group-hover:bg-green-500/20"
          : color === "text-red-400"
          ? "bg-red-500/10 group-hover:bg-red-500/20"
          : "bg-green-500/10 group-hover:bg-green-500/20"
      }`}>
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${color} transition-all duration-300`} />
      </div>
    </div>
  </motion.div>
);

// Enhanced Toast Component
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, x: 300, scale: 0.9 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, x: 300, scale: 0.9 }}
    className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl border max-w-sm w-full mx-4 sm:mx-0 sm:w-auto sm:min-w-[320px] ${
      type === "success"
        ? "bg-[#1a1a1a] border border-white/10 shadow-md border-green-500 text-green-400"
        : type === "error"
        ? "bg-[#1a1a1a] border border-white/10 shadow-md border-red-500 text-red-400"
        : "bg-[#1a1a1a] border border-white/10 shadow-md border-yellow-500 text-yellow-400"
    }`}
  >
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 mt-0.5">
        {type === "success" && <CheckCircle className="w-5 h-5" />}
        {type === "error" && <AlertCircle className="w-5 h-5" />}
        {type === "info" && <AlertCircle className="w-5 h-5" />}
      </div>
      <p className="flex-1 text-sm font-medium leading-relaxed">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </motion.div>
);

// Enhanced Dropdown Component
const Dropdown = ({ options, value, onChange, placeholder, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.dropdown-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`relative dropdown-container ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#1a1a1a] border border-white/10 shadow-md border border-black rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm sm:text-base flex items-center justify-between hover:bg-[#1a1a1a] border border-white/10 shadow-md transition-all duration-200 group"
      >
        <span className="truncate flex-1 text-left font-medium">
          {value || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform duration-200 group-hover:text-gray-300 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 bg-[#1a1a1a] border border-white/10 shadow-md border border-black rounded-lg shadow-xl z-30 w-full max-h-48 overflow-y-auto"
          >
            {options.map((option, index) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 sm:px-4 py-2.5 text-sm sm:text-base text-gray-200 hover:bg-gray-800 hover:text-white transition-colors first:rounded-t-lg last:rounded-b-lg font-medium"
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

// Enhanced Modal Component
const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#1a1a1a] border border-white/10 shadow-md/60 z-50 flex items-start justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`bg-[#1a1a1a] border border-white/10 shadow-md border border-black shadow-2xl w-full ${sizeClasses[size]} my-8 mx-auto max-h-[90vh] overflow-hidden rounded-xl`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-black bg-[#1a1a1a] border border-white/10 shadow-md">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white pr-4">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="p-4 sm:p-6">
                {children}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Enhanced Content Form
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
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (formData.title.length < 3) newErrors.title = "Title must be at least 3 characters";
    if (formData.description.length < 10) newErrors.description = "Description must be at least 10 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag),
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
      {/* Title and Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="sm:col-span-2 lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className={`w-full bg-[#1a1a1a] border border-white/10 shadow-md border ${
              errors.title ? "border-red-400" : "border-black"
            } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all`}
            placeholder="Enter content title"
          />
          {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Type *</label>
          <select
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 shadow-md border border-black rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
          >
            <option value="Article">Article</option>
            <option value="Video">Video</option>
            <option value="Document">Document</option>
            <option value="Image">Image</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 shadow-md border border-black rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
          >
            <option value="Draft">Draft</option>
            <option value="Pending">Pending</option>
            <option value="Published">Published</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={4}
          className={`w-full bg-[#1a1a1a] border border-white/10 shadow-md border ${
            errors.description ? "border-red-400" : "border-black"
          } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 resize-y transition-all`}
          placeholder="Enter content description"
        />
        {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Category and Tags */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 shadow-md border border-black rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
            placeholder="Enter category"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => handleChange("tags", e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 shadow-md border border-black rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
            placeholder="react, javascript, tutorial"
          />
        </div>
      </div>

      {/* Main Content */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">Content</label>
        <textarea
          value={formData.content}
          onChange={(e) => handleChange("content", e.target.value)}
          rows={8}
          className="w-full bg-[#1a1a1a] border border-white/10 shadow-md border border-black rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 resize-y transition-all"
          placeholder="Enter main content..."
        />
      </div>

      {/* Settings */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-[#1a1a1a] border border-white/10 shadow-md rounded-lg border border-black">
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => handleChange("featured", e.target.checked)}
            className="w-5 h-5 text-green-400 bg-[#1a1a1a] border border-white/10 shadow-md border-black rounded focus:ring-green-400 focus:ring-2"
          />
          <span className="ml-3 text-gray-300 group-hover:text-white transition-colors font-medium">
            Featured Content
          </span>
        </label>

        <div className="flex items-center space-x-3">
          <label className="text-sm font-semibold text-gray-300">Visibility:</label>
          <select
            value={formData.visibility}
            onChange={(e) => handleChange("visibility", e.target.value)}
            className="bg-[#1a1a1a] border border-white/10 shadow-md border border-black rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-400 transition-colors"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="restricted">Restricted</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-6 border-t border-black">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-black text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-green-400 text-black rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all font-medium"
        >
          {loading && <Loader className="w-4 h-4 animate-spin" />}
          <Save className="w-4 h-4" />
          <span>{content ? "Update" : "Create"}</span>
        </button>
      </div>
    </form>
  );
};

// Enhanced Content Details
const ContentDetails = ({ content }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case "Video": return Video;
      case "Document": return File;
      case "Image": return Image;
      default: return FileText;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Published": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Rejected": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const TypeIcon = getTypeIcon(content.type);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 sm:p-6 bg-[#1a1a1a] border border-white/10 shadow-md rounded-xl border border-black">
        <div className="p-4 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl">
          <TypeIcon className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3">
            {content.title}
          </h3>
          <p className="text-gray-300 mb-4 text-base leading-relaxed">
            {content.description}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(content.status)}`}>
              {content.status}
            </span>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-400">
              <span>Created: {new Date(content.createdAt).toLocaleDateString()}</span>
              {content.publishedAt && (
                <span>Published: {new Date(content.publishedAt).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Views", value: content.views || 0, color: "text-green-400", bg: "bg-green-500/10" },
          { label: "Likes", value: content.likes || 0, color: "text-yellow-400", bg: "bg-yellow-500/10" },
          { label: "Shares", value: content.shares || 0, color: "text-red-400", bg: "bg-red-500/10" },
          { label: "Comments", value: content.comments || 0, color: "text-green-400", bg: "bg-green-500/10" }
        ].map((stat, index) => (
          <div key={index} className={`${stat.bg} rounded-xl p-4 sm:p-5 text-center border border-black`}>
            <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${stat.color} mb-1`}>
              {stat.value.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tags */}
      {content.tags && content.tags.length > 0 && (
        <div>
          <h4 className="text-lg font-bold text-gray-300 mb-3">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {content.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm border border-black hover:bg-gray-700 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Content Preview */}
      {content.content && (
        <div>
          <h4 className="text-lg font-bold text-gray-300 mb-3">Content Preview</h4>
          <div className="bg-[#1a1a1a] border border-white/10 shadow-md rounded-xl p-4 sm:p-6 border border-black max-h-80 overflow-y-auto">
            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">
              {content.content}
            </pre>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="border-t border-black pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-400 font-medium">Category:</span>
            <span className="text-white ml-2">{content.category}</span>
          </div>
          <div>
            <span className="text-gray-400 font-medium">Type:</span>
            <span className="text-white ml-2">{content.type}</span>
          </div>
          <div>
            <span className="text-gray-400 font-medium">Visibility:</span>
            <span className="text-white ml-2 capitalize">{content.visibility}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Content Row with better mobile layout - Fixed for laptop screens
const ContentRow = ({ content, index, onAction, loading }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case "Video": return Video;
      case "Document": return File;
      case "Image": return Image;
      default: return FileText;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Video": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Document": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Image": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-green-500/20 text-green-400 border-green-500/30";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Published": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Rejected": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const TypeIcon = getTypeIcon(content.type);

  return (
    <>
      {/* Desktop Table Row - Fixed width issues */}
      <motion.tr
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="hidden lg:table-row border-b border-black hover:bg-[#1a1a1a] border border-white/10 shadow-md/50 transition-colors group"
      >
        <td className="p-3 text-gray-300 font-medium text-sm">{content.id}</td>
        <td className="p-3 max-w-xs">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-lg ${getTypeColor(content.type)}`}>
              <TypeIcon className="w-3 h-3" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-white font-semibold truncate text-sm group-hover:text-green-400 transition-colors">
                {content.title}
              </div>
              <div className="text-gray-400 text-xs truncate">{content.description}</div>
            </div>
          </div>
        </td>
        <td className="p-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getTypeColor(content.type)}`}>
            {content.type}
          </span>
        </td>
        <td className="p-3 max-w-24">
          <div className="flex items-center space-x-1">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(content.createdBy?.name || 'User')}&background=00FF7F&color=000&size=24`}
              alt={content.createdBy?.name || "User"}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-gray-300 text-xs truncate max-w-16">
              {content.createdBy?.name || "Unknown"}
            </span>
          </div>
        </td>
        <td className="p-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(content.status)}`}>
            {content.status}
          </span>
        </td>
        <td className="p-3 text-gray-400 text-xs">{content.createdOn}</td>
        <td className="p-3">
          <div className="flex items-center space-x-1">
            {[
              { icon: Eye, action: "view", color: "text-green-400 hover:bg-green-400/10" },
              { icon: Edit, action: "edit", color: "text-yellow-400 hover:bg-yellow-400/10" },
              { icon: Trash2, action: "delete", color: "text-red-400 hover:bg-red-400/10" }
            ].map(({ icon: Icon, action, color }) => (
              <motion.button
                key={action}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onAction(action, content)}
                disabled={loading}
                className={`p-1.5 rounded-lg ${color} disabled:opacity-50 transition-all`}
              >
                <Icon className="w-3 h-3" />
              </motion.button>
            ))}
          </div>
        </td>
      </motion.tr>

      {/* Mobile Card Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="lg:hidden bg-[#1a1a1a] border border-white/10 shadow-md border border-black rounded-xl p-4 mb-4 hover:bg-[#1a1a1a] border border-white/10 shadow-md transition-all"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400 text-sm font-medium">#{content.id}</span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(content.status)}`}>
            {content.status}
          </span>
        </div>

        {/* Content */}
        <div className="flex items-start space-x-3 mb-4">
          <div className={`p-2.5 rounded-xl ${getTypeColor(content.type)} flex-shrink-0`}>
            <TypeIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-bold text-base mb-1 line-clamp-1">
              {content.title}
            </h4>
            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
              {content.description}
            </p>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-col space-y-2 text-sm mb-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Type:</span>
            <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getTypeColor(content.type)}`}>
              {content.type}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Created:</span>
            <span className="text-gray-300">{content.createdOn}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-black">
          <div className="flex items-center space-x-2">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(content.createdBy?.name || 'User')}&background=00FF7F&color=000&size=32`}
              alt={content.createdBy?.name || "User"}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-gray-300 text-sm font-medium truncate">
              {content.createdBy?.name || "Unknown User"}
            </span>
          </div>

          <div className="flex space-x-2">
            {[
              { icon: Eye, action: "view", color: "text-green-400 hover:bg-green-400/10" },
              { icon: Edit, action: "edit", color: "text-yellow-400 hover:bg-yellow-400/10" },
              { icon: Trash2, action: "delete", color: "text-red-400 hover:bg-red-400/10" }
            ].map(({ icon: Icon, action, color }) => (
              <motion.button
                key={action}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onAction(action, content)}
                disabled={loading}
                className={`p-2 rounded-lg ${color} disabled:opacity-50 transition-all`}
              >
                <Icon className="w-4 h-4" />
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

// Enhanced Pagination
const Pagination = ({ currentPage, totalPages, onPageChange, loading }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = window.innerWidth < 640 ? 3 : 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const half = Math.floor(maxVisible / 2);
      let start = Math.max(currentPage - half, 1);
      let end = Math.min(start + maxVisible - 1, totalPages);

      if (end - start + 1 < maxVisible) {
        start = Math.max(end - maxVisible + 1, 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-8 mb-6 space-y-4 sm:space-y-0">
      {/* Page Info */}
      <p className="text-gray-400 text-sm font-medium">
        Showing page {currentPage} of {totalPages}
      </p>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="px-3 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          Previous
        </motion.button>

        <div className="flex space-x-1">
          {getPageNumbers().map((page) => (
            <motion.button
              key={page}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onPageChange(page)}
              disabled={loading}
              className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                currentPage === page
                  ? "bg-green-400 text-black shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              } disabled:opacity-50`}
            >
              {page}
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="px-3 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          Next
        </motion.button>
      </div>
    </div>
  );
};

// Enhanced Analytics Dashboard
const AnalyticsDashboard = ({ analytics, loading }) => {
  const COLORS = {
    article: "#00FF7F", video: "#FF4C4C", document: "#FFD700", image: "#00FF7F",
    published: "#00FF7F", pending: "#FFD700", draft: "#6b7280", rejected: "#FF4C4C",
  };

  const typeData = analytics?.typeDistribution?.map((item) => ({
    name: item._id,
    value: item.count,
    color: COLORS[item._id.toLowerCase()] || "#6b7280",
  })) || [];

  const statusData = analytics?.statusDistribution?.map((item) => ({
    name: item._id,
    value: item.count,
    color: COLORS[item._id.toLowerCase()] || "#6b7280",
  })) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="mt-12"
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-green-400/20 rounded-xl border border-green-500/30">
          <BarChart3 className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Analytics Dashboard</h2>
          <p className="text-gray-400 text-sm">Insights into your content performance</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Type Distribution Chart */}
        <div className="bg-[#1a1a1a] border border-white/10 shadow-md border border-black rounded-2xl p-6 hover:border-gray-800 transition-colors">
          <div className="flex items-center space-x-3 mb-6">
            <PieChart className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-bold text-white">Content Type Distribution</h3>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-80">
              <div className="text-center">
                <Loader className="w-8 h-8 animate-spin text-green-400 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Loading analytics...</p>
              </div>
            </div>
          ) : typeData.length > 0 ? (
            <div className="h-80">
              {/* Mock chart visualization */}
              <div className="grid grid-cols-2 gap-4 h-full">
                {typeData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center justify-center bg-[#1a1a1a] border border-white/10 shadow-md rounded-xl p-4 border border-black">
                    <div className="text-2xl font-bold mb-2" style={{ color: item.color }}>
                      {item.value}
                    </div>
                    <div className="text-gray-300 text-sm font-medium capitalize">{item.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-80 text-gray-400">
              <div className="text-center">
                <PieChart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No type data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Status Distribution Chart */}
        <div className="bg-[#1a1a1a] border border-white/10 shadow-md border border-black rounded-2xl p-6 hover:border-gray-800 transition-colors">
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-bold text-white">Status Distribution</h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-80">
              <div className="text-center">
                <Loader className="w-8 h-8 animate-spin text-yellow-400 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Loading analytics...</p>
              </div>
            </div>
          ) : statusData.length > 0 ? (
            <div className="h-80">
              {/* Mock bar chart visualization */}
              <div className="flex items-end justify-between h-full space-x-2 px-4">
                {statusData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full rounded-t-lg mb-3 transition-all hover:opacity-80"
                      style={{ 
                        backgroundColor: item.color,
                        height: `${(item.value / Math.max(...statusData.map(d => d.value))) * 100}%`,
                        minHeight: '40px'
                      }}
                    />
                    <div className="text-center">
                      <div className="text-lg font-bold text-white mb-1">{item.value}</div>
                      <div className="text-xs text-gray-400 capitalize">{item.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-80 text-gray-400">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No status data available</p>
              </div>
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
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Modal states
  const [viewModal, setViewModal] = useState({ open: false, content: null });
  const [editModal, setEditModal] = useState({ open: false, content: null });
  const [createModal, setCreateModal] = useState({ open: false });
  const [deleteModal, setDeleteModal] = useState({ open: false, content: null });

  // Toast state
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const contentPerPage = 5;

  // Show toast function
  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  // API functions
  const fetchStats = async () => {
    try {
      const response = await mockApi.get("/content/stats");
      if (response.data.success) {
        setStats(response.data.data.overview);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      showToast("Failed to fetch statistics", "error");
    }
  };

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await mockApi.get("/content/getContentChartAnalytics");
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

  const fetchContent = async (page = 1, search = "", status = "", type = "") => {
    try {
      setLoading(true);
      const response = await mockApi.get(`/content?page=${page}&limit=${contentPerPage}&search=${search}&status=${status}&type=${type}`);
      if (response.data.success) {
        const { content: contentData, pagination: paginationData } = response.data.data;
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

  const fetchContentById = async (id) => {
    try {
      const response = await mockApi.get(`/content/${id}`);
      if (response.data.success) {
        // Return mock detailed content
        const baseContent = content.find(c => c._id === id) || content[0];
        return { ...baseContent, content: `Detailed content for ${baseContent?.title}. This would contain the full content body with all details, metadata, and additional information that might not be shown in the list view.` };
      }
    } catch (error) {
      console.error("Error fetching content by ID:", error);
      showToast("Failed to fetch content details", "error");
    }
    return null;
  };

  const createContent = async (contentData) => {
    try {
      setActionLoading(true);
      await mockApi.post("/content", contentData);
      showToast("Content created successfully", "success");
      setCreateModal({ open: false });
      await Promise.all([
        fetchContent(currentPage, searchTerm, statusFilter, typeFilter),
        fetchStats(),
        fetchAnalytics(),
      ]);
    } catch (error) {
      console.error("Error creating content:", error);
      showToast("Failed to create content", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const updateContent = async (id, contentData) => {
    try {
      setActionLoading(true);
      await mockApi.put(`/content/${id}`, contentData);
      showToast("Content updated successfully", "success");
      setEditModal({ open: false, content: null });
      await Promise.all([
        fetchContent(currentPage, searchTerm, statusFilter, typeFilter),
        fetchStats(),
        fetchAnalytics(),
      ]);
    } catch (error) {
      console.error("Error updating content:", error);
      showToast("Failed to update content", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteContent = async (id) => {
    try {
      setActionLoading(true);
      await mockApi.delete(`/content/${id}`);
      showToast("Content deleted successfully", "success");
      setDeleteModal({ open: false, content: null });

      const remainingItems = content.length - 1;
      let targetPage = currentPage;

      if (remainingItems === 0 && currentPage > 1) {
        targetPage = currentPage - 1;
        setCurrentPage(targetPage);
      }

      await Promise.all([
        fetchContent(targetPage, searchTerm, statusFilter, typeFilter),
        fetchStats(),
        fetchAnalytics(),
      ]);
    } catch (error) {
      console.error("Error deleting content:", error);
      showToast("Failed to delete content", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle functions
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

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === "type") {
      setTypeFilter(value);
    } else if (filterType === "status") {
      setStatusFilter(value);
    }
    setCurrentPage(1);
    setIsMobileFiltersOpen(false);
  };

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

  const displayStats = useMemo(() => ({
    totalContent: stats.totalContent || 0,
    published: stats.published || 0,
    pending: stats.pending || 0,
    rejected: stats.rejected || 0,
  }), [stats]);

  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 lg:mb-12"
        >
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Content Management
              </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto sm:mx-0">
              Manage and analyze your digital content with powerful tools and insights
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 lg:mb-12">
          <StatsCard
            title="Total Content"
            value={displayStats.totalContent}
            icon={FileText}
            color="text-green-400"
            delay={0.1}
            loading={loading}
            className="border border-black"
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
            title="Pending Review"
            value={displayStats.pending}
            icon={Clock}
            color="text-yellow-400"
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

        {/* Search and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="space-y-4 sm:space-y-6 mb-6 sm:mb-8"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search content by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 shadow-md border border-black rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all text-base"
            />
          </div>

          {/* Desktop Filters and Actions */}
          <div className="hidden sm:flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="flex flex-1 gap-4">
              <Dropdown
                options={["All Types", "Article", "Video", "Document", "Image"]}
                value={typeFilter}
                onChange={(value) => handleFilterChange("type", value)}
                placeholder="All Types"
                className="flex-1"
              />
              <Dropdown
                options={["All Status", "Published", "Pending", "Rejected", "Draft"]}
                value={statusFilter}
                onChange={(value) => handleFilterChange("status", value)}
                placeholder="All Status"
                className="flex-1"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCreateModal({ open: true })}
              className="bg-green-400 hover:bg-green-500 text-black px-6 py-3 rounded-xl flex items-center space-x-2 transition-all font-semibold shadow-lg whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              <span>Create Content</span>
            </motion.button>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="sm:hidden flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="flex items-center space-x-2 bg-[#1a1a1a] border border-white/10 shadow-md border border-black rounded-xl px-4 py-3 text-white hover:bg-[#1a1a1a] border border-white/10 shadow-md transition-all"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isMobileFiltersOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCreateModal({ open: true })}
              className="bg-green-400 text-black px-4 py-3 rounded-xl flex items-center space-x-2 font-semibold shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Create</span>
            </motion.button>
          </div>

          {/* Mobile Filters */}
          <AnimatePresence>
            {isMobileFiltersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="sm:hidden space-y-3"
              >
                <Dropdown
                  options={["All Types", "Article", "Video", "Document", "Image"]}
                  value={typeFilter}
                  onChange={(value) => handleFilterChange("type", value)}
                  placeholder="All Types"
                />
                <Dropdown
                  options={["All Status", "Published", "Pending", "Rejected", "Draft"]}
                  value={statusFilter}
                  onChange={(value) => handleFilterChange("status", value)}
                  placeholder="All Status"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Content Table/List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-[#1a1a1a] border border-white/10 shadow-md border border-black rounded-2xl overflow-hidden shadow-xl"
        >
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1a1a1a] border border-white/10 shadow-md">
                <tr>
                  {[
                    "ID",
                    "Title",
                    "Type",
                    "Created By",
                    "Status",
                    "Created On",
                    "Actions"
                  ].map((header) => (
                    <th
                      key={header}
                      className="p-3 text-left text-gray-300 font-bold text-sm uppercase tracking-wider border-b border-black"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <Loader className="w-8 h-8 animate-spin text-green-400" />
                        <p className="text-gray-400 font-medium">Loading your content...</p>
                      </div>
                    </td>
                  </tr>
                ) : content.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <FileText className="w-12 h-12 text-gray-500" />
                        <div>
                          <p className="text-gray-400 font-medium text-lg mb-2">No content found</p>
                          <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                        </div>
                      </div>
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

          {/* Mobile List */}
          <div className="lg:hidden p-4 space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader className="w-8 h-8 animate-spin text-green-400" />
                <p className="text-gray-400 font-medium">Loading your content...</p>
              </div>
            ) : content.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <FileText className="w-12 h-12 text-gray-500" />
                <div className="text-center">
                  <p className="text-gray-400 font-medium text-lg mb-2">No content found</p>
                  <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                </div>
              </div>
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
          </div>

          {/* Pagination */}
          {!loading && content.length > 0 && (
            <div className="border-t border-black bg-[#1a1a1a] border border-white/10 shadow-md">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                loading={loading}
              />
            </div>
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
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 sm:p-6 bg-red-900/20 border border-red-500/30 rounded-xl">
                <div className="p-2 bg-red-500/20 rounded-lg flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg mb-2">Confirm Deletion</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Are you sure you want to delete <strong>"{deleteModal.content.title}"</strong>? 
                    This action cannot be undone and will permanently remove all associated data.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                <button
                  onClick={() => setDeleteModal({ open: false, content: null })}
                  className="px-6 py-3 border border-black text-gray-300 rounded-xl hover:bg-gray-800 hover:text-white transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteContent(deleteModal.content._id)}
                  disabled={actionLoading}
                  className="px-6 py-3 bg-red-400 text-black rounded-xl hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all font-medium"
                >
                  {actionLoading && <Loader className="w-4 h-4 animate-spin" />}
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Content</span>
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Toast Notifications */}
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