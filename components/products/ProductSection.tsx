'use client';

import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { SectionHeading } from '../ui/SectionHeading';
import { useHomeProducts } from '@/hooks/useHomeProducts';
import { ProductItem } from '@/types/product';
import { Product } from '@/types';

const formatPrice = (val: number | string): string => {
  if (val === undefined || val === null || val === '') return '$0.00';
  const str = String(val);
  if (str.startsWith('$')) return str;
  const num = parseFloat(str);
  if (isNaN(num)) return str;
  return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col bg-white rounded-md overflow-hidden border border-gray-100 shadow-xs animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[4/3] w-full bg-stone-200/70" />
      {/* Content Skeleton */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-stone-200/70 rounded w-5/6" />
          <div className="h-4 bg-stone-200/70 rounded w-3/4" />
        </div>
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <div className="h-6 bg-stone-200/70 rounded w-24" />
          <div className="h-4 bg-stone-200/70 rounded w-16" />
        </div>
      </div>
    </div>
  );
};

export const ProductSection: React.FC = () => {
  const { data: homeProductsData, isLoading, isError, refetch } = useHomeProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products: Product[] = (homeProductsData || []).map((item: ProductItem) => ({
    id: item.id,
    title: item.title,
    price: formatPrice(item.price),
    numericPrice: typeof item.price === 'number' ? item.price : parseFloat(String(item.price)) || 0,
    image: item.image,
    category: item.category,
  }));

  return (
    <section id="products" className="py-20 md:py-28 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeading
          subtitle="EXCLUSIVE COLLECTION"
          title="Premium Products"
          align="center"
        />

        {/* Products Grid / Skeleton / Error / Empty States */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm mb-4">Unable to load products at this time.</p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2.5 bg-black text-white text-xs uppercase tracking-wider font-semibold rounded-md hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white max-w-lg w-full rounded-xl overflow-hidden shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold text-xl"
            >
              ✕
            </button>
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 mb-4">
              <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-full object-cover" />
            </div>
            {selectedProduct.category && (
              <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider">
                {selectedProduct.category}
              </span>
            )}
            <h3 className="font-serif-luxury text-xl font-bold text-gray-900 mt-1 mb-2">
              {selectedProduct.title}
            </h3>
            <p className="font-bold text-2xl text-gray-900 mb-4">{selectedProduct.price}</p>
            <p className="text-xs text-gray-500 mb-6">
              Exclusive agent discount pricing available upon portal sign-in. Includes white-glove staging delivery.
            </p>
            <button
              onClick={() => setSelectedProduct(null)}
              className="w-full py-3 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-gray-800 transition-colors"
            >
              Close Quick View
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
