'use client';

import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';

export const DataOptimization: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-[#FAF9F6] border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Text Column */}
          <div className="flex flex-col justify-center">
            <SectionHeading
              subtitle="ABOUT US"
              title="Redefining Luxury Through Data Optimization"
              align="left"
              className="mb-6"
            />

            <div className="space-y-6 text-gray-600 text-sm md:text-base leading-relaxed">
              <p>
                Our agent ecosystem provides real-time access to high-end architectural pieces, curated room setups, and luxury home styling tailored to maximize property value and client satisfaction.
              </p>
              <p>
                From turnkey interior solutions to exclusive catalog discounts, we empower top-performing agents to transform luxury properties effortlessly.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-6 pt-6 border-t border-gray-200/80">
              <div>
                <div className="font-serif-luxury text-3xl font-bold text-gray-900">98%</div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-medium">Staging Accuracy</div>
              </div>
              <div className="h-10 w-[1px] bg-gray-200" />
              <div>
                <div className="font-serif-luxury text-3xl font-bold text-gray-900">3.5x</div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-medium">Faster Listing Sales</div>
              </div>
            </div>
          </div>

          {/* Right Image Column: Crate & Barrel VIP Card on Coffee Table */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl border border-gray-200 bg-stone-200 group">
              <img
                src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=1200"
                alt="Luxury coffee table setup"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay VIP Card Mockup matching screenshot */}
              <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/10">
                <div className="w-72 md:w-80 bg-stone-900 text-white p-6 rounded-xl shadow-2xl backdrop-blur-md border border-stone-700/50 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <span className="font-serif-luxury tracking-widest text-lg font-bold">
                        HNI Corporation
                      </span>
                      <p className="text-[9px] uppercase tracking-widest text-stone-400 font-semibold">
                        AGENT ELITE CARD
                      </p>
                    </div>
                    <div className="w-8 h-6 bg-amber-400/80 rounded-sm" />
                  </div>

                  <div className="flex justify-between items-end text-xs tracking-widest font-mono text-stone-300">
                    <span>•••• •••• •••• 8821</span>
                    <span className="text-xs font-serif font-bold text-white tracking-normal">VISA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
