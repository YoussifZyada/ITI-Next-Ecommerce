'use client';

import React, { useState } from 'react';
import ProductForm from './ProductForm';
import ProductList from './ProductList';

export default function AdminProductsPage() {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProductCreated = () => {
    setShowForm(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">

      {/* Header */}
      <div className="flex items-start justify-between">

        <div>
          <h1 className="text-xl font-medium text-gray-900">
            Products
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage inventory
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm border border-gray-300 px-4 py-2 hover:border-black hover:text-black transition"
        >
          {showForm ? 'Close' : 'Add product'}
        </button>

      </div>

      {/* Form */}
      {showForm && (
        <div className="border border-gray-100 p-4">
          <ProductForm onProductCreated={handleProductCreated} />
        </div>
      )}

      {/* List Section */}
      <div className="space-y-4">

        <h2 className="text-sm text-gray-500">
          Inventory
        </h2>

        <div className="border-t border-gray-100 pt-4">
          <ProductList key={refreshKey} />
        </div>

      </div>

    </div>
  );
}