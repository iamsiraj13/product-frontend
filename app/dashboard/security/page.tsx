"use client";

import React from "react";
import { Shield, Lock, Fingerprint, Eye, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function SecurityPage() {
  const securityFeatures = [
    {
      id: "encryption",
      title: "End-to-End Encryption",
      description:
        "All data transmitted between you and our servers is encrypted using AES-256 encryption, ensuring your information is always protected.",
      icon: Shield,
    },
    {
      id: "2fa",
      title: "Two-Factor Authentication",
      description:
        "Enable 2FA to add an extra layer of security to your account. We support authenticator apps and SMS verification.",
      icon: Lock,
    },
    {
      id: "biometric",
      title: "Biometric Security",
      description:
        "Our mobile app supports fingerprint and face recognition for quick and secure access to your account.",
      icon: Fingerprint,
    },
    {
      id: "privacy",
      title: "Privacy First",
      description:
        "We never share your personal data with third parties. Your privacy is our top priority, and we comply with GDPR and other international standards.",
      icon: Eye,
    },
  ];

  const bestPractices = [
    "Use a strong, unique password for your Crate&Barrel account",
    "Enable two-factor authentication for added protection",
    "Never share your login credentials with anyone",
    "Regularly review your account activity and report any suspicious behavior",
    "Keep your wallet address information secure and up to date",
  ];

  const handleSupportClick = () => {
    toast.info("Connecting to C&B Support...");
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl relative pb-16">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight">
          Security
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1.5 font-normal">
          Your safety is our top priority
        </p>
      </div>

      {/* 2x2 Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {securityFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.id}
              className="bg-white border border-gray-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4 hover:border-gray-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl sm:rounded-2xl bg-gray-100 flex items-center justify-center text-gray-800 border border-gray-200/60 mb-5">
                  <Icon className="w-5 h-5 text-gray-800" />
                </div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-gray-900 tracking-tight">
                  {feature.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mt-2 font-normal">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Best Practices Section */}
      <div className="bg-white border border-gray-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
        <h2 className="text-lg sm:text-xl font-serif font-bold text-gray-900 tracking-tight">
          Security Best Practices
        </h2>
        <ul className="space-y-2.5 text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
          {bestPractices.map((practice, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="text-gray-900 font-bold text-sm leading-normal select-none">
                •
              </span>
              <span>{practice}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
