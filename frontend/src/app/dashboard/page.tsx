"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardOverview() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gbr-accent border-t-transparent" />
      </div>
    );
  }

  const stats = [
    { label: "New Leads", value: "24", icon: "bi-people", color: "text-gbr-primary" },
    { label: "Active Chats", value: "8", icon: "bi-chat-dots", color: "text-gbr-accent" },
    { label: "Meetings This Week", value: "5", icon: "bi-calendar-check", color: "text-emerald-600" },
    { label: "Profile Completion", value: "92%", icon: "bi-person-check", color: "text-amber-500" },
  ];

  const features = [
    { label: "Company Profile", href: "/dashboard/company", icon: "bi-building", description: "Manage your company details and visibility.", bg: "bg-emerald-500" },
    { label: "Investor Connections", href: "/directory", icon: "bi-graph-up-arrow", description: "Explore and connect with potential investors.", bg: "bg-gbr-accent" },
    { label: "Expert Consultation", href: "/calls", icon: "bi-camera-video", description: "Schedule calls with domain experts.", bg: "bg-amber-500" },
    { label: "Messages", href: "#", icon: "bi-envelope", description: "View and manage your conversations.", bg: "bg-red-500" },
  ];

  const activities = [
    { action: "New connection request", from: "John Smith", status: "pending", time: "2 hours ago" },
    { action: "Profile view", from: "Sarah Johnson", status: "viewed", time: "5 hours ago" },
    { action: "Meeting scheduled", from: "Michael Brown", status: "confirmed", time: "1 day ago" },
  ];

  return (
    <div>
      {/* Welcome card */}
      <div className="rounded-xl bg-gbr-dark px-6 py-8 text-white">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.display_name ?? "User"}</h1>
            <p className="mt-1 text-sm capitalize text-white/70">{user?.user_type} account</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/dashboard/profile"
              className="rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              <i className="bi bi-pencil me-1" /> Edit Profile
            </Link>
            <Link
              href="/dashboard/subscription"
              className="rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              <i className="bi bi-gear me-1" /> Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 ${stat.color}`}>
                <i className={`bi ${stat.icon} text-xl`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <Link
            key={f.label}
            href={f.href}
            className={`group rounded-xl ${f.bg} p-5 text-white transition-opacity hover:opacity-90`}
          >
            <i className={`bi ${f.icon} text-3xl`} />
            <h3 className="mt-3 text-sm font-semibold">{f.label}</h3>
            <p className="mt-1 text-xs text-white/80">{f.description}</p>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase text-gray-500">
                <th className="pb-3 pr-4">Action</th>
                <th className="pb-3 pr-4">From</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-3 pr-4 text-gray-900">{a.action}</td>
                  <td className="py-3 pr-4 text-gray-600">{a.from}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        a.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-700"
                          : a.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400">{a.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
