'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { Testimonial } from '@/types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-center md:items-start gap-6">
      {/* Avatar Image */}
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden shrink-0 bg-stone-100 border border-gray-200">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
          <div>
            <h3 className="font-serif-luxury text-xl font-bold text-gray-900">
              {testimonial.name}
            </h3>
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mt-0.5">
              {testimonial.role}
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex items-center justify-center md:justify-end gap-1">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-black text-black" />
            ))}
          </div>
        </div>

        {/* Quote */}
        <p className="text-sm text-gray-600 leading-relaxed italic mt-3">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>
    </div>
  );
};
