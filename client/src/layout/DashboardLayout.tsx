import React, { useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Users, LogOut, Sun, Moon, Menu, X, ShieldAlert } from "lucide-react";

export const DashboardLayout: React.FC = () => {
  const { user, logoutSession } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] =
    useState<boolean>(false);

  const navigate = useNavigate();
  const currentLocation = useLocation();

  const handleLogoutAction = () => {
    logoutSession();
    navigate("/login");
  };

  const navMenuItems = [
    // clearance uses role string values rather than the type-only UserRole
    {
      name: "Leads Explorer",
      path: "/",
      icon: Users,
      clearance: ["ADMIN", "SALES"],
    },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 1. Persisted Workspace Desktop Sidebar Menu */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <Link
            to="/"
            className="text-xl font-black tracking-tight text-indigo-600 dark:text-indigo-400 flex items-center gap-2"
          >
            <span className="p-1.5 bg-indigo-600 text-white rounded-md">
              LS
            </span>{" "}
            Leadsync
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navMenuItems.map((item) => {
            const isActive = currentLocation.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footbar User Identity Badge */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <span className="text-[10px] px-2 py-0.5 font-bold uppercase rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                {user?.role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogoutAction}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg font-medium transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* 2. Primary App Body Content Control Grid */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar Header Component */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 z-10">
          <button
            onClick={() => setIsSidebarMobileOpen(true)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:block text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Workspace Engine Node Active
          </div>

          <div className="flex items-center gap-2">
            {/* Global Dark Mode Action Button Controller */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              title="Toggle application style layout color grid"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </header>

        {/* Dynamic Nested Route Rendering Gateway Viewport */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* 3. Responsive Drawer Menu Sheet for Mobile Screens */}
      {isSidebarMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Drawer Mask Overlay backdrop filter */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsSidebarMobileOpen(false)}
          />

          <div className="relative flex flex-col w-full max-w-xs bg-white dark:bg-slate-900 h-full p-4 border-r dark:border-slate-800 animate-slide-in">
            <div className="flex items-center justify-between pb-4 border-b dark:border-slate-800 mb-4">
              <span className="text-lg font-black tracking-tight text-indigo-600 dark:text-indigo-400">
                Leadsync Mobile
              </span>
              <button
                onClick={() => setIsSidebarMobileOpen(false)}
                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {navMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <item.icon className="w-4 h-4" /> {item.name}
                </Link>
              ))}
            </nav>

            <button
              onClick={handleLogoutAction}
              className="mt-auto w-full flex items-center justify-center gap-3 py-3 text-sm font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-700 shadow-xs"
            >
              <LogOut className="w-4 h-4" /> Complete Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
