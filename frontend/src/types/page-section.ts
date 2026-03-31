export type SectionType =
  | "hero"
  | "feature_grid"
  | "cta_banner"
  | "testimonial"
  | "text_block"
  | "stats";

export interface PageSection {
  id: number;
  documentId: string;
  page: string;
  order: number;
  section_type: SectionType;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  background_image: {
    url: string;
    formats?: {
      large?: { url: string };
      medium?: { url: string };
    };
  } | null;
  cta_text: string | null;
  cta_link: string | null;
  metadata: Record<string, unknown> | null;
  is_visible: boolean;
}

/** Typed metadata for feature_grid sections */
export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

/** Typed metadata for testimonial sections */
export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  company: string;
}

/** Typed metadata for stats sections */
export interface StatItem {
  value: string;
  label: string;
}
