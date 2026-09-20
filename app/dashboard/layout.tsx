"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Zap,
  History as HistoryIcon,
  LogOut,
  User as UserIcon,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, _hasHydrated, setHasHydrated } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (useAuthStore.persist?.hasHydrated()) {
      setHasHydrated(true);
    }
  }, [setHasHydrated]);

  useEffect(() => {
    if (isMounted && _hasHydrated) {
      if (!isAuthenticated) {
        router.push("/");
      }
    }
  }, [isAuthenticated, _hasHydrated, isMounted, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (!isMounted || !_hasHydrated) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-500 font-medium">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
    router.push("/");
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      exact: true,
    },
    {
      name: "Data Optimization",
      href: "/dashboard/data-optimization",
      icon: Zap,
      exact: false,
    },
    {
      name: "History",
      href: "/dashboard/history",
      icon: HistoryIcon,
      exact: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans antialiased text-gray-900">
      {/* Top Header Bar */}
      <header className="bg-[#111111] text-white h-14 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs border-b border-gray-800">
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-md md:hidden hover:bg-gray-800 text-gray-300 hover:text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-700"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Logo Icon Box */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <span className="font-serif font-bold text-sm tracking-widest text-white uppercase">
              HNI Corporation
            </span>
          </Link>
        </div>

        {/* User profile & actions */}
        <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-300">
          <span className="font-medium text-gray-200">
            {user?.username || "sirajul"}
          </span>
          <div className="p-1 rounded-full hover:bg-gray-800 transition-colors cursor-pointer">
            <UserIcon className="w-4 h-4 text-gray-300" />
          </div>
          <button
            onClick={handleLogout}
            className="p-1 rounded-full hover:bg-gray-800 hover:text-white transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="flex flex-1 relative">
        {/* Mobile Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Left Sidebar */}
        <aside
          className={`fixed top-14 bottom-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-200 ease-in-out md:static md:top-auto md:z-auto md:w-60 md:min-h-[calc(100vh-3.5rem)] md:translate-x-0 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="flex-1 divide-y divide-gray-100 overflow-y-auto">
            <div className="py-1">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 text-xs sm:text-sm font-medium transition-colors border-b border-gray-100 ${
                      isActive
                        ? "text-gray-900 bg-gray-50/80 font-semibold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${isActive ? "text-black" : "text-gray-500"}`}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer text-left border-b border-gray-100"
              >
                <LogOut className="w-4 h-4 text-gray-500" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Floating Bottom-Right Chat Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button className="bg-[#3b4754] hover:bg-[#2d3742] text-white px-3.5 py-2 rounded-md shadow-lg flex items-center gap-2 text-xs font-semibold cursor-pointer transition-all">
          <MessageSquare className="w-4 h-4 fill-white/20" />
          <span>C&B</span>
        </button>
      </div>
    </div>
  );
}
