"use client";

import React from "react";
import { Gem, Globe, Users, TrendingUp, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function AboutPage() {
  const handleSupportClick = () => {
    toast.info("Connecting to HNI Support...");
  };

  const featureCards = [
    {
      id: "premium-products",
      title: "Premium Products",
      description:
        "Access to the worlds most luxurious and exclusive products, from yachts to haute couture.",
      icon: Gem,
    },
    {
      id: "global-reach",
      title: "Global Reach",
      description:
        "Our platform serves agents in over 150 countries, creating a truly global luxury network.",
      icon: Globe,
    },
    {
      id: "agent-network",
      title: "Agent Network",
      description:
        "Join a growing community of thousands of agents earning commissions through data optimization.",
      icon: Users,
    },
    {
      id: "growth",
      title: "Growth",
      description:
        "Our innovative commission structure ensures that your earnings grow alongside your engagement.",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl relative pb-16">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight">
          About HNI Corporation
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 font-normal">
          Our mission and vision
        </p>
      </div>

      {/* Top Hero Section: Image Card Left + Who We Are Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Left: Coffee Table Image with Credit Card Overlay */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200/90 shadow-2xs group min-h-[300px] sm:min-h-[360px] bg-neutral-900 flex items-center justify-center">
          <img
            src="/about-hero.jpg"
            alt="HNI Corporation Interior Aesthetics"
            className="w-full h-full object-cover brightness-[0.92] transition-transform duration-500 group-hover:scale-[1.02]"
          />
          {/* Subtle gradient overlay to make card pop */}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />

          {/* Credit Card Overlay centered over image */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-60 sm:w-72 bg-white/95 backdrop-blur-md border border-white/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-2xl text-gray-900 flex flex-col justify-between aspect-[1.586/1] transform transition-transform duration-300 group-hover:scale-[1.03] select-none">
              {/* Card Header: Brand Logo */}
              <div className="flex items-center justify-between">
                <span className="font-serif font-extrabold text-sm sm:text-base tracking-wider text-gray-900 uppercase">
                  HNI Corporation
                </span>
              </div>

              {/* Card Middle: Metallic Chip */}
              <div className="my-2">
                <div className="w-9 h-7 bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-400 rounded-md border border-amber-500/40 relative shadow-2xs overflow-hidden flex items-center justify-center">
                  <div className="w-full h-[1px] bg-amber-600/30 absolute top-2" />
                  <div className="w-full h-[1px] bg-amber-600/30 absolute bottom-2" />
                  <div className="h-full w-[1px] bg-amber-600/30 absolute left-3" />
                  <div className="h-full w-[1px] bg-amber-600/30 absolute right-3" />
                </div>
              </div>

              {/* Card Bottom: Sub-logos & Visa Signature */}
              <div className="flex items-end justify-between text-[9px] sm:text-[10px] text-gray-600 font-medium">
                <div className="flex items-center gap-1 text-[8px] sm:text-[9px] font-semibold text-gray-500">
                  <span>HNI&kids</span>
                  <span>CB2</span>
                  <span>HUDSON GRACE</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-blue-900 italic font-sans text-xs sm:text-sm tracking-tight block leading-none">
                    VISA
                  </span>
                  <span className="text-[7px] sm:text-[8px] uppercase tracking-widest text-gray-400 block font-sans">
                    Signature
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Who We Are Card Box */}
        <div className="bg-white border border-gray-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xs flex flex-col justify-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
            Who We Are
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
            <p>
              HNI Corporation is a premier luxury platform that connects
              discerning individuals with the worlds most exclusive products
              and experiences. Founded on the principles of excellence,
              innovation, and exclusivity, we provide our agents with
              unparalleled opportunities to earn while engaging with the finest
              offerings the world has to offer.
            </p>
            <p>
              Our platform leverages cutting-edge data optimization technology
              to ensure that every interaction is meaningful and rewarding.
              Whether you are a seasoned professional or just beginning your
              journey, HNI Corporation provides the tools and resources you
              need to succeed.
            </p>
          </div>
        </div>
      </div>

      {/* 2x2 Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {featureCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white border border-gray-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xs hover:border-gray-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-800 border border-gray-200/60 mb-4">
                  <Icon className="w-5 h-5 text-gray-800" />
                </div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-gray-900 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mt-2 font-normal">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Our Mission Card Box */}
      <div className="bg-white border border-gray-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xs space-y-3">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
          Our Mission
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
          To democratize access to luxury experiences and empower individuals
          worldwide to build sustainable income streams through innovative data
          optimization and a world-class product marketplace. We believe that
          luxury should not be a privilege of the few, but an opportunity
          accessible to dedicated, ambitious agents everywhere.
        </p>
      </div>


    </div>
  );
}
