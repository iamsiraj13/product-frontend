'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Coins,
  Edit3,
} from 'lucide-react';
import { useGetAdminWithdrawals } from '@/hooks/useGetAdminWithdrawals';
import { AdminWithdrawalItem } from '@/types/adminWithdrawal';
import { UpdateWithdrawalStatusModal } from '@/components/admin/UpdateWithdrawalStatusModal';
import { toast } from 'sonner';

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
          hour: '2-digit',
          minute: '2-digit',
        });
  } catch {
    return dateStr;
  }
};

// Format currency helper
const formatCurrency = (val?: string | number): string => {
  if (val === undefined || val === null || val === '') return '$0.00';
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num)) return `$${val}`;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
};

export default function AdminWithdrawalsPage() {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [updatingWithdrawal, setUpdatingWithdrawal] =
    useState<AdminWithdrawalItem | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useGetAdminWithdrawals({
    page,
    limit,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  });

  const withdrawalsList: AdminWithdrawalItem[] = data?.withdrawals || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  // Client-side search filtering
  const filteredWithdrawals = withdrawalsList.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    const usernameMatch = item.user?.username?.toLowerCase().includes(q);
    const emailMatch = item.user?.email?.toLowerCase().includes(q);
    const phoneMatch = item.user?.phone?.toLowerCase().includes(q);
    const addressMatch = item.walletAddress?.toLowerCase().includes(q);
    const networkMatch = item.network?.toLowerCase().includes(q);
    const statusMatch = item.status?.toLowerCase().includes(q);

    return (
      usernameMatch ||
      emailMatch ||
      phoneMatch ||
      addressMatch ||
      networkMatch ||
      statusMatch
    );
  });

  const handleCopyAddress = (id: string, address: string) => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    toast.success('Wallet address copied to clipboard');
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Calculate summary stats
  const pendingCount = withdrawalsList.filter((w) => w.status === 'PENDING').length;
  const approvedCount = withdrawalsList.filter((w) => w.status === 'APPROVED').length;
  const totalAmount = withdrawalsList.reduce((acc, curr) => {
    const num = typeof curr.amount === 'number' ? curr.amount : parseFloat(curr.amount || '0');
    return acc + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Refresh Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-serif-luxury text-slate-900 flex items-center gap-2">
              <ArrowDownRight className="w-5 h-5 text-amber-500" />
              Withdrawal Management
            </h2>
            {isFetching && !isLoading && (
              <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
            )}
          </div>
          <p className="text-xs text-slate-500">
            Monitor, inspect, and track user withdrawal requests and transaction records
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            title="Refresh withdrawals"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-amber-600 ${
                isFetching ? 'animate-spin' : ''
              }`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Requests
            </p>
            <p className="text-2xl font-bold font-serif-luxury text-slate-900 mt-1">
              {meta.total}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-md">
            <Coins className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">
              Pending Action
            </p>
            <p className="text-2xl font-bold font-serif-luxury text-slate-900 mt-1">
              {pendingCount}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
            <Clock className="w-5.5 h-5.5 animate-pulse" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
              Approved
            </p>
            <p className="text-2xl font-bold font-serif-luxury text-slate-900 mt-1">
              {approvedCount}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Page Total Value
            </p>
            <p className="text-xl font-bold font-serif-luxury text-slate-900 mt-1">
              {formatCurrency(totalAmount)}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Wallet className="w-5.5 h-5.5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user, email, wallet address, or network..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Filter className="w-4 h-4 text-amber-600" />
            <span>Status:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
              <tr>
                <th className="py-4 px-6">User Details</th>
                <th className="py-4 px-6">Network</th>
                <th className="py-4 px-6">Wallet Address</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Created At</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                // Smooth Skeleton Loader Rows
                Array.from({ length: 6 }).map((_, idx) => (
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
                      <div className="h-4 bg-slate-200 rounded-md w-32" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-slate-200 rounded-md w-16" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-5 bg-slate-200 rounded-full w-20" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-3.5 bg-slate-100 rounded-md w-28" />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end">
                        <div className="w-24 h-7 bg-slate-200 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                      <AlertCircle className="w-8 h-8 text-rose-500" />
                      <p className="text-sm font-semibold text-slate-800">
                        Failed to load withdrawal requests
                      </p>
                      <p className="text-xs text-slate-500">
                        Please check your network connection or authentication credentials.
                      </p>
                      <button
                        onClick={() => refetch()}
                        className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                        <span>Retry Loading</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredWithdrawals.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-14 text-center text-slate-400 text-xs font-medium"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Coins className="w-8 h-8 text-slate-300" />
                      <p>No withdrawal records found matching your query.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredWithdrawals.map((item) => {
                  const statusUpper = item.status?.toUpperCase();
                  const isPending = statusUpper === 'PENDING';
                  const isApproved = statusUpper === 'APPROVED';
                  const isRejected = statusUpper === 'REJECTED';

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* User Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-500/20 shadow-sm">
                            {item.user?.username
                              ? item.user.username.charAt(0).toUpperCase()
                              : '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {item.user?.username || 'Unknown User'}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {item.user?.email || item.userId}
                            </p>
                            {item.user?.phone && (
                              <p className="text-[10px] text-slate-400">
                                Phone: {item.user.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Network */}
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-800 border border-slate-200">
                          {item.network || 'USDT'}
                        </span>
                      </td>

                      {/* Wallet Address */}
                      <td className="py-4 px-6 font-mono text-xs">
                        <div className="flex items-center gap-2 max-w-xs">
                          <span
                            className="truncate text-slate-700 font-medium"
                            title={item.walletAddress}
                          >
                            {item.walletAddress || 'N/A'}
                          </span>
                          {item.walletAddress && (
                            <button
                              onClick={() =>
                                handleCopyAddress(item.id, item.walletAddress)
                              }
                              className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                              title="Copy address"
                            >
                              {copiedId === item.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6 font-mono text-sm font-bold text-slate-900">
                        {formatCurrency(item.amount)}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                            isPending
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : isApproved
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : isRejected
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {isPending && <Clock className="w-3 h-3 text-amber-600" />}
                          {isApproved && (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          )}
                          {isRejected && <XCircle className="w-3 h-3 text-rose-600" />}
                          {item.status || 'UNKNOWN'}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="py-4 px-6 text-slate-500 text-xs">
                        {formatDate(item.createdAt)}
                      </td>

                      {/* Action Button */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setUpdatingWithdrawal(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 text-amber-300 hover:bg-slate-800 text-xs font-semibold transition-all shadow-xs cursor-pointer border border-slate-800"
                            title="Update Status"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Action</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!isLoading && !isError && meta.totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 font-medium">
            <div>
              Showing Page <span className="font-bold text-slate-900">{meta.page}</span> of{' '}
              <span className="font-bold text-slate-900">{meta.totalPages}</span> ({meta.total}{' '}
              total items)
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isFetching}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page >= meta.totalPages || isFetching}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      <UpdateWithdrawalStatusModal
        isOpen={!!updatingWithdrawal}
        withdrawal={updatingWithdrawal}
        onClose={() => setUpdatingWithdrawal(null)}
        onStatusUpdated={() => refetch()}
      />
    </div>
  );
}
