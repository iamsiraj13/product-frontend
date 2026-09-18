"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Mail,
  Lock,
  Phone,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { registerSchema, RegisterFormData } from "@/lib/validations/auth";
import { useRegister } from "@/hooks/useRegister";
import { extractErrorMessage } from "@/lib/api/api-client";
import { useAuthStore } from "@/store/useAuthStore";

export const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: register, isPending, isSuccess, error, data } = useRegister();
  const authUser = useAuthStore((state) => state.user);

  const {
    register: registerField,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      phone: "",
      invitationCode: "",
    },
  });

  const onSubmit = (formData: RegisterFormData) => {
    register(formData);
  };

  const serverErrorMessage = error ? extractErrorMessage(error) : null;
  const registeredUser = data?.data?.user || authUser;

  if (isSuccess && registeredUser) {
    return (
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 transition-all duration-300">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-serif-luxury text-2xl font-bold text-gray-900 tracking-tight">
            Account Created Successfully!
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Welcome to the HNI Portal,{" "}
            <span className="font-semibold text-gray-900">
              @{registeredUser.username}
            </span>
            .
          </p>

          <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-gray-200/60 pb-2">
              <span className="text-gray-500 uppercase font-semibold">
                User ID:
              </span>
              <span className="font-mono text-gray-800">
                {registeredUser.id.slice(0, 18)}...
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200/60 pb-2">
              <span className="text-gray-500 uppercase font-semibold">
                Email:
              </span>
              <span className="font-medium text-gray-800">
                {registeredUser.email}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200/60 pb-2">
              <span className="text-gray-500 uppercase font-semibold">
                Phone:
              </span>
              <span className="font-medium text-gray-800">
                {registeredUser.phone}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200/60 pb-2">
              <span className="text-gray-500 uppercase font-semibold">
                Role / Account:
              </span>
              <span className="font-semibold text-emerald-700">
                {registeredUser.role} ({registeredUser.accountType})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 uppercase font-semibold">
                Invitation Code:
              </span>
              <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-semibold">
                {registeredUser.invitationCode}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-3.5 px-6 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10"
            >
              <span>Go to Login Page</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-linear-to-br from-amber-100/40 to-orange-50/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700 tracking-wider uppercase mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-black" />
          <span>User Registration</span>
        </div>
        <h2 className="font-serif-luxury text-3xl font-bold text-gray-900 tracking-tight">
          Join HNI Corporation
        </h2>
        <p className="text-sm text-gray-500 mt-2">Create your account</p>
      </div>

      {/* Server API Error Banner */}
      {serverErrorMessage && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-800 leading-relaxed font-medium">
            <span className="font-bold block text-rose-900 mb-0.5">
              Registration Failed
            </span>
            {serverErrorMessage}
          </div>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-700 mb-1.5 tracking-wider">
            Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              {...registerField("username")}
              type="text"
              placeholder="Enter your name"
              className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                errors.username
                  ? "border-rose-400 focus:ring-rose-500"
                  : "border-gray-200 focus:ring-black"
              } rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            />
          </div>
          {errors.username && (
            <p className="text-xs text-rose-600 mt-1 font-medium">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-700 mb-1.5 tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              {...registerField("email")}
              type="email"
              placeholder="john@example.com"
              className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                errors.email
                  ? "border-rose-400 focus:ring-rose-500"
                  : "border-gray-200 focus:ring-black"
              } rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-600 mt-1 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-700 mb-1.5 tracking-wider">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              {...registerField("phone")}
              type="text"
              placeholder="+1234567890"
              className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                errors.phone
                  ? "border-rose-400 focus:ring-rose-500"
                  : "border-gray-200 focus:ring-black"
              } rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-rose-600 mt-1 font-medium">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-700 mb-1.5 tracking-wider">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              {...registerField("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className={`w-full pl-10 pr-11 py-3 bg-gray-50 border ${
                errors.password
                  ? "border-rose-400 focus:ring-rose-500"
                  : "border-gray-200 focus:ring-black"
              } rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5 rounded-md"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-rose-600 mt-1 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Invitation Code */}
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-700 mb-1.5 tracking-wider">
            Invitation Code
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              {...registerField("invitationCode")}
              type="text"
              placeholder=""
              className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                errors.invitationCode
                  ? "border-rose-400 focus:ring-rose-500"
                  : "border-gray-200 focus:ring-black"
              } rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all font-mono uppercase tracking-wider`}
            />
          </div>
          {errors.invitationCode && (
            <p className="text-xs text-rose-600 mt-1 font-medium">
              {errors.invitationCode.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-6 py-3.5 px-6 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 focus:ring-4 focus:ring-black/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group shadow-xl shadow-black/10"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Registering...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Footer info */}
        <p className="text-center text-xs text-gray-500 pt-3">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-black font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};
