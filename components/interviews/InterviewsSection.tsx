'use client';

import React, { useState } from 'react';
import { interviewsData } from '@/data/interviewsData';
import { InterviewCard } from './InterviewCard';
import { VideoModal } from './VideoModal';
import { SectionHeading } from '../ui/SectionHeading';
import { Interview } from '@/types';

export const InterviewsSection: React.FC = () => {
  const [activeInterview, setActiveInterview] = useState<Interview | null>(null);

  return (
    <section className="py-20 md:py-28 bg-[#FAF9F6] border-t border-gray-200/60">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeading
          subtitle="FEATURED STORIES"
          title="Interviews"
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {interviewsData.map((interview) => (
            <InterviewCard
              key={interview.id}
              interview={interview}
              onPlay={(item) => setActiveInterview(item)}
            />
          ))}
        </div>
      </div>

      <VideoModal
        interview={activeInterview}
        onClose={() => setActiveInterview(null)}
      />
    </section>
  );
};
