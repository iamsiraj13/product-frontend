'use client';

import React from 'react';
import { testimonialsData } from '@/data/testimonialsData';
import { TestimonialCard } from './TestimonialCard';
import { SectionHeading } from '../ui/SectionHeading';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-[#FAF9F6]">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <SectionHeading
          subtitle="TESTIMONIALS"
          title="What Our Agents Say"
          align="center"
        />

        <div className="space-y-6">
          {testimonialsData.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};
