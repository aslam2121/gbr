"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { strapiGet, type StrapiResponse } from "@/lib/strapi";
import { type Company } from "@/types/company";
import { CompanyCard, CompanyCardSkeleton } from "./CompanyCard";

const PAGE_SIZE = 9;

interface CompanyListProps {
  initialData: StrapiResponse<Company[]>;
}

export function CompanyList({ initialData }: CompanyListProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const industry = searchParams.get("industry") ?? "";
  const continent = searchParams.get("continent") ?? "";
  const size = searchParams.get("size") ?? "";

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {
        "pagination[page]": page,
        "pagination[pageSize]": PAGE_SIZE,
        sort: "name_of_the_company:asc",
      };

      if (search) {
        params["filters[name_of_the_company][$containsi]"] = search;
      }
      if (industry) {
        params["filters[industry][$eq]"] = industry;
      }
      if (continent) {
        params["filters[continent][$eq]"] = continent;
      }
      if (size) {
        params["filters[employee_count][$eq]"] = size;
      }

      const result = await strapiGet<Company[]>("/companies", params);
      setData(result);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, industry, continent, size]);

  // Re-fetch when filters/page change (skip on initial render if params match)
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const companies = data.data ?? [];
  const pagination = data.meta?.pagination;
  const totalPages = pagination?.pageCount ?? 1;

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <CompanyCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-white py-16 shadow-sm ring-1 ring-gray-200">
        <svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">No companies found</h3>
        <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search term.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Results count */}
      <p className="mb-4 text-sm text-gray-500">
        Showing {companies.length} of {pagination?.total ?? 0} companies
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-1">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            // Show first, last, and pages around current
            if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
              return (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    p === page
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              );
            }
            // Show ellipsis
            if (p === page - 2 || p === page + 2) {
              return (
                <span key={p} className="px-2 text-gray-400">
                  ...
                </span>
              );
            }
            return null;
          })}

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
