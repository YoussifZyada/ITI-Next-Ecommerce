'use client';

import React from 'react';
import { useCartStore } from '../../src/store/useCartStore';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } =
    useCartStore();

  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">

        <div className="text-5xl mb-6">🛒</div>

        <h2 className="text-lg font-medium text-gray-900">
          Your cart is empty
        </h2>

        <p className="text-sm text-gray-400 mt-2 mb-8">
          Add items to continue shopping
        </p>

        <Link
          href="/products"
          className="text-sm border border-black px-5 py-2 hover:bg-black hover:text-white transition"
        >
          Start shopping
        </Link>

      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Header */}
      <h1 className="text-xl font-medium text-gray-900 mb-10">
        Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Items */}
        <div className="lg:col-span-2 space-y-4">

          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between border-b border-gray-100 py-4"
            >

              {/* Product */}
              <div className="flex items-center gap-4">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-cover bg-gray-100"
                />

                <div>
                  <p className="text-sm text-gray-900">
                    {item.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3 text-sm text-gray-600">

                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity - 1)
                  }
                  className="px-2 hover:text-black"
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity + 1)
                  }
                  className="px-2 hover:text-black"
                >
                  +
                </button>

              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.productId)}
                className="text-xs text-gray-400 hover:text-red-500 transition"
              >
                remove
              </button>

            </div>
          ))}

          {/* Clear */}
          <button
            onClick={clearCart}
            className="text-xs text-gray-400 hover:text-red-500 transition mt-4"
          >
            Clear cart
          </button>

        </div>

        {/* Summary */}
        <div className="border border-gray-100 p-6 h-fit">

          <h2 className="text-sm font-medium text-gray-900 mb-6">
            Summary
          </h2>

          <div className="space-y-3 text-sm text-gray-600">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between text-black font-medium">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

          </div>

          <Link
            href="/checkout"
            className="block text-center mt-6 text-sm border border-black py-2 hover:bg-black hover:text-white transition"
          >
            Checkout
          </Link>

        </div>

      </div>
    </div>
  );
}