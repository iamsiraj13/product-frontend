'use client';

import React, { useState } from 'react';
import { productsData } from '@/data/productsData';
import { ProductCard } from './ProductCard';
import { SectionHeading } from '../ui/SectionHeading';
import { Product } from '@/types';

export const ProductSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = ['All', 'Living Room', 'Dining', 'Seating', 'Outdoor', 'Office'];

  const filteredProducts = selectedCategory === 'All'
    ? productsData
    : productsData.filter(p => p.category === selectedCategory);

  return (
    <section id="products" className="py-20 md:py-28 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeading
          subtitle="EXCLUSIVE COLLECTION"
          title="Premium Products"
          align="center"
        />

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
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
            <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider">
              {selectedProduct.category}
            </span>
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
