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

const EXPERTISE_AREAS = [
  { value: "strategy", label: "Strategy" },
  { value: "finance", label: "Finance & Accounting" },
  { value: "marketing", label: "Marketing" },
  { value: "technology", label: "Technology" },
  { value: "operations", label: "Operations" },
  { value: "legal", label: "Legal & Compliance" },
  { value: "hr", label: "Human Resources" },
  { value: "sales", label: "Sales & BD" },
  { value: "product", label: "Product Management" },
  { value: "data", label: "Data & Analytics" },
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

interface ExpertFormData {
  full_name: string;
  email: string;
  password: string;
  expertise_areas: string[];
  experience_years: string;
  hourly_rate: string;
  country: string;
  availability: string;
  bio: string;
}

export function ExpertRegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ExpertFormData>({
    defaultValues: { expertise_areas: [] },
  });

  const onSubmit = async (data: ExpertFormData) => {
    setError("");
    try {
      await axios.post(`${STRAPI_URL}/api/auth/local/register`, {
        username: data.email.split("@")[0] + "_" + Date.now(),
        email: data.email,
        password: data.password,
        user_type: "expert",
        display_name: data.full_name,
        expert_name: data.full_name,
        specialty: data.expertise_areas.join(", "),
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
      title="Register as an Expert"
      subtitle="Share your expertise and connect with businesses"
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
            placeholder="Dr. Alex Johnson"
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
            placeholder="alex@consulting.com"
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

        <FormField label="Areas of Expertise" error={errors.expertise_areas}>
          <Controller
            name="expertise_areas"
            control={control}
            rules={{ validate: (v) => v.length > 0 || "Select at least one area" }}
            render={({ field }) => (
              <MultiSelect
                options={EXPERTISE_AREAS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select expertise areas..."
                error={!!errors.expertise_areas}
              />
            )}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Years of Experience" error={errors.experience_years}>
            <Select
              options={[
                { value: "1-3", label: "1-3 years" },
                { value: "3-5", label: "3-5 years" },
                { value: "5-10", label: "5-10 years" },
                { value: "10-15", label: "10-15 years" },
                { value: "15+", label: "15+ years" },
              ]}
              placeholder="Select"
              registration={register("experience_years", { required: "Required" })}
              error={errors.experience_years}
            />
          </FormField>

          <FormField label="Hourly Rate (USD)" error={errors.hourly_rate}>
            <Input
              type="number"
              registration={register("hourly_rate", { required: "Required" })}
              placeholder="150"
              error={errors.hourly_rate}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Country" error={errors.country}>
            <Select
              options={COUNTRIES}
              placeholder="Select country"
              registration={register("country", { required: "Required" })}
              error={errors.country}
            />
          </FormField>

          <FormField label="Availability" error={errors.availability}>
            <Select
              options={[
                { value: "full_time", label: "Full-time" },
                { value: "part_time", label: "Part-time" },
                { value: "weekends", label: "Weekends only" },
                { value: "project", label: "Project-based" },
              ]}
              placeholder="Select"
              registration={register("availability", { required: "Required" })}
              error={errors.availability}
            />
          </FormField>
        </div>

        <FormField label="Bio" error={errors.bio}>
          <Textarea
            registration={register("bio")}
            placeholder="Describe your experience and what you can offer..."
            error={errors.bio}
          />
        </FormField>

        <SubmitButton loading={isSubmitting}>Create Expert Account</SubmitButton>
      </form>
    </AuthLayout>
  );
}
