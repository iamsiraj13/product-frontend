'use client';

import React from 'react';
import { User } from 'lucide-react';

interface NavbarProps {
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="px-2.5 py-1 bg-black text-white font-serif-luxury font-bold text-lg md:text-xl tracking-wider">
            CRATE&BARREL
          </div>
        </a>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenLogin}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold uppercase tracking-wider rounded-sm transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>
        </div>
      </div>
    </header>
  );
};
