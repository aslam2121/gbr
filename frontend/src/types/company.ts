export interface Company {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
  industry: string | null;
  country: string;
  continent: string | null;
  latitude: number | null;
  longitude: number | null;
  website: string | null;
  founded_year: number | null;
  employee_count: string | null;
  logo: {
    url: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
    };
  } | null;
  createdAt: string;
  updatedAt: string;
}

/** Map employee_count enum to human-readable label */
export const EMPLOYEE_COUNT_LABELS: Record<string, string> = {
  s_1_10: "1–10",
  s_11_50: "11–50",
  s_51_200: "51–200",
  s_201_500: "201–500",
  s_500_plus: "500+",
};

/** Map continent enum to human-readable label */
export const CONTINENT_LABELS: Record<string, string> = {
  asia: "Asia",
  europe: "Europe",
  north_america: "North America",
  south_america: "South America",
  africa: "Africa",
  oceania: "Oceania",
};

/** Map industry enum to human-readable label */
export const INDUSTRY_LABELS: Record<string, string> = {
  tech: "Tech",
  finance: "Finance",
  healthcare: "Healthcare",
  energy: "Energy",
  manufacturing: "Manufacturing",
  logistics: "Logistics",
  education: "Education",
  other: "Other",
};

/** Country code to flag emoji */
export function countryFlag(country: string): string {
  const flags: Record<string, string> = {
    "United States": "\u{1F1FA}\u{1F1F8}",
    "United Kingdom": "\u{1F1EC}\u{1F1E7}",
    Germany: "\u{1F1E9}\u{1F1EA}",
    France: "\u{1F1EB}\u{1F1F7}",
    Canada: "\u{1F1E8}\u{1F1E6}",
    Australia: "\u{1F1E6}\u{1F1FA}",
    India: "\u{1F1EE}\u{1F1F3}",
    Singapore: "\u{1F1F8}\u{1F1EC}",
    UAE: "\u{1F1E6}\u{1F1EA}",
    Japan: "\u{1F1EF}\u{1F1F5}",
    Brazil: "\u{1F1E7}\u{1F1F7}",
    Argentina: "\u{1F1E6}\u{1F1F7}",
    Colombia: "\u{1F1E8}\u{1F1F4}",
    Kenya: "\u{1F1F0}\u{1F1EA}",
    Nigeria: "\u{1F1F3}\u{1F1EC}",
    "South Africa": "\u{1F1FF}\u{1F1E6}",
    "New Zealand": "\u{1F1F3}\u{1F1FF}",
    Sweden: "\u{1F1F8}\u{1F1EA}",
  };
  return flags[country] ?? "\u{1F30D}";
}
