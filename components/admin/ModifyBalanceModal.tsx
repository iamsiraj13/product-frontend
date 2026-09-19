'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import {
  X,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2,
  AlertCircle,
  FileText,
  User,
  ArrowUpDown,
  Calculator,
} from 'lucide-react';
import { useModifyUserBalance } from '@/hooks/useModifyUserBalance';
import { AdminUser, ModifyBalancePayload } from '@/types/adminUser';

interface ModifyBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onBalanceUpdated?: (user?: AdminUser) => void;
}

export const ModifyBalanceModal: React.FC<ModifyBalanceModalProps> = ({
  isOpen,
  onClose,
  user,
  onBalanceUpdated,
}) => {
  const [type, setType] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user && isOpen) {
      setType('CREDIT');
      setAmount('');
      setNote('Bonus credit top-up');
      setValidationErrors({});
    }
  }, [user, isOpen]);

  const { mutate: modifyBalance, isPending } = useModifyUserBalance({
    onSuccessCallback: (res) => {
      if (onBalanceUpdated) {
        onBalanceUpdated(res?.data);
      }
      onClose();
    },
  });

  if (!isOpen || !user) return null;

  const currentNumericBalance = parseFloat(user.balance || '0') || 0;
  const numAmount = parseFloat(amount) || 0;
  const projectedBalance =
    type === 'CREDIT'
      ? currentNumericBalance + numAmount
      : currentNumericBalance - numAmount;

  const handleClose = () => {
    setValidationErrors({});
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!amount.trim()) {
      errors.amount = 'Amount is required';
    } else {
      const parsed = parseFloat(amount);
      if (isNaN(parsed) || parsed <= 0) {
        errors.amount = 'Amount must be a positive number greater than 0';
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});

    const payload: ModifyBalancePayload = {
      type,
      amount: parseFloat(amount),
      note: note.trim() || undefined,
    };

    modifyBalance({
      id: user.id,
      payload,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <ArrowUpDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg font-bold tracking-tight">Modify User Balance</h3>
              <p className="text-xs text-slate-400">Adjust account funds for {user.username || user.email}</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            type="button"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Summary Card */}
        <div className="mx-6 mt-6 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-300 font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
              {user.username ? user.username.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <p className="font-semibold text-xs text-slate-900">{user.username}</p>
              <p className="text-[11px] text-slate-500">{user.email}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Balance</span>
            <span className="text-sm font-bold font-mono text-slate-900">${currentNumericBalance.toFixed(2)}</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Transaction Type Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Transaction Action <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('CREDIT')}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
                  type === 'CREDIT'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ArrowUpRight className={`w-4 h-4 ${type === 'CREDIT' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>CREDIT (Add Fund)</span>
              </button>

              <button
                type="button"
                onClick={() => setType('DEBIT')}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
                  type === 'DEBIT'
                    ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ArrowDownLeft className={`w-4 h-4 ${type === 'DEBIT' ? 'text-rose-600' : 'text-slate-400'}`} />
                <span>DEBIT (Deduct)</span>
              </button>
            </div>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Amount ($) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                step="any"
                min="0"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setValidationErrors((prev) => ({ ...prev, amount: '' }));
                }}
                placeholder="0.00"
                className={`w-full bg-slate-50 border ${
                  validationErrors.amount ? 'border-rose-500' : 'border-slate-200'
                } rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all`}
              />
            </div>
            {validationErrors.amount && (
              <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{validationErrors.amount}</span>
              </p>
            )}
          </div>

          {/* Note Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Reason / Note <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Bonus credit top-up"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>
          </div>

          {/* Projected Balance Estimation */}
          {numAmount > 0 && (
            <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-medium">
                <Calculator className="w-4 h-4 text-amber-600" />
                <span>New Projected Balance:</span>
              </div>
              <span className={`font-mono font-bold ${projectedBalance < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                ${projectedBalance.toFixed(2)}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
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
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <ArrowUpDown className="w-4 h-4 text-amber-400" />
                  <span>Submit Balance Adjustment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
