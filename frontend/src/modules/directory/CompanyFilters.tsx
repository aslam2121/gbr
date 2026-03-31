"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import {
  INDUSTRY_LABELS,
  CONTINENT_LABELS,
  EMPLOYEE_COUNT_LABELS,
} from "@/types/company";

export function CompanyFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const currentIndustry = searchParams.get("industry") ?? "";
  const currentContinent = searchParams.get("continent") ?? "";
  const currentSize = searchParams.get("size") ?? "";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page"); // reset to page 1 on filter change
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const clearFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const hasFilters = currentSearch || currentIndustry || currentContinent || currentSize;

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          id="search"
          type="text"
          placeholder="Company name..."
          defaultValue={currentSearch}
          onChange={(e) => {
            // Debounce-like: update on blur or enter
            // For immediate update, we use onChange
            updateParam("search", e.target.value);
          }}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Industry */}
      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
          Industry
        </label>
        <select
          id="industry"
          value={currentIndustry}
          onChange={(e) => updateParam("industry", e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Industries</option>
          {Object.entries(INDUSTRY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Continent */}
      <div>
        <label htmlFor="continent" className="block text-sm font-medium text-gray-700 mb-1">
          Continent
        </label>
        <select
          id="continent"
          value={currentContinent}
          onChange={(e) => updateParam("continent", e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Continents</option>
          {Object.entries(CONTINENT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Employee Size */}
      <div>
        <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
          Company Size
        </label>
        <select
          id="size"
          value={currentSize}
          onChange={(e) => updateParam("size", e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Sizes</option>
          {Object.entries(EMPLOYEE_COUNT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label} employees
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
