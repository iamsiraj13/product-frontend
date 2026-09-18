"use client";

import React from "react";
import {
  FileText,
  TrendingUp,
  DollarSign,
  ArrowDownToLine,
  Wallet,
  HelpCircle,
  ShieldCheck,
  BadgeCheck,
  Info,
  Award,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

interface DashboardProduct {
  badge: string;
  title: string;
  price: string;
  image: string;
}

const featuredProducts: DashboardProduct[] = [
  {
    badge: "#18",
    title:
      "82' Loveseat Cloud Couch, Brown Chenille Modern Upholstered 2-Seater Sofa with Tufted Deep Seat & Wood Legs, Comfy Small Love Seat Couch for Living Room Apartment",
    price: "$2100.00",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
  },
  {
    badge: "#17",
    title:
      '55" Small Boneless Couch, 3-in-1 Boneless Loveseat Sleeper Sofa Bed Convertible Sofa Bed with 4 Pillows, Black Corduroy Boneless Couch for Living Room, Guest Room, Small Space, No Assembly Required',
    price: "$1699.00",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800",
  },
  {
    badge: "#16",
    title: 'Ipanema 86" Outdoor Dining Table with Wicker Dining Chairs',
    price: "$2199.00",
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800",
  },
  {
    badge: "#14",
    title:
      'Annie 149" Charcoal Brown Wood Storage Media Console Set by Leanne Ford',
    price: "$1899.00",
    image:
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800",
  },
  {
    badge: "#13",
    title: "Sogno Chaise Lounge",
    price: "$745.50",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
  },
  {
    badge: "#12",
    title: "Caterina Natural Upholstered Office Chair with Brass Base",
    price: "$3458.99",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800",
  },
  {
    badge: "#11",
    title: 'Alfresco 108" Black Rectangular Outdoor Dining Table',
    price: "$1785.50",
    image:
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80&w=800",
  },
  {
    badge: "#10",
    title: 'Portico 84" Marble and Warm Brown Oak Rectangular Leg Dining Table',
    price: "$2915.99",
    image:
      "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&q=80&w=800",
  },
  {
    badge: "#9",
    title: "Apero Swivel Accent Chair",
    price: "$1899.55",
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800",
  },
];

const quickActions = [
  {
    label: "Withdraw",
    icon: ArrowDownToLine,
    bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    label: "Wallet",
    icon: Wallet,
    bg: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    label: "Support",
    icon: HelpCircle,
    bg: "bg-amber-50 text-amber-600 border-amber-100",
  },
  {
    label: "Security",
    icon: ShieldCheck,
    bg: "bg-rose-50 text-rose-600 border-rose-100",
  },
  {
    label: "ID",
    icon: BadgeCheck,
    bg: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    label: "About",
    icon: Info,
    bg: "bg-teal-50 text-teal-600 border-teal-100",
  },
  {
    label: "T&C",
    icon: FileText,
    bg: "bg-orange-50 text-orange-600 border-orange-100",
  },
  {
    label: "Certificate",
    icon: Award,
    bg: "bg-pink-50 text-pink-600 border-pink-100",
  },
];

export default function DashboardMainPage() {
  const { user } = useAuthStore();
  const username = user?.username || "sirajul";
  const balance = user?.balance !== undefined ? `$${user.balance}` : "$0.00";

  const handleActionClick = (label: string) => {
    toast.info(`${label} quick action selected`);
  };

  return (
    <div className="space-y-8">
      {/* Account Balance Summary Banner */}
      <div className="bg-[#171717] text-white p-6 sm:p-8 rounded-none shadow-xs">
        <span className="text-xs text-gray-400 font-medium block">
          Total Balance
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif text-white font-medium tracking-tight mt-1">
          {balance}
        </h1>
        <span className="text-xs text-gray-400 font-medium mt-1 mb-6 block">
          @{username}
        </span>

        {/* 3 Sub-Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* Subcard 1 */}
          <div className="bg-[#262626] p-4 text-center rounded-none flex flex-col items-center justify-center">
            <FileText className="w-4 h-4 text-gray-300 mb-1" />
            <span className="text-xl font-bold text-white leading-tight">
              0
            </span>
            <span className="text-[11px] text-gray-400 font-medium mt-0.5">
              Uploaded Data
            </span>
          </div>

          {/* Subcard 2 */}
          <div className="bg-[#262626] p-4 text-center rounded-none flex flex-col items-center justify-center">
            <TrendingUp className="w-4 h-4 text-gray-300 mb-1" />
            <span className="text-xl font-bold text-white leading-tight">
              31
            </span>
            <span className="text-[11px] text-gray-400 font-medium mt-0.5">
              Total Products
            </span>
          </div>

          {/* Subcard 3 */}
          <div className="bg-[#262626] p-4 text-center rounded-none flex flex-col items-center justify-center">
            <DollarSign className="w-4 h-4 text-gray-300 mb-1" />
            <span className="text-xl font-bold text-white leading-tight">
              $0.00
            </span>
            <span className="text-[11px] text-gray-400 font-medium mt-0.5">
              Earned Commission
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-3">
          QUICK ACTIONS
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => handleActionClick(action.label)}
                className="bg-white border border-gray-200 py-3.5 px-2 flex flex-col items-center justify-center hover:border-gray-300 hover:shadow-xs transition-all cursor-pointer rounded-xs"
              >
                <div
                  className={`w-7 h-7 rounded-xs flex items-center justify-center border ${action.bg}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-semibold text-gray-700 mt-2 text-center">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Banner Section */}
      <div className="bg-[#171717] text-white py-12 sm:py-16 px-8 rounded-none text-center sm:text-left flex items-center justify-start">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium text-white tracking-wide">
          Crate & Barrel Awaits
        </h2>
      </div>

      {/* Featured Products Section */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-4">
          FEATURED PRODUCTS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredProducts.map((prod, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 overflow-hidden flex flex-col hover:border-gray-300 transition-all rounded-xs"
            >
              {/* Image with badge */}
              <div className="relative w-full h-48 sm:h-52 bg-gray-100 overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-2xs">
                  {prod.badge}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug line-clamp-4">
                  {prod.title}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Price:{" "}
                  <span className="text-gray-900 font-semibold">
                    {prod.price}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
