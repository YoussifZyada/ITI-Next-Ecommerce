'use client';

import React from 'react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-white text-gray-900">

      {/* Sidebar */}
      <aside className="w-56 border-r border-gray-100 px-4 py-6">

        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-sm font-medium tracking-wide">
            Admin
          </h1>
        </div>

        {/* Nav */}
        <nav className="space-y-2 text-sm">

          <Link
            href="/admin"
            className="block text-gray-600 hover:text-black transition"
          >
            Dashboard
          </Link>

          <Link
            href="/admin/products"
            className="block text-gray-600 hover:text-black transition"
          >
            Products
          </Link>

          <Link
            href="/admin/categories"
            className="block text-gray-600 hover:text-black transition"
          >
            Categories
          </Link>

          <Link
            href="/admin/users"
            className="block text-gray-600 hover:text-black transition"
          >
            Users
          </Link>

          <Link
            href="/admin/orders"
            className="block text-gray-600 hover:text-black transition"
          >
            Orders
          </Link>

        </nav>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-gray-100">

          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-black transition"
          >
            ← Back to store
          </Link>

        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 px-10 py-8 bg-gray-50">
        {children}
      </main>

    </div>
  );
}