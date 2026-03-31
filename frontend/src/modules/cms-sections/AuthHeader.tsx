"use client";

import Link from "next/link";

export function AuthHeader() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="py-2">
        <p className="mb-2 text-center text-sm font-semibold">Welcome to GBR</p>
        <form className="flex w-full flex-col items-center gap-3 md:flex-row">
          <div className="w-full">
            <label className="sr-only" htmlFor="headerUsername">Username</label>
            <input
              id="headerUsername"
              type="text"
              placeholder="Username"
              className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-gbr-accent focus:ring-1 focus:ring-gbr-accent"
            />
          </div>
          <div className="w-full flex-1">
            <label className="sr-only" htmlFor="headerPassword">Password</label>
            <input
              id="headerPassword"
              type="password"
              placeholder="Password"
              className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-gbr-accent focus:ring-1 focus:ring-gbr-accent"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <input type="checkbox" id="headerRemember" className="rounded border-gray-300" />
            <label htmlFor="headerRemember" className="whitespace-nowrap text-sm">Remember me</label>
          </div>
          <p className="mb-0 whitespace-nowrap">
            <a href="#" className="text-sm text-gbr-accent hover:underline">Forgot Password?</a>
          </p>
          <div className="flex w-full justify-center gap-2 md:w-auto md:justify-start">
            <Link
              href="/login"
              className="flex-1 rounded border-[3px] border-gbr-accent bg-gbr-accent px-3 py-1.5 text-center text-sm font-medium text-white hover:bg-gbr-accent/90 md:flex-none"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="flex-1 rounded border-[3px] border-gbr-accent bg-gbr-accent px-3 py-1.5 text-center text-sm font-medium text-white hover:bg-gbr-accent/90 md:flex-none"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
