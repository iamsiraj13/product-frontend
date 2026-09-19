'use client';

import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2, RefreshCw, AlertCircle, Loader2, MoreVertical, ArrowUpDown } from 'lucide-react';
import { useGetAdminUsers } from '@/hooks/useGetAdminUsers';
import { CreateUserModal } from '@/components/admin/CreateUserModal';
import { EditUserModal } from '@/components/admin/EditUserModal';
import { DeleteUserModal } from '@/components/admin/DeleteUserModal';
import { ModifyBalanceModal } from '@/components/admin/ModifyBalanceModal';
import { AdminUser } from '@/types/adminUser';

// Format date helper
const formatDate = (dateStr?: string): string => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
  } catch {
    return dateStr;
  }
};

export default function AdminUsersPage() {
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [modifyingBalanceUser, setModifyingBalanceUser] = useState<AdminUser | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useGetAdminUsers({ page: 1, limit: 50 });
  const usersList = data?.users || [];

  const filteredUsers = usersList.filter((u) => {
    const query = userSearchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (u.username && u.username.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      (u.phone && u.phone.toLowerCase().includes(query)) ||
      (u.invitationCode && u.invitationCode.toLowerCase().includes(query));
    const matchesRole = roleFilter === 'ALL' || u.role.toUpperCase() === roleFilter.toUpperCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-serif-luxury text-slate-900">
              User Management Directory
            </h2>
            {isFetching && !isLoading && (
              <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
            )}
          </div>
          <p className="text-xs text-slate-500">
            View, search, and filter registered users, agents, and administrators
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => refetch()}
            className="p-2.5 text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-sm transition-all cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-amber-500' : ''}`} />
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add Agent</span>
          </button>
        </div>
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
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`} className="animate-pulse">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
                        <div className="space-y-1.5 flex-1">
                          <div className="h-3.5 bg-slate-200 rounded-md w-28" />
                          <div className="h-2.5 bg-slate-100 rounded-md w-36" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-5 bg-slate-200 rounded-full w-16" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-slate-200 rounded-md w-20" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-slate-200 rounded-md w-14" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-3.5 bg-slate-100 rounded-md w-24" />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-7 h-7 bg-slate-100 rounded-lg" />
                        <div className="w-7 h-7 bg-slate-100 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                      <AlertCircle className="w-6 h-6 text-rose-500" />
                      <p className="text-xs font-semibold text-slate-700">Failed to load user list</p>
                      <button
                        onClick={() => refetch()}
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                        <span>Retry</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-medium">
                    No users found matching your query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {u.username ? u.username.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{u.username}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${u.role === 'ADMIN'
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
                      {u.invitationCode || 'N/A'}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-900 font-semibold">
                      ${u.balance ?? '0'}
                    </td>
                    <td className="py-4 px-6 text-slate-500">{formatDate(u.createdAt)}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingUser(u)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Edit user"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingUser(u)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        {/* 3-dot Dropdown */}
                        <div className="relative inline-block text-left">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(openDropdownId === u.id ? null : u.id);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="More actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openDropdownId === u.id && (
                            <>
                              <div
                                className="fixed inset-0 z-20"
                                onClick={() => setOpenDropdownId(null)}
                              />
                              <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                                <button
                                  onClick={() => {
                                    setModifyingBalanceUser(u);
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-amber-900 hover:bg-amber-50 flex items-center gap-2 transition-colors cursor-pointer"
                                >
                                  <ArrowUpDown className="w-3.5 h-3.5 text-amber-600" />
                                  <span>up and down</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
      />

      {/* Delete User Modal */}
      <DeleteUserModal
        isOpen={!!deletingUser}
        user={deletingUser}
        onClose={() => setDeletingUser(null)}
      />

      {/* Modify Balance Modal */}
      <ModifyBalanceModal
        isOpen={!!modifyingBalanceUser}
        user={modifyingBalanceUser}
        onClose={() => setModifyingBalanceUser(null)}
      />
    </div>
  );
}



