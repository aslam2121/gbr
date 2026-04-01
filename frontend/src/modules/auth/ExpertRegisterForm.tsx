"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import { COUNTRIES, CONTINENTS_WITH_ANTARCTICA } from "@/lib/countries";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

interface ExpertFormData {
  // User account fields
  password: string;
  confirmPassword: string;
  terms: boolean;
  // Profile fields (match Strapi schema exactly)
  name_of_the_person: string;
  email: string;
  telephone_mobile: string;
  date_of_birth: string;
  specialty: string;
  field_of_expertise: string;
  specialisation_on_selected_field: string;
  years_of_experience: string;
  short_description: string;
  any_other_details: string;
  consultation_fee: string;
  continent: string;
  country: string;
  membership_duration: string;
}

export function ExpertRegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExpertFormData>();

  const password = watch("password");
  const feeSelection = watch("consultation_fee");
  const [showCustomFee, setShowCustomFee] = useState(false);
  const [customFee, setCustomFee] = useState("");

  const onSubmit = async (data: ExpertFormData) => {
    setError("");

    const fee = showCustomFee ? customFee : data.consultation_fee;

    try {
      await axios.post(`${STRAPI_URL}/api/auth/local/register`, {
        username: data.email.split("@")[0] + "_" + Date.now(),
        email: data.email,
        password: data.password,
        user_type: "expert",
        display_name: data.name_of_the_person,
        // Profile fields
        name_of_the_person: data.name_of_the_person,
        telephone_mobile: data.telephone_mobile || undefined,
        date_of_birth: data.date_of_birth || undefined,
        specialty: data.specialty || undefined,
        field_of_expertise: data.field_of_expertise || undefined,
        specialisation_on_selected_field: data.specialisation_on_selected_field || undefined,
        years_of_experience: data.years_of_experience ? parseInt(data.years_of_experience) : undefined,
        short_description: data.short_description || undefined,
        any_other_details: data.any_other_details || undefined,
        consultation_fee: fee ? parseFloat(fee) : undefined,
        continent: data.continent,
        country: data.country,
        membership_duration: data.membership_duration,
      });

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
          <div className="bg-amber-500 px-6 py-3 text-gray-900">
            <h1 className="text-lg font-semibold">
              <i className="bi bi-mortarboard me-2"></i>Expert Registration
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
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="date_of_birth">Date of Birth</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="date_of_birth" type="date" {...register("date_of_birth")} />
                </div>
              </div>

              {/* Expertise Information */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Expertise Information</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="field_of_expertise">Field of Expertise</label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="field_of_expertise" defaultValue="" {...register("field_of_expertise")}>
                    <option value="" disabled>Select field</option>
                    <option>Economics</option>
                    <option>Politics</option>
                    <option>Law</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="years_of_experience">Years of Experience</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="years_of_experience" type="number" min={0} {...register("years_of_experience")} />
                </div>
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="specialty">Specialty</label>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="specialty" type="text" {...register("specialty")} />
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="specialisation_on_selected_field">Specialisation on Selected Field</label>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="specialisation_on_selected_field" type="text" {...register("specialisation_on_selected_field")} />
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="short_description">Short Description</label>
                <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="short_description" rows={4} {...register("short_description")}></textarea>
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="any_other_details">Any Other Details</label>
                <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="any_other_details" rows={3} {...register("any_other_details")}></textarea>
              </div>

              {/* Consultation Rates */}
              <h2 className="mb-3 mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">Consultation Rates</h2>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <div className="mb-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="consultation_fee">Consultation Fee per Hour</label>
                  <select
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    id="consultation_fee"
                    defaultValue=""
                    {...register("consultation_fee")}
                    onChange={(e) => {
                      register("consultation_fee").onChange(e);
                      setShowCustomFee(e.target.value === "custom");
                    }}
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
                    <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="customFee">Custom Rate ($)</label>
                    <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" id="customFee" type="number" min={1} placeholder="Enter custom fee" value={customFee} onChange={(e) => setCustomFee(e.target.value)} required />
                  </div>
                )}
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
                <button type="submit" disabled={isSubmitting} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-amber-600 disabled:opacity-50">
                  {isSubmitting ? "Creating..." : <><i className="bi bi-check-circle me-1"></i>Create Expert Account</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
