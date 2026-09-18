"use client";

import React, { useState } from "react";
import { History as HistoryIcon } from "lucide-react";

export default function DashboardHistoryPage() {
  const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Completed">("All");

  const tabs: Array<"All" | "Pending" | "Completed"> = ["All", "Pending", "Completed"];

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900">
          History
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Your recent reviews and earned commissions
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs sm:text-sm transition-colors cursor-pointer pb-2.5 ${
                activeTab === tab
                  ? "border-b-2 border-black font-semibold text-black"
                  : "text-gray-500 hover:text-black font-medium"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State Box */}
      <div className="bg-white border border-gray-200 p-14 sm:p-20 text-center rounded-none shadow-2xs my-4">
        <HistoryIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-gray-900">No History Yet</h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Start reviewing products to see your history here.
        </p>
      </div>
    </div>
  );
}
