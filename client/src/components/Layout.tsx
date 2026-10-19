import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Derive title from current path
  const getPageTitle = (pathname: string): string => {
    if (pathname.includes('/admin/dashboard')) return 'Administrative Overview';
    if (pathname.includes('/admin/complaints')) return 'Complaint Management Hub';
    if (pathname.includes('/admin/departments')) return 'Campus Departments';
    if (pathname.includes('/admin/analytics')) return 'Analytics & Operational Reports';
    if (pathname.includes('/dashboard')) return 'Student Portal Dashboard';
    if (pathname.includes('/submit')) return 'Lodge a Campus Complaint';
    if (pathname.includes('/my-complaints')) return 'My Registered Complaints';
    if (pathname.includes('/notifications')) return 'Notification Center';
    if (pathname.includes('/profile')) return 'User Account Profile';
    if (pathname.includes('/complaint/')) return 'Complaint Ticket Investigation';
    return 'Campus Connect';
  };

  const title = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Navbar setMobileOpen={setMobileOpen} title={title} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200/80 bg-white/50 py-4 px-6 text-center text-xs text-slate-500">
          <p>
            Campus Connect © {new Date().getFullYear()} — University Campus Issue & Facility Complaint Resolution System.
          </p>
        </footer>
      </div>
    </div>
  );
};
