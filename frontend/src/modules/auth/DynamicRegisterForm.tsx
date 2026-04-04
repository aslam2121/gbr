"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { AxiosError } from "axios";
import { COUNTRIES, CONTINENTS_WITH_ANTARCTICA } from "@/lib/countries";
import { strapiRegister } from "@/lib/strapi";
import type { UserType } from "@/types/next-auth";

interface RegisterFormData {
  // Account
  password: string;
  confirmPassword: string;
  terms: boolean;
  // Common
  user_type: UserType;
  continent: string;
  name_of_the_person: string;
  email: string;
  telephone_mobile: string;
  short_description: string;
  membership_duration: string;
  // Company + Investor shared
  name_of_the_company: string;
  foundation_year: string;
  country: string;
  location_of_headquarters: string;
  location_of_branches: string;
  // Company only
  area_of_specification: string;
  requirements_for_partnership: string;
  existing_partners: string;
  // Investor only
  type_of_investor: string;
  investment_policies: string;
  eligibility_criteria: string;
  // Expert only
  date_of_birth: string;
  field_of_expertise: string;
  specialisation_on_selected_field: string;
  years_of_experience: string;
  work_experience_description: string;
  consultation_fee: string;
  any_other_details: string;
}

const AREA_OF_SPECIFICATION_OPTIONS = [
  "Health",
  "Financial Services",
  "IT",
  "Consumer Products and Services",
  "Logistics and Transportation",
  "Business Products and Services",
  "Construction and Real Estate",
  "Trading",
  "Manufacturing",
  "Advertising and Marketing",
  "Agriculture",
];

const INVESTOR_TYPE_OPTIONS = [
  "Private Equity Firms",
  "Venture Capital Firms",
  "Private Investors",
  "Angel Investors",
  "Business Lenders",
];

const EXPERTISE_OPTIONS = ["Economics", "Politics", "Law"];

const USER_TYPE_CONFIG = {
  company: { label: "Company", icon: "bi-building", color: "bg-gbr-primary" },
  investor: { label: "Investor", icon: "bi-graph-up-arrow", color: "bg-emerald-600" },
  expert: { label: "Expert", icon: "bi-mortarboard", color: "bg-amber-500" },
};

export function DynamicRegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ defaultValues: { user_type: "company" } });

  const userType = watch("user_type");
  const password = watch("password");
  const config = USER_TYPE_CONFIG[userType];

  const onSubmit = async (data: RegisterFormData) => {
    setError("");
    try {
      const displayName =
        data.user_type === "expert"
          ? data.name_of_the_person
          : data.name_of_the_company || data.name_of_the_person;

      // Single request — backend creates user + profile
      const regRes = await strapiRegister({
        username: data.email.split("@")[0] + "_" + Date.now(),
        email: data.email,
        password: data.password,
        user_type: data.user_type,
        display_name: displayName,
        continent: data.continent,
        name_of_the_person: data.name_of_the_person,
        telephone_mobile: data.telephone_mobile || undefined,
        short_description: data.short_description || undefined,
        membership_duration: data.membership_duration,
        country: data.country || undefined,
        ...(data.user_type !== "expert" && {
          name_of_the_company: data.name_of_the_company || undefined,
          foundation_year: data.foundation_year ? parseInt(data.foundation_year) : undefined,
          location_of_headquarters: data.location_of_headquarters || undefined,
          location_of_branches: data.location_of_branches || undefined,
        }),
        ...(data.user_type === "company" && {
          area_of_specification: data.area_of_specification || undefined,
          requirements_for_partnership: data.requirements_for_partnership || undefined,
          existing_partners: data.existing_partners || undefined,
        }),
        ...(data.user_type === "investor" && {
          type_of_investor: data.type_of_investor || undefined,
          investment_policies: data.investment_policies || undefined,
          eligibility_criteria: data.eligibility_criteria || undefined,
        }),
        ...(data.user_type === "expert" && {
          date_of_birth: data.date_of_birth || undefined,
          field_of_expertise: data.field_of_expertise || undefined,
          specialisation_on_selected_field: data.specialisation_on_selected_field || undefined,
          years_of_experience: data.years_of_experience ? parseInt(data.years_of_experience) : undefined,
          work_experience_description: data.work_experience_description || undefined,
          consultation_fee: data.consultation_fee ? parseFloat(data.consultation_fee) : undefined,
          any_other_details: data.any_other_details || undefined,
        }),
      });

      if (!regRes.jwt) {
        setError("Registration failed. Please try again.");
        return;
      }

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
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error?.message || "Registration failed. Please try again.");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  const inputClass = (fieldError?: { message?: string }) =>
    `w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gbr-accent ${fieldError ? "border-red-500" : "border-gray-300"}`;

  const selectClass = (fieldError?: { message?: string }) =>
    `w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gbr-accent ${fieldError ? "border-red-500" : "border-gray-300"}`;

  const labelClass = "mb-1 block text-sm font-semibold text-gray-700";

  return (
    <main className="bg-gray-50 py-10">
      <div className="mx-auto max-w-[980px] px-4">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Registration Form</h1>

        {/* User Type & Continent Panel */}
        <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4">
            <label className={labelClass} htmlFor="user_type">User Type</label>
            <select className={selectClass()} id="user_type" {...register("user_type")}>
              <option value="company">Company</option>
              <option value="investor">Investor</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Continent *</label>
            <input type="hidden" {...register("continent", { required: "Continent is required" })} />
            {/* Desktop: radio buttons */}
            <div className="hidden md:flex md:flex-wrap md:gap-4">
              {CONTINENTS_WITH_ANTARCTICA.map((c) => (
                <label key={c} className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    name="continent_desktop"
                    value={c}
                    onChange={() => setValue("continent", c, { shouldValidate: true })}
                    className="h-4 w-4 text-gbr-primary focus:ring-gbr-accent"
                  />
                  {c === "North America" ? "N. America" : c === "South America" ? "S. America" : c}
                </label>
              ))}
            </div>
            {/* Mobile: dropdown */}
            <div className="md:hidden">
              <select
                className={selectClass(errors.continent)}
                defaultValue=""
                onChange={(e) => setValue("continent", e.target.value, { shouldValidate: true })}
              >
                <option value="" disabled>Select continent</option>
                {CONTINENTS_WITH_ANTARCTICA.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {errors.continent && <p className="mt-1 text-xs text-red-500">{errors.continent.message}</p>}
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">{error}</div>
          )}

          {/* Company Section */}
          {userType === "company" && (
            <section>
              <h2 className="mb-3 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">Company Information</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className={labelClass}>Name of the Company *</label>
                  <input className={inputClass(errors.name_of_the_company)} type="text" {...register("name_of_the_company", { required: userType === "company" ? "Company name is required" : false })} />
                  {errors.name_of_the_company && <p className="mt-1 text-xs text-red-500">{errors.name_of_the_company.message}</p>}
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Name of the Person *</label>
                  <input className={inputClass(errors.name_of_the_person)} type="text" {...register("name_of_the_person", { required: "Name is required" })} />
                  {errors.name_of_the_person && <p className="mt-1 text-xs text-red-500">{errors.name_of_the_person.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className={labelClass}>Foundation Year</label>
                  <input className={inputClass()} type="number" min="1800" max="2100" {...register("foundation_year")} />
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Country *</label>
                  <select className={selectClass(errors.country)} defaultValue="" {...register("country", { required: "Country is required" })}>
                    <option value="" disabled>Select country</option>
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className={labelClass}>Location of Headquarters</label>
                  <input className={inputClass()} type="text" {...register("location_of_headquarters")} />
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Location of Branch/Branches</label>
                  <input className={inputClass()} type="text" {...register("location_of_branches")} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className={labelClass}>Areas of Specifications</label>
                  <select className={selectClass()} defaultValue="" {...register("area_of_specification")}>
                    <option value="" disabled>Select area</option>
                    {AREA_OF_SPECIFICATION_OPTIONS.map((a) => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Annual Revenue Data / Turn Over Data</label>
                  <input className={inputClass()} type="file" />
                </div>
              </div>

              <div className="mb-3">
                <label className={labelClass}>Requirements for Partnership</label>
                <textarea className={`${inputClass()} min-h-[96px]`} rows={3} {...register("requirements_for_partnership")} />
              </div>

              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className={labelClass}>Existing Partners, if any</label>
                  <input className={inputClass()} type="text" {...register("existing_partners")} />
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Personal/Business Email *</label>
                  <input className={inputClass(errors.email)} type="email" {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } })} />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className={labelClass}>Telephone/Mobile</label>
                  <input className={inputClass()} type="tel" {...register("telephone_mobile")} />
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Short Description about the Company</label>
                  <textarea className={`${inputClass()} min-h-[96px]`} rows={3} {...register("short_description")} />
                </div>
              </div>
            </section>
          )}

          {/* Investor Section */}
          {userType === "investor" && (
            <section>
              <h2 className="mb-3 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">Investor Information</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className={labelClass}>Name of the Company</label>
                  <input className={inputClass()} type="text" {...register("name_of_the_company")} />
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Name of the Person *</label>
                  <input className={inputClass(errors.name_of_the_person)} type="text" {...register("name_of_the_person", { required: "Name is required" })} />
                  {errors.name_of_the_person && <p className="mt-1 text-xs text-red-500">{errors.name_of_the_person.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className={labelClass}>Foundation Year</label>
                  <input className={inputClass()} type="number" min="1800" max="2100" {...register("foundation_year")} />
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Country *</label>
                  <select className={selectClass(errors.country)} defaultValue="" {...register("country", { required: "Country is required" })}>
                    <option value="" disabled>Select country</option>
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className={labelClass}>Location of Headquarters</label>
                  <input className={inputClass()} type="text" {...register("location_of_headquarters")} />
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Location of Branch/Branches</label>
                  <input className={inputClass()} type="text" {...register("location_of_branches")} />
                </div>
              </div>

              <div className="mb-3">
                <label className={labelClass}>Type of Investor</label>
                <select className={selectClass()} defaultValue="" {...register("type_of_investor")}>
                  <option value="" disabled>Select investor type</option>
                  {INVESTOR_TYPE_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className={labelClass}>Investment Policies (if any)</label>
                  <textarea className={`${inputClass()} min-h-[96px]`} rows={3} {...register("investment_policies")} />
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Investment Policies Media Upload</label>
                  <input className={inputClass()} type="file" />
                </div>
              </div>

              <div className="mb-3">
                <label className={labelClass}>Eligibility Criteria</label>
                <textarea className={`${inputClass()} min-h-[96px]`} rows={3} {...register("eligibility_criteria")} />
              </div>

              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className={labelClass}>Personal/Business Email *</label>
                  <input className={inputClass(errors.email)} type="email" {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } })} />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Telephone/Mobile</label>
                  <input className={inputClass()} type="tel" {...register("telephone_mobile")} />
                </div>
              </div>

              <div className="mb-3">
                <label className={labelClass}>Short Description about the Company</label>
                <textarea className={`${inputClass()} min-h-[96px]`} rows={3} {...register("short_description")} />
              </div>
            </section>
          )}

          {/* Expert Section */}
          {userType === "expert" && (
            <section>
              <h2 className="mb-3 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">Expert Information</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className={labelClass}>Name of the Person *</label>
                  <input className={inputClass(errors.name_of_the_person)} type="text" {...register("name_of_the_person", { required: "Name is required" })} />
                  {errors.name_of_the_person && <p className="mt-1 text-xs text-red-500">{errors.name_of_the_person.message}</p>}
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Date of Birth</label>
                  <input className={inputClass()} type="date" {...register("date_of_birth")} />
                </div>
              </div>

              <div className="mb-3">
                <label className={labelClass}>Field of Expertise</label>
                <input type="hidden" {...register("field_of_expertise")} />
                {/* Desktop: radio buttons */}
                <div className="hidden md:flex md:flex-wrap md:gap-4">
                  {EXPERTISE_OPTIONS.map((e) => (
                    <label key={e} className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <input
                        type="radio"
                        name="expertise_desktop"
                        value={e}
                        onChange={() => setValue("field_of_expertise", e)}
                        className="h-4 w-4 text-gbr-primary focus:ring-gbr-accent"
                      />
                      {e}
                    </label>
                  ))}
                </div>
                {/* Mobile: dropdown */}
                <div className="md:hidden">
                  <select
                    className={selectClass()}
                    defaultValue=""
                    onChange={(e) => setValue("field_of_expertise", e.target.value)}
                  >
                    <option value="" disabled>Select field</option>
                    {EXPERTISE_OPTIONS.map((e) => <option key={e}>{e}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className={labelClass}>Specialisation on Selected Field</label>
                  <input className={inputClass()} type="text" {...register("specialisation_on_selected_field")} />
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Years of Experience</label>
                  <input className={inputClass()} type="number" min="0" {...register("years_of_experience")} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className={labelClass}>Brief Description about Work Experience</label>
                  <textarea className={`${inputClass()} min-h-[96px]`} rows={3} {...register("work_experience_description")} />
                </div>
                <div className="mb-3">
                  <label className={labelClass}>CV/Biography</label>
                  <input className={inputClass()} type="file" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className={labelClass}>Consultation Fee/Hour ($)</label>
                  <input className={inputClass()} type="number" step="0.01" min="0" {...register("consultation_fee")} />
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Personal/Business Email *</label>
                  <input className={inputClass(errors.email)} type="email" {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } })} />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className={labelClass}>Telephone/Mobile</label>
                  <input className={inputClass()} type="tel" {...register("telephone_mobile")} />
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Any other details (if any)</label>
                  <textarea className={`${inputClass()} min-h-[96px]`} rows={3} {...register("any_other_details")} />
                </div>
              </div>
            </section>
          )}

          {/* Membership Duration */}
          <section className="mt-4">
            <h2 className="mb-3 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">Membership Duration</h2>
            <input type="hidden" {...register("membership_duration", { required: "Membership duration is required" })} />
            {/* Desktop: radio buttons */}
            <div className="hidden md:flex md:flex-wrap md:gap-4">
              {[
                { value: "One Year", label: "1 Year" },
                { value: "Two Years", label: "2 Years" },
                { value: "Three Years", label: "3 Years" },
              ].map((m) => (
                <label key={m.value} className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    name="membership_desktop"
                    value={m.value}
                    onChange={() => setValue("membership_duration", m.value, { shouldValidate: true })}
                    className="h-4 w-4 text-gbr-primary focus:ring-gbr-accent"
                  />
                  {m.label}
                </label>
              ))}
            </div>
            {/* Mobile: dropdown */}
            <div className="md:hidden">
              <select
                className={selectClass(errors.membership_duration)}
                defaultValue=""
                onChange={(e) => setValue("membership_duration", e.target.value, { shouldValidate: true })}
              >
                <option value="" disabled>Select duration</option>
                <option value="One Year">1 Year</option>
                <option value="Two Years">2 Years</option>
                <option value="Three Years">3 Years</option>
              </select>
            </div>
            {errors.membership_duration && <p className="mt-1 text-xs text-red-500">{errors.membership_duration.message}</p>}
          </section>

          {/* Account Security */}
          <section className="mt-4">
            <h2 className="mb-3 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">Account Security</h2>
            <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
              <div className="mb-3">
                <label className={labelClass}>Password *</label>
                <input className={inputClass(errors.password)} type="password" {...register("password", { required: "Password is required", minLength: { value: 6, message: "At least 6 characters" } })} />
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              </div>
              <div className="mb-3">
                <label className={labelClass}>Confirm Password *</label>
                <input className={inputClass(errors.confirmPassword)} type="password" {...register("confirmPassword", { required: "Please confirm password", validate: (v) => v === password || "Passwords do not match" })} />
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>
          </section>

          {/* Terms */}
          <div className="mt-4 flex items-start gap-2">
            <input className="mt-0.5 h-4 w-4 rounded border-gray-300" type="checkbox" id="terms" {...register("terms", { required: "You must agree to the terms" })} />
            <label className="text-sm text-gray-700" htmlFor="terms">I agree to the terms and policies.</label>
          </div>
          {errors.terms && <p className="mt-1 text-xs text-red-500">{errors.terms.message}</p>}

          {/* Buttons */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-gbr-accent hover:text-gbr-secondary">Sign in</Link>
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-md px-6 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50 ${config.color} hover:opacity-90`}
            >
              {isSubmitting ? "Creating..." : (
                <><i className={`bi ${config.icon} me-1`}></i>Register as {config.label}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
