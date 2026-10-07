"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Lock,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User as UserIcon,
  Mail,
  Phone,
  Copy,
  Check,
  Shield,
  Settings,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { useChangePassword } from "@/hooks/useChangePassword";
import { useChangeWithdrawalPassword } from "@/hooks/useChangeWithdrawalPassword";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfile } from "@/hooks/useProfile";
import { extractErrorMessage } from "@/lib/api/api-client";
import {
  changePasswordSchema,
  ChangePasswordFormData,
  changeWithdrawalPasswordSchema,
  ChangeWithdrawalPasswordFormData,
} from "@/lib/validations/auth";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"security" | "withdrawal" | "profile">("security");

  // Login Password visibility states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Withdrawal Password visibility states
  const [showOldWithdrawalPassword, setShowOldWithdrawalPassword] = useState(false);
  const [showNewWithdrawalPassword, setShowNewWithdrawalPassword] = useState(false);
  const [showConfirmWithdrawalPassword, setShowConfirmWithdrawalPassword] = useState(false);

  const [copiedCode, setCopiedCode] = useState(false);

  const authUser = useAuthStore((state) => state.user);
  const { data: profile } = useProfile();
  const user = profile || authUser;

  // Change Password Mutation
  const {
    mutate: changePassword,
    isPending,
    error,
    reset: resetMutation,
  } = useChangePassword();

  // Change Withdrawal Password Mutation
  const {
    mutate: changeWithdrawalPassword,
    isPending: isPendingWithdrawal,
    error: withdrawalError,
    reset: resetWithdrawalMutation,
  } = useChangeWithdrawalPassword();

  // Login Password Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Withdrawal Password Form
  const {
    register: registerWithdrawal,
    handleSubmit: handleSubmitWithdrawal,
    reset: resetWithdrawal,
    formState: { errors: withdrawalErrors },
  } = useForm<ChangeWithdrawalPasswordFormData>({
    resolver: zodResolver(changeWithdrawalPasswordSchema),
    defaultValues: {
      oldWithdrawalPassword: "",
      newWithdrawalPassword: "",
      confirmWithdrawalPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    resetMutation();
    changePassword(data, {
      onSuccess: (response) => {
        if (response.success) {
          toast.success(response.message || "Password updated successfully!");
          reset();
        } else {
          toast.error(response.error || "Failed to update password");
        }
      },
      onError: (err) => {
        toast.error(extractErrorMessage(err));
      },
    });
  };

  const onWithdrawalSubmit = (data: ChangeWithdrawalPasswordFormData) => {
    resetWithdrawalMutation();
    changeWithdrawalPassword(data, {
      onSuccess: (response) => {
        if (response.success) {
          toast.success(response.message || "Withdrawal password updated successfully!");
          resetWithdrawal();
        } else {
          toast.error(response.error || "Failed to update withdrawal password");
        }
      },
      onError: (err) => {
        toast.error(extractErrorMessage(err));
      },
    });
  };

  const handleCopyInvitationCode = () => {
    if (user?.invitationCode) {
      navigator.clipboard.writeText(user.invitationCode);
      setCopiedCode(true);
      toast.success("Invitation code copied to clipboard!");
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const serverErrorMessage = error ? extractErrorMessage(error) : null;
  const serverWithdrawalErrorMessage = withdrawalError ? extractErrorMessage(withdrawalError) : null;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl relative pb-16">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4 text-gray-700" />
          <span>Account Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Manage your login credentials, withdrawal password, and account profile
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-4 sm:gap-8 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`text-xs sm:text-sm transition-colors cursor-pointer pb-3 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "security"
                ? "border-b-2 border-black font-semibold text-black"
                : "text-gray-500 hover:text-black font-medium"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Change Password</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("withdrawal")}
            className={`text-xs sm:text-sm transition-colors cursor-pointer pb-3 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "withdrawal"
                ? "border-b-2 border-black font-semibold text-black"
                : "text-gray-500 hover:text-black font-medium"
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Withdrawal Password</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`text-xs sm:text-sm transition-colors cursor-pointer pb-3 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "profile"
                ? "border-b-2 border-black font-semibold text-black"
                : "text-gray-500 hover:text-black font-medium"
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile Details</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Change Login Password Section */}
      {activeTab === "security" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Main Password Change Form Card */}
          <div className="lg:col-span-2 bg-white border border-gray-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-serif font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Lock className="w-5 h-5 text-gray-800" />
                <span>Change Your Password</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Enter your current password and choose a new secure password.
              </p>
            </div>

            {/* Server API Error Banner */}
            {serverErrorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-800 leading-relaxed font-medium">
                  <span className="font-bold block text-rose-900 mb-0.5">
                    Password Update Failed
                  </span>
                  {serverErrorMessage}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Current / Old Password */}
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1.5 tracking-wider">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    {...register("oldPassword")}
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    className={`w-full pl-10 pr-11 py-3 bg-gray-50 border ${
                      errors.oldPassword
                        ? "border-rose-400 focus:ring-rose-500"
                        : "border-gray-200 focus:ring-black"
                    } rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5 rounded-md cursor-pointer"
                    aria-label="Toggle old password visibility"
                  >
                    {showOldPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.oldPassword && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">
                    {errors.oldPassword.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1.5 tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    {...register("newPassword")}
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password (min. 6 characters)"
                    className={`w-full pl-10 pr-11 py-3 bg-gray-50 border ${
                      errors.newPassword
                        ? "border-rose-400 focus:ring-rose-500"
                        : "border-gray-200 focus:ring-black"
                    } rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5 rounded-md cursor-pointer"
                    aria-label="Toggle new password visibility"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1.5 tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter new password"
                    className={`w-full pl-10 pr-11 py-3 bg-gray-50 border ${
                      errors.confirmPassword
                        ? "border-rose-400 focus:ring-rose-500"
                        : "border-gray-200 focus:ring-black"
                    } rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5 rounded-md cursor-pointer"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto px-8 py-3 bg-black hover:bg-gray-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Side Card: Password Security Guidelines */}
          <div className="bg-white border border-gray-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-800 border border-gray-200/60 mb-2">
              <Shield className="w-5 h-5 text-gray-800" />
            </div>
            <h3 className="font-serif font-bold text-base text-gray-900 tracking-tight">
              Password Requirements
            </h3>
            <ul className="space-y-3 text-xs text-gray-600 leading-relaxed font-normal">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Minimum of 6 characters long</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Includes letters, numbers, or special characters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Must match the confirmation password exactly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Avoid sharing your password with anyone</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-gray-100 text-xs text-gray-400">
              <p>
                Need support with your account? Contact our customer support team anytime.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Change Withdrawal Password Section */}
      {activeTab === "withdrawal" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Main Withdrawal Password Form Card */}
          <div className="lg:col-span-2 bg-white border border-gray-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-serif font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Wallet className="w-5 h-5 text-gray-800" />
                <span>Change Withdrawal Password</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Enter your current withdrawal password and set a new secure PIN/password.
              </p>
            </div>

            {/* Server API Error Banner */}
            {serverWithdrawalErrorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-800 leading-relaxed font-medium">
                  <span className="font-bold block text-rose-900 mb-0.5">
                    Withdrawal Password Update Failed
                  </span>
                  {serverWithdrawalErrorMessage}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitWithdrawal(onWithdrawalSubmit)} className="space-y-5">
              {/* Current / Old Withdrawal Password */}
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1.5 tracking-wider">
                  Current Withdrawal Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    {...registerWithdrawal("oldWithdrawalPassword")}
                    type={showOldWithdrawalPassword ? "text" : "password"}
                    placeholder="Enter current withdrawal password"
                    className={`w-full pl-10 pr-11 py-3 bg-gray-50 border ${
                      withdrawalErrors.oldWithdrawalPassword
                        ? "border-rose-400 focus:ring-rose-500"
                        : "border-gray-200 focus:ring-black"
                    } rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldWithdrawalPassword(!showOldWithdrawalPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5 rounded-md cursor-pointer"
                    aria-label="Toggle old withdrawal password visibility"
                  >
                    {showOldWithdrawalPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {withdrawalErrors.oldWithdrawalPassword && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">
                    {withdrawalErrors.oldWithdrawalPassword.message}
                  </p>
                )}
              </div>

              {/* New Withdrawal Password */}
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1.5 tracking-wider">
                  New Withdrawal Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    {...registerWithdrawal("newWithdrawalPassword")}
                    type={showNewWithdrawalPassword ? "text" : "password"}
                    placeholder="Enter new withdrawal password (min. 6 characters)"
                    className={`w-full pl-10 pr-11 py-3 bg-gray-50 border ${
                      withdrawalErrors.newWithdrawalPassword
                        ? "border-rose-400 focus:ring-rose-500"
                        : "border-gray-200 focus:ring-black"
                    } rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewWithdrawalPassword(!showNewWithdrawalPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5 rounded-md cursor-pointer"
                    aria-label="Toggle new withdrawal password visibility"
                  >
                    {showNewWithdrawalPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {withdrawalErrors.newWithdrawalPassword && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">
                    {withdrawalErrors.newWithdrawalPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm New Withdrawal Password */}
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1.5 tracking-wider">
                  Confirm New Withdrawal Password
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    {...registerWithdrawal("confirmWithdrawalPassword")}
                    type={showConfirmWithdrawalPassword ? "text" : "password"}
                    placeholder="Re-enter new withdrawal password"
                    className={`w-full pl-10 pr-11 py-3 bg-gray-50 border ${
                      withdrawalErrors.confirmWithdrawalPassword
                        ? "border-rose-400 focus:ring-rose-500"
                        : "border-gray-200 focus:ring-black"
                    } rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmWithdrawalPassword(!showConfirmWithdrawalPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5 rounded-md cursor-pointer"
                    aria-label="Toggle confirm withdrawal password visibility"
                  >
                    {showConfirmWithdrawalPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {withdrawalErrors.confirmWithdrawalPassword && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">
                    {withdrawalErrors.confirmWithdrawalPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPendingWithdrawal}
                  className="w-full sm:w-auto px-8 py-3 bg-black hover:bg-gray-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {isPendingWithdrawal ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Updating Withdrawal Password...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Update Withdrawal Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Side Card: Withdrawal Security Guidelines */}
          <div className="bg-white border border-gray-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-800 border border-gray-200/60 mb-2">
              <Shield className="w-5 h-5 text-gray-800" />
            </div>
            <h3 className="font-serif font-bold text-base text-gray-900 tracking-tight">
              Withdrawal Password Info
            </h3>
            <ul className="space-y-3 text-xs text-gray-600 leading-relaxed font-normal">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Required for verifying all payout & withdrawal requests</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Minimum of 6 characters long</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Must match the confirmation password exactly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Keep this password secure and distinct from login password</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-gray-100 text-xs text-gray-400">
              <p>
                Having trouble with payouts or passwords? Contact our support team.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Profile Overview Section */}
      {activeTab === "profile" && (
        <div className="bg-white border border-gray-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-gray-900 tracking-tight">
                Profile Overview
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Your account info and referral details
              </p>
            </div>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              {user?.role || "User"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-700">
                <UserIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Username</p>
                <p className="font-semibold text-gray-900">{user?.username || "—"}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-700">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Email Address</p>
                <p className="font-semibold text-gray-900">{user?.email || "—"}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-700">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Phone Number</p>
                <p className="font-semibold text-gray-900">{user?.phone || "—"}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-700">
                <KeyRound className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium">Invitation Code</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-gray-900">
                    {user?.invitationCode || "—"}
                  </span>
                  {user?.invitationCode && (
                    <button
                      type="button"
                      onClick={handleCopyInvitationCode}
                      className="p-1 text-gray-400 hover:text-gray-900 cursor-pointer transition-colors"
                      title="Copy code"
                    >
                      {copiedCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
