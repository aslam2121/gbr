"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { AuthLayout, SubmitButton, ErrorAlert } from "./AuthLayout";
import { FormField, Input } from "./FormField";

interface LoginFormData {
  identifier: string;
  password: string;
}

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Welcome back to B2B Platform"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Register
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && <ErrorAlert message={error} />}

        <FormField label="Email or Username" error={errors.identifier}>
          <Input
            registration={register("identifier", { required: "Email is required" })}
            placeholder="you@example.com"
            error={errors.identifier}
          />
        </FormField>

        <FormField label="Password" error={errors.password}>
          <Input
            type="password"
            registration={register("password", { required: "Password is required" })}
            placeholder="Your password"
            error={errors.password}
          />
        </FormField>

        <SubmitButton loading={isSubmitting}>Sign in</SubmitButton>
      </form>
    </AuthLayout>
  );
}
