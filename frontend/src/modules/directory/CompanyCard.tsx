import Link from "next/link";
import {
  Company,
  EMPLOYEE_COUNT_LABELS,
  INDUSTRY_LABELS,
  countryFlag,
} from "@/types/company";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const logoUrl = company.logo?.formats?.small?.url ?? company.logo?.url;

  return (
    <Link
      href={`/directory/${company.slug}`}
      className="group flex flex-col rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md hover:ring-blue-300"
    >
      {/* Logo area */}
      <div className="flex h-40 items-center justify-center rounded-t-xl bg-gray-50 p-6">
        {logoUrl ? (
          <img
            src={`${STRAPI_URL}${logoUrl}`}
            alt={`${company.name} logo`}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 text-2xl font-bold text-blue-600">
            {company.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {company.name}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {company.industry && (
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              {INDUSTRY_LABELS[company.industry] ?? company.industry}
            </span>
          )}
          {company.employee_count && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              {EMPLOYEE_COUNT_LABELS[company.employee_count] ?? company.employee_count} employees
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-500">
          <span>{countryFlag(company.country)}</span>
          <span>{company.country}</span>
        </div>

        {company.founded_year && (
          <p className="mt-1 text-xs text-gray-400">
            Founded {company.founded_year}
          </p>
        )}
      </div>
    </Link>
  );
}

export function CompanyCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl bg-white shadow-sm ring-1 ring-gray-200 animate-pulse">
      <div className="flex h-40 items-center justify-center rounded-t-xl bg-gray-100">
        <div className="h-16 w-16 rounded-xl bg-gray-200" />
      </div>
      <div className="p-5 space-y-3">
        <div className="h-5 w-3/4 rounded bg-gray-200" />
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-gray-200" />
          <div className="h-5 w-20 rounded-full bg-gray-200" />
        </div>
        <div className="h-4 w-1/2 rounded bg-gray-200" />
      </div>
    </div>
  );
}
