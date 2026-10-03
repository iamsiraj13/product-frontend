"use client";

import React, { useState } from "react";
import { Copy, Check, Info, RefreshCw } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export default function EmployeeIdPage() {
  const { user } = useAuthStore();
  const { data: profile, isLoading, isError, refetch } = useProfile();

  const [copiedId, setCopiedId] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const employeeId = profile?.id || user?.id || "133";
  const invitationCode = profile?.invitationCode || "PD4495PX";

  const handleCopyId = (idText: string) => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      const textToCopy = idText.startsWith("#") ? idText : `#${idText}`;
      navigator.clipboard.writeText(textToCopy);
      setCopiedId(true);
      toast.success("Employee ID copied to clipboard!");
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleCopyCode = (codeText: string) => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(codeText);
      setCopiedCode(true);
      toast.success("Invitation code copied to clipboard!");
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl relative pb-16">
      {/* Error Alert Banner if profile fetch fails */}
      {isError && (
        <div className="bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800 flex items-center justify-between rounded-xs">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Could not connect to live profile service. Showing cached details.
            </span>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 font-semibold text-amber-900 hover:underline cursor-pointer ml-3 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight">
          Employee ID
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 font-normal">
          Your unique agent identification
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          <div className="bg-white border border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-200" />
            <div className="h-4 w-32 bg-gray-200 rounded-xs" />
            <div className="h-10 w-24 bg-gray-200 rounded-xs" />
            <div className="h-10 w-44 bg-gray-200 rounded-full" />
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
            <div className="h-5 w-36 bg-gray-200 rounded-xs" />
            <div className="h-4 w-3/4 bg-gray-200 rounded-xs" />
            <div className="h-14 w-full bg-gray-100 rounded-xl" />
          </div>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {/* Card 1: Employee ID */}
          <div className="bg-white border border-gray-200/90 rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-2xs flex flex-col items-center justify-center text-center space-y-4">
            {/* Circle Check Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#f1f3f5] border border-gray-200/60 flex items-center justify-center mb-1">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-gray-900/80 flex items-center justify-center">
                <Check className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900 stroke-[2.5]" />
              </div>
            </div>

            <span className="text-xs sm:text-sm text-gray-500 font-medium">
              Your Employee ID
            </span>

            <div className="text-3xl sm:text-4xl font-bold font-sans text-gray-900 tracking-tight">
              {invitationCode}
            </div>

            <button
              onClick={() => handleCopyId(employeeId)}
              className="bg-[#18181b] hover:bg-black text-white px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95 border border-transparent mt-2"
            >
              {copiedId ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4 text-white" />
              )}
              <span>{copiedId ? "Copied!" : "Copy Employee ID"}</span>
            </button>
          </div>

          {/* Card 2: Invitation Code */}
          <div className="bg-white border border-gray-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-gray-900 tracking-tight">
                Invitation Code
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 font-normal leading-relaxed">
                Share this code with others to invite them to Crate&Barrel. They
                will need it during registration.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 bg-[#f8f9fa] border border-gray-200/90 rounded-xl sm:rounded-2xl py-4 sm:py-5 px-6 flex items-center justify-center text-center shadow-2xs">
                <span className="font-mono text-xl sm:text-2xl font-bold text-gray-900 tracking-wider">
                  {invitationCode}
                </span>
              </div>
              <button
                onClick={() => handleCopyCode(invitationCode)}
                className="bg-white border border-gray-200/90 hover:bg-gray-50 text-gray-700 p-4 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-200 cursor-pointer shadow-2xs active:scale-95 flex items-center justify-center shrink-0"
                title="Copy Invitation Code"
              >
                {copiedCode ? (
                  <Check className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Card 3: About Your ID */}
          <div className="bg-white border border-gray-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xs space-y-3">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-gray-900 tracking-tight">
              About Your ID
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
              Your Employee ID is a unique identifier assigned to you when you
              joined Crate&Barrel. Use this ID for all official communications,
              referrals, and support inquiries. Keep it safe and do not share
              it publicly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
