import Link from "next/link";
import Image from "next/image";

const FOOTER_LINKS = [
  { label: "How GBR Works", href: "/how-it-works" },
  { label: "About", href: "/about" },
  { label: "Contact us", href: "/contact" },
  { label: "Policies", href: "/policies" },
  { label: "FAQ", href: "/faq" },
];

export function Footer() {
  return (
    <footer className="bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/">
              <Image
                src="/img/gbr-logo.png"
                alt="GBR"
                width={155}
                height={77}
                className="h-16 w-auto rounded border border-gray-200 bg-gbr-secondary/10 object-scale-down p-2"
              />
            </Link>
          </div>

          {/* Links */}
          <div className="flex flex-1 flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-start sm:pl-8">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 transition-colors hover:text-gbr-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-6 border-t border-gray-100 pt-4 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} GBR Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
