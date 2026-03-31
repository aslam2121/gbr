"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

interface ProfileFormData {
  display_name: string;
  email: string;
}

export function ProfileEditor() {
  const { user, session } = useAuth();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      display_name: user?.display_name ?? "",
      email: user?.email ?? "",
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      // Update user profile
      await axios.put(
        `${STRAPI_URL}/api/users/${user?.id}`,
        { display_name: data.display_name },
        { headers: { Authorization: `Bearer ${session?.jwt}` } }
      );

      // Upload avatar if selected
      if (fileRef.current?.files?.[0]) {
        const formData = new FormData();
        formData.append("files", fileRef.current.files[0]);
        formData.append("ref", "plugin::users-permissions.user");
        formData.append("refId", String(user?.id));
        formData.append("field", "avatar");

        await axios.post(`${STRAPI_URL}/api/upload`, formData, {
          headers: {
            Authorization: `Bearer ${session?.jwt}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error?.message || "Failed to update profile");
      } else {
        setError("Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage your personal information and preferences.
      </p>

      {success && (
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 ring-1 ring-green-200">
          Profile updated successfully.
        </div>
      )}
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8">
        {/* Avatar */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Avatar</h2>
          <div className="mt-4 flex items-center gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-blue-600">
                  {user?.display_name?.charAt(0) ?? "?"}
                </span>
              )}
            </div>
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Change Avatar
              </button>
              <p className="mt-1 text-xs text-gray-400">JPG, PNG. Max 2MB.</p>
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <input
                {...register("display_name", { required: "Name is required" })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {errors.display_name && (
                <p className="mt-1 text-sm text-red-600">{errors.display_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                {...register("email")}
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-400">Email cannot be changed.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <input
                value={user?.user_type ?? ""}
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 capitalize"
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
