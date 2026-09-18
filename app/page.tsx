"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/hero/Hero";
import { DataOptimization } from "@/components/about/DataOptimization";
import { ProductSection } from "@/components/products/ProductSection";
import { HowItWorks } from "@/components/how-it-works/HowItWorks";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import { InterviewsSection } from "@/components/interviews/InterviewsSection";
import { Footer } from "@/components/layout/Footer";
import { LoginModal } from "@/components/ui/LoginModal";

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF9F6] selection:bg-black selection:text-white">
      {/* Top Header Navbar */}
      <Navbar onOpenLogin={() => setIsLoginOpen(true)} />

      {/* Hero Section */}
      <Hero onOpenLogin={() => setIsLoginOpen(true)} />

      {/* About Section: Data Optimization */}
      <DataOptimization />

      {/* Product Catalog Section */}
      <ProductSection />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Agent Testimonials Section */}
      <TestimonialsSection />

      {/* Featured Interview Stories Section */}
      <InterviewsSection />

      {/* Footer */}
      <Footer />

      {/* Login Dialog Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </main>
  );
}
