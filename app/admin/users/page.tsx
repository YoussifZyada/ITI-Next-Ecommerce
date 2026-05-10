'use client';

import React, { useEffect, useState } from 'react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isActive: !currentStatus }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, isActive: !currentStatus } : u
          )
        );
      }
    } catch {
      alert('Failed to update user');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Delete this user?')) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch {
      alert('Failed to delete user');
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-400">Loading users...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-medium text-gray-900">
          Users
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage platform users
        </p>
      </div>

      {/* List */}
      <div className="space-y-3">

        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between border-b border-gray-100 py-4"
          >

            {/* Left */}
            <div>
              <p className="text-sm text-gray-900">
                {user.name}
              </p>
              <p className="text-xs text-gray-400">
                {user.email}
              </p>
            </div>

            {/* Middle */}
            <div className="flex items-center gap-4 text-xs">

              <span
                className={
                  user.role === 'admin'
                    ? 'text-purple-600'
                    : 'text-blue-600'
                }
              >
                {user.role}
              </span>

              <span
                className={
                  user.isActive
                    ? 'text-green-600'
                    : 'text-red-500'
                }
              >
                {user.isActive ? 'active' : 'inactive'}
              </span>

            </div>

            {/* Actions */}
            <div className="flex gap-3 text-xs">

              <button
                onClick={() =>
                  toggleUserStatus(user._id, user.isActive)
                }
                className="text-gray-500 hover:text-black transition"
              >
                toggle
              </button>

              <button
                onClick={() => deleteUser(user._id)}
                className="text-red-500 hover:text-red-700 transition"
              >
                delete
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}