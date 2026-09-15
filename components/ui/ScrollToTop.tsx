'use client';

import React from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-xs font-medium rounded-md shadow-sm transition-all duration-200 group"
      aria-label="Scroll to top"
    >
      <span>Top</span>
      <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
};
