'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">

      <div className="w-full max-w-sm space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-xl font-medium text-gray-900">
            Create account
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Start your journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            placeholder="Full name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-black transition"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-black transition"
            required
          />

          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-black transition"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-black transition"
            required
          />

          {error && (
            <p className="text-xs text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-sm border border-black py-2 hover:bg-black hover:text-white transition"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>

        </form>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-black">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}