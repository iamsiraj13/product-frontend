'use client';

import React from 'react';
import { howItWorksData } from '@/data/howItWorksData';
import { ProcessStepCard } from './ProcessStepCard';
import { SectionHeading } from '../ui/SectionHeading';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-[#FAF9F6] border-t border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeading
          subtitle="PROCESS"
          title="How It Works"
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {howItWorksData.map((step) => (
            <ProcessStepCard key={step.stepNumber} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
};
