"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import { AuthLayout, SubmitButton, ErrorAlert } from "./AuthLayout";
import { FormField, Input, Select, Textarea } from "./FormField";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const INDUSTRIES = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "retail", label: "Retail" },
  { value: "energy", label: "Energy" },
  { value: "real_estate", label: "Real Estate" },
  { value: "education", label: "Education" },
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

interface CompanyFormData {
  company_name: string;
  email: string;
  password: string;
  industry: string;
  country: string;
  website: string;
  employee_count: string;
  description: string;
}

export function CompanyRegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormData>();

  const onSubmit = async (data: CompanyFormData) => {
    setError("");
    try {
      await axios.post(`${STRAPI_URL}/api/auth/local/register`, {
        username: data.email.split("@")[0] + "_" + Date.now(),
        email: data.email,
        password: data.password,
        user_type: "company",
        display_name: data.company_name,
        company_name: data.company_name,
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
      title="Register as a Company"
      subtitle="List your business and connect with investors and experts"
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

        <FormField label="Company Name" error={errors.company_name}>
          <Input
            registration={register("company_name", { required: "Company name is required" })}
            placeholder="Acme Corporation"
            error={errors.company_name}
          />
        </FormField>

        <FormField label="Email" error={errors.email}>
          <Input
            type="email"
            registration={register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
            })}
            placeholder="contact@acme.com"
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
          <FormField label="Industry" error={errors.industry}>
            <Select
              options={INDUSTRIES}
              placeholder="Select industry"
              registration={register("industry", { required: "Industry is required" })}
              error={errors.industry}
            />
          </FormField>

          <FormField label="Country" error={errors.country}>
            <Select
              options={COUNTRIES}
              placeholder="Select country"
              registration={register("country", { required: "Country is required" })}
              error={errors.country}
            />
          </FormField>
        </div>

        <FormField label="Website" error={errors.website}>
          <Input
            registration={register("website")}
            placeholder="https://acme.com"
            error={errors.website}
          />
        </FormField>

        <FormField label="Number of Employees" error={errors.employee_count}>
          <Select
            options={[
              { value: "1-10", label: "1-10" },
              { value: "11-50", label: "11-50" },
              { value: "51-200", label: "51-200" },
              { value: "201-500", label: "201-500" },
              { value: "500+", label: "500+" },
            ]}
            placeholder="Select range"
            registration={register("employee_count")}
            error={errors.employee_count}
          />
        </FormField>

        <FormField label="Description" error={errors.description}>
          <Textarea
            registration={register("description")}
            placeholder="Tell us about your company..."
            error={errors.description}
          />
        </FormField>

        <SubmitButton loading={isSubmitting}>Create Company Account</SubmitButton>
      </form>
    </AuthLayout>
  );
}
