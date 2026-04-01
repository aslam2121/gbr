"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { strapiGet } from "@/lib/strapi";
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
  "Côte d'Ivoire": "Ivory Coast",
  "The Bahamas": "Bahamas",
  "Guinea Bissau": "Guinea-Bissau",
  "Republic of Macedonia": "Macedonia",
  "North Macedonia": "Macedonia",
  "Timor-Leste": "East Timor",
  "Myanmar": "Myanmar, {Burma}",
  "Cabo Verde": "Cape Verde",
  "eSwatini": "Swaziland",
  "Antigua and Barbuda": "Antigua & Deps",
  "Trinidad and Tobago": "Trinidad & Tobago",
  "Saint Kitts and Nevis": "St Kitts & Nevis",
  "Saint Lucia": "St Lucia",
  "Saint Vincent and the Grenadines": "Saint Vincent & the Grenadines",
  "São Tomé and Príncipe": "Sao Tome & Principe",
  "Sao Tome and Principe": "Sao Tome & Principe",
  "Bosnia and Herzegovina": "Bosnia Herzegovina",
  "Czechia": "Czech Republic",
  "South Korea": "Korea South",
  "Republic of Korea": "Korea South",
  "North Korea": "Korea North",
  "Democratic People's Republic of Korea": "Korea North",
  "Lao PDR": "Laos",
  "Russia": "Russian Federation",
  "Iran (Islamic Republic of)": "Iran",
  "Syrian Arab Republic": "Syria",
  "Brunei Darussalam": "Brunei",
  "Burkina Faso": "Burkina",
  "Central African Republic": "Central African Rep",
  "Ireland": "Ireland {Republic}",
  "Federated States of Micronesia": "Micronesia",
  "Viet Nam": "Vietnam",
  "Somaliland": "Somalia",
  "Western Sahara": "Morocco",
  "Northern Cyprus": "Cyprus",
};

function mapGeoJsonCountry(geoName: string): string {
  return GEOJSON_TO_STRAPI[geoName] ?? geoName;
}

/** Fetch companies for a specific country from Strapi */
async function fetchCompaniesByCountry(country: string): Promise<Company[]> {
  try {
    const res = await strapiGet<Company[]>("/companies", {
      "filters[country][$eq]": country,
      "fields[0]": "name_of_the_company",
      "fields[1]": "country",
      "fields[2]": "continent",
      "fields[3]": "latitude",
      "fields[4]": "longitude",
      "fields[5]": "industry",
      "pagination[pageSize]": 100,
    });
    return res.data ?? [];
  } catch {
    return [];
  }
}

export default function HomeMap() {
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
    let activeLayer: L.Layer | null = null;
    let activeCountry = "";
    const markerLayer = L.layerGroup().addTo(map);

    // Loading indicator
    const loadingDiv = L.DomUtil.create("div", "");
    loadingDiv.innerHTML = `<div id="mapLoading" style="display:none;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:1000;background:rgba(0,0,0,0.7);color:#fff;padding:10px 20px;border-radius:8px;font-size:13px;">Loading companies...</div>`;
    map.getContainer().appendChild(loadingDiv);

    function countryStyle() {
      return {
        fillColor: "#043443",
        weight: 1,
        opacity: 1,
        color: "#0582ad",
        fillOpacity: 0.7,
      };
    }

    function activeStyle() {
      return {
        fillColor: "#0582ad",
        weight: 2,
        opacity: 1,
        color: "#42a5f5",
        fillOpacity: 0.85,
      };
    }

    function addMarkers(companies: Company[]) {
      markerLayer.clearLayers();
      for (const company of companies) {
        if (!company.latitude || !company.longitude) continue;

        const color = CONTINENT_COLORS[company.continent ?? ""] ?? "#0083ae";

        const icon = L.divIcon({
          className: "",
          html: `<div style="width:12px;height:12px;background:${color};border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.4);cursor:pointer;"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
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
    }

    async function selectCountry(strapiName: string, layer: L.Layer) {
      // Reset previous active country style
      if (activeLayer && geojsonLayer) {
        (activeLayer as L.Path).setStyle(countryStyle());
      }

      // Set new active
      activeCountry = strapiName;
      activeLayer = layer;
      (layer as L.Path).setStyle(activeStyle());

      // Zoom to country
      const bounds = (layer as L.Polygon).getBounds();
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 });

      // Show loading, fetch, show markers
      const loadingEl = document.getElementById("mapLoading");
      if (loadingEl) loadingEl.style.display = "block";

      const companies = await fetchCompaniesByCountry(strapiName);
      addMarkers(companies);

      if (loadingEl) loadingEl.style.display = "none";

      // Show back button
      const backBtn = document.getElementById("backToWorld");
      if (backBtn) backBtn.style.display = "block";

      // Show count info
      const infoEl = document.getElementById("countryInfo");
      if (infoEl) {
        infoEl.style.display = "block";
        infoEl.innerHTML = `<strong>${strapiName}</strong> — ${companies.length} companies`;
      }
    }

    function resetToWorld() {
      // Reset active country
      if (activeLayer) {
        (activeLayer as L.Path).setStyle(countryStyle());
      }
      activeLayer = null;
      activeCountry = "";
      markerLayer.clearLayers();

      if (geojsonLayer) {
        map.fitBounds(geojsonLayer.getBounds());
      }

      const backBtn = document.getElementById("backToWorld");
      if (backBtn) backBtn.style.display = "none";

      const infoEl = document.getElementById("countryInfo");
      if (infoEl) infoEl.style.display = "none";
    }

    // Back to world button
    const BackControl = L.Control.extend({
      options: { position: "topleft" as const },
      onAdd: () => {
        const container = L.DomUtil.create("div", "");
        container.innerHTML = `
          <button id="backToWorld" style="display:none;background:#fff;border:2px solid rgba(0,0,0,0.2);border-radius:4px;padding:6px 12px;cursor:pointer;font-size:13px;font-family:inherit;box-shadow:0 1px 4px rgba(0,0,0,0.15);">← World View</button>
        `;
        L.DomEvent.disableClickPropagation(container);
        return container;
      },
    });
    new BackControl().addTo(map);

    // Country info bar
    const InfoControl = L.Control.extend({
      options: { position: "topright" as const },
      onAdd: () => {
        const container = L.DomUtil.create("div", "");
        container.innerHTML = `
          <div id="countryInfo" style="display:none;background:#fff;border-radius:4px;padding:8px 14px;font-size:13px;font-family:inherit;box-shadow:0 1px 4px rgba(0,0,0,0.15);color:#333;"></div>
        `;
        L.DomEvent.disableClickPropagation(container);
        return container;
      },
    });
    new InfoControl().addTo(map);

    // Load GeoJSON
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
            const strapiName = mapGeoJsonCountry(rawName);

            // Tooltip on hover
            layer.bindTooltip(
              `<strong>${strapiName}</strong><br/><span style="font-size:11px;color:#888;">Click to view companies</span>`,
              { sticky: true, className: "leaflet-tooltip" }
            );

            layer.on({
              mouseover: () => {
                if (activeCountry !== strapiName) {
                  (layer as L.Path).setStyle({
                    fillColor: "#065a73",
                    weight: 1.5,
                    color: "#42a5f5",
                    fillOpacity: 0.8,
                  });
                }
              },
              mouseout: () => {
                if (activeCountry !== strapiName) {
                  (layer as L.Path).setStyle(countryStyle());
                }
              },
              click: () => {
                selectCountry(strapiName, layer);
              },
            });
          },
        }).addTo(map);

        // Wire up back button
        const backBtn = document.getElementById("backToWorld");
        if (backBtn) {
          backBtn.addEventListener("click", resetToWorld);
        }

        map.fitBounds(geojsonLayer.getBounds());
      });

    return () => {
      cancelled = true;
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return <div ref={mapRef} style={{ height: "800px", border: "2px solid #ccc" }} />;
}
