"use client";

import { type SubscriptionPlan } from "@/types/subscription";

interface PlanCardProps {
  plan: SubscriptionPlan;
  billingPeriod: "monthly" | "yearly";
  currentPlanId?: number;
  onSelect: (plan: SubscriptionPlan) => void;
}

export function PlanCard({ plan, billingPeriod, currentPlanId, onSelect }: PlanCardProps) {
  const isCurrent = currentPlanId === plan.id;
  const isFree = plan.price_monthly === 0;
  const price = billingPeriod === "yearly" && plan.price_yearly != null
    ? plan.price_yearly
    : plan.price_monthly;
  const perMonth = billingPeriod === "yearly" && plan.price_yearly != null
    ? Math.round((plan.price_yearly / 12) * 100) / 100
    : plan.price_monthly;

  let buttonText = "Get Started";
  if (isCurrent) buttonText = "Current Plan";
  else if (!isFree && currentPlanId) buttonText = "Upgrade";

  return (
    <div
      className={`relative flex flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 transition-shadow hover:shadow-md ${
        plan.is_popular
          ? "ring-2 ring-blue-600 shadow-blue-100"
          : "ring-gray-200"
      }`}
    >
      {/* Popular badge */}
      {plan.is_popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white shadow-sm">
            Most Popular
          </span>
        </div>
      )}

      {/* Plan name */}
      <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>

      {/* Price */}
      <div className="mt-4 flex items-baseline gap-1">
        {isFree ? (
          <span className="text-4xl font-bold text-gray-900">Free</span>
        ) : (
          <>
            <span className="text-4xl font-bold text-gray-900">
              ${Math.round(perMonth)}
            </span>
            <span className="text-sm text-gray-500">/month</span>
          </>
        )}
      </div>

      {/* Yearly total */}
      {!isFree && billingPeriod === "yearly" && plan.price_yearly != null && (
        <p className="mt-1 text-xs text-gray-400">
          ${plan.price_yearly} billed annually
        </p>
      )}

      {/* Divider */}
      <div className="my-6 h-px bg-gray-100" />

      {/* Features */}
      <ul className="flex-1 space-y-3">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-blue-600"
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
            <span className="text-sm text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={() => onSelect(plan)}
        disabled={isCurrent}
        className={`mt-8 w-full rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
          isCurrent
            ? "cursor-default bg-gray-100 text-gray-400"
            : plan.is_popular
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              : "bg-gray-900 text-white hover:bg-gray-800"
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
}
