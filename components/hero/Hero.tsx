'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onOpenLogin: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenLogin }) => {
  return (
    <section className="relative w-full min-h-[680px] lg:min-h-[760px] flex items-center justify-start overflow-hidden bg-stone-100">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100 hover:scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=85&w=2000')`,
        }}
      >
        {/* Subtle overlay filter to enhance readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full py-20">
        <div className="max-w-xl bg-white/95 backdrop-blur-md p-8 md:p-12 shadow-2xl rounded-sm border border-white/40">
          <span className="block text-xs uppercase tracking-[0.3em] font-semibold text-gray-500 mb-4">
            FOR LIFETIME AGENTS FOR LIFE
          </span>
          
          <h1 className="font-serif-luxury text-3xl md:text-5xl lg:text-5xl font-bold text-gray-900 leading-[1.15] mb-6 tracking-tight">
            Explore Crate&Barrel: Luxury Living for Lifetime Agents
          </h1>
          
          <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-8">
            Discover curated collections, bespoke designs, and premium furniture tailored for lifetime real estate agents and luxury spaces.
          </p>

          <div>
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold uppercase tracking-widest rounded-sm transition-all shadow-md group cursor-pointer"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
