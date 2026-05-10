'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
    category: any;
  };
}

const PLACEHOLDER = 'https://via.placeholder.com/300';

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const mainImage = product.images?.[0] || PLACEHOLDER;

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      productId: product._id,
      name: product.name,
      price: product.price,
      image: mainImage,
      quantity: 1
    });
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="aspect-square overflow-hidden bg-gray-100 relative">
        <img
          src={mainImage}
          alt={product.name}
          onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-600">
          {product.category?.name || 'General'}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-blue-600 font-bold text-xl mb-4">${product.price.toFixed(2)}</p>

        <div className="mt-auto flex gap-2">
          <Link
            href={`/products/${product._id}`}
            className="flex-1 text-center py-2 px-4 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Details
          </Link>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
