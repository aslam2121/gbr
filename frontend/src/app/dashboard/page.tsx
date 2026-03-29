"use client";

import { useAuth } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";

export default function DashboardPage() {
  const { user, session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Session Info</h2>
          <dl className="mt-4 space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">User ID</dt>
              <dd className="text-sm text-gray-900">{user?.id ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">User Type</dt>
              <dd className="text-sm text-gray-900">{user?.user_type ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Display Name</dt>
              <dd className="text-sm text-gray-900">{user?.display_name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">JWT</dt>
              <dd className="truncate text-sm text-gray-900 font-mono">
                {session?.jwt ? session.jwt.substring(0, 40) + "..." : "—"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
}
