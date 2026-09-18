'use client';

import React from 'react';
import { Menu, Bell, LogOut, Search, User as UserIcon } from 'lucide-react';
import { User } from '@/types/auth';

interface AdminHeaderProps {
  user: User | null;
  activeTabTitle: string;
  onLogout: () => void;
  onOpenMobileSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  user,
  activeTabTitle,
  onLogout,
  onOpenMobileSidebar,
}) => {
  // Avatar image URL: use user provided image if available, else a beautiful high quality sample profile avatar
  const avatarImageUrl =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250';

  return (
    <header className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left Section: Mobile toggle & Page Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-bold font-serif-luxury tracking-wide text-white capitalize">
              {activeTabTitle}
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Manage and oversee your system operations
            </p>
          </div>
        </div>

        {/* Center Section: Search Bar (Desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50 transition-colors"
            />
          </div>
        </div>

        {/* Right Section: User Image, User Name, Notifications & Logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Notification Button */}
          <button
            className="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-700/50 cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-900" />
          </button>

          {/* User Profile Info (User Image & Name) */}
          <div className="flex items-center gap-3 bg-slate-950/80 px-3 py-1.5 rounded-full border border-slate-800 shadow-inner">
            {/* User Image */}
            <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-amber-400/80 shadow-md shrink-0 bg-slate-800">
              <img
                src={avatarImageUrl}
                alt={user?.username || 'User Profile'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="hidden w-full h-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center">
                {user?.username ? user.username.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
            </div>

            {/* User Name & Role */}
            <div className="text-left pr-1">
              <p className="font-semibold text-xs text-white leading-tight truncate max-w-[110px] sm:max-w-[140px]">
                {user?.username || 'Rahim'}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-amber-300 font-mono font-bold uppercase tracking-wider">
                  {user?.role || 'ADMIN'}
                </span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Logout"
            className="p-2.5 sm:px-3.5 sm:py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/50 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
