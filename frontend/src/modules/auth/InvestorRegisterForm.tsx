"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import { AuthLayout, SubmitButton, ErrorAlert } from "./AuthLayout";
import { FormField, Input, Select, Textarea } from "./FormField";
import { MultiSelect } from "./MultiSelect";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const INVESTMENT_FOCUS = [
  { value: "seed", label: "Seed Stage" },
  { value: "series_a", label: "Series A" },
  { value: "series_b", label: "Series B+" },
  { value: "growth", label: "Growth Equity" },
  { value: "late_stage", label: "Late Stage" },
  { value: "debt", label: "Debt Financing" },
];

const SECTORS = [
  { value: "saas", label: "SaaS" },
  { value: "fintech", label: "Fintech" },
  { value: "healthtech", label: "Healthtech" },
  { value: "cleantech", label: "Cleantech" },
  { value: "edtech", label: "Edtech" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "ai_ml", label: "AI / ML" },
  { value: "biotech", label: "Biotech" },
  { value: "hardware", label: "Hardware" },
  { value: "other", label: "Other" },
];

const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "IN", label: "India" },
  { value: "SG", label: "Singapore" },
  { value: "AE", label: "UAE" },
  { value: "OTHER", label: "Other" },
];

interface InvestorFormData {
  full_name: string;
  email: string;
  password: string;
  investment_focus: string;
  sectors: string[];
  portfolio_size: string;
  country: string;
  linkedin_url: string;
  bio: string;
}

export function InvestorRegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<InvestorFormData>({
    defaultValues: { sectors: [] },
  });

  const onSubmit = async (data: InvestorFormData) => {
    setError("");
    try {
      await axios.post(`${STRAPI_URL}/api/auth/local/register`, {
        username: data.email.split("@")[0] + "_" + Date.now(),
        email: data.email,
        password: data.password,
        user_type: "investor",
        display_name: data.full_name,
        investor_name: data.full_name,
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
        setError(
          err.response?.data?.error?.message || "Registration failed. Please try again."
        );
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <AuthLayout
      title="Register as an Investor"
      subtitle="Discover companies and connect with founders"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && <ErrorAlert message={error} />}

        <FormField label="Full Name" error={errors.full_name}>
          <Input
            registration={register("full_name", { required: "Name is required" })}
            placeholder="Jane Smith"
            error={errors.full_name}
          />
        </FormField>

        <FormField label="Email" error={errors.email}>
          <Input
            type="email"
            registration={register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
            })}
            placeholder="jane@ventures.com"
            error={errors.email}
          />
        </FormField>

        <FormField label="Password" error={errors.password}>
          <Input
            type="password"
            registration={register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "At least 6 characters" },
            })}
            placeholder="Min. 6 characters"
            error={errors.password}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Investment Focus" error={errors.investment_focus}>
            <Select
              options={INVESTMENT_FOCUS}
              placeholder="Select focus"
              registration={register("investment_focus", { required: "Required" })}
              error={errors.investment_focus}
            />
          </FormField>

          <FormField label="Country" error={errors.country}>
            <Select
              options={COUNTRIES}
              placeholder="Select country"
              registration={register("country", { required: "Required" })}
              error={errors.country}
            />
          </FormField>
        </div>

        <FormField label="Sectors of Interest" error={errors.sectors}>
          <Controller
            name="sectors"
            control={control}
            rules={{ validate: (v) => v.length > 0 || "Select at least one sector" }}
            render={({ field }) => (
              <MultiSelect
                options={SECTORS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select sectors..."
                error={!!errors.sectors}
              />
            )}
          />
        </FormField>

        <FormField label="Portfolio Size" error={errors.portfolio_size}>
          <Select
            options={[
              { value: "under_1m", label: "Under $1M" },
              { value: "1m_10m", label: "$1M - $10M" },
              { value: "10m_50m", label: "$10M - $50M" },
              { value: "50m_100m", label: "$50M - $100M" },
              { value: "over_100m", label: "$100M+" },
            ]}
            placeholder="Select range"
            registration={register("portfolio_size")}
            error={errors.portfolio_size}
          />
        </FormField>

        <FormField label="LinkedIn URL" error={errors.linkedin_url}>
          <Input
            registration={register("linkedin_url")}
            placeholder="https://linkedin.com/in/janesmith"
            error={errors.linkedin_url}
          />
        </FormField>

        <FormField label="Bio" error={errors.bio}>
          <Textarea
            registration={register("bio")}
            placeholder="Tell us about your investment philosophy..."
            error={errors.bio}
          />
        </FormField>

        <SubmitButton loading={isSubmitting}>Create Investor Account</SubmitButton>
      </form>
    </AuthLayout>
  );
}
