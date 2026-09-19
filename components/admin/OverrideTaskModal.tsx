'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import {
  X,
  Wrench,
  Loader2,
  DollarSign,
  Percent,
  Package,
  Sparkles,
  Calculator,
  Hash,
  ShoppingBag,
} from 'lucide-react';
import { UserTaskItem } from '@/types/task';
import { ProductItem } from '@/types/product';
import { useOverrideTask } from '@/hooks/useOverrideTask';
import { useGetProducts } from '@/hooks/useGetProducts';

interface OverrideTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: UserTaskItem | null;
  onSuccess?: () => void;
}

const formatImageUrl = (url?: string): string => {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  ) {
    return url;
  }
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `http://localhost:4000${cleanPath}`;
};

export const OverrideTaskModal: React.FC<OverrideTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onSuccess,
}) => {
  const [price, setPrice] = useState<string>('');
  const [commissionRate, setCommissionRate] = useState<string>('');
  const [productId, setProductId] = useState<string>('');

  const { data: productsData } = useGetProducts({ limit: 100 });
  const products: ProductItem[] = productsData?.products || [];


  const { mutate: overrideTask, isPending } = useOverrideTask({
    onSuccessCallback: () => {
      if (onSuccess) onSuccess();
      onClose();
    },
  });

  useEffect(() => {
    if (task) {
      setPrice(task.priceSnapshot !== undefined && task.priceSnapshot !== null ? String(task.priceSnapshot) : '');
      setCommissionRate(
        task.commissionSnapshot !== undefined && task.commissionSnapshot !== null
          ? String(task.commissionSnapshot)
          : ''
      );
      setProductId(task.productId || task.product?.id || '');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleProductSelect = (selectedProdId: string) => {
    setProductId(selectedProdId);
    const selected = products.find((p) => p.id === selectedProdId);
    if (selected) {
      if (selected.price !== undefined) {
        setPrice(String(selected.price));
      }
      if (selected.commissionRate !== undefined) {
        setCommissionRate(String(selected.commissionRate));
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(price);
    const parsedCommRate = parseFloat(commissionRate);

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return;
    }
    if (isNaN(parsedCommRate) || parsedCommRate < 0) {
      return;
    }
    if (!productId.trim()) {
      return;
    }

    overrideTask({
      taskId: task.id,
      payload: {
        price: parsedPrice,
        commissionRate: parsedCommRate,
        productId: productId.trim(),
      },
    });
  };

  const numPrice = parseFloat(price) || 0;
  const numCommRate = parseFloat(commissionRate) || 0;
  const calculatedCommission = ((numPrice * numCommRate) / 100).toFixed(2);

  const currentProduct = products.find((p) => p.id === productId) || task.product;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury text-base font-bold tracking-tight">Override Task Slot</h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono">
                  Step #{task.stepNumber}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Modify snapshot parameters and product assignment</p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Task Summary Banner */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentProduct?.image ? (
              <img
                src={formatImageUrl(currentProduct.image)}
                alt={currentProduct.title || 'Product'}
                className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-500 shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
            )}
            <div className="truncate max-w-[240px]">
              <p className="text-xs font-bold text-slate-900 truncate">
                {currentProduct?.title || 'Selected Product'}
              </p>
              <p className="text-[10px] text-slate-400 font-mono truncate">Task ID: {task.id}</p>
            </div>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              task.status === 'COMPLETED'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-indigo-100 text-indigo-800'
            }`}
          >
            {task.status}
          </span>
        </div>

        {/* Form Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Select Existing Product or Enter Product ID */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-indigo-600" />
              <span>Select Product / Product ID</span>
            </label>

            {products.length > 0 && (
              <select
                value={products.some((p) => p.id === productId) ? productId : ''}
                onChange={(e) => {
                  if (e.target.value) handleProductSelect(e.target.value);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer mb-2"
              >
                <option value="">-- Pick from catalog (Auto-fills price & comm) --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} (${p.price} | {p.commissionRate || p.commission}%)
                  </option>
                ))}
              </select>
            )}

            <input
              type="text"
              required
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Target Product UUID"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Grid for Price and Commission Rate */}
          <div className="grid grid-cols-2 gap-4">
            {/* Price Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Price ($)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="500"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Commission Rate Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-amber-600" />
                <span>Commission Rate (%)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  required
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  placeholder="15"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-8 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 transition-colors"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Calculated Summary Card */}
          <div className="p-4 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl shadow-sm space-y-2 border border-slate-800">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                <span>Override Snapshot Preview</span>
              </span>
              <span className="text-amber-400 font-mono text-[10px]">Realtime Calculation</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block">Price</span>
                <span className="text-xs font-bold font-mono text-white">${numPrice.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Comm Rate</span>
                <span className="text-xs font-bold font-mono text-amber-300">{numCommRate}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Earned Comm</span>
                <span className="text-xs font-bold font-mono text-emerald-400">${calculatedCommission}</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-400" />
              )}
              <span>{isPending ? 'Applying Override...' : 'Apply Override'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
