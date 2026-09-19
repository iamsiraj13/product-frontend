'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import {
  X,
  ListTodo,
  Loader2,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Sparkles,
  AlertCircle,
  Star,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Hash,
  Layers,
  Wrench,
} from 'lucide-react';
import { usePreGenerateTasks } from '@/hooks/usePreGenerateTasks';
import { useGetUserTasks } from '@/hooks/useGetUserTasks';
import { AdminUser } from '@/types/adminUser';
import { PreGenerateTasksData, UserTaskItem } from '@/types/task';
import { OverrideTaskModal } from './OverrideTaskModal';


interface ManageTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
}

const formatImageUrl = (url?: string): string => {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  ) {
    return url;
  }
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `http://localhost:4000${cleanPath}`;
};

const formatDate = (dateStr?: string | null): string => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
  } catch {
    return dateStr;
  }
};

export const ManageTasksModal: React.FC<ManageTasksModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [count, setCount] = useState<number>(33);
  const [tasksData, setTasksData] = useState<PreGenerateTasksData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'GENERATED'>('ALL');
  const [overrideTaskItem, setOverrideTaskItem] = useState<UserTaskItem | null>(null);

  // Fetch existing tasks for the user when modal is open
  const {
    data: userTasksResponse,
    isLoading: isFetchingTasks,
    refetch: refetchUserTasks,
  } = useGetUserTasks(user?.id, isOpen);

  const { mutate: preGenerateTasks, isPending: isGenerating } = usePreGenerateTasks({
    onSuccessCallback: (res) => {
      if (res.data) {
        setTasksData(res.data);
      }
      refetchUserTasks();
    },
  });

  // Reset local state when modal opens or user changes
  useEffect(() => {
    if (isOpen && user) {
      setCount(33);
      setSearchQuery('');
      setStatusFilter('ALL');
      setOverrideTaskItem(null);
      setTasksData(null);
    } else {
      setTasksData(null);
      setOverrideTaskItem(null);
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleGenerate = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!count || count < 1) return;
    preGenerateTasks({ userId: user.id, count });
  };

  const tasksList: UserTaskItem[] =
    tasksData?.tasks || userTasksResponse?.data?.tasks || [];

  const totalTasks =
    tasksData?.totalTasks ??
    userTasksResponse?.data?.taskCount ??
    userTasksResponse?.data?.taskLimit ??
    tasksList.length;

  const displayMessage =
    tasksData?.message ||
    (userTasksResponse?.data
      ? `Task slots for user: ${userTasksResponse.data.user.username}`
      : 'User Task Slots');

  const filteredTasks = tasksList.filter((task) => {
    const query = searchQuery.toLowerCase().trim();
    const titleMatch = task.product?.title?.toLowerCase().includes(query) || false;
    const stepMatch = task.stepNumber.toString().includes(query);
    const matchesSearch = !query || titleMatch || stepMatch;

    const matchesStatus =
      statusFilter === 'ALL' || task.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const completedCount = tasksList.filter((t) => t.status === 'COMPLETED').length;
  const generatedCount = tasksList.filter((t) => t.status === 'GENERATED').length;
  const isLoading = isGenerating || isFetchingTasks;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury text-lg font-bold tracking-tight">Manage Task Slots</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 border border-amber-500/30 text-amber-300">
                  User Tasks
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Summary & Pre-generate Form */}
        <div className="p-5 bg-slate-50 border-b border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-300 font-bold text-sm flex items-center justify-center shrink-0 shadow-sm border border-slate-800">
              {user.username ? user.username.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900">{user.username}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                  {user.role}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{user.email}</p>
            </div>
          </div>

          {/* Generator Controls */}
          <form onSubmit={handleGenerate} className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
              <span className="text-xs font-semibold text-slate-600">Slots:</span>
              <input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 text-center"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-400" />
              )}
              <span>{isGenerating ? 'Generating...' : 'Pre-Generate Tasks'}</span>
            </button>
          </form>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 relative min-h-[350px]">
          {/* Smooth Circle Loader in Center */}
          {isLoading ? (
            <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 animate-fade-in">
              <div className="relative flex items-center justify-center">
                {/* Outer glowing pulsing ring */}
                <div className="w-20 h-20 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
                {/* Inner counter-rotating ring */}
                <div className="absolute w-14 h-14 rounded-full border-4 border-slate-900/10 border-b-slate-900 animate-spin [animation-duration:1.2s] [animation-direction:reverse]" />
                {/* Center icon */}
                <div className="absolute p-3 bg-slate-900 rounded-full text-amber-400 shadow-md">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              </div>
              <p className="mt-5 text-sm font-bold text-slate-800">
                {isGenerating ? 'Generating Task Slots...' : 'Loading User Tasks...'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {isGenerating
                  ? 'Pre-assigning products and calculating commission snapshots'
                  : 'Fetching allocated task slots and product details'}
              </p>
            </div>
          ) : null}

          {/* Results Summary & Toolbar */}
          {(tasksList.length > 0 || tasksData || userTasksResponse?.data) && (
            <div className="space-y-5">
              {/* Message Banner & Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2 p-4 bg-gradient-to-r from-amber-50 to-indigo-50 border border-amber-200/70 rounded-2xl flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{displayMessage}</p>
                    <p className="text-[11px] text-slate-500">
                      Total task slots for user: <strong className="text-slate-900">{totalTasks}</strong>
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">Completed</span>
                    <p className="text-lg font-bold text-emerald-900 font-mono">{completedCount}</p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 opacity-80" />
                </div>

                <div className="p-4 bg-indigo-50/70 border border-indigo-200/70 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-indigo-700 tracking-wider">Generated / Pending</span>
                    <p className="text-lg font-bold text-indigo-900 font-mono">{generatedCount}</p>
                  </div>
                  <Clock className="w-6 h-6 text-indigo-500 opacity-80" />
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search task step or product..."
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Tasks List */}
              {filteredTasks.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  No task slots match your search query.
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Step</th>
                          <th className="py-3 px-4">Product Details</th>
                          <th className="py-3 px-4">Price / Comm</th>
                          <th className="py-3 px-4">Status / Rating</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredTasks.map((task) => {
                          const isCompleted = task.status === 'COMPLETED';
                          const imgUrl = formatImageUrl(task.product?.image);

                          return (
                            <tr key={task.id} className="hover:bg-slate-50/70 transition-colors">
                              {/* Step # */}
                              <td className="py-3.5 px-4">
                                <span className="inline-flex items-center gap-1 font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg text-xs">
                                  <Hash className="w-3 h-3 text-amber-500" />
                                  <span>{task.stepNumber}</span>
                                </span>
                              </td>

                              {/* Product Info */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3 max-w-xs">
                                  {imgUrl ? (
                                    <img
                                      src={imgUrl}
                                      alt={task.product?.title || 'Product'}
                                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                                      onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                                      <ShoppingBag className="w-5 h-5" />
                                    </div>
                                  )}
                                  <div className="truncate">
                                    <p className="font-semibold text-slate-900 truncate">
                                      {task.product?.title || 'Unknown Product'}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-mono truncate">
                                      ID: {task.productId}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Snapshots */}
                              <td className="py-3.5 px-4 font-mono">
                                <div>
                                  <span className="font-bold text-slate-900">${task.priceSnapshot}</span>
                                  <div className="text-[11px] text-indigo-600 font-medium">
                                    Comm: ${task.product?.commission || task.commissionSnapshot} ({task.commissionSnapshot}%)
                                  </div>
                                </div>
                              </td>

                              {/* Earned Commission / Rating & Comment */}
                              <td className="py-3.5 px-4">
                                {isCompleted ? (
                                  <div className="space-y-1">
                                    <div className="font-mono font-bold text-emerald-600 text-xs">
                                      +${task.earnedCommission ?? '0.00'}
                                    </div>
                                    {task.rating ? (
                                      <div className="flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        <span>{task.rating} / 5</span>
                                      </div>
                                    ) : null}
                                    {task.comment && (
                                      <p className="text-[10px] text-slate-500 italic max-w-xs truncate" title={task.comment}>
                                        "{task.comment}"
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-slate-400 text-[11px] italic">Pending action</span>
                                )}
                              </td>

                              {/* Action Button Column */}
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => setOverrideTaskItem(task)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/90 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                                  title="Override task price/commission/product"
                                >
                                  <Wrench className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Action</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {!isLoading && tasksList.length === 0 && !tasksData && !userTasksResponse?.data && (
            <div className="py-16 text-center text-slate-400 text-xs font-medium">
              No task slots found for this user. Click <strong className="text-slate-700">Pre-Generate Tasks</strong> to create task slots.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-500">
            Task slots pre-allocated for optimization workflow
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* Override Task Modal */}
      <OverrideTaskModal
        isOpen={!!overrideTaskItem}
        task={overrideTaskItem}
        onClose={() => setOverrideTaskItem(null)}
        onSuccess={() => {
          setTasksData(null);
          refetchUserTasks();
        }}
      />
    </div>

  );
};
