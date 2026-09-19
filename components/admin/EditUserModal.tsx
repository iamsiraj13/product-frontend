'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  Edit3,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Layers,
} from 'lucide-react';
import { useUpdateAdminUser } from '@/hooks/useUpdateAdminUser';
import { AdminUser, UpdateAdminUserPayload } from '@/types/adminUser';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onUserUpdated?: (updatedUser?: AdminUser) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserUpdated,
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [accountType, setAccountType] = useState('MAIN');
  const [balance, setBalance] = useState<string | number>('0');
  const [isActive, setIsActive] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user && isOpen) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setPassword('');
      setRole(user.role || 'USER');
      setAccountType(user.accountType || 'MAIN');
      setBalance(user.balance !== undefined && user.balance !== null ? user.balance : '0');
      setIsActive(user.isActive !== undefined ? user.isActive : true);
      setValidationErrors({});
      setShowPassword(false);
    }
  }, [user, isOpen]);

  const { mutate: updateUser, isPending } = useUpdateAdminUser({
    onSuccessCallback: (updatedUser) => {
      if (onUserUpdated) {
        onUserUpdated(updatedUser);
      }
      onClose();
    },
  });

  if (!isOpen || !user) return null;

  const handleClose = () => {
    setValidationErrors({});
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!username.trim()) {
      errors.username = 'Username is required';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    const numericBalance = Number(balance);
    if (isNaN(numericBalance) || numericBalance < 0) {
      errors.balance = 'Balance must be a non-negative number';
    }

    if (password && password.length < 6) {
      errors.password = 'New password must be at least 6 characters';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});

    const payload: UpdateAdminUserPayload = {
      username: username.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      role,
      accountType,
      balance: numericBalance,
      isActive,
    };

    if (password.trim()) {
      payload.password = password.trim();
    }

    updateUser({
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
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg font-bold tracking-tight">Edit User Details</h3>
              <p className="text-xs text-slate-400">Update parameters for {user.username || user.email}</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Username Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Username <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setValidationErrors((prev) => ({ ...prev, username: '' }));
                }}
                placeholder="e.g. john_doe"
                className={`w-full bg-slate-50 border ${
                  validationErrors.username ? 'border-rose-500' : 'border-slate-200'
                } rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all`}
              />
            </div>
            {validationErrors.username && (
              <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{validationErrors.username}</span>
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setValidationErrors((prev) => ({ ...prev, email: '' }));
                }}
                placeholder="e.g. john@example.com"
                className={`w-full bg-slate-50 border ${
                  validationErrors.email ? 'border-rose-500' : 'border-slate-200'
                } rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all`}
              />
            </div>
            {validationErrors.email && (
              <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{validationErrors.email}</span>
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1234567890"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>
          </div>

          {/* Password Field (Optional on edit) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              New Password <span className="text-slate-400 font-normal lowercase">(leave blank to keep current)</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setValidationErrors((prev) => ({ ...prev, password: '' }));
                }}
                placeholder="Enter new password"
                className={`w-full bg-slate-50 border ${
                  validationErrors.password ? 'border-rose-500' : 'border-slate-200'
                } rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{validationErrors.password}</span>
              </p>
            )}
          </div>

          {/* Grid for Role & Account Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Role Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Role
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="AGENT">AGENT</option>
                  <option value="USER">USER</option>
                </select>
              </div>
            </div>

            {/* Account Type Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Account Type
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer"
                >
                  <option value="MAIN">MAIN</option>
                  <option value="SUB">SUB</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid for Balance & Active Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Balance Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Balance ($)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  step="any"
                  value={balance}
                  onChange={(e) => {
                    setBalance(e.target.value);
                    setValidationErrors((prev) => ({ ...prev, balance: '' }));
                  }}
                  placeholder="0.00"
                  className={`w-full bg-slate-50 border ${
                    validationErrors.balance ? 'border-rose-500' : 'border-slate-200'
                  } rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all`}
                />
              </div>
              {validationErrors.balance && (
                <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{validationErrors.balance}</span>
                </p>
              )}
            </div>

            {/* IsActive Toggle */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Account Status
              </label>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-full py-2.5 px-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50/80 border-rose-300 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isActive ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>{isActive ? 'Active Account' : 'Inactive / Suspended'}</span>
                </div>
                <div
                  className={`w-8 h-4 rounded-full p-0.5 transition-colors ${
                    isActive ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white transition-transform ${
                      isActive ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
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
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>Update User</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
