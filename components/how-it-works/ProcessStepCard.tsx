'use client';

import React from 'react';
import { UserCheck, BarChart3, Coins } from 'lucide-react';
import { ProcessStep } from '@/types';

interface ProcessStepCardProps {
  step: ProcessStep;
}

export const ProcessStepCard: React.FC<ProcessStepCardProps> = ({ step }) => {
  const getIcon = () => {
    switch (step.iconName) {
      case 'Register':
        return <UserCheck className="w-8 h-8 text-gray-800" />;
      case 'OptimizeData':
        return <BarChart3 className="w-8 h-8 text-gray-800" />;
      case 'EarnCommissions':
        return <Coins className="w-8 h-8 text-gray-800" />;
      default:
        return <UserCheck className="w-8 h-8 text-gray-800" />;
    }
  };

  return (
    <div className="relative flex flex-col items-center text-center p-8 md:p-10 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      {/* Step Badge */}
      <span className="mb-6 px-4 py-1 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-sm shadow-xs">
        Step {step.stepNumber}
      </span>

      {/* Icon Circle */}
      <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-black group-hover:text-white transition-all duration-300">
        <div className="group-hover:text-white transition-colors">
          {getIcon()}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-serif-luxury text-xl font-bold text-gray-900 mb-3">
        {step.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
        {step.description}
      </p>
    </div>
  );
};
