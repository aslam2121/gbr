"use client";

import { useEffect, useState } from "react";
import type { Company } from "@/types/company";
import { COUNTRY_COORDS } from "@/types/company";

interface CompanyMapProps {
  company: Company;
}

export function CompanyMap({ company }: CompanyMapProps) {
  const [MapComponent, setMapComponent] = useState<React.ReactNode>(null);

  const coords = COUNTRY_COORDS[company.country];

  useEffect(() => {
    if (!coords) return;

    // Dynamically import leaflet to avoid SSR issues
    Promise.all([
      import("leaflet"),
      import("react-leaflet"),
      import("leaflet/dist/leaflet.css"),
    ]).then(([L, RL]) => {
      // Fix default marker icon
      delete (L.default.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const { MapContainer, TileLayer, Marker, Popup } = RL;

      setMapComponent(
        <MapContainer
          center={coords}
          zoom={5}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={coords}>
            <Popup>{company.name_of_the_company}</Popup>
          </Marker>
        </MapContainer>
      );
    });
  }, [company, coords]);

  if (!coords) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-100 text-sm text-gray-400">
        No location data available
      </div>
    );
  }

  if (!MapComponent) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-100">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return <>{MapComponent}</>;
}
