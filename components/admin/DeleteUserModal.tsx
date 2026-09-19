'use client';

import React from 'react';
import { AlertTriangle, Trash2, Loader2, X } from 'lucide-react';
import { AdminUser } from '@/types/adminUser';
import { useDeleteAdminUser } from '@/hooks/useDeleteAdminUser';

interface DeleteUserModalProps {
  isOpen: boolean;
  user: AdminUser | null;
  onClose: () => void;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  user,
  onClose,
}) => {
  const { mutate: deleteUser, isPending } = useDeleteAdminUser({
    onSuccessCallback: () => {
      onClose();
    },
  });

  if (!isOpen || !user) return null;

  const handleDelete = () => {
    deleteUser(user.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={isPending ? undefined : onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isPending}
          type="button"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 text-center space-y-4">
          {/* Icon Badge */}
          <div className="mx-auto w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-xs">
            <AlertTriangle className="w-6 h-6" />
          </div>

          {/* Modal Header Text */}
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-serif-luxury text-slate-900">
              Confirm Delete User
            </h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
          </div>

          {/* User Preview Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-left flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
              {user.username ? user.username.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {user.username}
              </p>
              <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700">
              {user.role}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete User</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
