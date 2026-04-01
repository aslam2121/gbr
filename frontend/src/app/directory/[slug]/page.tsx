import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { strapiGet } from "@/lib/strapi";
import {
  type Company,
  INDUSTRY_LABELS,
  CONTINENT_LABELS,
  EMPLOYEE_COUNT_LABELS,
  countryFlag,
} from "@/types/company";
import { CompanyMap } from "@/modules/directory/CompanyMap";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCompany(documentId: string): Promise<Company | null> {
  try {
    const res = await strapiGet<Company>(`/companies/${documentId}`, {
      "populate": "*",
    });
    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: documentId } = await params;
  const company = await getCompany(documentId);
  if (!company) return { title: "Company Not Found" };
  return {
    title: `${company.name_of_the_company} | B2B Platform`,
    description: company.short_description
      ? String(company.short_description).slice(0, 160)
      : `${company.name_of_the_company} — ${company.industry ?? ""} company based in ${company.country}`,
  };
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const { slug: documentId } = await params;
  const company = await getCompany(documentId);

  if (!company) {
    notFound();
  }

  const logoUrl = company.logo?.formats?.small?.url ?? company.logo?.url;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Back link */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/directory"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Directory
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <div className="flex items-start gap-4">
                {logoUrl ? (
                  <img
                    src={`${STRAPI_URL}${logoUrl}`}
                    alt={`${company.name_of_the_company} logo`}
                    className="h-16 w-16 rounded-xl object-contain bg-gray-50 p-2"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-2xl font-bold text-blue-600">
                    {company.name_of_the_company?.trim()?.charAt(0) ?? "?"}
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{company.name_of_the_company}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {company.industry && (
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        {INDUSTRY_LABELS[company.industry] ?? company.industry}
                      </span>
                    )}
                    {company.continent && (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        {CONTINENT_LABELS[company.continent] ?? company.continent}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {company.short_description && (
              <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">About</h2>
                <div className="mt-3 text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {company.short_description}
                </div>
              </div>
            )}

            {/* Map */}
            {company.latitude && company.longitude && (
              <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
                <div className="px-6 pt-6 pb-3">
                  <h2 className="text-lg font-semibold text-gray-900">Location</h2>
                </div>
                <div className="h-64">
                  <CompanyMap company={company} />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details card */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Details</h2>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Country</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {countryFlag(company.country)} {company.country}
                  </dd>
                </div>

                {company.employee_count && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Employees</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {EMPLOYEE_COUNT_LABELS[company.employee_count] ?? company.employee_count}
                    </dd>
                  </div>
                )}

                {company.website && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Website</dt>
                    <dd className="mt-1">
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 break-all"
                      >
                        {company.website.replace(/^https?:\/\//, "")}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Action buttons */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-3">
              <Link
                href="/calls"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                Request a Call
              </Link>
              <Link
                href="/directory"
                className="flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Browse More Companies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
