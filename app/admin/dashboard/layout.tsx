'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout, _hasHydrated, setHasHydrated } = useAuthStore();
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (useAuthStore.persist?.hasHydrated()) {
      setHasHydrated(true);
    }
  }, [setHasHydrated]);

  useEffect(() => {
    if (isMounted && _hasHydrated) {
      if (!isAuthenticated) {
        router.push('/');
      }
    }
  }, [isAuthenticated, _hasHydrated, isMounted, router]);

  // Prevent premature redirect or UI flash while session is rehydrating on reload
  if (!isMounted || !_hasHydrated) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.info('You have logged out successfully');
    router.push('/');
  };

  const getPageTitle = () => {
    if (pathname.includes('/users')) {
      return 'User Management';
    }
    if (pathname.includes('/products')) {
      return 'Product Catalog';
    }
    return 'Dashboard Overview';
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 flex">
      {/* Sidebar Component */}
      <AdminSidebar
        isOpenMobile={isOpenMobileSidebar}
        setIsOpenMobile={setIsOpenMobileSidebar}
      />

      {/* Right Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Component */}
        <AdminHeader
          user={user}
          activeTabTitle={getPageTitle()}
          onLogout={handleLogout}
          onOpenMobileSidebar={() => setIsOpenMobileSidebar(true)}
        />

        {/* Dynamic Sub-page Body Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
