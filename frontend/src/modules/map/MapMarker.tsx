"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { type Company } from "@/types/company";
import { CountryPopup } from "./CountryPopup";

interface MapMarkerProps {
  country: string;
  companies: Company[];
  position: [number, number];
}

const CONTINENT_COLORS: Record<string, string> = {
  "North America": "#3B82F6",
  "South America": "#10B981",
  "Europe": "#8B5CF6",
  "Africa": "#F59E0B",
  "Asia": "#EF4444",
  "Oceania": "#06B6D4",
};

function getMarkerColor(continent: string | null): string {
  return continent ? CONTINENT_COLORS[continent] ?? "#6B7280" : "#6B7280";
}

function createClusterIcon(count: number, color: string): L.DivIcon {
  const size = count >= 5 ? 44 : count >= 3 ? 38 : 32;

  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        color: white;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${count >= 5 ? 14 : 12}px;
        font-weight: 700;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border: 3px solid white;
        cursor: pointer;
        transition: transform 0.15s ease;
      ">${count}</div>
    `,
    className: "custom-cluster-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

export function MapMarker({ country, companies, position }: MapMarkerProps) {
  const continent = companies[0]?.continent ?? null;
  const color = getMarkerColor(continent);
  const icon = createClusterIcon(companies.length, color);

  return (
    <Marker position={position} icon={icon}>
      <Popup maxWidth={300} minWidth={200}>
        <CountryPopup country={country} companies={companies} />
      </Popup>
    </Marker>
  );
}
