"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

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
    <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left panel — dark branding */}
          <div className="flex flex-col justify-center bg-gbr-dark px-8 py-12 text-white md:px-10">
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Sign in to access your dashboard, manage your connections, and grow your business network.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <i className="bi bi-check-circle-fill text-gbr-accent" />
                Global company directory
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-check-circle-fill text-gbr-accent" />
                Video and voice calls
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-check-circle-fill text-gbr-accent" />
                Expert consultations
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-check-circle-fill text-gbr-accent" />
                Investor matching
              </li>
            </ul>
          </div>

          {/* Right panel — login form */}
          <div className="px-8 py-12 md:px-10">
            <h2 className="text-xl font-bold text-gray-900">Sign in to your account</h2>
            <p className="mt-1 text-sm text-gray-500">
              Enter your credentials below
            </p>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email or Username
                </label>
                <input
                  {...register("identifier", { required: "Email is required" })}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gbr-accent focus:ring-1 focus:ring-gbr-accent"
                />
                {errors.identifier && (
                  <p className="mt-1 text-xs text-red-600">{errors.identifier.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  {...register("password", { required: "Password is required" })}
                  placeholder="Your password"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gbr-accent focus:ring-1 focus:ring-gbr-accent"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" className="rounded border-gray-300" />
                  Remember me
                </label>
                <a href="#" className="text-sm text-gbr-accent hover:underline">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-gbr-accent py-2.5 text-sm font-medium text-white transition-colors hover:bg-gbr-secondary disabled:opacity-50"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>

              <Link
                href="/register"
                className="block w-full rounded-lg border-2 border-gbr-accent py-2.5 text-center text-sm font-medium text-gbr-accent transition-colors hover:bg-gbr-accent hover:text-white"
              >
                Create an account
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
