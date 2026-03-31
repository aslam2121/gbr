"use client";

import Link from "next/link";

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
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyFirstName">First Name *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyFirstName" type="text" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyLastName">Last Name *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyLastName" type="text" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyEmail">Email Address *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyEmail" type="email" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyPhone">Phone Number</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyPhone" type="tel" />
                </div>
              </div>

              {/* Company Information */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Company Information</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyName">Company Name *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyName" type="text" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="foundationYear">Foundation Year *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="foundationYear" type="number" min={1800} max={2100} required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="industry">Industry</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="industry" type="text" />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companySize">Company Size</label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companySize" defaultValue="">
                    <option value="" disabled>Select size</option>
                    <option>1-10 Employees</option>
                    <option>11-50 Employees</option>
                    <option>51-200 Employees</option>
                    <option>201-500 Employees</option>
                    <option>500+ Employees</option>
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyWebsite">Website</label>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyWebsite" type="url" placeholder="https://example.com" />
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companySpecialization">Area of Specialization *</label>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companySpecialization" type="text" required />
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyDescription">Company Description *</label>
                <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyDescription" rows={4} required></textarea>
              </div>

              {/* Address Information */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Address Information</h2>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyAddress">Full Address *</label>
                <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyAddress" rows={3} required></textarea>
              </div>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-3">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyCity">City *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyCity" type="text" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyState">State/Province</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyState" type="text" />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyPostalCode">Postal Code</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyPostalCode" type="text" />
                </div>
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="headquartersLocation">Headquarters Description *</label>
                <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="headquartersLocation" rows={3} required></textarea>
              </div>

              {/* Location */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Location</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyContinent">Continent *</label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyContinent" required defaultValue="">
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
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyCountry">Country *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyCountry" type="text" required />
                </div>
              </div>

              {/* Membership */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Membership</h2>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="companyMembership">Membership Duration *</label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="companyMembership" required defaultValue="">
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
