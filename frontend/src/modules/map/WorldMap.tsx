"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { strapiGet } from "@/lib/strapi";
import { type Company, CONTINENT_LABELS } from "@/types/company";
import { MapMarker } from "./MapMarker";

/** Group companies by country and compute average lat/lng per group */
interface CountryGroup {
  country: string;
  companies: Company[];
  position: [number, number];
}

function groupByCountry(companies: Company[]): CountryGroup[] {
  const map = new Map<string, Company[]>();
  for (const c of companies) {
    const list = map.get(c.country) ?? [];
    list.push(c);
    map.set(c.country, list);
  }

  return Array.from(map.entries()).map(([country, list]) => {
    const lats = list.filter((c) => c.latitude != null).map((c) => c.latitude!);
    const lngs = list.filter((c) => c.longitude != null).map((c) => c.longitude!);
    const avgLat = lats.length ? lats.reduce((a, b) => a + b, 0) / lats.length : 0;
    const avgLng = lngs.length ? lngs.reduce((a, b) => a + b, 0) / lngs.length : 0;
    return { country, companies: list, position: [avgLat, avgLng] as [number, number] };
  });
}

/** Search bar overlay */
function SearchOverlay({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="absolute left-4 right-4 top-4 z-[1000] sm:left-auto sm:right-4 sm:w-72">
      <input
        type="text"
        placeholder="Search companies..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border-0 bg-white px-4 py-2.5 text-sm shadow-lg ring-1 ring-gray-200 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

/** Legend overlay */
function Legend({
  totalCompanies,
  totalCountries,
  continentCounts,
}: {
  totalCompanies: number;
  totalCountries: number;
  continentCounts: Record<string, number>;
}) {
  const CONTINENT_COLORS: Record<string, string> = {
    "North America": "#3B82F6",
    "South America": "#10B981",
    "Europe": "#8B5CF6",
    "Africa": "#F59E0B",
    "Asia": "#EF4444",
    "Oceania": "#06B6D4",
  };

  return (
    <div className="absolute bottom-6 left-4 z-[1000] rounded-lg bg-white p-4 shadow-lg ring-1 ring-gray-200 text-sm max-w-[220px]">
      <p className="font-semibold text-gray-900">
        {totalCompanies} companies
      </p>
      <p className="text-gray-500 text-xs mb-3">
        in {totalCountries} countries
      </p>
      <div className="space-y-1.5">
        {Object.entries(CONTINENT_COLORS).map(([key, color]) => {
          const count = continentCounts[key] ?? 0;
          if (count === 0) return null;
          return (
            <div key={key} className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-600">
                {CONTINENT_LABELS[key] ?? key} ({count})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Invalidate map size after render (fixes gray tiles) */
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timeout = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(timeout);
  }, [map]);
  return null;
}

export function WorldMap() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetch() {
      try {
        const res = await strapiGet<Company[]>("/companies", {
          "pagination[pageSize]": 100,
          sort: "name_of_the_company:asc",
        });
        setCompanies(res.data ?? []);
      } catch (err) {
        console.error("Failed to fetch companies for map:", err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return companies;
    const q = search.toLowerCase();
    return companies.filter(
      (c) =>
        c.name_of_the_company.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    );
  }, [companies, search]);

  const groups = useMemo(() => groupByCountry(filtered), [filtered]);

  const continentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of filtered) {
      if (c.continent) {
        counts[c.continent] = (counts[c.continent] ?? 0) + 1;
      }
    }
    return counts;
  }, [filtered]);

  const totalCountries = groups.length;

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
          <p className="text-sm text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      <MapContainer
        center={[20, 10]}
        zoom={2}
        minZoom={2}
        maxZoom={14}
        zoomControl={false}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ background: "#f0f0f0" }}
      >
        <MapResizer />
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <ZoomControl position="topright" />

        {groups.map((group) => (
          <MapMarker
            key={group.country}
            country={group.country}
            companies={group.companies}
            position={group.position}
          />
        ))}
      </MapContainer>

      {/* Overlays */}
      <SearchOverlay value={search} onChange={setSearch} />
      <Legend
        totalCompanies={filtered.length}
        totalCountries={totalCountries}
        continentCounts={continentCounts}
      />
    </div>
  );
}
