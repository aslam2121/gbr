import { type PageSection, type StatItem } from "@/types/page-section";

interface StatsSectionProps {
  section: PageSection;
}

export function StatsSection({ section }: StatsSectionProps) {
  const stats = (section.metadata as { stats?: StatItem[] })?.stats ?? [];

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(section.title || section.subtitle) && (
          <div className="mx-auto max-w-2xl text-center mb-12">
            {section.title && (
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {section.title}
              </h2>
            )}
            {section.subtitle && (
              <p className="mt-4 text-lg text-gray-600">{section.subtitle}</p>
            )}
          </div>
        )}

        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl font-bold tracking-tight text-blue-600 sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-gray-600">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
