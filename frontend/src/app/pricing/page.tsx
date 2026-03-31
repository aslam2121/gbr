import type { Metadata } from "next";
import { strapiGet } from "@/lib/strapi";
import { type SubscriptionPlan } from "@/types/subscription";
import { PricingGrid } from "@/modules/pricing";

export const metadata: Metadata = {
  title: "Pricing | B2B Platform",
  description:
    "Simple, transparent pricing for companies, investors, and experts. Start free and upgrade as you grow.",
};

const FAQ_ITEMS = [
  {
    question: "Can I switch plans at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the credit will be applied to your next billing cycle.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Every account starts with our Free plan, which includes core features at no cost. You can upgrade to a paid plan whenever you need more capabilities.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express) through our secure Stripe payment processing.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "You can cancel your subscription at any time from your dashboard. You'll continue to have access to paid features until the end of your current billing period.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer:
      "Yes! Switch to annual billing and save approximately 20% compared to monthly billing.",
  },
  {
    question: "What happens to my data if I downgrade?",
    answer:
      "Your data is never deleted when you change plans. If you exceed the limits of your new plan, you'll still have read access to all your data but won't be able to add more until you upgrade or free up space.",
  },
];

export default async function PricingPage() {
  let plans: SubscriptionPlan[] = [];

  try {
    const res = await strapiGet<SubscriptionPlan[]>("/subscription-plans", {
      "pagination[pageSize]": 100,
      sort: "price_monthly:asc",
    });
    plans = res.data ?? [];
  } catch (err) {
    console.error("Failed to fetch plans:", err);
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-gray-50 to-white pt-16 pb-8">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
        </div>
      </div>

      {/* Pricing grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {plans.length > 0 ? (
          <PricingGrid plans={plans} />
        ) : (
          <div className="py-16 text-center">
            <p className="text-gray-500">
              Pricing plans are being configured. Check back soon.
            </p>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <dl className="mt-10 space-y-6">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
              >
                <dt className="text-base font-semibold text-gray-900">
                  {item.question}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-gray-600">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Ready to get started?
          </h2>
          <p className="mt-3 text-gray-600">
            Join thousands of companies, investors, and experts already on the platform.
          </p>
          <a
            href="/register"
            className="mt-6 inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Create your free account
          </a>
        </div>
      </div>
    </main>
  );
}
