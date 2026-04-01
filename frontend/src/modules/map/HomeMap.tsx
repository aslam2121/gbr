"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { type Company } from "@/types/company";

const CONTINENT_COLORS: Record<string, string> = {
  "North America": "#3B82F6",
  "South America": "#10B981",
  "Europe": "#8B5CF6",
  "Africa": "#F59E0B",
  "Asia": "#EF4444",
  "Oceania": "#06B6D4",
};

/** Map GeoJSON country names → Strapi enum names where they differ */
const GEOJSON_TO_STRAPI: Record<string, string> = {
  "United States of America": "United States",
  "Republic of Serbia": "Serbia",
  "United Republic of Tanzania": "Tanzania",
  "Republic of the Congo": "Congo",
  "Democratic Republic of the Congo": "Congo {Democratic Rep}",
  "Ivory Coast": "Ivory Coast",
  "Côte d'Ivoire": "Ivory Coast",
  "The Bahamas": "Bahamas",
  "Guinea Bissau": "Guinea-Bissau",
  "Republic of Macedonia": "Macedonia",
  "North Macedonia": "Macedonia",
  "Timor-Leste": "East Timor",
  "East Timor": "East Timor",
  "Myanmar": "Myanmar, {Burma}",
  "Cabo Verde": "Cape Verde",
  "eSwatini": "Swaziland",
  "Swaziland": "Swaziland",
  "Antigua and Barbuda": "Antigua & Deps",
  "Trinidad and Tobago": "Trinidad & Tobago",
  "Saint Kitts and Nevis": "St Kitts & Nevis",
  "Saint Lucia": "St Lucia",
  "Saint Vincent and the Grenadines": "Saint Vincent & the Grenadines",
  "São Tomé and Príncipe": "Sao Tome & Principe",
  "Sao Tome and Principe": "Sao Tome & Principe",
  "Bosnia and Herzegovina": "Bosnia Herzegovina",
  "Czech Republic": "Czech Republic",
  "Czechia": "Czech Republic",
  "South Korea": "Korea South",
  "Republic of Korea": "Korea South",
  "Korea": "Korea South",
  "North Korea": "Korea North",
  "Dem. Rep. Korea": "Korea North",
  "Democratic People's Republic of Korea": "Korea North",
  "Lao PDR": "Laos",
  "Lao People's Democratic Republic": "Laos",
  "Laos": "Laos",
  "Russian Federation": "Russian Federation",
  "Russia": "Russian Federation",
  "Iran (Islamic Republic of)": "Iran",
  "Iran, Islamic Republic of": "Iran",
  "Syria": "Syria",
  "Syrian Arab Republic": "Syria",
  "Brunei Darussalam": "Brunei",
  "Brunei": "Brunei",
  "Burkina Faso": "Burkina",
  "Central African Republic": "Central African Rep",
  "Ireland": "Ireland {Republic}",
  "Micronesia (Federated States of)": "Micronesia",
  "Federated States of Micronesia": "Micronesia",
  "Viet Nam": "Vietnam",
  "Vietnam": "Vietnam",
  "Palestine": "Israel",
  "Somaliland": "Somalia",
  "Western Sahara": "Morocco",
  "Taiwan": "Taiwan",
  "Northern Cyprus": "Cyprus",
};

function mapGeoJsonCountry(geoName: string): string {
  return GEOJSON_TO_STRAPI[geoName] ?? geoName;
}

interface HomeMapProps {
  companies: Company[];
}

export default function HomeMap({ companies }: HomeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      minZoom: 2,
      maxZoom: 12,
      zoomControl: true,
      attributionControl: false,
    }).setView([40, 0], 2);

    mapInstanceRef.current = map;

    let cancelled = false;
    let geojsonLayer: L.GeoJSON | null = null;
    const markerLayer = L.layerGroup().addTo(map);

    function countryStyle() {
      return {
        fillColor: "#043443",
        weight: 1,
        opacity: 1,
        color: "#0582ad",
        fillOpacity: 0.7,
      };
    }

    function highlightStyle() {
      return {
        fillColor: "#42a5f5",
        weight: 2,
        color: "#1e88e5",
      };
    }

    function addMarkerForCompany(company: Company) {
      if (!company.latitude || !company.longitude) return;

      const color = CONTINENT_COLORS[company.continent ?? ""] ?? "#0083ae";

      const icon = L.divIcon({
        className: "",
        html: `<div style="width:14px;height:14px;background:${color};border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.4);cursor:pointer;"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      L.marker([company.latitude, company.longitude], { icon })
        .bindPopup(
          `<div style="min-width:150px;">` +
            `<strong><a href="/directory/${company.documentId}" style="color:#0083ae;text-decoration:none;">${company.name_of_the_company}</a></strong>` +
            `<br/><span style="font-size:12px;color:#666;">${company.country}</span>` +
            (company.industry
              ? `<br/><span style="font-size:11px;color:#999;text-transform:capitalize;">${company.industry}</span>`
              : "") +
            `</div>`
        )
        .addTo(markerLayer);
    }

    function showCompanyMarkers(companyList: Company[]) {
      markerLayer.clearLayers();
      companyList.forEach(addMarkerForCompany);
    }

    function updateMarkersForViewport() {
      const zoom = map.getZoom();
      if (zoom < 4) {
        markerLayer.clearLayers();
        return;
      }

      const bounds = map.getBounds();
      const visible = companies.filter(
        (c) =>
          c.latitude &&
          c.longitude &&
          bounds.contains([c.latitude, c.longitude])
      );
      showCompanyMarkers(visible);

      // Show back button when zoomed in
      const backBtn = document.getElementById("backToWorld");
      if (backBtn) backBtn.style.display = zoom >= 4 ? "block" : "none";
    }

    map.on("moveend", updateMarkersForViewport);

    // Back to world view button
    const BackControl = L.Control.extend({
      options: { position: "topleft" as const },
      onAdd: () => {
        const btn = L.DomUtil.create("div", "");
        btn.innerHTML = `<button style="background:#fff;border:2px solid rgba(0,0,0,0.2);border-radius:4px;padding:4px 10px;cursor:pointer;font-size:13px;font-family:inherit;display:none;" id="backToWorld">← World View</button>`;
        L.DomEvent.disableClickPropagation(btn);
        return btn;
      },
    });
    new BackControl().addTo(map);

    fetch(
      "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
    )
      .then((res) => res.json())
      .then((geojsonData) => {
        if (cancelled) return;

        geojsonLayer = L.geoJSON(geojsonData, {
          style: countryStyle,
          onEachFeature: (feature, layer) => {
            const rawName: string =
              feature.properties.ADMIN ?? feature.properties.name ?? "Unknown";
            const countryName = mapGeoJsonCountry(rawName);

            const countryCompanies = companies.filter(
              (c) => c.country === countryName
            );
            const count = countryCompanies.length;

            // Tooltip on hover showing country name + count
            layer.bindTooltip(
              `<strong>${countryName}</strong>${count > 0 ? `<br/>${count} compan${count === 1 ? "y" : "ies"}` : ""}`,
              { sticky: true, className: "leaflet-tooltip" }
            );

            layer.on({
              mouseover: () => {
                (layer as L.Path).setStyle(highlightStyle());
              },
              mouseout: () => {
                (layer as L.Path).setStyle(countryStyle());
              },
              click: () => {
                // Zoom into the country bounds
                const bounds = (layer as L.Polygon).getBounds();
                map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 });

                // Show company markers for this country
                showCompanyMarkers(countryCompanies);

                // Show back button
                const backBtn = document.getElementById("backToWorld");
                if (backBtn) backBtn.style.display = "block";
              },
            });
          },
        }).addTo(map);

        // Back to world click handler
        const backBtn = document.getElementById("backToWorld");
        if (backBtn) {
          backBtn.addEventListener("click", () => {
            if (geojsonLayer) {
              map.fitBounds(geojsonLayer.getBounds());
            }
            markerLayer.clearLayers();
            backBtn.style.display = "none";
          });
        }

        map.fitBounds(geojsonLayer.getBounds());
      });

    return () => {
      cancelled = true;
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [companies]);

  return <div ref={mapRef} style={{ height: "800px", border: "2px solid #ccc" }} />;
}
