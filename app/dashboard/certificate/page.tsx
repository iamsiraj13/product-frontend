"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Download, ZoomIn, MessageCircle, X } from "lucide-react";
import { toast } from "sonner";

export default function CertificatePage() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/certificate.jpg";
    link.download = "business-authorization-certificate.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Certificate download started!");
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl relative pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight">
          Certificate
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 font-normal">
          Your achievement certificate
        </p>
      </div>

      {/* Main Certificate Card Container */}
      <div className="bg-white border border-gray-200/90 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-2xs space-y-4">
        {/* Certificate Display Area */}
        <div className="relative group overflow-hidden rounded-xl sm:rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center">
          <img
            src="/certificate.jpg"
            alt="Business Authorization Certificate"
            className="w-full h-auto max-w-4xl object-contain rounded-xl sm:rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-[1.005]"
          />

          {/* Quick Action Overlay Controls on Hover */}
          <div className="absolute top-4 right-4 flex items-center gap-2 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 bg-black/60 backdrop-blur-md p-1.5 rounded-xl border border-white/20">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
              title="View Full Size"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

          </div>
        </div>


      </div>

      {/* Fullscreen Image Preview Modal */}
      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-12 right-0 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="Close Preview"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src="/certificate.jpg"
              alt="Business Authorization Certificate Full View"
              className="max-h-[85vh] w-auto object-contain rounded-xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}


    </div>
  );
}
