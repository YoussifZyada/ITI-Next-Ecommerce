'use client';

import React, { useEffect, useState } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: { name: string };
  isActive: boolean;
  isFeatured: boolean;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-400">Loading products...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-2">

      {products.length === 0 ? (
        <p className="text-sm text-gray-400">No products found</p>
      ) : (
        products.map((product) => (
          <div
            key={product._id}
            className="flex items-center justify-between py-4 border-b border-gray-100"
          >

            {/* Left */}
            <div className="space-y-1">
              <p className="text-sm text-gray-900">
                {product.name}
              </p>

              <p className="text-xs text-gray-400">
                {product.category?.name} • Stock {product.stock}
              </p>
            </div>

            {/* Middle */}
            <div className="text-sm text-gray-900 font-medium">
              ${product.price}
            </div>

            {/* Right */}
            <div className="flex items-center gap-3 text-xs">

              <span
                className={
                  product.isActive
                    ? 'text-green-600'
                    : 'text-gray-400'
                }
              >
                {product.isActive ? 'active' : 'inactive'}
              </span>

              {product.isFeatured && (
                <span className="text-yellow-600">★</span>
              )}

            </div>

          </div>
        ))
      )}

    </div>
  );
}