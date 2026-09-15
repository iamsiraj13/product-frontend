'use client';

import React from 'react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect?.(product)}
      className="group flex flex-col bg-white rounded-md overflow-hidden border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {product.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-xs text-[10px] uppercase tracking-wider font-semibold text-gray-700 rounded-xs shadow-xs">
            {product.category}
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <h3 className="font-semibold text-sm md:text-base text-gray-900 leading-snug line-clamp-3 mb-3 group-hover:text-black transition-colors">
          {product.title}
        </h3>

        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <span className="font-serif-luxury text-lg md:text-xl font-bold text-gray-900">
            {product.price}
          </span>
          <span className="text-xs font-semibold text-gray-500 group-hover:text-black uppercase tracking-wider underline opacity-0 group-hover:opacity-100 transition-opacity">
            View Item
          </span>
        </div>
      </div>
    </div>
  );
};
