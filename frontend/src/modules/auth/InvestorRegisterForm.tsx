"use client";

import Link from "next/link";
import { COUNTRIES, CONTINENTS_WITH_ANTARCTICA } from "@/lib/countries";

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
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorName">Name *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorName" type="text" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorSurname">Surname</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorSurname" type="text" />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorEmail">Email Address *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorEmail" type="email" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorPhone">Telephone / Mobile</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorPhone" type="tel" />
                </div>
              </div>

              {/* Investment Information */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Investment Information</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorCompanyName">Name of the Company *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorCompanyName" type="text" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorPersonName">Name of the Person *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorPersonName" type="text" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="foundationYear">Foundation Year</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="foundationYear" type="number" min={1800} max={2100} />
                </div>
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorType">Type of Investor *</label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorType" required defaultValue="">
                  <option value="" disabled>Select investor type</option>
                  <option>Private equity firms</option>
                  <option>Venture capital firms</option>
                  <option>Private investors</option>
                  <option>Angel investors</option>
                  <option>Business lenders</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investmentPolicies">Investment Policies</label>
                <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investmentPolicies" rows={4}></textarea>
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investmentPoliciesFile">Investment Policies File(s)</label>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investmentPoliciesFile" type="file" multiple />
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="eligibilityCriteria">Eligibility Criteria</label>
                <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="eligibilityCriteria" rows={4}></textarea>
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="shortDescriptionCompany">Short Description of Company *</label>
                <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="shortDescriptionCompany" rows={4} required></textarea>
              </div>

              {/* Location */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Location</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorContinent">Continent</label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorContinent" defaultValue="">
                    <option value="" disabled>Select continent</option>
                    {CONTINENTS_WITH_ANTARCTICA.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorCountry">Country *</label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorCountry" required defaultValue="">
                    <option value="" disabled>Select country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="locationOfHeadquarters">Location of Headquarters</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="locationOfHeadquarters" type="text" />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="locationOfBranches">Location of Branches</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="locationOfBranches" type="text" />
                </div>
              </div>

              {/* Membership */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Membership</h2>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investorMembership">Membership Duration *</label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investorMembership" required defaultValue="">
                  <option value="" disabled>Select duration</option>
                  <option value="year 1">1 Year</option>
                  <option value="years 2">2 Years</option>
                  <option value="years 3">3 Years</option>
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
