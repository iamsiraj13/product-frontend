'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  Package,
  TrendingUp,
  DollarSign,
  Plus,
  ArrowUpRight,
  Building2,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();

  // Sample users for Recent Activity Highlights
  const sampleUsers = [
    {
      id: user?.id || '9f1d873d-8d52-4824-8fb7-05c935b6ab3f',
      username: user?.username || 'Rahim',
      email: user?.email || 'rahim@gmail.com',
      role: user?.role || 'ADMIN',
    },
    {
      id: 'a12e3456-7890-4abc-9def-1234567890ab',
      username: 'Victoria_Agent',
      email: 'victoria@luxuryrealestate.com',
      role: 'AGENT',
    },
    {
      id: 'b98f7654-3210-4cba-8fed-0987654321ba',
      username: 'System_Admin',
      email: 'admin@crateandbarrel.com',
      role: 'ADMIN',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-100/50 via-amber-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Administrative Overview</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900">
            Welcome back, {user?.username || 'Rahim'}!
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Logged in as <span className="font-semibold text-slate-900">{user?.email || 'rahim@gmail.com'}</span> with role{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-950 text-amber-300 border border-slate-800">
              {user?.role || 'ADMIN'}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/dashboard/users"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Invite Agent</span>
          </Link>
          <Link
            href="/admin/dashboard/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            <Package className="w-4 h-4 text-slate-600" />
            <span>Manage Products</span>
          </Link>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Balance Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Account Balance
            </span>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-bold font-mono text-slate-900">
            ${user?.balance !== undefined ? user.balance : '0.00'}
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Type: {user?.accountType || 'MAIN'}</span>
          </div>
        </div>

        {/* Total Active Agents */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Agents
            </span>
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-bold font-mono text-slate-900">142</h3>
          <div className="mt-3 flex items-center gap-1 text-xs text-indigo-600 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12 agents this week</span>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Products Inventory
            </span>
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-bold font-mono text-slate-900">38</h3>
          <div className="mt-3 flex items-center gap-1 text-xs text-amber-600 font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>24 catalog items in stock</span>
          </div>
        </div>

        {/* Invitation Code */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Invitation Code
            </span>
            <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-mono text-slate-900 uppercase">
            {user?.invitationCode || 'L2J3Z6Z'}
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-sky-600 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Status: Verified Admin</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Quick Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-serif-luxury font-bold text-slate-900">
              Recent Activity Highlights
            </h3>
            <p className="text-xs text-slate-500">Live platform operations</p>
          </div>
          <Link
            href="/admin/dashboard/users"
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            <span>View all users</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {sampleUsers.map((u) => (
            <div key={u.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                  {u.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">{u.username}</p>
                  <p className="text-[10px] text-slate-500">{u.email}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 uppercase">
                {u.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
