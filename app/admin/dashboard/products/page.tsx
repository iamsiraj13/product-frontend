"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Tag,
  Plus,
  Eye,
  Edit,
  Trash2,
  Home,
  Percent,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  RefreshCw,
  LayoutGrid,
  Table as TableIcon,
  AlertCircle,
  Calendar,
  Sparkles,
  CheckCircle2,
  XCircle,
  X,
  ExternalLink,
} from "lucide-react";
import { AddProductModal } from "@/components/admin/AddProductModal";
import { EditProductModal } from "@/components/admin/EditProductModal";
import { useGetProducts } from "@/hooks/useGetProducts";
import { ProductItem } from "@/types/product";

// Helper to format image URLs from API
const formatImageUrl = (url?: string): string => {
  if (!url)
    return "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=300";
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

// Format currency display
const formatCurrency = (val?: number | string): string => {
  if (val === undefined || val === null || val === "") return "$0.00";
  const num = typeof val === "number" ? val : parseFloat(String(val));
  return isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`;
};

// Format date display
const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? "N/A"
      : d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  } catch {
    return "N/A";
  }
};

export default function AdminProductsPage() {
  // Filters & State
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Lightbox, Edit & Preview States
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null,
  );
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(
    null,
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(productSearchQuery);
      setPage(1); // reset to page 1 on new search query
    }, 400);

    return () => clearTimeout(timer);
  }, [productSearchQuery]);

  // Fetch products from API via React Query hook
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetProducts({
      page,
      limit,
      search: debouncedSearch || undefined,
    });

  const productsList = data?.products || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  // Calculate showing numbers
  const fromCount = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const toCount = Math.min(meta.page * meta.limit, meta.total);

  // Pagination Handler
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductCreated={() => {
          refetch();
        }}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={!!editingProduct}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onProductUpdated={() => {
          refetch();
        }}
      />

      {/* Image Lightbox Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-slate-900 rounded-3xl p-2 border border-slate-700/80 overflow-hidden shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Product Full Preview"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                  <img
                    src={formatImageUrl(selectedProduct.image)}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-slate-900 leading-snug">
                    {selectedProduct.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    ID: {selectedProduct.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block font-medium mb-1">
                  Price
                </span>
                <span className="text-base font-bold font-mono text-slate-900">
                  {formatCurrency(selectedProduct.price)}
                </span>
              </div>

              <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-100">
                <span className="text-amber-600 block font-bold mb-1">
                  Commission ({selectedProduct.commissionRate ?? 0}%)
                </span>
                <span className="text-base font-bold font-mono text-emerald-600">
                  {formatCurrency(selectedProduct.commission)}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block font-medium mb-1">
                  Showcase Status
                </span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  {selectedProduct.isHomeProduct ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-amber-500" /> Home
                      Featured
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-slate-400" /> Standard
                      Catalog
                    </>
                  )}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block font-medium mb-1">
                  Active Status
                </span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  {selectedProduct.isActive !== false ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />{" "}
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-500" /> Inactive
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-serif-luxury text-slate-900">
              Product Catalog & Staging Inventory
            </h2>
            {isFetching && !isLoading && (
              <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage product pricing, commission rates, home showcase flags, and
            staging items
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-white bg-slate-100 rounded-xl border border-slate-200/80 transition-all shadow-xs cursor-pointer active:scale-95"
            title="Refresh list"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin text-amber-500" : ""}`}
            />
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Product Filter & View Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={productSearchQuery}
            onChange={(e) => setProductSearchQuery(e.target.value)}
            placeholder="Search product title or ID..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all"
          />
          {productSearchQuery && (
            <button
              onClick={() => setProductSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Show</span>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>per page</span>
          </div>

          {/* View Mode Toggle Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <h3 className="text-sm font-bold text-rose-900">
            Failed to Load Products
          </h3>
          <p className="text-xs text-rose-600 max-w-md mx-auto">
            {error instanceof Error
              ? error.message
              : "Unable to connect to product server."}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Main Content: Table View or Grid View */}
      {!isError && (
        <>
          {viewMode === "table" ? (
            /* Table View */
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-4 font-semibold">
                        Product Name & ID
                      </th>
                      <th className="py-3.5 px-4 font-semibold">Price</th>
                      <th className="py-3.5 px-4 font-semibold">Commission</th>
                      <th className="py-3.5 px-4 font-semibold">
                        Home Showcase
                      </th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold">Created At</th>
                      <th className="py-3.5 px-4 font-semibold text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {/* Skeleton Loading State */}
                    {isLoading
                      ? Array.from({ length: limit > 10 ? 10 : limit }).map(
                          (_, idx) => (
                            <tr
                              key={`skeleton-${idx}`}
                              className="animate-pulse"
                            >
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-11 h-11 bg-slate-200 rounded-xl shrink-0" />
                                  <div className="space-y-1.5 flex-1">
                                    <div className="h-3.5 bg-slate-200 rounded-md w-40" />
                                    <div className="h-2.5 bg-slate-100 rounded-md w-24" />
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="h-4 bg-slate-200 rounded-md w-16" />
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="space-y-1">
                                  <div className="h-3.5 bg-slate-200 rounded-md w-14" />
                                  <div className="h-2.5 bg-slate-100 rounded-md w-10" />
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="h-5 bg-slate-100 rounded-full w-20" />
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="h-5 bg-slate-200 rounded-full w-16" />
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="h-3.5 bg-slate-100 rounded-md w-24" />
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <div className="w-7 h-7 bg-slate-100 rounded-lg" />
                                  <div className="w-7 h-7 bg-slate-100 rounded-lg" />
                                </div>
                              </td>
                            </tr>
                          ),
                        )
                      : productsList.map((p) => {
                          const imgUrl = formatImageUrl(p.image);
                          return (
                            <tr
                              key={p.id}
                              className="hover:bg-slate-50/80 transition-colors group"
                            >
                              {/* Product Info */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    onClick={() => setPreviewImage(imgUrl)}
                                    className="relative w-11 h-11 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0 cursor-pointer group-hover:border-amber-400 transition-colors"
                                    title="Click to expand preview"
                                  >
                                    <img
                                      src={imgUrl}
                                      alt={p.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=300";
                                      }}
                                    />
                                  </div>

                                  <div className="min-w-0">
                                    <h4 className="font-semibold text-slate-900 truncate max-w-xs group-hover:text-amber-700 transition-colors">
                                      {p.title}
                                    </h4>
                                    <p className="text-[10px] font-mono text-slate-400 truncate">
                                      ID: {p.id}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Price */}
                              <td className="py-3.5 px-4 font-bold font-mono text-slate-900">
                                {formatCurrency(p.price)}
                              </td>

                              {/* Commission */}
                              <td className="py-3.5 px-4">
                                <div>
                                  <span className="font-bold font-mono text-emerald-600 block text-xs">
                                    +{formatCurrency(p.commission)}
                                  </span>
                                  <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-0.5">
                                    <Percent className="w-2.5 h-2.5 text-amber-500" />
                                    {p.commissionRate ?? 0}% Rate
                                  </span>
                                </div>
                              </td>

                              {/* Home Showcase */}
                              <td className="py-3.5 px-4">
                                {p.isHomeProduct ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 border border-amber-200 text-amber-700 shadow-2xs">
                                    <Home className="w-3 h-3 text-amber-500" />
                                    <span>Featured</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-200">
                                    Standard
                                  </span>
                                )}
                              </td>

                              {/* Status */}
                              <td className="py-3.5 px-4">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                    p.isActive !== false
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : "bg-rose-50 text-rose-700 border border-rose-200"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      p.isActive !== false
                                        ? "bg-emerald-500"
                                        : "bg-rose-500"
                                    }`}
                                  />
                                  {p.isActive !== false ? "Active" : "Inactive"}
                                </span>
                              </td>

                              {/* Created At */}
                              <td className="py-3.5 px-4 text-slate-500 font-medium text-[11px]">
                                {formatDate(p.createdAt)}
                              </td>

                              {/* Actions */}
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedProduct(p)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                                    title="View Details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setEditingProduct(p)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                                    title="Edit Product"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                  </tbody>
                </table>
              </div>

              {/* Empty Data State inside Table */}
              {!isLoading && productsList.length === 0 && (
                <div className="p-12 text-center space-y-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 border border-slate-200">
                    <Tag className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    No products found
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {debouncedSearch
                      ? `No product matches "${debouncedSearch}". Try clearing your search query.`
                      : "No products registered in the system yet."}
                  </p>
                  {debouncedSearch ? (
                    <button
                      onClick={() => setProductSearchQuery("")}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Clear Search
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Add First Product</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading
                ? Array.from({ length: 6 }).map((_, idx) => (
                    <div
                      key={`grid-skeleton-${idx}`}
                      className="bg-white rounded-3xl border border-slate-200/80 p-4 space-y-4 animate-pulse"
                    >
                      <div className="h-44 bg-slate-200 rounded-2xl w-full" />
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                        <div className="h-3 bg-slate-100 rounded-md w-1/2" />
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <div className="h-5 bg-slate-200 rounded-md w-20" />
                        <div className="h-5 bg-slate-200 rounded-md w-16" />
                      </div>
                    </div>
                  ))
                : productsList.map((p) => {
                    const imgUrl = formatImageUrl(p.image);
                    return (
                      <div
                        key={p.id}
                        className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative h-48 bg-slate-100 overflow-hidden">
                            <img
                              src={imgUrl}
                              alt={p.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=300";
                              }}
                            />
                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                              {p.isHomeProduct && (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm bg-amber-500 text-white flex items-center gap-1">
                                  <Home className="w-3 h-3" />
                                  <span>Home</span>
                                </span>
                              )}
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm ${
                                  p.isActive !== false
                                    ? "bg-emerald-500 text-white"
                                    : "bg-rose-500 text-white"
                                }`}
                              >
                                {p.isActive !== false ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>

                          <div className="p-5 space-y-3">
                            <h3 className="font-serif-luxury font-bold text-slate-900 text-base leading-snug line-clamp-2">
                              {p.title}
                            </h3>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                              <div>
                                <span className="text-[10px] text-slate-400 block font-medium uppercase">
                                  Price
                                </span>
                                <span className="text-lg font-bold font-mono text-slate-900">
                                  {formatCurrency(p.price)}
                                </span>
                              </div>

                              <div className="text-right">
                                <span className="text-[10px] text-amber-600 font-bold block flex items-center justify-end gap-0.5">
                                  <Percent className="w-3 h-3" />{" "}
                                  {p.commissionRate ?? 0}% Comm.
                                </span>
                                <span className="text-xs font-bold text-emerald-600 font-mono">
                                  +{formatCurrency(p.commission)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                          <button
                            onClick={() => setSelectedProduct(p)}
                            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            <span>Details</span>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/80 transition-colors cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-100/80 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          )}

          {/* Pagination Controls */}
          {meta.total > 0 && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
              <div>
                Showing{" "}
                <span className="font-bold text-slate-900">{fromCount}</span> to{" "}
                <span className="font-bold text-slate-900">{toCount}</span> of{" "}
                <span className="font-bold text-slate-900">{meta.total}</span>{" "}
                products
              </div>

              <div className="flex items-center gap-1.5">
                {/* First Page */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={meta.page <= 1 || isLoading}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  title="First Page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                {/* Previous Page */}
                <button
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page <= 1 || isLoading}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Number Buttons */}
                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                    .filter((pageNum) => {
                      // Display first, last, current, and adjacent pages
                      return (
                        pageNum === 1 ||
                        pageNum === meta.totalPages ||
                        Math.abs(pageNum - meta.page) <= 1
                      );
                    })
                    .map((pageNum, idx, arr) => {
                      const prevPageNum = arr[idx - 1];
                      const hasGap = prevPageNum && pageNum - prevPageNum > 1;

                      return (
                        <React.Fragment key={pageNum}>
                          {hasGap && (
                            <span className="px-1 text-slate-400 select-none">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() => handlePageChange(pageNum)}
                            disabled={isLoading}
                            className={`min-w-[32px] h-8 rounded-xl font-bold transition-all cursor-pointer ${
                              meta.page === pageNum
                                ? "bg-slate-950 text-white shadow-xs scale-105"
                                : "text-slate-600 hover:bg-slate-100 border border-transparent"
                            }`}
                          >
                            {pageNum}
                          </button>
                        </React.Fragment>
                      );
                    })}
                </div>

                {/* Next Page */}
                <button
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={meta.page >= meta.totalPages || isLoading}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Last Page */}
                <button
                  onClick={() => handlePageChange(meta.totalPages)}
                  disabled={meta.page >= meta.totalPages || isLoading}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  title="Last Page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
