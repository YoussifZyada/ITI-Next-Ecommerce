'use client';

import React from 'react';
import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
      <div className="text-6xl">❌</div>
      <h1 className="text-3xl font-extrabold text-gray-900">Payment Cancelled</h1>
      <p className="text-gray-600 text-center max-w-md">
        Your payment was cancelled. Don&apos;t worry — your cart is still saved and you can try again whenever you&apos;re ready.
      </p>
      <div className="flex gap-4">
        <Link href="/checkout" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
          Try Again
        </Link>
        <Link href="/cart" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
          Back to Cart
        </Link>
      </div>
    </div>
  );
}
