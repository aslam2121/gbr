import Link from "next/link";

const USER_TYPES = [
  {
    type: "company",
    title: "Company",
    description: "List your business, attract investors, and find expert consultants.",
    href: "/register/company",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    type: "investor",
    title: "Investor",
    description: "Discover promising companies and connect directly with founders.",
    href: "/register/investor",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
  {
    type: "expert",
    title: "Expert",
    description: "Offer your expertise to businesses seeking consulting and guidance.",
    href: "/register/expert",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
  },
];

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="mb-10 text-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            B2B Platform
          </Link>
          <h1 className="mt-6 text-3xl font-semibold text-gray-900">
            Create your account
          </h1>
          <p className="mt-2 text-gray-600">
            Choose how you want to use the platform
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {USER_TYPES.map((ut) => (
            <Link
              key={ut.type}
              href={ut.href}
              className="group rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md hover:ring-blue-300"
            >
              <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-3 text-blue-600 group-hover:bg-blue-100">
                {ut.icon}
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{ut.title}</h2>
              <p className="mt-2 text-sm text-gray-600">{ut.description}</p>
              <span className="mt-4 inline-block text-sm font-medium text-blue-600 group-hover:text-blue-700">
                Get started &rarr;
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
