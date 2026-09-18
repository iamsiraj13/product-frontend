'use client';

import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminUsersPage() {
  const { user } = useAuthStore();
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Sample data for Users
  const sampleUsers = [
    {
      id: user?.id || '9f1d873d-8d52-4824-8fb7-05c935b6ab3f',
      username: user?.username || 'Rahim',
      email: user?.email || 'rahim@gmail.com',
      phone: user?.phone || '01796762456',
      role: user?.role || 'ADMIN',
      accountType: user?.accountType || 'MAIN',
      balance: user?.balance || '0',
      invitationCode: user?.invitationCode || 'L2J3Z6Z',
      status: 'Active',
      joined: '2026-09-17',
    },
    {
      id: 'a12e3456-7890-4abc-9def-1234567890ab',
      username: 'Victoria_Agent',
      email: 'victoria@luxuryrealestate.com',
      phone: '+1 415 890 1234',
      role: 'AGENT',
      accountType: 'PREMIUM',
      balance: '15400',
      invitationCode: 'VIC889',
      status: 'Active',
      joined: '2026-08-12',
    },
    {
      id: 'b98f7654-3210-4cba-8fed-0987654321ba',
      username: 'System_Admin',
      email: 'admin@crateandbarrel.com',
      phone: '+1 800 555 0199',
      role: 'ADMIN',
      accountType: 'SYSTEM',
      balance: '500000',
      invitationCode: 'SYSADMIN',
      status: 'Active',
      joined: '2026-01-01',
    },
    {
      id: 'c34d5678-9012-4def-8abc-2345678901cd',
      username: 'Sarah_Client',
      email: 'sarah.m@gmail.com',
      phone: '+1 212 444 8811',
      role: 'USER',
      accountType: 'MAIN',
      balance: '0',
      invitationCode: 'USR102',
      status: 'Active',
      joined: '2026-09-02',
    },
    {
      id: 'd56e7890-1234-4abc-9def-3456789012de',
      username: 'David_Broker',
      email: 'david@bayproperties.com',
      phone: '+1 312 998 7766',
      role: 'AGENT',
      accountType: 'MAIN',
      balance: '3200',
      invitationCode: 'BAY551',
      status: 'Pending',
      joined: '2026-09-15',
    },
  ];

  const filteredUsers = sampleUsers.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.invitationCode.toLowerCase().includes(userSearchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role.toUpperCase() === roleFilter.toUpperCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif-luxury text-slate-900">
            User Management Directory
          </h2>
          <p className="text-xs text-slate-500">
            View, search, and filter registered users, agents, and administrators
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer self-start sm:self-auto">
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Create User</span>
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
            placeholder="Search by name, email, or invitation code..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Filter className="w-4 h-4 text-amber-600" />
            <span>Role Filter:</span>
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="AGENT">AGENT</option>
            <option value="USER">USER</option>
          </select>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
              <tr>
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Invitation Code</th>
                <th className="py-4 px-6">Balance</th>
                <th className="py-4 px-6">Joined Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center">
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{u.username}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                        u.role === 'ADMIN'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : u.role === 'AGENT'
                          ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono font-semibold text-slate-800">
                    {u.invitationCode}
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-900 font-semibold">
                    ${u.balance}
                  </td>
                  <td className="py-4 px-6 text-slate-500">{u.joined}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
