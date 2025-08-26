import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar, { useSidebarLayout } from "../components/ui/Sidebar";

const AdminLayout = () => {
  const { sidebarClasses, isMobile } = useSidebarLayout();

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Sidebar />
      
      <main className={`transition-all duration-300 ${sidebarClasses}`}>
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
