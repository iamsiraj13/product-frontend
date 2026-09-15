'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Interview } from '@/types';

interface VideoModalProps {
  interview: Interview | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ interview, onClose }) => {
  if (!interview) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-stone-800">
        {/* Header bar */}
        <div className="flex items-center justify-between p-4 px-6 bg-stone-900 border-b border-stone-800 text-white">
          <div>
            <h3 className="font-serif-luxury font-bold text-lg">{interview.name}</h3>
            <p className="text-xs text-stone-400">{interview.role} • {interview.duration}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Close video player"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={interview.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
            title={interview.name}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};
