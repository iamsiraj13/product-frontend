"use client";

import React, { useState } from "react";
import { Zap, DollarSign, X, Play, Package, Loader2, Star, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfile } from "@/hooks/useProfile";
import { userTasksApi } from "@/lib/api/userTasks";
import { extractErrorMessage } from "@/lib/api/api-client";
import { UserTaskItem } from "@/types/task";
import { toast } from "sonner";

const formatImageUrl = (url?: string): string => {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  ) {
    return url;
  }
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `http://localhost:4000${cleanPath}`;
};

const COMMENT_OPTIONS = [
  "Excellent product quality and premium finish!",
  "Highly recommended! Fast processing and smooth experience.",
  "Great value for money, very satisfied with the purchase.",
  "Top-tier performance and high quality build.",
  "Outstanding service and authentic item quality.",
];

export default function DataOptimizationPage() {
  const { user } = useAuthStore();
  const { data: profile, refetch: refetchProfile } = useProfile();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [generatedTask, setGeneratedTask] = useState<UserTaskItem | null>(null);
  const [selectedCommentIndex, setSelectedCommentIndex] = useState<number | null>(0);

  const rawBalance = profile?.balance ?? user?.balance ?? "0";
  const balance = `$${Number(rawBalance || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const totalTask = profile?.todayTaskProgress?.dailyLimit ?? 0;
  const completedTask = profile?.todayTaskProgress?.completedToday ?? 0;
  const totalCommission = `$${Number(profile?.commissionSummary?.totalEarned || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const handleGenerateProduct = async () => {
    setIsGenerating(true);
    const toastId = toast.loading("Generating product task...");

    try {
      const response = await userTasksApi.generateTask();
      toast.dismiss(toastId);

      if (response.success && response.data) {
        setGeneratedTask(response.data);
        setTaskModalOpen(true);
        refetchProfile();
        toast.success("Task product generated successfully!");
      } else {
        toast.error("Failed to generate task product.");
      }
    } catch (error) {
      toast.dismiss(toastId);
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartTask = async () => {
    if (!generatedTask?.id) return;
    setIsStarting(true);
    const toastId = toast.loading("Starting task...");

    try {
      const response = await userTasksApi.startTask(generatedTask.id);
      toast.dismiss(toastId);

      if (response.success) {
        if (response.data && response.data.id) {
          setGeneratedTask(response.data);
        } else {
          setGeneratedTask((prev) => (prev ? { ...prev, status: "IN_PROGRESS" } : null));
        }
        toast.success("Task started successfully!");
        setTaskModalOpen(false);
        setReviewModalOpen(true);
      } else {
        toast.error("Failed to start task.");
      }
    } catch (error) {
      toast.dismiss(toastId);
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsStarting(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!generatedTask?.id || selectedCommentIndex === null) {
      toast.error("Task ID is missing. Please refresh and try again.");
      return;
    }
    const selectedComment = COMMENT_OPTIONS[selectedCommentIndex];
    setIsSubmitting(true);
    const toastId = toast.loading("Submitting task review...");

    try {
      const response = await userTasksApi.submitTask(generatedTask.id, {
        rating: 5,
        comment: selectedComment,
      });
      toast.dismiss(toastId);

      if (response.success) {
        toast.success("Task review submitted successfully!");
        setReviewModalOpen(false);
        setGeneratedTask(null);
        refetchProfile();
      } else {
        toast.error("Failed to submit task review.");
      }
    } catch (error) {
      toast.dismiss(toastId);
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900">
          Data Optimization
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Generate and submit product reviews to earn commissions
        </p>
      </div>

      {/* Top Dark Card */}
      <div className="bg-[#171717] text-white p-6 sm:p-8 rounded-none shadow-xs">
        <span className="text-xs text-gray-400 font-medium block">Current Balance</span>
        <h2 className="text-4xl sm:text-5xl font-serif text-white font-medium tracking-tight mt-1 mb-6">
          {balance}
        </h2>

        {/* 3 Sub-Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">

          <div className="bg-[#262626] p-4 text-center rounded-none flex flex-col items-center justify-center">
            <Zap className="w-4 h-4 text-gray-300 mb-1" />
            <span className="text-xl font-bold text-white leading-tight">
              {totalTask}
            </span>
            <span className="text-[11px] text-gray-400 font-medium mt-0.5">
              Total Task
            </span>
          </div>


          <div className="bg-[#262626] p-4 text-center rounded-none flex flex-col items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-gray-300 mb-1" />
            <span className="text-xl font-bold text-white leading-tight">
              {completedTask}
            </span>
            <span className="text-[11px] text-gray-400 font-medium mt-0.5">
              Completed Task
            </span>
          </div>


          <div className="bg-[#262626] p-4 text-center rounded-none flex flex-col items-center justify-center">
            <DollarSign className="w-4 h-4 text-gray-300 mb-1" />
            <span className="text-xl font-bold text-white leading-tight">
              {totalCommission}
            </span>
            <span className="text-[11px] text-gray-400 font-medium mt-0.5">
              Total Commission
            </span>
          </div>
        </div>
      </div>

      {/* Main Action Area */}
      <div className="pt-8 pb-6 text-center space-y-3">
        <div>
          <button
            onClick={handleGenerateProduct}
            disabled={isGenerating}
            className="bg-black hover:bg-gray-800 disabled:bg-gray-600 text-white px-7 py-3 rounded-none inline-flex items-center gap-2 text-sm font-semibold cursor-pointer transition-colors shadow-xs"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <span>{isGenerating ? "Generating..." : "Generate Product"}</span>
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Click to generate a random product and start earning
        </p>
      </div>

      {/* Generated Task Modal */}
      {taskModalOpen && generatedTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 shadow-2xl max-w-md w-full p-6 space-y-5 rounded-none text-gray-900 relative animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="bg-black text-white text-[11px] font-semibold px-2 py-0.5">
                  Step #{generatedTask.stepNumber}
                </span>
                <h3 className="font-serif font-medium text-lg text-gray-900">
                  Task Generated
                </h3>
              </div>
              <button
                onClick={() => setTaskModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Image & Info */}
            <div className="space-y-4">
              {generatedTask.product?.image ? (
                <div className="w-full h-48 bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formatImageUrl(generatedTask.product.image)}
                    alt={generatedTask.product.title || "Product Image"}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              ) : (
                <div className="w-full h-36 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                  <Package className="w-8 h-8 mb-1 stroke-1" />
                  <span className="text-xs">No Image Available</span>
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-900 text-base leading-snug">
                  {generatedTask.product?.title || "Product Title Unavailable"}
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Status: <span className="font-semibold text-gray-700">{generatedTask.status}</span>
                </p>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 border border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400 block text-[11px]">Price</span>
                  <span className="font-bold text-gray-900 text-sm">
                    ${generatedTask.priceSnapshot || generatedTask.product?.price || "0.00"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Commission</span>
                  <span className="font-bold text-emerald-600 text-sm">
                    ${generatedTask.commissionSnapshot || generatedTask.product?.commission || "0.00"}
                  </span>
                </div>
                {generatedTask.product?.commissionRate && (
                  <div>
                    <span className="text-gray-400 block text-[11px]">Commission Rate</span>
                    <span className="font-medium text-gray-700">
                      {generatedTask.product.commissionRate}%
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-gray-400 block text-[11px]">Task ID</span>
                  <span className="font-mono text-[10px] text-gray-500 truncate block">
                    {generatedTask.id.slice(0, 8)}...
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2">
              <button
                onClick={handleStartTask}
                disabled={isStarting}
                className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-600 text-white font-semibold py-3 text-sm cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                {isStarting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                <span>{isStarting ? "Starting..." : "Start"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Review & Rating Modal */}
      {reviewModalOpen && generatedTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 shadow-2xl max-w-md w-full p-6 space-y-5 rounded-none text-gray-900 relative animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-serif font-medium text-lg text-gray-900">
                  Task Review
                </h3>
                <p className="text-xs text-gray-400">
                  Select a review comment to complete task
                </p>
              </div>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Read-only 5 Star Rating */}
            <div className="bg-gray-50 border border-gray-100 p-4 text-center space-y-1">
              <span className="text-xs font-medium text-gray-500 block uppercase tracking-wider">
                Product Rating
              </span>
              <div className="flex items-center justify-center gap-1 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-6 h-6 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400 block font-medium">
                5.0 / 5.0 (Read-only)
              </span>
            </div>

            {/* 5 Comment Options (Checkboxes - Single Select) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 block uppercase tracking-wide">
                Select Comment
              </label>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {COMMENT_OPTIONS.map((comment, index) => {
                  const isSelected = selectedCommentIndex === index;
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedCommentIndex(index)}
                      className={`p-3 border cursor-pointer transition-all flex items-start gap-3 rounded-none ${isSelected
                        ? "border-black bg-gray-50 text-gray-900 shadow-xs"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50/50"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => setSelectedCommentIndex(index)}
                        className="mt-0.5 h-4 w-4 accent-black rounded-none cursor-pointer"
                      />
                      <span className="text-xs leading-relaxed font-medium">
                        {comment}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit / Finish Action */}
            <div className="pt-2">
              <button
                onClick={handleSubmitReview}
                disabled={isSubmitting || selectedCommentIndex === null}
                className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-600 text-white font-semibold py-3 text-sm cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>{isSubmitting ? "Submitting..." : "Submit Review"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



