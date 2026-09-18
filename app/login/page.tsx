"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { useLogin } from "@/hooks/useLogin";
import { extractErrorMessage } from "@/lib/api/api-client";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "rahim@gmail.com",
      password: "123456",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  const serverErrorMessage = error ? extractErrorMessage(error) : null;

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:text-black hover:border-gray-400 transition-all shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight uppercase">
          HNI Corporation
        </h2>
        <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto">
          Sign in to your luxury real estate staging portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl border border-gray-100 sm:px-10 relative">
          {/* Quick Fill Banner */}
          <div className="mb-6 p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Quick Test Login Payload
              </span>
            </div>
          </div>

          {/* Error display */}
          {serverErrorMessage && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-800 leading-relaxed font-medium">
                <span className="font-bold block text-rose-900 mb-0.5">
                  Authentication Error
                </span>
                {serverErrorMessage}
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register("email")}
                  type="email"
                  disabled={isPending}
                  placeholder="rahim@gmail.com"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                    errors.email
                      ? "border-rose-400 focus:ring-rose-500"
                      : "border-gray-200 focus:ring-black"
                  } rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-60`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-600 mt-1.5 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  disabled={isPending}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-10 py-3 bg-gray-50 border ${
                    errors.password
                      ? "border-rose-400 focus:ring-rose-500"
                      : "border-gray-200 focus:ring-black"
                  } rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-60`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 rounded-md"
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
                <p className="text-xs text-rose-600 mt-1.5 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 px-6 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-black hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
