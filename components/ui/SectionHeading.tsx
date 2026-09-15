import React from 'react';

interface SectionHeadingProps {
  subtitle: string;
  title: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  subtitle,
  title,
  align = 'center',
  className = '',
}) => {
  return (
    <div className={`mb-12 ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}>
      <span className="inline-block text-xs uppercase tracking-[0.25em] text-gray-500 font-semibold mb-2">
        {subtitle}
      </span>
      <h2 className="font-serif-luxury text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
        {title}
      </h2>
    </div>
  );
};
