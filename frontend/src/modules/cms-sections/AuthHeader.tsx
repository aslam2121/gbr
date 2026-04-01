"use client";

import Link from "next/link";

export function AuthHeader() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="py-2">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm font-semibold whitespace-nowrap">
            Welcome to GBR
          </p>

          <form className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
            <input
              id="headerUsername"
              type="text"
              placeholder="Username"
              className="w-full rounded border border-gray-300 px-4 py-2.5 text-base placeholder:text-base outline-none focus:border-gbr-accent focus:ring-1 focus:ring-gbr-accent sm:w-52"
            />
            <input
              id="headerPassword"
              type="password"
              placeholder="Password"
              className="w-full rounded border border-gray-300 px-4 py-2.5 text-base placeholder:text-base outline-none focus:border-gbr-accent focus:ring-1 focus:ring-gbr-accent sm:w-52"
            />
            <Link
              href="/login"
              className="rounded border-[3px] border-gbr-accent bg-gbr-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-gbr-accent/90"
            >
              Sign in
            </Link>

            {/* keep remember/forgot/sign in/sign up as needed */}
          </form>
        </div>
      </div>
    </div>
  );
}
