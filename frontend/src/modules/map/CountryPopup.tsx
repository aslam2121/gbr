import Link from "next/link";
import { type Company, countryFlag } from "@/types/company";

interface CountryPopupProps {
  country: string;
  companies: Company[];
}

const MAX_DISPLAY = 5;

export function CountryPopup({ country, companies }: CountryPopupProps) {
  const displayed = companies.slice(0, MAX_DISPLAY);
  const remaining = companies.length - MAX_DISPLAY;

  return (
    <div className="min-w-[200px] max-w-[280px]">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">{countryFlag(country)}</span>
        <h3 className="text-sm font-semibold text-gray-900">{country}</h3>
      </div>
      <p className="mb-2 text-xs text-gray-500">
        {companies.length} {companies.length === 1 ? "company" : "companies"}
      </p>
      <ul className="space-y-1">
        {displayed.map((c) => (
          <li key={c.id}>
            <Link
              href={`/directory/${c.slug}`}
              className="block text-sm text-blue-600 hover:text-blue-700 hover:underline truncate"
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
      {remaining > 0 && (
        <Link
          href={`/directory?search=${encodeURIComponent(country)}`}
          className="mt-2 inline-block text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          and {remaining} more &rarr;
        </Link>
      )}
      <div className="mt-3 border-t border-gray-100 pt-2">
        <Link
          href={`/directory?search=${encodeURIComponent(country)}`}
          className="text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          View all in directory &rarr;
        </Link>
      </div>
    </div>
  );
}
