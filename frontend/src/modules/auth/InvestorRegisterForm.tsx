"use client";

import Link from "next/link";

export function InvestorRegisterForm() {
  return (
    <main className="bg-gray-50 py-10">
      <div className="mx-auto max-w-4xl px-4">
        <div className="overflow-hidden rounded-lg border-0 bg-white shadow-sm">
          {/* Header */}
          <div className="bg-emerald-600 px-6 py-3 text-white">
            <h1 className="text-lg font-semibold">
              <i className="bi bi-graph-up-arrow me-2"></i>Investor Registration
            </h1>
          </div>

          {/* Form */}
          <div className="p-6 lg:p-10">
            <form>
              {/* Personal Information */}
              <h2 className="mb-3 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Personal Information</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorFirstName">First Name *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorFirstName" type="text" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorLastName">Last Name *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorLastName" type="text" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorEmail">Email Address *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorEmail" type="email" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorPhone">Phone Number</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorPhone" type="tel" />
                </div>
              </div>

              {/* Investment Information */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Investment Information</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorCompanyName">Investment Company Name *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorCompanyName" type="text" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorPersonName">Your Full Name *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorPersonName" type="text" required />
                </div>
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorType">Type of Investor *</label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorType" required defaultValue="">
                  <option value="" disabled>Select investor type</option>
                  <option>Angel Investor</option>
                  <option>Venture Capital</option>
                  <option>Private Equity</option>
                  <option>Institutional Investor</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorCriteria">Investment Criteria &amp; Eligibility Requirements *</label>
                <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorCriteria" rows={4} required></textarea>
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorDescription">Company Description *</label>
                <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorDescription" rows={4} required></textarea>
              </div>

              {/* Location */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Location</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorContinent">Continent *</label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorContinent" required defaultValue="">
                    <option value="" disabled>Select continent</option>
                    <option>Africa</option>
                    <option>Asia</option>
                    <option>Europe</option>
                    <option>North America</option>
                    <option>South America</option>
                    <option>Oceania</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorCountry">Country *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorCountry" type="text" required />
                </div>
              </div>

              {/* Membership */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Membership</h2>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorMembership">Membership Duration *</label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorMembership" required defaultValue="">
                  <option value="" disabled>Select duration</option>
                  <option>1 Month</option>
                  <option>3 Months</option>
                  <option>6 Months</option>
                  <option>12 Months</option>
                </select>
              </div>

              {/* Account Security */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Account Security</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorPassword">Password *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorPassword" type="password" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorConfirmPassword">Confirm Password *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorConfirmPassword" type="password" required />
                </div>
              </div>

              {/* Terms */}
              <div className="mt-2 flex items-center gap-2">
                <input className="h-4 w-4 rounded border-gray-300" type="checkbox" id="investorTerms" required />
                <label className="text-sm text-gray-700" htmlFor="investorTerms">I agree to the terms and policies.</label>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <Link href="/register" className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  <i className="bi bi-arrow-left me-1"></i>Back
                </Link>
                <button type="submit" className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                  <i className="bi bi-check-circle me-1"></i>Create Investor Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
