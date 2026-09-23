"use client";

import React, { useState } from "react";
import { X, Lock, Eye, EyeOff, Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import { extractErrorMessage } from "@/lib/api/api-client";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  isPending: boolean;
  amount: number;
  networkName: string;
  networkKey: string;
  walletAddress: string;
  error?: unknown;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  amount,
  networkName,
  networkKey,
  walletAddress,
  error,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.trim() === "") {
      setValidationError("Withdrawal password is required");
      return;
    }
    setValidationError("");
    onConfirm(password);
  };

  const handleClose = () => {
    if (isPending) return;
    setPassword("");
    setValidationError("");
    setShowPassword(false);
    onClose();
  };

  const serverErrorMessage = error ? extractErrorMessage(error) : null;

  const formattedAmount = `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden border border-gray-100 transition-all">
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isPending}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black text-white mb-3 shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl sm:text-2xl text-gray-900 tracking-tight">
            Confirm Withdrawal
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Please enter your withdrawal password to proceed
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-4 mb-5 space-y-2.5">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-gray-500 font-medium">Withdrawal Amount</span>
            <span className="font-bold text-gray-900 font-serif text-base">{formattedAmount}</span>
          </div>
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-gray-500 font-medium">Network</span>
            <span className="font-semibold text-gray-800">{networkName}</span>
          </div>
          <div className="pt-2 border-t border-gray-200/60">
            <span className="text-[11px] text-gray-400 font-medium block mb-0.5">Destination Address ({networkKey})</span>
            <p className="text-xs font-mono text-gray-800 break-all bg-white p-2 rounded-lg border border-gray-200/60">
              {walletAddress}
            </p>
          </div>
        </div>

        {/* Server or Validation Error Alert */}
        {(serverErrorMessage || validationError) && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
            {validationError || serverErrorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-1.5 tracking-wider">
              Withdrawal Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationError) setValidationError("");
                }}
                disabled={isPending}
                autoFocus
                placeholder="Enter withdrawal password"
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 rounded-md cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-semibold rounded-xl transition-all disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-3 px-4 bg-black text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-neutral-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Confirm</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
