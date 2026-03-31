import { type PageSection } from "@/types/page-section";

interface TextBlockProps {
  section: PageSection;
}

export function TextBlock({ section }: TextBlockProps) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {section.title && (
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {section.title}
          </h2>
        )}
        {section.content && (
          <div
            className="mt-6 prose prose-lg prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-blue-600 prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        )}
      </div>
    </section>
  );
}
