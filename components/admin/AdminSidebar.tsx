"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  X,
  ArrowDownRight,
} from "lucide-react";

interface AdminSidebarProps {
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpenMobile,
  setIsOpenMobile,
}) => {
  const pathname = usePathname();

  const navItems: {
    href: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[] = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/dashboard/users",
      label: "User Management",
      icon: Users,
      badge: "142",
    },
    {
      href: "/admin/dashboard/products",
      label: "Product",
      icon: Package,
      badge: "38",
    },
    {
      href: "/admin/dashboard/withdrawals",
      label: "Withdraw Management",
      icon: ArrowDownRight,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 border-r border-slate-800/80 shadow-2xl">
      {/* Brand Header */}
      <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-serif-luxury font-black text-xl shadow-lg shadow-amber-500/20">
            C
          </div>
          <div>
            <span className="font-serif-luxury text-base font-bold tracking-wider text-white block leading-tight">
              HNI Corporation
            </span>
            <span className="text-[10px] text-amber-400 font-medium tracking-widest uppercase flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Admin Portal
            </span>
          </div>
        </div>

        {/* Close button for mobile */}
        <button
          onClick={() => setIsOpenMobile(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation Menu */}
      <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Main Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin/dashboard"
              ? pathname === "/admin/dashboard" || pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpenMobile(false)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer group ${
                isActive
                  ? "bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-300 border border-amber-500/30 shadow-sm"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30"
                      : "bg-slate-900 text-slate-400 group-hover:text-white group-hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-medium">{item.label}</span>
              </div>

              <div className="flex items-center gap-2">
                {isActive && (
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer link to public site */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <Link
          href="/"
          className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-all border border-slate-800"
        >
          <div className="flex items-center gap-2.5">
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Return to Storefront</span>
          </div>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpenMobile(false)}
          />
          <div className="relative w-72 max-w-full h-full z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
