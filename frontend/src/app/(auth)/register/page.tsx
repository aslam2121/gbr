import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register — GBR Platform",
  description: "Create your GBR account as a Company, Investor, or Expert.",
};

const USER_TYPES = [
  {
    type: "investor",
    title: "Investor",
    description: "Register as an investor to discover opportunities and connect with growing businesses.",
    href: "/register/investor",
    icon: "bi-graph-up-arrow",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    btnColor: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    type: "company",
    title: "Company",
    description: "Register your company to connect with investors, experts, and global business networks.",
    href: "/register/company",
    icon: "bi-building",
    color: "text-gbr-primary",
    bgColor: "bg-gbr-primary/5",
    btnColor: "bg-gbr-primary hover:bg-gbr-dark",
  },
  {
    type: "expert",
    title: "Expert",
    description: "Register as an expert and offer consulting support to companies and investors.",
    href: "/register/expert",
    icon: "bi-mortarboard",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    btnColor: "bg-amber-500 hover:bg-amber-600",
  },
];

export default function RegisterPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Choose Registration Type</h1>
          <p className="mt-2 text-gray-600">Select your profile to create a GBR account.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {USER_TYPES.map((ut) => (
            <div
              key={ut.type}
              className="flex flex-col rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-200"
            >
              <div className="flex flex-1 flex-col items-center">
                <i className={`bi ${ut.icon} text-4xl ${ut.color}`} />
                <h2 className="mt-3 text-xl font-semibold text-gray-900">{ut.title}</h2>
                <p className="mt-2 text-sm text-gray-600">{ut.description}</p>
              </div>
              <Link
                href={ut.href}
                className={`mt-4 block w-full rounded-lg py-2.5 text-center text-sm font-medium text-white transition-colors ${ut.btnColor}`}
              >
                Register as {ut.title}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-gbr-accent hover:text-gbr-secondary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
