// File: /src/components/Sidebar.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChart3,
  Users,
  FileText,
  Activity,
  Settings,
  Database,
  Menu,
  X,
} from "lucide-react";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtil";
import { BASE_URL } from "../../utils/constant";
import axios from "axios";

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isOpen) {
        const sidebar = document.getElementById('sidebar');
        const menuButton = document.getElementById('menu-button');
        
        if (sidebar && !sidebar.contains(event.target) && 
            menuButton && !menuButton.contains(event.target)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isOpen]);

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      // Close mobile menu when switching to desktop
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      showSuccessToast("Logout successfully!");
      navigate("/login");
    } catch (error) {
      console.log("failed to logout" + error);
      showErrorToast("Failed to Logout! Try again!");
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      icon: BarChart3,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    { id: "users", icon: Users, label: "Users", path: "/admin/users" },
    { id: "content", icon: FileText, label: "Content", path: "/admin/content" },
    {
      id: "analytics",
      icon: Activity,
      label: "Analytics",
      path: "/admin/analytics",
    },
    { 
      id: "system-logs", 
      icon: Database, 
      label: "System Logs", 
      path: "/admin/system-logs" 
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      path: "/admin/settings",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
<<<<<<< HEAD
    // Close mobile menu after navigation
    if (isMobile) {
      setIsMobileMenuOpen(false);
=======
    if (isMobile) {
      setIsOpen(false);
>>>>>>> b4251fc (made it responsive)
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

<<<<<<< HEAD
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
=======
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
>>>>>>> b4251fc (made it responsive)
  };

  return (
    <>
<<<<<<< HEAD
      {/* Mobile Header with Menu Toggle */}
      {isMobile && (
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1a1a1a] border-b border-white/10 flex items-center px-4 z-50">
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-3 ml-4">
            <div className="w-8 h-8 bg-[#e3dddc] rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-black" />
            </div>
            <span className="text-white text-xl font-bold">AdminCore</span>
          </div>
        </div>
      )}

      {/* Mobile Backdrop */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        bg-[#1a1a1a] border-r border-white/10 z-40 flex flex-col
        ${isMobile 
          ? `fixed top-16 left-0 bottom-0 w-72 transform transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`
          : 'fixed top-0 left-0 h-screen w-64'
        }
      `}>
        {/* Desktop Logo */}
        {!isMobile && (
          <div className="p-6 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#e3dddc] rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-black" />
              </div>
              <span className="text-white text-xl font-bold">AdminCore</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
=======
      
      {/* Mobile Menu Button - ONLY for mobile screens */}
      {isMobile && (
        <button
          id="menu-button"
          onClick={toggleSidebar}
          className="fixed top-4 right-4 z-50 p-2.5 bg-[#1a1a1a] text-white rounded-lg border border-white/10 shadow-lg"
          aria-label="Toggle menu"
          style={{ zIndex: 9999 }}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}

      {/* Mobile Overlay - ONLY for mobile when sidebar is open */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30" />
      )}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`
          w-64 h-screen bg-[#1a1a1a] border-r border-white/10 flex flex-col
          ${isMobile 
            ? `fixed left-0 top-0 z-40 transform transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : 'fixed left-0 top-0 z-30'
          }
        `}
      >
        {/* Logo */}
        <div className="flex-shrink-0 px-4 py-4 sm:p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#e3dddc] rounded-lg flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
            </div>
            <span className="text-white text-lg sm:text-xl font-bold truncate">AdminCore</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1 sm:space-y-2">
>>>>>>> b4251fc (made it responsive)
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.path);
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
<<<<<<< HEAD
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg text-left 
                  transition-all duration-200 group
                  ${isActive
                    ? "bg-white/10 text-white border border-white/20"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                <span className="font-medium">{item.label}</span>
=======
                className={`w-full flex items-center gap-3 p-2.5 sm:p-3 rounded-lg text-left transition-all duration-200 group ${
                  isActive
                    ? "border border-gray-300 text-white bg-white/5"
                    : "text-gray-400 hover:text-white hover:bg-white/5 hover:border hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base truncate">{item.label}</span>
>>>>>>> b4251fc (made it responsive)
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
<<<<<<< HEAD
        <div className="p-4 border-t border-white/10 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 text-red-400 hover:bg-red-500/10 hover:text-red-300 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 flex-shrink-0"
=======
        <div className="flex-shrink-0 p-3 sm:p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-2.5 sm:p-3 rounded-lg text-left transition-all duration-200 text-red-500 hover:bg-red-500/10 hover:text-red-400 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
>>>>>>> b4251fc (made it responsive)
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
<<<<<<< HEAD
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 002 2h4a2 2 0 002-2v-1m-8 0v-1a2 2 0 00-2-2H3a2 2 0 00-2-2v1"
              />
            </svg>
            <span className="font-medium">Logout</span>
=======
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 002 2h4a2 2 0 002-2v1m-8 0v-1a2 2 0 00-2-2H3a2 2 0 00-2 2v1"
              />
            </svg>
            <span className="font-medium text-sm sm:text-base truncate">Logout</span>
>>>>>>> b4251fc (made it responsive)
          </button>
        </div>
      </div>
    </>
  );
};

// Export a hook to get the correct classes for your main content wrapper
export const useSidebarLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return {
    sidebarClasses: isMobile ? 'pt-16' : 'ml-64',
    isMobile
  };
};

export default Sidebar;