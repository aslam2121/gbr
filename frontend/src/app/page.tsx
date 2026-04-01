import { HeroBanner } from "@/modules/cms-sections/HeroBanner";
import { AuthHeader } from "@/modules/cms-sections/AuthHeader";
import { LiveChatSidebar } from "@/modules/cms-sections/LiveChatSidebar";
import { strapiGet } from "@/lib/strapi";
import { type Company } from "@/types/company";
import dynamic from "next/dynamic";

const HomeMap = dynamic(() => import("@/modules/map/HomeMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-gray-100" style={{ height: "800px" }}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gbr-accent border-t-transparent" />
    </div>
  ),
});

export default async function Home() {
  let companies: Company[] = [];

  try {
    const res = await strapiGet<Company[]>("/companies", {
      "pagination[pageSize]": 100,
      "fields[0]": "name_of_the_company",
      "fields[1]": "country",
      "fields[2]": "continent",
      "fields[3]": "latitude",
      "fields[4]": "longitude",
      "fields[5]": "industry",
    });
    companies = res.data ?? [];
  } catch {
    // Strapi not available
  }

  return (
    <>
      {/* Auth header bar */}
      <AuthHeader />

      {/* Hero banner */}
      <HeroBanner />

      {/* Map + sidebar section */}
      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Map */}
            <div className="lg:col-span-8" style={{ padding: 0 }}>
              <HomeMap companies={companies} />
            </div>
            {/* Sidebar */}
            <div className="lg:col-span-4" style={{ padding: 0 }}>
              <LiveChatSidebar />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
