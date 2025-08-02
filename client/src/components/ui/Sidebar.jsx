import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Activity, 
  Settings, 
  Database
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard', path: '/admin/dashboard' },
    { id: 'users', icon: Users, label: 'Users', path: '/admin/users' },
    { id: 'content', icon: FileText, label: 'Content', path: '/admin/content' },
    { id: 'analytics', icon: Activity, label: 'Analytics', path: '/admin/analytics' },
    { id: 'logs', icon: Database, label: 'System Logs', path: '/admin/logs' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/admin/settings' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 h-screen bg-[#1a1a1a] fixed left-0 top-0 border-r border-white/10">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[#00FFFF] to-[#39FF14] rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-black" />
          </div>
          <span className="text-white text-xl font-bold">AdminCore</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.path);
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-[#00FFFF]/20 to-[#39FF14]/20 text-[#00FFFF] border border-[#00FFFF]/30' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      {/* Logout Button */}
<div className="px-4 mt-4">
  <button
    onClick={async () => {
      try {
        const token = localStorage.getItem('token');
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        // Clear storage and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } catch (err) {
        console.error("Logout failed:", err);
      }
    }}
    className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 text-red-500 hover:bg-red-500/10"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 002 2h4a2 2 0 002-2v-1m-8 0v-1a2 2 0 00-2-2H3a2 2 0 00-2 2v1" />
    </svg>
    <span className="font-medium">Logout</span>
  </button>
</div>

    </div>
  );
};

export default Sidebar;