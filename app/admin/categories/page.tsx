'use client';

import React, { useEffect, useState } from 'react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to load categories');
      const data = await res.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create category');

      setForm({ name: '', slug: '', description: '' });
      setSuccess('Category created');
      fetchCategories();

      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      {/* Header */}
      <h1 className="text-xl font-medium text-gray-900 mb-8">
        Categories
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border-b border-gray-300 px-2 py-2 text-sm outline-none focus:border-black"
            required
          />

          <input
            placeholder="Slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="border-b border-gray-300 px-2 py-2 text-sm outline-none focus:border-black"
            required
          />

          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border-b border-gray-300 px-2 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            disabled={submitting}
            className="text-sm px-4 py-2 border border-black hover:bg-black hover:text-white transition"
          >
            {submitting ? 'Saving...' : 'Add Category'}
          </button>

          {success && <span className="text-xs text-green-600">{success}</span>}
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
      </form>

      {/* Table */}
      <div className="border-t border-gray-200">

        {loading ? (
          <p className="py-6 text-sm text-gray-400">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="py-6 text-sm text-gray-400">No categories yet</p>
        ) : (
          <table className="w-full text-sm">

            <thead>
              <tr className="text-left text-gray-500 text-xs border-b">
                <th className="py-3 font-normal">Name</th>
                <th className="py-3 font-normal">Slug</th>
                <th className="py-3 font-normal">Status</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3">{cat.name}</td>
                  <td className="py-3 text-gray-500">{cat.slug}</td>
                  <td className="py-3">
                    <span
                      className={`text-xs ${
                        cat.isActive ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {cat.isActive ? 'active' : 'inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>
    </div>
  );
}