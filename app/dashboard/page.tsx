"use client";

import React, { useState } from "react";
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
  Users,
  Copy,
  Check,
  ListTodo,
  RefreshCw,
  Mail,
  Phone,
  User as UserIcon,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfile } from "@/hooks/useProfile";
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

function BannerSkeleton() {
  return (
    <div className="bg-[#171717] text-white p-6 sm:p-8 rounded-none shadow-xs animate-pulse">
      <div className="h-3 w-24 bg-neutral-800 rounded-xs mb-3" />
      <div className="h-10 w-48 bg-neutral-800 rounded-xs mb-3" />
      <div className="h-3 w-40 bg-neutral-800 rounded-xs mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        <div className="bg-[#262626] p-4 text-center rounded-none flex flex-col items-center justify-center space-y-2.5 min-h-[90px]">
          <div className="w-4 h-4 bg-neutral-700 rounded-full" />
          <div className="h-5 w-20 bg-neutral-700 rounded-xs" />
          <div className="h-3 w-28 bg-neutral-700 rounded-xs" />
        </div>
        <div className="bg-[#262626] p-4 text-center rounded-none flex flex-col items-center justify-center space-y-2.5 min-h-[90px]">
          <div className="w-4 h-4 bg-neutral-700 rounded-full" />
          <div className="h-5 w-20 bg-neutral-700 rounded-xs" />
          <div className="h-3 w-28 bg-neutral-700 rounded-xs" />
        </div>
        <div className="bg-[#262626] p-4 text-center rounded-none flex flex-col items-center justify-center space-y-2.5 min-h-[90px]">
          <div className="w-4 h-4 bg-neutral-700 rounded-full" />
          <div className="h-5 w-20 bg-neutral-700 rounded-xs" />
          <div className="h-3 w-28 bg-neutral-700 rounded-xs" />
        </div>
      </div>
    </div>
  );
}

function ProfileSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 p-5 rounded-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-3.5 w-28 bg-gray-200 rounded-xs" />
            <div className="w-6 h-6 bg-gray-100 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-6 w-3/4 bg-gray-200 rounded-xs" />
            <div className="h-3 w-1/2 bg-gray-200 rounded-xs" />
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-xs" />
        </div>
      ))}
    </div>
  );
}

export default function DashboardMainPage() {
  const { user } = useAuthStore();
  const { data: profile, isLoading, isError, refetch } = useProfile();
  const [copiedCode, setCopiedCode] = useState(false);

  const username = profile?.username || user?.username || "sirajul";
  const rawBalance = profile?.balance ?? user?.balance ?? "0";
  const formattedBalance = `$${Number(rawBalance || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const handleActionClick = (label: string) => {
    toast.info(`${label} quick action selected`);
  };

  const handleCopyCode = (code: string) => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      toast.success("Invitation code copied to clipboard!");
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const completedToday = profile?.todayTaskProgress?.completedToday ?? 0;
  const dailyLimit = profile?.todayTaskProgress?.dailyLimit ?? 33;
  const remainingToday = profile?.todayTaskProgress?.remainingToday ?? 33;
  const totalGeneratedToday =
    profile?.todayTaskProgress?.totalGeneratedToday ?? 0;
  const taskProgressPercent = Math.min(
    100,
    Math.round((completedToday / (dailyLimit || 1)) * 100)
  );

  const totalEarned = profile?.commissionSummary?.totalEarned ?? 0;
  const todayEarned = profile?.commissionSummary?.todayEarned ?? 0;
  const inviteesCount = profile?._count?.invitees ?? 0;
  const invitedByUsername = profile?.invitedBy?.username || null;

  return (
    <div className="space-y-8">
      {/* Error Alert Banner if endpoint fails */}
      {isError && (
        <div className="bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800 flex items-center justify-between rounded-xs">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Could not connect to live profile service. Showing offline
              cached profile data.
            </span>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 font-semibold text-amber-900 hover:underline cursor-pointer ml-3 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Account Balance Summary Banner */}
      {isLoading ? (
        <BannerSkeleton />
      ) : (
        <div className="bg-[#171717] text-white p-6 sm:p-8 rounded-none shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium block">
              Total Balance
            </span>
            {profile?.accountType && (
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-neutral-800 text-neutral-300 border border-neutral-700 tracking-wider rounded-2xs">
                {profile.accountType} ACCOUNT
              </span>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl font-serif text-white font-medium tracking-tight mt-1">
            {formattedBalance}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-medium mt-1 mb-6">
            <span>@{username}</span>
            {profile?.invitationCode && (
              <>
                <span className="text-neutral-600">•</span>
                <span className="text-neutral-300 font-mono">
                  Code: {profile.invitationCode}
                </span>
              </>
            )}
            {profile?.role && (
              <>
                <span className="text-neutral-600">•</span>
                <span className="text-emerald-400 font-semibold text-[11px]">
                  {profile.role}
                </span>
              </>
            )}
          </div>

          {/* 3 Sub-Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {/* Subcard 1: Task Progress */}
            <div className="bg-[#262626] p-4 text-center rounded-none flex flex-col items-center justify-center border border-neutral-800/50 hover:border-neutral-700 transition-colors">
              <FileText className="w-4 h-4 text-gray-300 mb-1" />
              <span className="text-xl font-bold text-white leading-tight">
                {completedToday} / {dailyLimit}
              </span>
              <span className="text-[11px] text-gray-400 font-medium mt-0.5">
                Today Task Progress ({remainingToday} Left)
              </span>
            </div>

            {/* Subcard 2: Commission Summary */}
            <div className="bg-[#262626] p-4 text-center rounded-none flex flex-col items-center justify-center border border-neutral-800/50 hover:border-neutral-700 transition-colors">
              <TrendingUp className="w-4 h-4 text-emerald-400 mb-1" />
              <span className="text-xl font-bold text-white leading-tight">
                $
                {Number(totalEarned).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-[11px] text-gray-400 font-medium mt-0.5">
                Earned Commission (Today: ${todayEarned.toFixed(2)})
              </span>
            </div>

            {/* Subcard 3: Network & Invitees */}
            <div className="bg-[#262626] p-4 text-center rounded-none flex flex-col items-center justify-center border border-neutral-800/50 hover:border-neutral-700 transition-colors">
              <DollarSign className="w-4 h-4 text-blue-400 mb-1" />
              <span className="text-xl font-bold text-white leading-tight">
                {inviteesCount}
              </span>
              <span className="text-[11px] text-gray-400 font-medium mt-0.5">
                {invitedByUsername
                  ? `Invitees (Invited by @${invitedByUsername})`
                  : "Invitees"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Profile Overview Metrics Cards */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-3 flex items-center justify-between">
          <span>ACCOUNT PROFILE OVERVIEW</span>
          {profile?.createdAt && (
            <span className="text-[11px] font-normal normal-case text-gray-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-gray-400" />
              Joined{" "}
              {new Date(profile.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
        </h2>

        {isLoading ? (
          <ProfileSummarySkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Today's Task Progress */}
            <div className="bg-white border border-gray-200 p-4 sm:p-5 rounded-xs space-y-3 hover:border-gray-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Daily Task Progress
                  </span>
                  <div className="p-1 bg-amber-50 rounded-xs text-amber-600">
                    <ListTodo className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {completedToday}
                  </span>
                  <span className="text-xs text-gray-500">
                    / {dailyLimit} Tasks
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${taskProgressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 font-medium">
                  <span>{taskProgressPercent}% Completed</span>
                  <span>{remainingToday} Remaining</span>
                </div>
              </div>
            </div>

            {/* Card 2: Commission Summary */}
            <div className="bg-white border border-gray-200 p-4 sm:p-5 rounded-xs space-y-3 hover:border-gray-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Commission Summary
                  </span>
                  <div className="p-1 bg-emerald-50 rounded-xs text-emerald-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  $
                  {Number(totalEarned).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  Today Earned:{" "}
                  <span className="text-emerald-600 font-semibold">
                    +$
                    {Number(todayEarned).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </p>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>Account Status</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-2xs text-[10px]">
                  Active
                </span>
              </div>
            </div>

            {/* Card 3: Invitation Code & Network */}
            <div className="bg-white border border-gray-200 p-4 sm:p-5 rounded-xs space-y-3 hover:border-gray-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Referral & Code
                  </span>
                  <div className="p-1 bg-blue-50 rounded-xs text-blue-600">
                    <Users className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 px-3 py-2 rounded-xs">
                  <span className="font-mono text-sm font-bold text-gray-900 tracking-wider">
                    {profile?.invitationCode || "N/A"}
                  </span>
                  {profile?.invitationCode && (
                    <button
                      onClick={() => handleCopyCode(profile.invitationCode)}
                      className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors rounded-2xs cursor-pointer"
                      title="Copy invitation code"
                    >
                      {copiedCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-1 text-[11px] text-gray-500 font-medium">
                <div className="flex justify-between">
                  <span>Direct Invitees:</span>
                  <span className="font-semibold text-gray-900">
                    {inviteesCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Invited By:</span>
                  <span className="font-semibold text-gray-900">
                    {invitedByUsername ? `@${invitedByUsername}` : "Direct"}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4: Contact & Details */}
            <div className="bg-white border border-gray-200 p-4 sm:p-5 rounded-xs space-y-3 hover:border-gray-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Contact Details
                  </span>
                  <div className="p-1 bg-purple-50 rounded-xs text-purple-600">
                    <UserIcon className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-gray-700 truncate">
                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate font-medium">
                      {profile?.email || user?.email || "user@gmail.com"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="font-medium">
                      {profile?.phone || user?.phone || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>Account Type</span>
                <span className="font-semibold text-gray-900">
                  {profile?.accountType || "MAIN"}
                </span>
              </div>
            </div>
          </div>
        )}
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
