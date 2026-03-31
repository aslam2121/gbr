"use client";

import Link from "next/link";
import { COUNTRIES, CONTINENTS } from "@/lib/countries";

export function CompanyRegisterForm() {
  return (
    <main className="bg-gray-50 py-10">
      <div className="mx-auto max-w-4xl px-4">
        <div className="overflow-hidden rounded-lg border-0 bg-white shadow-sm">
          {/* Header */}
          <div className="px-6 py-3 text-white" style={{ backgroundColor: "#033443" }}>
            <h1 className="text-lg font-semibold">
              <i className="bi bi-building me-2"></i>Company Registration
            </h1>
          </div>

          {/* Form */}
          <div className="p-6 lg:p-10">
            <form>
              {/* Personal Information */}
              <h2 className="mb-3 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Personal Information</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyPersonName">Name of the Person *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyPersonName" type="text" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyEmail">Email Address *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyEmail" type="email" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyPhone">Telephone / Mobile</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyPhone" type="tel" />
                </div>
              </div>

              {/* Company Information */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Company Information</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyName">Name of the Company *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyName" type="text" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="foundationYear">Foundation Year</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="foundationYear" type="number" min={1800} max={2100} />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="industry">Industry</label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="industry" defaultValue="">
                    <option value="" disabled>Select industry</option>
                    <option value="tech">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="energy">Energy</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="logistics">Logistics</option>
                    <option value="education">Education</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companySize">Employee Count</label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companySize" defaultValue="">
                    <option value="" disabled>Select size</option>
                    <option value="s_1_10">1-10 Employees</option>
                    <option value="s_11_50">11-50 Employees</option>
                    <option value="s_51_200">51-200 Employees</option>
                    <option value="s_201_500">201-500 Employees</option>
                    <option value="s_500_plus">500+ Employees</option>
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyWebsite">Website</label>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyWebsite" type="url" placeholder="https://example.com" />
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="areaOfSpecification">Area of Specification *</label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="areaOfSpecification" required defaultValue="">
                  <option value="" disabled>Select area</option>
                  <option>Health</option>
                  <option>Financial services</option>
                  <option>IT</option>
                  <option>Consumer products and services</option>
                  <option>Logistics and Transportation</option>
                  <option>Business products and services</option>
                  <option>Construction and real estate</option>
                  <option>Trading</option>
                  <option>Manufacturing</option>
                  <option>Advertising and marketing</option>
                  <option>Agriculture</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="shortDescription">Short Description *</label>
                <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="shortDescription" rows={4} required></textarea>
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyDescription">Full Description</label>
                <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyDescription" rows={4}></textarea>
              </div>

              {/* Logo Upload */}
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyLogo">Company Logo</label>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyLogo" type="file" accept="image/*" />
              </div>

              {/* Partnership & Revenue */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Partnership &amp; Revenue</h2>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="requirementsForPartnership">Requirements for Partnership</label>
                <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="requirementsForPartnership" rows={3}></textarea>
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="existingPartners">Existing Partners</label>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="existingPartners" type="text" />
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="annualRevenueData">Annual Revenue Data (files)</label>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="annualRevenueData" type="file" multiple />
              </div>

              {/* Location */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Location</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyContinent">Continent *</label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyContinent" required defaultValue="">
                    <option value="" disabled>Select continent</option>
                    {CONTINENTS.map((c) => (
                      <option key={c} value={c.toLowerCase().replace(" ", "_")}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyCountry">Country *</label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyCountry" required defaultValue="">
                    <option value="" disabled>Select country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="foundationCountry">Foundation Country</label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="foundationCountry" defaultValue="">
                    <option value="" disabled>Select country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Membership */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Membership</h2>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyMembership">Membership Duration *</label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyMembership" required defaultValue="">
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
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyPassword">Password *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyPassword" type="password" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyConfirmPassword">Confirm Password *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyConfirmPassword" type="password" required />
                </div>
              </div>

              {/* Terms */}
              <div className="mt-2 flex items-center gap-2">
                <input className="h-4 w-4 rounded border-gray-300" type="checkbox" id="companyTerms" required />
                <label className="text-sm text-gray-700" htmlFor="companyTerms">I agree to the terms and policies.</label>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <Link href="/register" className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  <i className="bi bi-arrow-left me-1"></i>Back
                </Link>
                <button type="submit" className="rounded-md px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: "#033443" }}>
                  <i className="bi bi-check-circle me-1"></i>Create Company Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
