"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { type SubscriptionPlan } from "@/types/subscription";
import { useAuth } from "@/hooks/useAuth";
import { PlanCard } from "./PlanCard";

type UserType = "company" | "investor" | "expert";

interface PricingGridProps {
  plans: SubscriptionPlan[];
}

const TABS: { key: UserType; label: string }[] = [
  { key: "company", label: "Companies" },
  { key: "investor", label: "Investors" },
  { key: "expert", label: "Experts" },
];

const COMPARISON_ROWS = [
  { label: "Directory Listings", key: "directory_listings" as const, format: (v: number) => v >= 999 ? "Unlimited" : String(v) },
  { label: "Contact Requests", key: "max_contacts" as const, format: (v: number) => v >= 999 ? "Unlimited" : `${v}/month` },
  { label: "Video Call Minutes", key: "call_minutes" as const, format: (v: number) => v === 0 ? "—" : v >= 999 ? "Unlimited" : `${v} min/month` },
];

export function PricingGrid({ plans }: PricingGridProps) {
  const [activeTab, setActiveTab] = useState<UserType>("company");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const { user } = useAuth();
  const router = useRouter();

  const filteredPlans = useMemo(
    () => plans.filter((p) => p.user_type === activeTab),
    [plans, activeTab]
  );

  const handleSelect = async (plan: SubscriptionPlan) => {
    if (plan.price_monthly === 0) {
      router.push("/register");
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: plan.id, billing_period: billingPeriod }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  return (
    <div>
      {/* User type tabs */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg bg-gray-100 p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-md px-5 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Billing toggle */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <span
          className={`text-sm font-medium ${
            billingPeriod === "monthly" ? "text-gray-900" : "text-gray-500"
          }`}
        >
          Monthly
        </span>
        <button
          onClick={() =>
            setBillingPeriod((p) => (p === "monthly" ? "yearly" : "monthly"))
          }
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
          style={{
            backgroundColor: billingPeriod === "yearly" ? "#2563EB" : "#D1D5DB",
          }}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
              billingPeriod === "yearly" ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span
          className={`text-sm font-medium ${
            billingPeriod === "yearly" ? "text-gray-900" : "text-gray-500"
          }`}
        >
          Yearly
        </span>
        {billingPeriod === "yearly" && (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
            Save 20%
          </span>
        )}
      </div>

      {/* Plan cards */}
      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            billingPeriod={billingPeriod}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Comparison table */}
      {filteredPlans.length > 0 && (
        <div className="mx-auto mt-16 max-w-4xl">
          <h3 className="text-center text-lg font-semibold text-gray-900 mb-6">
            Compare Plans
          </h3>
          <div className="overflow-x-auto rounded-xl ring-1 ring-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left font-medium text-gray-500">
                    Feature
                  </th>
                  {filteredPlans.map((plan) => (
                    <th
                      key={plan.id}
                      className="px-6 py-3 text-center font-medium text-gray-900"
                    >
                      {plan.name.split(" ").pop()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Price row */}
                <tr className="bg-white">
                  <td className="px-6 py-4 font-medium text-gray-700">
                    Price
                  </td>
                  {filteredPlans.map((plan) => {
                    const price =
                      billingPeriod === "yearly" && plan.price_yearly != null
                        ? Math.round(plan.price_yearly / 12)
                        : plan.price_monthly;
                    return (
                      <td
                        key={plan.id}
                        className="px-6 py-4 text-center text-gray-900 font-semibold"
                      >
                        {price === 0 ? "Free" : `$${price}/mo`}
                      </td>
                    );
                  })}
                </tr>

                {/* Feature rows from features array */}
                {(() => {
                  const allFeatures = new Set<string>();
                  filteredPlans.forEach((p) =>
                    p.features.forEach((f) => allFeatures.add(f))
                  );
                  return Array.from(allFeatures).map((feature) => (
                    <tr key={feature} className="bg-white">
                      <td className="px-6 py-3 text-gray-700">{feature}</td>
                      {filteredPlans.map((plan) => (
                        <td key={plan.id} className="px-6 py-3 text-center">
                          {plan.features.includes(feature) ? (
                            <svg
                              className="mx-auto h-5 w-5 text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2.5}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                              />
                            </svg>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ));
                })()}

                {/* Numeric comparison rows */}
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.key} className="bg-white">
                    <td className="px-6 py-3 font-medium text-gray-700">
                      {row.label}
                    </td>
                    {filteredPlans.map((plan) => (
                      <td
                        key={plan.id}
                        className="px-6 py-3 text-center text-gray-600"
                      >
                        {row.format(plan[row.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
