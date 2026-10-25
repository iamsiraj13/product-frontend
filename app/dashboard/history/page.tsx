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

function HistoryGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-none shadow-2xs overflow-hidden animate-pulse"
        >
          <div className="w-full h-48 bg-gray-100" />
          <div className="p-4 sm:p-5 space-y-3">
            <div className="h-4 bg-gray-200 w-3/4" />
            <div className="h-3 bg-gray-100 w-1/3" />
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="h-12 bg-gray-100" />
              <div className="h-12 bg-gray-100" />
            </div>
            <div className="h-10 bg-gray-200 w-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardHistoryPage() {
  const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Completed">(
    "All",
  );

  // Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<UserTaskItem | null>(null);
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
      setSelectedTask(null);
    },
  });

  const rawData = pendingTaskResponse?.data;
  const pendingTasks: UserTaskItem[] = Array.isArray(rawData)
    ? rawData
    : rawData && typeof rawData === "object" && "id" in rawData
    ? [rawData as UserTaskItem]
    : [];

  const isSubmitting = submitTaskMutation.isPending;

  const handleRefresh = async () => {
    const res = await refetchPendingTask();
    if (res.isSuccess) {
      toast.success("History refreshed");
    }
  };

  const handleActionClick = (task: UserTaskItem) => {
    if (!task?.id) return;
    setSelectedTask(task);
    setReviewModalOpen(true);
  };

  const handleSubmitReview = () => {
    if (!selectedTask?.id || selectedCommentIndex === null) return;
    const selectedComment = COMMENT_OPTIONS[selectedCommentIndex];

    submitTaskMutation.mutate({
      taskId: selectedTask.id,
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
  const hasPendingTasks = pendingTasks.length > 0;

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
        <div className="space-y-4">
          <HistoryGridSkeleton />
        </div>
      ) : (
        <>
          {/* 3-Column Grid for Pending Tasks */}
          {showPendingSection && hasPendingTasks ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Pending Tasks ({pendingTasks.length})
                </h3>
              </div>

              {/* 3-Column Responsive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white border border-gray-200 rounded-none shadow-2xs hover:shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      {/* Product Image Area with Badges */}
                      <div className="relative w-full h-44 sm:h-48 bg-gray-50/80 border-b border-gray-100 flex items-center justify-center p-4 overflow-hidden">
                        {task.product?.image ? (
                          <img
                            src={formatImageUrl(task.product.image)}
                            alt={task.product?.title || "Product"}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <Package className="w-10 h-10 stroke-1 mb-1" />
                            <span className="text-[11px] text-gray-400">
                              No image
                            </span>
                          </div>
                        )}

                        {/* Step Badge (Top-Left) */}
                        <div className="absolute top-3 left-3">
                          <span className="bg-black text-white text-[11px] font-semibold px-2.5 py-1 tracking-wider uppercase shadow-xs">
                            Step #{task.stepNumber}
                          </span>
                        </div>

                        {/* Status Badge (Top-Right) */}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide border shadow-2xs ${
                              task.status === "GENERATED"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-4 sm:p-5 space-y-3.5">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
                            {task.product?.title || "Product"}
                          </h4>
                          {task.id && (
                            <p className="text-[11px] text-gray-400 font-mono mt-1">
                              ID: {task.id.slice(0, 8)}...
                            </p>
                          )}
                        </div>

                        {/* Financial Details (Price & Commission) */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                          <div className="bg-gray-50/70 p-2.5 border border-gray-100">
                            <span className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider block mb-0.5">
                              Price
                            </span>
                            <span className="text-sm font-bold text-gray-900 block">
                              $
                              {Number(
                                task.priceSnapshot || 0,
                              ).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>

                          <div className="bg-emerald-50/50 p-2.5 border border-emerald-100/70">
                            <span className="text-[10px] uppercase font-semibold text-emerald-700 tracking-wider block mb-0.5">
                              Commission
                            </span>
                            <span className="text-sm font-bold text-emerald-600 block">
                              +$
                              {Number(
                                task.commissionSnapshot || 0,
                              ).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer / Action */}
                    <div className="p-4 sm:p-5 pt-0">
                      <button
                        onClick={() => handleActionClick(task)}
                        className="w-full bg-black hover:bg-gray-800 text-white text-xs font-semibold py-2.5 px-4 rounded-none transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-2xs hover:shadow-xs active:scale-[0.99]"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit Review</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Empty State Box when no pending task or on Completed tab */}
          {(!hasPendingTasks && showPendingSection) || showCompletedSection ? (
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
      {reviewModalOpen && selectedTask && selectedTask.id && (
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

            {/* Selected Product Summary */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200">
              {selectedTask.product?.image ? (
                <div className="w-12 h-12 bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden p-1">
                  <img
                    src={formatImageUrl(selectedTask.product.image)}
                    alt={selectedTask.product?.title || "Product"}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center text-gray-400">
                  <Package className="w-6 h-6 stroke-1" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 text-xs truncate">
                  {selectedTask.product?.title || "Product"}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                  <span className="font-semibold text-gray-900">
                    Step #{selectedTask.stepNumber}
                  </span>
                  <span>•</span>
                  <span className="font-bold text-emerald-600">
                    +$
                    {Number(
                      selectedTask.commissionSnapshot || 0,
                    ).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    Comm.
                  </span>
                </div>
              </div>
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
