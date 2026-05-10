'use client';

import React, { useEffect, useState } from 'react';

interface Order {
  _id: string;
  user: { name: string; email: string } | null;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  itemCount: number;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: 'text-yellow-600',
  completed: 'text-green-600',
  failed: 'text-red-500',
  refunded: 'text-gray-500',
  processing: 'text-blue-600',
  shipped: 'text-indigo-600',
  delivered: 'text-green-600',
  cancelled: 'text-red-500',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/orders')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load orders');
        return res.json();
      })
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-medium text-gray-900">Orders</h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage customer orders
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500 mb-4">{error}</p>
      )}

      {/* List */}
      <div className="space-y-3">

        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-gray-400">No orders yet</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="border-b border-gray-100 py-4 flex flex-col md:flex-row md:items-center md:justify-between"
            >

              {/* Left */}
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-mono">
                  #{order._id.slice(-8)}
                </p>

                <div>
                  <p className="text-sm text-gray-900">
                    {order.user?.name || 'Guest'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {order.user?.email || '—'}
                  </p>
                </div>
              </div>

              {/* Middle */}
              <div className="mt-3 md:mt-0 text-sm text-gray-500 flex gap-6">
                <span>{order.itemCount} items</span>
                <span className="text-gray-900 font-medium">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>

              {/* Right */}
              <div className="mt-3 md:mt-0 flex gap-3 text-xs">

                <span className={statusColors[order.paymentStatus]}>
                  {order.paymentStatus}
                </span>

                <span className={statusColors[order.orderStatus]}>
                  {order.orderStatus}
                </span>

                <span className="text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>

              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}