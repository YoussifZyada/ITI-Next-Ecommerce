'use client';

import React, { useState, useEffect } from 'react';
import { productValidation } from '../../../src/validators/product.validator';

interface Category {
  _id: string;
  name: string;
}

export default function ProductForm({
  onProductCreated,
}: {
  onProductCreated: () => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    images: '',
    isFeatured: false,
    isActive: true,
  });

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    }
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const { error: validationError } = productValidation.create.validate({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      images: formData.images
        .split(',')
        .map((img) => img.trim())
        .filter(Boolean),
    });

    if (validationError) {
      setError(validationError.details[0].message);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          images: formData.images
            .split(',')
            .map((img) => img.trim())
            .filter(Boolean),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create product');
      }

      setSuccess(true);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        images: '',
        isFeatured: false,
        isActive: true,
      });

      onProductCreated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Name */}
        <div>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product name"
            className="w-full border-b border-gray-300 py-2 text-sm outline-none focus:border-black"
            required
          />
        </div>

        {/* Category */}
        <div>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border-b border-gray-300 py-2 text-sm outline-none focus:border-black"
            required
          >
            <option value="">Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="border-b border-gray-300 py-2 text-sm outline-none focus:border-black"
          required
        />

        {/* Stock */}
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="border-b border-gray-300 py-2 text-sm outline-none focus:border-black"
          required
        />

        {/* Description */}
        <div className="md:col-span-2">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border-b border-gray-300 py-2 text-sm outline-none focus:border-black"
            rows={3}
          />
        </div>

        {/* Images */}
        <div className="md:col-span-2">
          <input
            name="images"
            value={formData.images}
            onChange={handleChange}
            placeholder="Images (comma separated)"
            className="w-full border-b border-gray-300 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        {/* Toggles */}
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
          />
          Featured
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          Active
        </label>
      </div>

      {/* Messages */}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">Product created</p>}

      {/* Button */}
      <button
        disabled={loading}
        className="text-sm border border-black px-4 py-2 hover:bg-black hover:text-white transition"
      >
        {loading ? 'Saving...' : 'Create product'}
      </button>
    </form>
  );
}