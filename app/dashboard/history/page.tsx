"use client";

import React, { useState } from "react";
import {
  History as HistoryIcon,
  Loader2,
  RefreshCw,
  Star,
  X,
  CheckCircle2,
  Package,
} from "lucide-react";
import { usePendingTask } from "@/hooks/usePendingTask";
import { useSubmitTask } from "@/hooks/useSubmitTask";
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

export default function DashboardHistoryPage() {
  const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Completed">(
    "All",
  );

  // Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [selectedCommentIndex, setSelectedCommentIndex] = useState<
    number | null
  >(0);

  // TanStack Query Hooks
  const {
    data: pendingTaskResponse,
    isLoading: loading,
    isRefetching: refreshing,
    refetch: refetchPendingTask,
  } = usePendingTask();

  const submitTaskMutation = useSubmitTask({
    onSuccessCallback: () => {
      setReviewModalOpen(false);
      setSelectedCommentIndex(0);
    },
  });

  const pendingTask = pendingTaskResponse?.data || null;
  const isSubmitting = submitTaskMutation.isPending;

  const handleRefresh = async () => {
    const res = await refetchPendingTask();
    if (res.isSuccess) {
      toast.success("History refreshed");
    }
  };

  const handleActionClick = () => {
    if (!pendingTask?.id) return;
    setReviewModalOpen(true);
  };

  const handleSubmitReview = () => {
    if (!pendingTask?.id || selectedCommentIndex === null) return;
    const selectedComment = COMMENT_OPTIONS[selectedCommentIndex];

    submitTaskMutation.mutate({
      taskId: pendingTask.id,
      payload: {
        rating: 5,
        comment: selectedComment,
      },
    });
  };

  const tabs: Array<"All" | "Pending" | "Completed"> = [
    "All",
    "Pending",
    "Completed",
  ];

  const showPendingSection = activeTab === "All" || activeTab === "Pending";
  const showCompletedSection = activeTab === "Completed";

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900">
            History
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Your recent reviews and earned commissions
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="p-2 border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer rounded-none"
          title="Refresh History"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing || loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs sm:text-sm transition-colors cursor-pointer pb-2.5 ${
                activeTab === tab
                  ? "border-b-2 border-black font-semibold text-black"
                  : "text-gray-500 hover:text-black font-medium"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white border border-gray-200 p-14 text-center rounded-none shadow-2xs my-4">
          <Loader2 className="w-8 h-8 text-black animate-spin mx-auto mb-3" />
          <p className="text-xs sm:text-sm text-gray-500">
            Loading pending task...
          </p>
        </div>
      ) : (
        <>
          {/* Pending Tasks Section */}
          {showPendingSection && pendingTask && pendingTask.id ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Pending Task
                </h3>
              </div>

              {/* Minimal Table */}
              <div className="bg-white border border-gray-200 rounded-none shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Product</th>
                        <th className="py-3 px-4">Step</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Commission</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-900">
                      <tr className="hover:bg-gray-50/50 transition-colors">
                        {/* Product Column */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {pendingTask.product?.image ? (
                              <div className="w-10 h-10 bg-gray-50 border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={formatImageUrl(
                                    pendingTask.product.image,
                                  )}
                                  alt={pendingTask.product.title || "Product"}
                                  className="w-full h-full object-contain p-1"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center text-gray-400">
                                <Package className="w-5 h-5 stroke-1" />
                              </div>
                            )}
                            <div className="min-w-0 max-w-55 sm:max-w-xs">
                              <p className="font-semibold text-gray-900 truncate">
                                {pendingTask.product?.title || "Product"}
                              </p>
                              {pendingTask.id && (
                                <p className="text-[11px] text-gray-400 font-mono">
                                  ID: {pendingTask.id.slice(0, 8)}...
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Step Column */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="bg-black text-white text-[11px] font-semibold px-2 py-0.5">
                            #{pendingTask.stepNumber}
                          </span>
                        </td>

                        {/* Price Column */}
                        <td className="py-3 px-4 whitespace-nowrap font-semibold">
                          ${pendingTask.priceSnapshot}
                        </td>

                        {/* Commission Column */}
                        <td className="py-3 px-4 whitespace-nowrap font-bold text-emerald-600">
                          ${pendingTask.commissionSnapshot}
                        </td>

                        {/* Status Column */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide border ${
                              pendingTask.status === "GENERATED"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {pendingTask.status}
                          </span>
                        </td>

                        {/* Action Column */}
                        <td className="py-3 px-4 whitespace-nowrap text-right">
                          <button
                            onClick={handleActionClick}
                            className="bg-black hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-none transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Submit</span>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}

          {/* Empty State Box when no pending task or on Completed tab */}
          {((!pendingTask || !pendingTask.id) && showPendingSection) ||
          showCompletedSection ? (
            <div className="bg-white border border-gray-200 p-14 sm:p-20 text-center rounded-none shadow-2xs my-4">
              <HistoryIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-900">
                {showCompletedSection
                  ? "No Completed Tasks"
                  : "No Pending Tasks"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {showCompletedSection
                  ? "Completed task reviews will appear here."
                  : "Start reviewing products in Data Optimization to generate new tasks."}
              </p>
            </div>
          ) : null}
        </>
      )}

      {/* Task Review / Submit Modal */}
      {reviewModalOpen && pendingTask && pendingTask.id && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 shadow-2xl max-w-md w-full p-6 space-y-5 rounded-none text-gray-900 relative animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-serif font-medium text-lg text-gray-900">
                  Product Review
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
                      className={`p-3 border cursor-pointer transition-all flex items-start gap-3 rounded-none ${
                        isSelected
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
