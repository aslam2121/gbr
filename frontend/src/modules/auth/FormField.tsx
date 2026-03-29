"use client";

import { type FieldError, type UseFormRegisterReturn } from "react-hook-form";

interface FormFieldProps {
  label: string;
  error?: FieldError | { message?: string };
  children: React.ReactNode;
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
}

interface InputProps {
  type?: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

export function Input({ type = "text", placeholder, registration, error }: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      {...registration}
      className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      }`}
    />
  );
}

interface SelectProps {
  options: { value: string; label: string }[];
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

export function Select({ options, placeholder, registration, error }: SelectProps) {
  return (
    <select
      {...registration}
      className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      }`}
    >
      {placeholder && (
        <option value="">{placeholder}</option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

interface TextareaProps {
  placeholder?: string;
  rows?: number;
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

export function Textarea({ placeholder, rows = 3, registration, error }: TextareaProps) {
  return (
    <textarea
      placeholder={placeholder}
      rows={rows}
      {...registration}
      className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      }`}
    />
  );
}
