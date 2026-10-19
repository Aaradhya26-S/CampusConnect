import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Bell,
  User as UserIcon,
  LogOut,
  Building2,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isStudent = user?.role === 'STUDENT';

  interface NavItem {
    to: string;
    label: string;
    icon: any;
    highlight?: boolean;
    badge?: number;
  }

  const studentLinks: NavItem[] = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/submit', label: 'Submit Complaint', icon: PlusCircle, highlight: true },
    { to: '/my-complaints', label: 'My Complaints', icon: FileText },
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { to: '/profile', label: 'Student Profile', icon: UserIcon },
  ];

  const adminLinks: NavItem[] = [
    { to: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { to: '/admin/complaints', label: 'Complaint Queue', icon: FileText },
    { to: '/admin/departments', label: 'Departments', icon: Building2 },
    { to: '/admin/analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { to: '/profile', label: 'Admin Profile', icon: UserIcon },
  ];

  const links: NavItem[] = isStudent ? studentLinks : adminLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-navy-950 text-white transition-all duration-300 ease-in-out border-r border-navy-800 ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-navy-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white shadow-md shadow-teal-500/20">
              <GraduationCap className="h-6 w-6 stroke-[2.2]" />
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <span className="text-base font-extrabold tracking-tight text-white block">
                  Campus <span className="text-teal-400">Connect</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  {isStudent ? 'Student Portal' : 'Admin Operations'}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg bg-navy-900 text-slate-400 hover:text-white hover:bg-navy-800 transition"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Role Badge in Sidebar */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-navy-900/60 bg-navy-900/40">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Logged in as</span>
              <span
                className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase tracking-wider ${
                  isStudent
                    ? 'bg-teal-950 text-teal-300 border border-teal-800'
                    : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                }`}
              >
                {user?.role}
              </span>
            </div>
            {isStudent && user?.studentId && (
              <p className="mt-1 text-[11px] text-slate-300 font-mono">
                ID: <span className="text-teal-300 font-semibold">{user.studentId}</span>
              </p>
            )}
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-300 shadow-sm'
                      : 'text-slate-300 hover:bg-navy-900 hover:text-white'
                  } ${link.highlight && !collapsed ? 'border border-teal-500/30' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Indicator Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-teal-400" />
                    )}

                    <Icon
                      className={`h-5 w-5 shrink-0 transition-colors ${
                        isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />

                    {!collapsed && (
                      <span className="truncate flex-1">{link.label}</span>
                    )}

                    {/* Unread notification count badge */}
                    {link.badge !== undefined && link.badge > 0 && (
                      <span
                        className={`flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm ${
                          collapsed ? 'absolute top-1 right-2' : ''
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Quick Logout Footer */}
        <div className="p-3 border-t border-navy-800/80 bg-navy-950">
          <div
            className={`flex items-center gap-3 rounded-xl p-2 bg-navy-900/60 ${
              collapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-800 border border-teal-500/30 text-teal-300 font-bold text-xs uppercase">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              {!collapsed && (
                <div className="overflow-hidden leading-tight">
                  <p className="truncate text-xs font-semibold text-white">{user?.fullName}</p>
                  <p className="truncate text-[10px] text-slate-400">{user?.email}</p>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-navy-800 hover:text-rose-400 transition shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
