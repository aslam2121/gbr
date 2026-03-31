import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "World Map | B2B Platform",
  description:
    "Explore companies around the world on an interactive map. Filter by country and continent.",
};

const WorldMap = dynamic(() => import("@/modules/map/WorldMap").then((m) => ({ default: m.WorldMap })), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
        <p className="text-sm text-gray-500">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  return <WorldMap />;
}
