"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User as UserIcon, LayoutDashboard, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

interface NavbarProps {
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin }) => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const roleUpper = (user?.role || "USER").toUpperCase();
  const dashboardHref =
    roleUpper === "ADMIN" || roleUpper === "AGENT"
      ? "/admin/dashboard"
      : "/dashboard";

  const handleLogout = () => {
    logout();
    toast.info("Signed out successfully");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="px-2.5 py-1 bg-black text-white font-serif-luxury font-bold text-lg md:text-xl tracking-wider">
            HNI Corporation
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-sm"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard ({user.username})</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-rose-600 transition-colors rounded-xl hover:bg-rose-50"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold uppercase tracking-wider rounded-sm transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
