"use client";

import { useState, useEffect, useRef } from "react";

interface User {
  id: number;
  display_name: string;
  email: string;
  user_type: string;
}

interface NewConversationModalProps {
  onClose: () => void;
  onSelect: (userId: number) => void;
}

const USER_TYPE_BADGE: Record<string, { label: string; color: string }> = {
  company: { label: "Company", color: "#033443" },
  investor: { label: "Investor", color: "#059669" },
  expert: { label: "Expert", color: "#d97706" },
};

export function NewConversationModal({ onClose, onSelect }: NewConversationModalProps) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/messaging/users?search=${encodeURIComponent(search)}`);
        const json = await res.json();
        if (res.ok) {
          setUsers(json.data ?? []);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const handleSelect = async (userId: number) => {
    setSelecting(true);
    await onSelect(userId);
    setSelecting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900">New Message</h2>
          <button onClick={onClose} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto border-t border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center p-6">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            </div>
          ) : users.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">
              {search ? "No users found" : "Type to search for users"}
            </div>
          ) : (
            users.map((u) => {
              const badge = USER_TYPE_BADGE[u.user_type ?? ""];
              return (
                <button
                  key={u.id}
                  onClick={() => handleSelect(u.id)}
                  disabled={selecting}
                  className="flex w-full items-center gap-3 p-3 text-left hover:bg-gray-50 disabled:opacity-50 border-b border-gray-50"
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: badge?.color ?? "#6B7280" }}
                  >
                    {(u.display_name ?? "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{u.display_name}</p>
                    <p className="truncate text-xs text-gray-500">{u.email}</p>
                  </div>
                  {badge && (
                    <span
                      className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium text-white"
                      style={{ backgroundColor: badge.color }}
                    >
                      {badge.label}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
