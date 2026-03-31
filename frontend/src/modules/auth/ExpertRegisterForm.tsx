"use client";

import { useState } from "react";
import Link from "next/link";

export function ExpertRegisterForm() {
  const [showCustomFee, setShowCustomFee] = useState(false);

  return (
    <main className="bg-gray-50 py-10">
      <div className="mx-auto max-w-4xl px-4">
        <div className="overflow-hidden rounded-lg border-0 bg-white shadow-sm">
          {/* Header */}
          <div className="bg-amber-500 px-6 py-3 text-gray-900">
            <h1 className="text-lg font-semibold">
              <i className="bi bi-mortarboard me-2"></i>Expert Registration
            </h1>
          </div>

          {/* Form */}
          <div className="p-6 lg:p-10">
            <form>
              {/* Personal Information */}
              <h2 className="mb-3 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Personal Information</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="expertFirstName">First Name *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="expertFirstName" type="text" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="expertLastName">Last Name *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="expertLastName" type="text" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="expertEmail">Email Address *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="expertEmail" type="email" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="expertPhone">Phone Number</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="expertPhone" type="tel" />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="expertProfessionalName">Professional Name *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="expertProfessionalName" type="text" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="expertDob">Date of Birth *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="expertDob" type="date" required />
                </div>
              </div>

              {/* Expertise Information */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Expertise Information</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="expertField">Field of Expertise *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="expertField" type="text" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="expertExperienceYears">Years of Experience *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="expertExperienceYears" type="number" min={0} required />
                </div>
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="expertSpecialisation">Specialization *</label>
                <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="expertSpecialisation" rows={3} required></textarea>
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="expertWorkDescription">Work Experience Description *</label>
                <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="expertWorkDescription" rows={4} required></textarea>
              </div>

              {/* Consultation Rates */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Consultation Rates</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="expertConsultationFee">Consultation Fee per Hour *</label>
                  <select
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    id="expertConsultationFee"
                    required
                    defaultValue=""
                    onChange={(e) => setShowCustomFee(e.target.value === "custom")}
                  >
                    <option value="" disabled>Select fee</option>
                    <option value="50">$50/hour</option>
                    <option value="100">$100/hour</option>
                    <option value="150">$150/hour</option>
                    <option value="200">$200/hour</option>
                    <option value="custom">Custom Rate</option>
                  </select>
                </div>
                {showCustomFee && (
                  <div className="mb-3">
                    <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="expertCustomFee">Custom Rate</label>
                    <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="expertCustomFee" type="number" min={1} placeholder="Enter custom fee" required />
                  </div>
                )}
              </div>

              {/* Location */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Location</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="expertContinent">Continent *</label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="expertContinent" required defaultValue="">
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
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="expertCountry">Country *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="expertCountry" type="text" required />
                </div>
              </div>

              {/* Membership */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Membership</h2>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="expertMembership">Membership Duration *</label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="expertMembership" required defaultValue="">
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
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="expertPassword">Password *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="expertPassword" type="password" required />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="expertConfirmPassword">Confirm Password *</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="expertConfirmPassword" type="password" required />
                </div>
              </div>

              {/* Terms */}
              <div className="mt-2 flex items-center gap-2">
                <input className="h-4 w-4 rounded border-gray-300" type="checkbox" id="expertTerms" required />
                <label className="text-sm text-gray-700" htmlFor="expertTerms">I agree to the terms and policies.</label>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <Link href="/register" className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  <i className="bi bi-arrow-left me-1"></i>Back
                </Link>
                <button type="submit" className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-amber-600">
                  <i className="bi bi-check-circle me-1"></i>Create Expert Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
