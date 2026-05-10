'use client';

import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-xl font-medium text-gray-900">
          Dashboard
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Overview of your store activity
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Revenue */}
        <div className="space-y-2">
          <p className="text-xs text-gray-400">Revenue</p>
          <p className="text-2xl font-medium text-gray-900">
            $0.00
          </p>
          <p className="text-xs text-green-600">
            +0% this month
          </p>
        </div>

        {/* Orders */}
        <div className="space-y-2">
          <p className="text-xs text-gray-400">Orders</p>
          <p className="text-2xl font-medium text-gray-900">
            0
          </p>
          <p className="text-xs text-gray-500">
            currently processing
          </p>
        </div>

        {/* Customers */}
        <div className="space-y-2">
          <p className="text-xs text-gray-400">Customers</p>
          <p className="text-2xl font-medium text-gray-900">
            0
          </p>
          <p className="text-xs text-blue-600">
            steady growth
          </p>
        </div>

      </div>

    </div>
  );
}