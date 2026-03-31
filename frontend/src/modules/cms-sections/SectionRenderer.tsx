import { type PageSection } from "@/types/page-section";
import { HeroSection } from "./HeroSection";
import { FeatureGrid } from "./FeatureGrid";
import { CTABanner } from "./CTABanner";
import { TestimonialSlider } from "./TestimonialSlider";
import { TextBlock } from "./TextBlock";
import { StatsSection } from "./StatsSection";
import { HeroBanner } from "./HeroBanner";

interface SectionRendererProps {
  section: PageSection;
}

const SECTION_MAP: Record<string, React.ComponentType<{ section: PageSection }>> = {
  hero: HeroSection,
  feature_grid: FeatureGrid,
  cta_banner: CTABanner,
  testimonial: TestimonialSlider,
  text_block: TextBlock,
  stats: StatsSection,
  hero_banner: HeroBanner,
};

export function SectionRenderer({ section }: SectionRendererProps) {
  const Component = SECTION_MAP[section.section_type];

  if (!Component) {
    return null;
  }

  return <Component section={section} />;
}
