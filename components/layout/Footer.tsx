"use client";

import React from "react";
import { ScrollToTop } from "../ui/ScrollToTop";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-gray-200">
          {/* Brand Info (Spans 2 cols on md+) */}
          <div className="md:col-span-2 space-y-4">
            <div className="inline-block px-2.5 py-1 bg-black text-white font-serif-luxury font-bold text-lg md:text-xl tracking-wider">
              HNI Corporation
            </div>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed max-w-md">
              Luxury living solutions tailored for real estate professionals and
              exclusive properties. Transform spaces into unforgettable client
              experiences.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-gray-900 mb-4">
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li>
                <a
                  href="#"
                  className="hover:text-black hover:underline transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  className="hover:text-black hover:underline transition-colors"
                >
                  Agent Benefits
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-black hover:underline transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Social Column matching screenshot rectangular buttons */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-gray-900 mb-4">
              SOCIAL
            </h4>
            <div className="grid grid-cols-2 gap-2 max-w-50">
              <a
                href="#"
                className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-gray-800 text-[11px] font-medium text-center rounded-sm transition-colors"
              >
                Instagram
              </a>
              <a
                href="#"
                className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-gray-800 text-[11px] font-medium text-center rounded-sm transition-colors"
              >
                Twitter / X
              </a>
              <a
                href="#"
                className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-gray-800 text-[11px] font-medium text-center rounded-sm transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-gray-800 text-[11px] font-medium text-center rounded-sm transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Scroll-To-Top */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 font-medium">
            © 2026 HNI Corporation. All Rights Reserved.
          </p>

          <ScrollToTop />
        </div>
      </div>
    </footer>
  );
};
