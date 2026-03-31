import Image from "next/image";
import Link from "next/link";

export function HeroBanner() {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Left column */}
          <div className="flex min-h-[250px] flex-col items-center justify-center p-6" style={{ background: "#f9efe3" }}>
            <p className="text-center text-sm font-semibold capitalize">
              Your Business Highway to Opportunities
            </p>
            <Image
              src="/img/gbr-logo.png"
              alt="GBR"
              width={200}
              height={86}
              className="mt-2 h-[86px] w-auto"
            />
          </div>

          {/* Center column */}
          <div className="flex min-h-[250px] flex-col items-center justify-center p-6" style={{ background: "#e7f9fc" }}>
            <p className="text-center text-sm font-semibold capitalize">
              Take your Business Meetings to Next level
            </p>
            <p className="mt-4 text-center text-sm font-normal capitalize">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla omnis distinctio
              voluptatum quod, eaque dolorum voluptate quis nostrum ipsum,
            </p>
          </div>

          {/* Right column */}
          <div className="flex min-h-[250px] flex-col items-center justify-center p-6" style={{ background: "#f9efe3" }}>
            <p className="text-center text-sm font-semibold capitalize">
              Join now, its Free<br />
              to take the advantageous of our Networking.
            </p>
            <p className="mt-4 text-center text-sm font-normal capitalize">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non minima ipsum
              deleniti maxime.
            </p>
            <Link
              href="/register"
              className="mt-3 rounded bg-gbr-primary px-4 py-2 text-sm font-medium text-white hover:bg-gbr-dark"
            >
              Yes I want to Join
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
