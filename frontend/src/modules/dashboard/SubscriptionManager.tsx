"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function SubscriptionManager() {
  const { user, session } = useAuth();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const subscriptionStatus = (session as { user?: { subscription_status?: string } })
    ?.user?.subscription_status ?? "free";
  const isPaid = subscriptionStatus === "active";

  const handleCancel = async () => {
    setCancelling(true);
    try {
      // In production, this would call Stripe to cancel the subscription
      // For now, just close the modal
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowCancelModal(false);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Subscription</h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage your subscription plan and billing.
      </p>

      {/* Current plan */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 capitalize">
                {isPaid ? "Pro" : "Free"}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  isPaid
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {subscriptionStatus}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500 capitalize">
              {user?.user_type} plan
            </p>
          </div>

          <Link
            href="/pricing"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {isPaid ? "Change Plan" : "Upgrade"}
          </Link>
        </div>

        {isPaid && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-500">
              Next billing date: <span className="text-gray-700">April 30, 2026</span>
            </p>
          </div>
        )}
      </div>

      {/* Usage stats */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Usage This Month</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-500">Call Minutes</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              0 <span className="text-sm font-normal text-gray-400">/ {isPaid ? "60" : "0"}</span>
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full w-0 rounded-full bg-blue-600" />
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-500">Directory Listings</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              1 <span className="text-sm font-normal text-gray-400">/ {isPaid ? "3" : "1"}</span>
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full w-1/3 rounded-full bg-blue-600" />
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-500">Contact Requests</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              0 <span className="text-sm font-normal text-gray-400">/ {isPaid ? "50" : "10"}</span>
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full w-0 rounded-full bg-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Cancel subscription */}
      {isPaid && (
        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Cancel Subscription</h2>
          <p className="mt-1 text-sm text-gray-500">
            You will lose access to paid features at the end of your current billing
            period.
          </p>
          <button
            onClick={() => setShowCancelModal(true)}
            className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Cancel Subscription
          </button>
        </div>
      )}

      {/* Cancel modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Cancel your subscription?
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Your subscription will remain active until the end of the current billing
              period. After that, you&apos;ll be downgraded to the Free plan.
            </p>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Keep Plan
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
