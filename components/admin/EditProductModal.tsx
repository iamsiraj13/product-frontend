'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  X,
  Upload,
  DollarSign,
  Percent,
  Tag,
  CheckCircle2,
  Edit,
  Loader2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
} from 'lucide-react';
import { useUpdateProduct } from '@/hooks/useUpdateProduct';
import { ProductItem } from '@/types/product';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductItem | null;
  onProductUpdated?: (updatedProduct: ProductItem) => void;
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

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onProductUpdated,
}) => {
  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<string>('');
  const [commissionRate, setCommissionRate] = useState<string>('');
  const [commission, setCommission] = useState<string>('');
  const [isHomeProduct, setIsHomeProduct] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCommissionManuallyEdited, setIsCommissionManuallyEdited] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Prefill state whenever product changes or modal opens
  useEffect(() => {
    if (product && isOpen) {
      setTitle(product.title || '');
      setPrice(product.price !== undefined ? String(product.price) : '');
      setCommissionRate(
        product.commissionRate !== undefined ? String(product.commissionRate) : ''
      );
      setCommission(product.commission !== undefined ? String(product.commission) : '');
      setIsHomeProduct(Boolean(product.isHomeProduct));
      setIsActive(product.isActive !== false);
      setImageFile(null);
      setImagePreview(formatImageUrl(product.image));
      setIsCommissionManuallyEdited(false);
      setValidationErrors({});
    }
  }, [product, isOpen]);

  const { mutate: updateProduct, isPending } = useUpdateProduct({
    onSuccessCallback: (updatedProduct) => {
      if (onProductUpdated) {
        onProductUpdated(updatedProduct);
      }
      onClose();
    },
  });

  if (!isOpen || !product) return null;

  // Auto calculate commission when price or rate changes
  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPrice(val);

    const numPrice = parseFloat(val);
    const numRate = parseFloat(commissionRate);

    if (!isNaN(numPrice) && !isNaN(numRate) && !isCommissionManuallyEdited) {
      const calcComm = ((numPrice * numRate) / 100).toFixed(2);
      setCommission(calcComm);
    }
  };

  const handleCommissionRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCommissionRate(val);

    const numPrice = parseFloat(price);
    const numRate = parseFloat(val);

    if (!isNaN(numPrice) && !isNaN(numRate) && !isCommissionManuallyEdited) {
      const calcComm = ((numPrice * numRate) / 100).toFixed(2);
      setCommission(calcComm);
    }
  };

  const handleCommissionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCommission(e.target.value);
    setIsCommissionManuallyEdited(true);
  };

  const handleRecalculateCommission = () => {
    const numPrice = parseFloat(price);
    const numRate = parseFloat(commissionRate);
    if (!isNaN(numPrice) && !isNaN(numRate)) {
      const calcComm = ((numPrice * numRate) / 100).toFixed(2);
      setCommission(calcComm);
      setIsCommissionManuallyEdited(false);
    }
  };

  // Image File Change Handler
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setValidationErrors((prev) => ({
          ...prev,
          image: 'Please select a valid image file (JPEG, PNG, WebP)',
        }));
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setValidationErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const handleResetImage = () => {
    setImageFile(null);
    setImagePreview(formatImageUrl(product.image));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!title.trim()) {
      errors.title = 'Product title is required';
    }
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      errors.price = 'Please enter a valid price';
    }
    if (!commissionRate || isNaN(parseFloat(commissionRate)) || parseFloat(commissionRate) < 0) {
      errors.commissionRate = 'Please enter a valid commission rate';
    }
    if (!commission || isNaN(parseFloat(commission)) || parseFloat(commission) < 0) {
      errors.commission = 'Please enter a valid commission amount';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});

    updateProduct({
      id: product.id,
      title: title.trim(),
      price: parseFloat(price),
      commissionRate: parseFloat(commissionRate),
      commission: parseFloat(commission),
      isHomeProduct,
      isActive,
      image: imageFile,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg font-bold tracking-tight">Edit Product</h3>
              <p className="text-xs text-slate-400">
                Update details, pricing, commission, or image for ID: {product.id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Title Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Product Title <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setValidationErrors((prev) => ({ ...prev, title: '' }));
                }}
                placeholder="Product title"
                className={`w-full bg-slate-50 border ${
                  validationErrors.title ? 'border-rose-500' : 'border-slate-200'
                } rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all`}
              />
            </div>
            {validationErrors.title && (
              <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{validationErrors.title}</span>
              </p>
            )}
          </div>

          {/* Pricing & Commission Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Price ($) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => {
                    handlePriceChange(e);
                    setValidationErrors((prev) => ({ ...prev, price: '' }));
                  }}
                  placeholder="250"
                  className={`w-full bg-slate-50 border ${
                    validationErrors.price ? 'border-rose-500' : 'border-slate-200'
                  } rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all`}
                />
              </div>
              {validationErrors.price && (
                <p className="mt-1 text-[11px] text-rose-500">{validationErrors.price}</p>
              )}
            </div>

            {/* Commission Rate */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Comm. Rate (%) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Percent className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={commissionRate}
                  onChange={(e) => {
                    handleCommissionRateChange(e);
                    setValidationErrors((prev) => ({ ...prev, commissionRate: '' }));
                  }}
                  placeholder="2.5"
                  className={`w-full bg-slate-50 border ${
                    validationErrors.commissionRate ? 'border-rose-500' : 'border-slate-200'
                  } rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all`}
                />
              </div>
              {validationErrors.commissionRate && (
                <p className="mt-1 text-[11px] text-rose-500">{validationErrors.commissionRate}</p>
              )}
            </div>

            {/* Commission Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Commission ($) <span className="text-rose-500">*</span>
                </label>
                {isCommissionManuallyEdited && (
                  <button
                    type="button"
                    onClick={handleRecalculateCommission}
                    className="text-[10px] text-amber-600 hover:text-amber-700 underline font-semibold cursor-pointer"
                  >
                    Auto-calc
                  </button>
                )}
              </div>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={commission}
                  onChange={(e) => {
                    handleCommissionChange(e);
                    setValidationErrors((prev) => ({ ...prev, commission: '' }));
                  }}
                  placeholder="6.25"
                  className={`w-full bg-amber-50/50 border ${
                    validationErrors.commission ? 'border-rose-500' : 'border-amber-200'
                  } rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all`}
                />
              </div>
              {validationErrors.commission && (
                <p className="mt-1 text-[11px] text-rose-500">{validationErrors.commission}</p>
              )}
            </div>
          </div>

          {/* Options Toggles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Is Home Product */}
            <div
              onClick={() => setIsHomeProduct(!isHomeProduct)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isHomeProduct
                  ? 'bg-amber-50/60 border-amber-300 text-slate-900 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/80'
              }`}
            >
              <div className="pr-3">
                <span className="text-xs font-bold block text-slate-800">Home Showcase Product</span>
                <span className="text-[11px] text-slate-500 block">Display in featured homepage section</span>
              </div>
              <div>
                {isHomeProduct ? (
                  <ToggleRight className="w-7 h-7 text-amber-600" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-400" />
                )}
              </div>
            </div>

            {/* Is Active */}
            <div
              onClick={() => setIsActive(!isActive)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isActive
                  ? 'bg-emerald-50/60 border-emerald-300 text-slate-900 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/80'
              }`}
            >
              <div className="pr-3">
                <span className="text-xs font-bold block text-slate-800">Active Status</span>
                <span className="text-[11px] text-slate-500 block">Product visible & available in catalog</span>
              </div>
              <div>
                {isActive ? (
                  <ToggleRight className="w-7 h-7 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-400" />
                )}
              </div>
            </div>
          </div>

          {/* Image Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Product Image <span className="text-slate-400 font-normal">(Optional to replace)</span>
              </label>
              {imageFile && (
                <button
                  type="button"
                  onClick={handleResetImage}
                  className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Restore Original</span>
                </button>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 flex flex-col sm:flex-row items-center gap-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Product Preview"
                  className="w-20 h-20 object-cover rounded-xl border border-slate-300 shadow-xs shrink-0"
                />
              ) : (
                <div className="w-20 h-20 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                  <Upload className="w-6 h-6" />
                </div>
              )}

              <div className="flex-1 text-center sm:text-left space-y-1 w-full">
                <p className="text-xs font-bold text-slate-800">
                  {imageFile ? imageFile.name : 'Current Image Loaded'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {imageFile
                    ? `${(imageFile.size / (1024 * 1024)).toFixed(2)} MB (New file selected)`
                    : 'Select a new image file if you want to replace it'}
                </p>

                <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 hover:border-amber-500 text-slate-700 hover:text-amber-600 text-xs font-semibold rounded-xl cursor-pointer transition-colors shadow-2xs mt-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose New Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Updating Product...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
