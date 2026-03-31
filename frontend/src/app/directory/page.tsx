import { Suspense } from "react";
import type { Metadata } from "next";
import { strapiGet } from "@/lib/strapi";
import { type Company } from "@/types/company";
import { CompanyFilters, CompanyList, CompanyCardSkeleton } from "@/modules/directory";

export const metadata: Metadata = {
  title: "Company Directory | B2B Platform",
  description:
    "Browse and discover companies across industries and continents. Connect with businesses, investors, and experts.",
};

interface DirectoryPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DirectoryPage({ searchParams }: DirectoryPageProps) {
  const params = await searchParams;

  const strapiParams: Record<string, unknown> = {
    "pagination[page]": params.page ?? "1",
    "pagination[pageSize]": 9,
    sort: "name:asc",
  };

  if (params.search) {
    strapiParams["filters[name][$containsi]"] = params.search;
  }
  if (params.industry) {
    strapiParams["filters[industry][$eq]"] = params.industry;
  }
  if (params.continent) {
    strapiParams["filters[continent][$eq]"] = params.continent;
  }
  if (params.size) {
    strapiParams["filters[employee_count][$eq]"] = params.size;
  }

  const initialData = await strapiGet<Company[]>("/companies", strapiParams);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Company Directory</h1>
          <p className="mt-2 text-gray-600">
            Discover companies across industries and continents
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar filters */}
          <div className="w-full shrink-0 lg:w-64">
            <div className="sticky top-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <Suspense fallback={null}>
                <CompanyFilters />
              </Suspense>
            </div>
          </div>

          {/* Company grid */}
          <div className="flex-1">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <CompanyCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <CompanyList initialData={initialData} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
