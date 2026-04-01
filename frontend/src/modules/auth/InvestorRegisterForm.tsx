"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import { COUNTRIES, CONTINENTS_WITH_ANTARCTICA } from "@/lib/countries";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

interface InvestorFormData {
  // User account fields
  password: string;
  confirmPassword: string;
  terms: boolean;
  // Profile fields (match Strapi schema exactly)
  name_of_the_company: string;
  name_of_the_person: string;
  email: string;
  telephone_mobile: string;
  foundation_year: string;
  type_of_investor: string;
  investment_policies: string;
  eligibility_criteria: string;
  short_description: string;
  continent: string;
  country: string;
  location_of_headquarters: string;
  location_of_branches: string;
  membership_duration: string;
}

export function InvestorRegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InvestorFormData>();

  const password = watch("password");

  const onSubmit = async (data: InvestorFormData) => {
    setError("");
    try {
      // Step 1: Register user account
      const regRes = await axios.post(`${STRAPI_URL}/api/auth/local/register`, {
        username: data.email.split("@")[0] + "_" + Date.now(),
        email: data.email,
        password: data.password,
        user_type: "investor",
        display_name: data.name_of_the_person,
      });

      const jwt = regRes.data.jwt;

      // Step 2: Create investor profile with all fields
      await axios.post(
        `${STRAPI_URL}/api/investors`,
        {
          data: {
            name_of_the_company: data.name_of_the_company,
            name_of_the_person: data.name_of_the_person,
            email: data.email,
            telephone_mobile: data.telephone_mobile || undefined,
            foundation_year: data.foundation_year ? parseInt(data.foundation_year) : undefined,
            type_of_investor: data.type_of_investor || undefined,
            investment_policies: data.investment_policies || undefined,
            eligibility_criteria: data.eligibility_criteria || undefined,
            short_description: data.short_description || undefined,
            continent: data.continent,
            country: data.country,
            location_of_headquarters: data.location_of_headquarters || undefined,
            location_of_branches: data.location_of_branches || undefined,
            membership_duration: data.membership_duration,
          },
        },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );

      // Step 3: Auto-login
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError("Account created but login failed. Please try logging in.");
        return;
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error?.message || "Registration failed. Please try again.");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

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
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">{error}</div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Personal Information */}
              <h2 className="mb-3 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Personal Information</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="name_of_the_person">Name of the Person *</label>
                  <input className={`w-full rounded-md border px-3 py-2 text-sm ${errors.name_of_the_person ? "border-red-500" : "border-gray-300"}`} id="name_of_the_person" type="text" {...register("name_of_the_person", { required: "Name is required" })} />
                  {errors.name_of_the_person && <p className="mt-1 text-xs text-red-500">{errors.name_of_the_person.message}</p>}
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="email">Email Address *</label>
                  <input className={`w-full rounded-md border px-3 py-2 text-sm ${errors.email ? "border-red-500" : "border-gray-300"}`} id="email" type="email" {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } })} />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="telephone_mobile">Telephone / Mobile</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="telephone_mobile" type="tel" {...register("telephone_mobile")} />
                </div>
              </div>

              {/* Investment Information */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Investment Information</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="name_of_the_company">Name of the Company *</label>
                  <input className={`w-full rounded-md border px-3 py-2 text-sm ${errors.name_of_the_company ? "border-red-500" : "border-gray-300"}`} id="name_of_the_company" type="text" {...register("name_of_the_company", { required: "Company name is required" })} />
                  {errors.name_of_the_company && <p className="mt-1 text-xs text-red-500">{errors.name_of_the_company.message}</p>}
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="foundation_year">Foundation Year</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="foundation_year" type="number" min={1800} max={2100} {...register("foundation_year")} />
                </div>
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="type_of_investor">Type of Investor</label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="type_of_investor" defaultValue="" {...register("type_of_investor")}>
                  <option value="" disabled>Select investor type</option>
                  <option>Private equity firms</option>
                  <option>Venture capital firms</option>
                  <option>Private investors</option>
                  <option>Angel investors</option>
                  <option>Business lenders</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="investment_policies">Investment Policies</label>
                <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="investment_policies" rows={4} {...register("investment_policies")}></textarea>
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="eligibility_criteria">Eligibility Criteria</label>
                <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="eligibility_criteria" rows={4} {...register("eligibility_criteria")}></textarea>
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="short_description">Short Description</label>
                <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="short_description" rows={4} {...register("short_description")}></textarea>
              </div>

              {/* Location */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Location</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="continent">Continent *</label>
                  <select className={`w-full rounded-md border px-3 py-2 text-sm ${errors.continent ? "border-red-500" : "border-gray-300"}`} id="continent" defaultValue="" {...register("continent", { required: "Continent is required" })}>
                    <option value="" disabled>Select continent</option>
                    {CONTINENTS_WITH_ANTARCTICA.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  {errors.continent && <p className="mt-1 text-xs text-red-500">{errors.continent.message}</p>}
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="country">Country *</label>
                  <select className={`w-full rounded-md border px-3 py-2 text-sm ${errors.country ? "border-red-500" : "border-gray-300"}`} id="country" defaultValue="" {...register("country", { required: "Country is required" })}>
                    <option value="" disabled>Select country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="location_of_headquarters">Location of Headquarters</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="location_of_headquarters" type="text" {...register("location_of_headquarters")} />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="location_of_branches">Location of Branches</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="location_of_branches" type="text" {...register("location_of_branches")} />
                </div>
              </div>

              {/* Membership */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Membership</h2>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="membership_duration">Membership Duration *</label>
                <select className={`w-full rounded-md border px-3 py-2 text-sm ${errors.membership_duration ? "border-red-500" : "border-gray-300"}`} id="membership_duration" defaultValue="" {...register("membership_duration", { required: "Membership duration is required" })}>
                  <option value="" disabled>Select duration</option>
                  <option value="year 1">1 Year</option>
                  <option value="years 2">2 Years</option>
                  <option value="years 3">3 Years</option>
                </select>
                {errors.membership_duration && <p className="mt-1 text-xs text-red-500">{errors.membership_duration.message}</p>}
              </div>

              {/* Account Security */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Account Security</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="password">Password *</label>
                  <input className={`w-full rounded-md border px-3 py-2 text-sm ${errors.password ? "border-red-500" : "border-gray-300"}`} id="password" type="password" {...register("password", { required: "Password is required", minLength: { value: 6, message: "At least 6 characters" } })} />
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="confirmPassword">Confirm Password *</label>
                  <input className={`w-full rounded-md border px-3 py-2 text-sm ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`} id="confirmPassword" type="password" {...register("confirmPassword", { required: "Please confirm password", validate: (v) => v === password || "Passwords do not match" })} />
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              {/* Terms */}
              <div className="mt-2 flex items-start gap-2">
                <input className="mt-0.5 h-4 w-4 rounded border-gray-300" type="checkbox" id="terms" {...register("terms", { required: "You must agree to the terms" })} />
                <label className="text-sm text-gray-700" htmlFor="terms">I agree to the terms and policies.</label>
              </div>
              {errors.terms && <p className="mt-1 text-xs text-red-500">{errors.terms.message}</p>}

              {/* Buttons */}
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <Link href="/register" className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  <i className="bi bi-arrow-left me-1"></i>Back
                </Link>
                <button type="submit" disabled={isSubmitting} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
                  {isSubmitting ? "Creating..." : <><i className="bi bi-check-circle me-1"></i>Create Investor Account</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
