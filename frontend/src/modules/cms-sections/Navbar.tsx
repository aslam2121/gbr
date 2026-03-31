"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const NAV_LINKS = [
  { label: "Home", href: "/", icon: "bi-house-door" },
  { label: "About", href: "/about", icon: "bi-info-circle" },
  { label: "How gbr works", href: "/how-it-works", icon: "bi-layers" },
  { label: "Company", href: "/what-is/company", icon: "bi-image" },
  { label: "Investor", href: "/what-is/investor", icon: "bi-journal-text" },
  { label: "Expert", href: "/what-is/expert", icon: "bi-telephone" },
  { label: "New Member", href: "/register", icon: "bi-person", guestOnly: true },
  { label: "Messaging", href: "/messaging", icon: "bi-person" },
  { label: "Video Chat", href: "/calls", icon: "bi-person" },
  { label: "Contact Us", href: "/contact", icon: "bi-person" },
  { label: "Policies", href: "/policies", icon: "bi-person" },
  { label: "FAQ", href: "/faq", icon: "bi-person" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isLoggedIn } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const loggedIn = isLoggedIn();

  // Filter nav links based on auth state
  const visibleLinks = NAV_LINKS.filter((link) => {
    if (link.guestOnly && loggedIn) return false;
    return true;
  });

  // Close search on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  // Hide navbar inside dashboard
  if (pathname.startsWith("/dashboard")) return null;

  return (
    <nav className="bg-gbr-primary shadow-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image src="/img/gbr-logo.png" alt="GBR" width={120} height={40} className="h-10 w-auto" priority />
        </Link>

        {/* Desktop nav */}
        <div className="hidden flex-1 overflow-x-auto xl:flex">
          <ul className="flex items-center gap-0 text-uppercase">
            {visibleLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex flex-col items-center gap-0.5 px-2 py-1.5 text-[10px] font-medium uppercase text-white transition-colors ${
                    isActive(link.href) ? "bg-white/10" : "hover:bg-white/10"
                  }`}
                >
                  <i className={`bi ${link.icon} text-base`} />
                  <span className="whitespace-nowrap leading-tight">{link.label}</span>
                </Link>
              </li>
            ))}

            {/* Auth items — shown when logged in */}
            {loggedIn && (
              <>
                <li>
                  <button
                    className="flex flex-col items-center gap-0.5 px-2 py-1.5 text-[10px] font-medium uppercase text-white transition-colors hover:bg-white/10"
                    type="button"
                  >
                    <i className="bi bi-bell text-base" />
                    <span className="whitespace-nowrap leading-tight">Notifications</span>
                  </button>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className={`flex flex-col items-center gap-0.5 px-2 py-1.5 text-[10px] font-medium uppercase text-white transition-colors ${
                      isActive("/dashboard") ? "bg-white/10" : "hover:bg-white/10"
                    }`}
                  >
                    <i className="bi bi-speedometer2 text-base" />
                    <span className="whitespace-nowrap leading-tight">{user?.display_name || "Dashboard"}</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Search dropdown */}
        <div className="relative ms-2" ref={searchRef}>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex h-9 w-9 items-center justify-center rounded text-white hover:bg-white/10"
            type="button"
          >
            <i className="bi bi-search text-xl" />
          </button>
          {searchOpen && (
            <div className="absolute right-0 z-50 mt-2 w-[250px] rounded bg-white p-3 shadow-lg">
              <input
                type="text"
                placeholder="Type to search..."
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-gbr-accent"
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="ms-2 flex h-9 w-9 items-center justify-center rounded border-2 border-white/30 text-white xl:hidden"
          type="button"
          aria-label="Toggle navigation"
        >
          <i className={`bi ${mobileOpen ? "bi-x-lg" : "bi-list"} text-lg`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 xl:hidden">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3">
              {visibleLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-2 rounded px-3 py-2 text-sm uppercase text-white ${
                      isActive(link.href) ? "bg-white/10" : "hover:bg-white/10"
                    }`}
                  >
                    <i className={`bi ${link.icon}`} />
                    {link.label}
                  </Link>
                </li>
              ))}

              {/* Auth items in mobile — shown when logged in */}
              {loggedIn && (
                <>
                  <li>
                    <button
                      className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm uppercase text-white hover:bg-white/10"
                      type="button"
                    >
                      <i className="bi bi-bell" />
                      Notifications
                    </button>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className={`flex items-center gap-2 rounded px-3 py-2 text-sm uppercase text-white ${
                        isActive("/dashboard") ? "bg-white/10" : "hover:bg-white/10"
                      }`}
                    >
                      <i className="bi bi-speedometer2" />
                      {user?.display_name || "Dashboard"}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}
