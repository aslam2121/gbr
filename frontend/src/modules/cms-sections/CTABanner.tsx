import Link from "next/link";
import { type PageSection } from "@/types/page-section";

interface CTABannerProps {
  section: PageSection;
}

export function CTABanner({ section }: CTABannerProps) {
  return (
    <section className="bg-blue-600">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        {section.title && (
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {section.title}
          </h2>
        )}
        {section.subtitle && (
          <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
            {section.subtitle}
          </p>
        )}
        {section.cta_text && section.cta_link && (
          <Link
            href={section.cta_link}
            className="mt-8 inline-flex items-center rounded-lg bg-white px-8 py-3.5 text-sm font-semibold text-blue-600 shadow-sm transition-colors hover:bg-blue-50"
          >
            {section.cta_text}
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        )}
      </div>
    </section>
  );
}
