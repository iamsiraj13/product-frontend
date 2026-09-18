"use client";

import React, { useState } from "react";
import { Zap, DollarSign } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export default function DataOptimizationPage() {
  const { user } = useAuthStore();
  const [totalProducts, setTotalProducts] = useState(31);
  const [totalUploaded, setTotalUploaded] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const balance = user?.balance !== undefined ? `$${user.balance}` : "$0.00";

  const handleGenerateProduct = () => {
    setIsGenerating(true);
    toast.loading("Generating product data...");

    setTimeout(() => {
      setIsGenerating(false);
      setTotalUploaded((prev) => prev + 1);
      toast.dismiss();
      toast.success("Random product generated successfully!");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900">
          Data Optimization
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Generate and submit product reviews to earn commissions
        </p>
      </div>

      {/* Top Dark Card */}
      <div className="bg-[#171717] text-white p-6 sm:p-8 rounded-none shadow-xs">
        <span className="text-xs text-gray-400 font-medium block">Current Balance</span>
        <h2 className="text-4xl sm:text-5xl font-serif text-white font-medium tracking-tight mt-1 mb-6">
          {balance}
        </h2>

        {/* 3 Sub-Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* Subcard 1 */}
          <div className="bg-[#262626] p-4 text-center rounded-none flex flex-col items-center justify-center">
            <Zap className="w-4 h-4 text-gray-300 mb-1" />
            <span className="text-xl font-bold text-white leading-tight">
              {totalProducts}
            </span>
            <span className="text-[11px] text-gray-400 font-medium mt-0.5">
              Total Products
            </span>
          </div>

          {/* Subcard 2 */}
          <div className="bg-[#262626] p-4 text-center rounded-none flex flex-col items-center justify-center">
            <DollarSign className="w-4 h-4 text-gray-300 mb-1" />
            <span className="text-xl font-bold text-white leading-tight">
              {totalUploaded}
            </span>
            <span className="text-[11px] text-gray-400 font-medium mt-0.5">
              Total Uploaded
            </span>
          </div>

          {/* Subcard 3 */}
          <div className="bg-[#262626] p-4 text-center rounded-none flex flex-col items-center justify-center">
            <DollarSign className="w-4 h-4 text-gray-300 mb-1" />
            <span className="text-xl font-bold text-white leading-tight">$0.00</span>
            <span className="text-[11px] text-gray-400 font-medium mt-0.5">
              Earn Commission
            </span>
          </div>
        </div>
      </div>

      {/* Main Action Area */}
      <div className="pt-8 pb-6 text-center space-y-3">
        <div>
          <button
            onClick={handleGenerateProduct}
            disabled={isGenerating}
            className="bg-black hover:bg-gray-800 disabled:bg-gray-600 text-white px-7 py-3 rounded-none inline-flex items-center gap-2 text-sm font-semibold cursor-pointer transition-colors shadow-xs"
          >
            <Zap className="w-4 h-4" />
            <span>{isGenerating ? "Generating..." : "Generate Product"}</span>
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Click to generate a random product and start earning
        </p>
      </div>
    </div>
  );
}
