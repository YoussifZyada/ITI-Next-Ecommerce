'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      router.push('/');
      router.refresh();
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
            Sign in
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Enter your account details
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

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
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

        </form>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center">
          No account?{' '}
          <Link href="/register" className="text-black">
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
}