'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '../../store/useCartStore';

export default function Navbar() {
  const { getItemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = getItemCount();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          E-SHOP
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
          <Link href="/admin" className="hover:text-blue-600 transition-colors">Admin</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/cart"
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <span className="text-xl">🛒</span>
          {mounted && count > 0 && (
            <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {count}
            </span>
          )}
        </Link>
        <Link
          href="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
