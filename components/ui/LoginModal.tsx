'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 overflow-hidden border border-gray-100">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal content */}
        <div className="text-center mb-6">
          <h3 className="font-serif-luxury text-2xl font-bold text-gray-900 tracking-wider uppercase mb-1">
            CRATE&BARREL
          </h3>
          <p className="text-xs tracking-widest text-gray-500 uppercase font-semibold">
            Agent Portal Access
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center animate-fadeIn">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
              ✓
            </div>
            <h4 className="font-semibold text-lg text-gray-900">Welcome Back!</h4>
            <p className="text-sm text-gray-500 mt-1">Authenticating agent portal session...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1 tracking-wider">
                Agent Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="agent@luxuryrealestate.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1 tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
                <span>Remember Me</span>
              </label>
              <a href="#" className="hover:underline text-gray-800 font-medium">Forgot Password?</a>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-6 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group shadow-md"
            >
              <span>Login to Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-center text-xs text-gray-500 pt-2">
              Not a registered agent yet?{' '}
              <a href="#how-it-works" onClick={onClose} className="text-black font-semibold hover:underline">
                Apply for Agent Account
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
