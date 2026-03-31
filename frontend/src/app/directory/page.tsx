import Link from "next/link";

export default function DirectoryPage() {
  return (
    <main>
      {/* Hero Banner - 3 columns matching template */}
      <section className="bg-gray-50 py-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="flex flex-col items-center justify-center p-8" style={{ backgroundColor: "#f9efe3", minHeight: "220px" }}>
              <p className="text-center font-semibold capitalize">Your Business Highway to Opportunities</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="mt-2" src="/img/gbr_logo_blue.png" alt="GBR Logo" height={86} style={{ height: "86px" }} />
            </div>
            <div className="flex flex-col items-center justify-center p-8" style={{ backgroundColor: "#e7f9fc", minHeight: "220px" }}>
              <p className="text-center font-semibold capitalize">Take your Business Meetings to Next level</p>
              <p className="mt-2 text-center text-sm font-normal capitalize">You can find new investors and companies from different industries and regions with focused search tools.</p>
            </div>
            <div className="flex flex-col items-center justify-center p-8" style={{ backgroundColor: "#f9efe3", minHeight: "220px" }}>
              <p className="text-center font-semibold capitalize">Connect with Global Investors</p>
              <p className="mt-2 text-center text-sm font-normal capitalize">Join our network to access international investment opportunities and grow your business globally.</p>
              <Link href="/register" className="mt-4 rounded-md px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: "#0083ae" }}>
                Register Your Company
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Companies List */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-center text-2xl font-semibold text-gray-900">Featured Companies</h1>

          {/* Search + Filter */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-12">
            <div className="md:col-span-8">
              <input type="text" placeholder="Search companies..." className="w-full rounded-md border px-3 py-2" style={{ borderColor: "#0083ae" }} />
            </div>
            <div className="md:col-span-4">
              <select className="w-full rounded-md border px-3 py-2" style={{ borderColor: "#0083ae" }}>
                <option>All Industries</option>
                <option>Technology</option>
                <option>Healthcare</option>
                <option>Finance</option>
                <option>Energy</option>
                <option>Manufacturing</option>
                <option>Logistics</option>
              </select>
            </div>
          </div>

          {/* Company Cards Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { name: "Tech Innovation Corp", desc: "Leading technology company specializing in AI and machine learning solutions for enterprise clients.", industry: "Technology" },
              { name: "Green Energy Solutions", desc: "Sustainable energy company focused on renewable technologies and clean power generation systems.", industry: "Energy" },
              { name: "Healthcare Innovations", desc: "Medical technology company developing next-generation healthcare solutions and diagnostic tools.", industry: "Healthcare" },
              { name: "FinTech Solutions", desc: "Revolutionary financial technology platform transforming digital payment systems globally.", industry: "Finance" },
              { name: "EcoManufacturing Ltd", desc: "Sustainable manufacturing company using eco-friendly processes and materials for production.", industry: "Manufacturing" },
              { name: "Global Logistics Pro", desc: "International logistics and supply chain management company serving Fortune 500 clients.", industry: "Logistics" },
            ].map((company) => (
              <div key={company.name} className="flex h-full flex-col rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200">
                <h2 className="text-base font-semibold text-gray-900">{company.name}</h2>
                <p className="mt-2 flex-1 text-sm text-gray-600">{company.desc}</p>
                <div className="mt-4 flex items-center justify-between">
                  <small className="text-gray-400">{company.industry}</small>
                  <Link href="#" className="rounded-md px-3 py-1 text-xs font-medium text-white" style={{ backgroundColor: "#0083ae" }}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
