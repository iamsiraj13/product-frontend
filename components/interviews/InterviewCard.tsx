'use client';

import React from 'react';
import { Play } from 'lucide-react';
import { Interview } from '@/types';

interface InterviewCardProps {
  interview: Interview;
  onPlay: (interview: Interview) => void;
}

export const InterviewCard: React.FC<InterviewCardProps> = ({ interview, onPlay }) => {
  return (
    <div className="flex flex-col bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
      {/* Video Thumbnail */}
      <div className="relative aspect-[4/3] w-full bg-stone-200 overflow-hidden cursor-pointer" onClick={() => onPlay(interview)}>
        <img
          src={interview.thumbnail}
          alt={interview.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Play Icon Overlay badge */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/90 group-hover:bg-white text-black flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 fill-black translate-x-0.5" />
          </div>
        </div>
      </div>

      {/* Details & Info */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-serif-luxury text-xl font-bold text-gray-900 mb-1">
            {interview.name}
          </h3>
          <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-3">
            {interview.role}
          </p>
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-4">
            {interview.description}
          </p>
        </div>

        {/* Bottom Play CTA bar matching screenshot */}
        <button
          onClick={() => onPlay(interview)}
          className="w-full py-2.5 px-4 bg-black hover:bg-stone-800 text-white text-xs font-semibold rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center">
            <Play className="w-2.5 h-2.5 fill-black translate-x-0.5" />
          </div>
          <span>Watch Interview ({interview.duration})</span>
        </button>
      </div>
    </div>
  );
};
