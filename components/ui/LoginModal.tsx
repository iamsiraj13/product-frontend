'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Lock, Mail, ArrowRight, Eye, EyeOff, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { loginSchema, LoginFormData } from '@/lib/validations/auth';
import { useLogin } from '@/hooks/useLogin';
import { extractErrorMessage } from '@/lib/api/api-client';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, error } = useLogin({
    onSuccessCallback: () => {
      onClose();
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'rahim@gmail.com',
      password: '123456',
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  const handleFillDemo = (email: string, pass: string) => {
    setValue('email', email);
    setValue('password', pass);
  };

  const serverErrorMessage = error ? extractErrorMessage(error) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 overflow-hidden border border-gray-100 transition-all">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isPending}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-50"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-3">
            CRATE & BARREL
          </div>
          <h3 className="font-serif-luxury text-2xl font-bold text-gray-900 tracking-tight">
            Agent Portal Sign In
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Access your staging dashboard and agent account
          </p>
        </div>

        {/* Demo Credentials Quick Fill */}
        <div className="mb-5 p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Quick Fill Test Credentials
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('rahim@gmail.com', '123456')}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-amber-100/60 border border-amber-200 rounded-lg text-xs font-semibold text-amber-900 transition-colors text-center"
            >
              Rahim (USER)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin@example.com', '123456')}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-amber-100/60 border border-amber-200 rounded-lg text-xs font-semibold text-amber-900 transition-colors text-center"
            >
              Admin / Agent
            </button>
          </div>
        </div>

        {/* Server API Error Display */}
        {serverErrorMessage && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-800 leading-relaxed font-medium">
              {serverErrorMessage}
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5 tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('email')}
                type="email"
                disabled={isPending}
                placeholder="rahim@gmail.com"
                className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border ${
                  errors.email ? 'border-rose-400 focus:ring-rose-500' : 'border-gray-200 focus:ring-black'
                } rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-60`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5 tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                disabled={isPending}
                placeholder="••••••••••••"
                className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 border ${
                  errors.password ? 'border-rose-400 focus:ring-rose-500' : 'border-gray-200 focus:ring-black'
                } rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-60`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 rounded-md"
                aria-label="Toggle password"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.password.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
              <span>Remember Me</span>
            </label>
            <a href="#" className="hover:underline text-gray-800 font-medium">
              Forgot Password?
            </a>
          </div>

          {/* Submit Button with smooth loading state */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 py-3 px-6 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Modal Footer */}
          <p className="text-center text-xs text-gray-500 pt-3 border-t border-gray-100 mt-4">
            Not a registered agent yet?{' '}
            <Link href="/register" onClick={onClose} className="text-black font-semibold hover:underline">
              Apply for Agent Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
