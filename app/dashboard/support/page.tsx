"use client";

import React from "react";
import { MessageSquare, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function SupportPage() {
  const handleLiveChat = () => {
    if (typeof window !== "undefined" && window.Tawk_API) {
      try {
        if (typeof window.Tawk_API.maximize === "function") {
          window.Tawk_API.maximize();
        } else if (typeof window.Tawk_API.toggle === "function") {
          window.Tawk_API.toggle();
        } else if (typeof window.Tawk_API.popup === "function") {
          window.Tawk_API.popup();
        }
      } catch (err) {
        console.warn("Tawk chat trigger:", err);
      }
    }
    toast.info("Connecting to live support team...");
  };

  return (
    <div className="space-y-6 max-w-5xl relative pb-16">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight">
          Support
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 font-normal">
          Connect with our support team
        </p>
      </div>

      {/* Main Support Card */}
      <div className="bg-white border border-gray-200/90 rounded-2xl sm:rounded-3xl p-8 sm:p-16 md:p-20 shadow-2xs flex flex-col items-center justify-center text-center min-h-[380px] sm:min-h-[440px]">
        {/* Circle Avatar / Speech Icon */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#f1f3f5] border border-gray-200/60 flex items-center justify-center mb-6 shadow-2xs">
          <MessageSquare className="w-8 h-8 sm:w-9 sm:h-9 text-gray-900 stroke-[1.75]" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight mb-3">
          Connect with Support
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed font-normal mb-8">
          Our dedicated support team is available 24/7 to assist you with any
          questions or concerns about your account, products, or commissions.
        </p>

        {/* Live Chat Action Button */}
        <button
          onClick={handleLiveChat}
          className="bg-[#18181b] hover:bg-black text-white px-7 py-3 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95 border border-transparent"
        >
          <MessageSquare className="w-4 h-4 text-white" />
          <span>Live Chat</span>
          <ExternalLink className="w-3.5 h-3.5 text-white/80" />
        </button>
      </div>


    </div>
  );
}
