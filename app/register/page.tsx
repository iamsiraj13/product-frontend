import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Register | HNI Corporation Portal",
  description:
    "Create your exclusive Crate & Barrel agent portal account for luxury interior solutions.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between p-4 sm:p-6 md:p-10 relative overflow-hidden">
      {/* Top Header / Nav back */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-600 hover:text-black transition-colors bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200/80 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="font-serif-luxury text-xl font-bold tracking-widest text-gray-900 uppercase">
          CRATE & BARREL
        </div>
      </div>

      {/* Main Registration Container */}
      <div className="my-10 flex items-center justify-center z-10">
        <RegisterForm />
      </div>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto text-center text-xs text-gray-400 z-10 py-4">
        &copy; {new Date().getFullYear()} Crate & Barrel Agent Portal. All
        rights reserved.
      </footer>
    </main>
  );
}
