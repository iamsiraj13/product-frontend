'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  Loader2,
  ShieldAlert,
  Wallet,
  Coins,
} from 'lucide-react';
import { useUpdateWithdrawalStatus } from '@/hooks/useUpdateWithdrawalStatus';
import { AdminWithdrawalItem, WithdrawalStatus } from '@/types/adminWithdrawal';

interface UpdateWithdrawalStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  withdrawal: AdminWithdrawalItem | null;
  onStatusUpdated?: () => void;
}

export const UpdateWithdrawalStatusModal: React.FC<
  UpdateWithdrawalStatusModalProps
> = ({ isOpen, onClose, withdrawal, onStatusUpdated }) => {
  const [selectedStatus, setSelectedStatus] = useState<WithdrawalStatus>('APPROVED');

  useEffect(() => {
    if (withdrawal && isOpen) {
      queueMicrotask(() => {
        if (withdrawal.status === 'REJECTED') {
          setSelectedStatus('REJECTED');
        } else {
          setSelectedStatus('APPROVED');
        }
      });
    }
  }, [withdrawal, isOpen]);

  const { mutate: updateStatus, isPending } = useUpdateWithdrawalStatus({
    onSuccessCallback: () => {
      if (onStatusUpdated) {
        onStatusUpdated();
      }
      onClose();
    },
  });

  if (!isOpen || !withdrawal) return null;

  const currentStatusUpper = withdrawal.status?.toUpperCase() || 'PENDING';
  const isAlreadyProcessed =
    currentStatusUpper === 'APPROVED' || currentStatusUpper === 'REJECTED';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!withdrawal) return;

    updateStatus({
      id: withdrawal.id,
      payload: {
        status: selectedStatus,
      },
    });
  };

  const formattedAmount =
    typeof withdrawal.amount === 'number'
      ? `$${withdrawal.amount.toFixed(2)}`
      : withdrawal.amount
      ? `$${parseFloat(String(withdrawal.amount)).toFixed(2)}`
      : '$0.00';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg font-bold tracking-tight">
                Update Withdrawal Status
              </h3>
              <p className="text-xs text-slate-400">
                Process request for {withdrawal.user?.username || withdrawal.userId}
              </p>
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

        {/* Withdrawal Overview Box */}
        <div className="mx-6 mt-6 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                {withdrawal.user?.username
                  ? withdrawal.user.username.charAt(0).toUpperCase()
                  : '?'}
              </div>
              <div>
                <p className="font-semibold text-xs text-slate-900">
                  {withdrawal.user?.username || 'User'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {withdrawal.user?.email || withdrawal.userId}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Amount
              </span>
              <span className="text-sm font-bold font-mono text-slate-900">
                {formattedAmount}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Wallet className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-medium">{withdrawal.network}</span>
              <span className="text-slate-400">|</span>
              <span
                className="font-mono text-slate-700 truncate max-w-[180px]"
                title={withdrawal.walletAddress}
              >
                {withdrawal.walletAddress}
              </span>
            </div>

            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                currentStatusUpper === 'PENDING'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : currentStatusUpper === 'APPROVED'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              Current: {currentStatusUpper}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Status Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Target Status <span className="text-rose-500">*</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedStatus('APPROVED')}
                className={`py-3.5 px-4 rounded-2xl border flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  selectedStatus === 'APPROVED'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2
                  className={`w-5 h-5 ${
                    selectedStatus === 'APPROVED'
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }`}
                />
                <span>APPROVE</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus('REJECTED')}
                className={`py-3.5 px-4 rounded-2xl border flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  selectedStatus === 'REJECTED'
                    ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <XCircle
                  className={`w-5 h-5 ${
                    selectedStatus === 'REJECTED'
                      ? 'text-rose-600'
                      : 'text-slate-400'
                  }`}
                />
                <span>REJECT</span>
              </button>
            </div>
          </div>

          {isAlreadyProcessed && (
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-800 font-medium flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Note: This withdrawal is currently labeled as <strong>{currentStatusUpper}</strong>.
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Updating Status...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Confirm Status Change</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
