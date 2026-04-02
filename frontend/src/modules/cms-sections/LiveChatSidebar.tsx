"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface SidebarConversation {
  id: number;
  documentId: string;
  participant_one: { id: number; display_name: string; user_type: string } | null;
  participant_two: { id: number; display_name: string; user_type: string } | null;
  last_message_text: string | null;
  last_message_at: string | null;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function LiveChatSidebar() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const loggedIn = isLoggedIn();

  const [conversations, setConversations] = useState<SidebarConversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/messaging");
      const json = await res.json();
      if (res.ok) {
        setConversations(json.data ?? []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) {
      fetchConversations();
      const interval = setInterval(fetchConversations, 15000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [loggedIn, fetchConversations]);

  const getOther = (c: SidebarConversation) => {
    if (!user) return null;
    return c.participant_one?.id === Number(user.id) ? c.participant_two : c.participant_one;
  };

  return (
    <div style={{ padding: 0 }}>
      {/* Sidebar image */}
      <div>
        <Image
          src="/img/sidebar_image.jpg"
          alt="GBR Sidebar"
          width={442}
          height={294}
          className="h-[300px] w-full object-cover"
        />
      </div>

      {/* Messaging card */}
      <div className="overflow-hidden" style={{ borderRadius: "0 0 15px 15px" }}>
        {/* Header */}
        <div className="flex items-center justify-between bg-gbr-primary px-4 py-3 text-white">
          <i className="bi bi-chat-dots" />
          <p className="mb-0 text-sm font-bold">Messages</p>
          <Link href={loggedIn ? "/messaging" : "/login"} className="text-white hover:text-gray-200">
            <i className="bi bi-box-arrow-up-right text-sm" />
          </Link>
        </div>

        <div className="bg-white" style={{ height: "500px", overflowY: "auto" }}>
          {isLoading || loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            </div>
          ) : !loggedIn ? (
            /* Guest view — sign up prompt */
            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(5, 130, 173, 0.1)" }}
              >
                <i className="bi bi-chat-left-text text-3xl" style={{ color: "#0582ad" }} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">Join the conversation</h3>
              <p className="mt-2 text-sm text-gray-500">
                Sign up to connect with companies, investors, and experts around the world.
              </p>
              <div className="mt-5 flex flex-col gap-2 w-full max-w-[200px]">
                <Link
                  href="/register"
                  className="rounded-md px-4 py-2.5 text-center text-sm font-medium text-white"
                  style={{ backgroundColor: "#0083ae" }}
                >
                  Sign Up Free
                </Link>
                <Link
                  href="/login"
                  className="rounded-md border px-4 py-2 text-center text-sm font-medium"
                  style={{ borderColor: "#0083ae", color: "#0083ae" }}
                >
                  Sign In
                </Link>
              </div>
            </div>
          ) : conversations.length === 0 ? (
            /* Logged in but no conversations */
            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(5, 130, 173, 0.1)" }}
              >
                <i className="bi bi-inbox text-3xl" style={{ color: "#0582ad" }} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">No messages yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                Start a conversation from the directory or messaging page.
              </p>
              <Link
                href="/messaging"
                className="mt-4 rounded-md px-4 py-2 text-sm font-medium text-white"
                style={{ backgroundColor: "#0083ae" }}
              >
                <i className="bi bi-pencil-square me-1" />
                New Message
              </Link>
            </div>
          ) : (
            /* Conversation list */
            <div>
              {conversations.slice(0, 8).map((convo) => {
                const other = getOther(convo);
                return (
                  <Link
                    key={convo.documentId}
                    href="/messaging"
                    className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50"
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: "#033443" }}
                    >
                      {(other?.display_name ?? "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900 truncate">
                          {other?.display_name ?? "Unknown"}
                        </span>
                        {convo.last_message_at && (
                          <span className="ml-2 shrink-0 text-[10px] text-gray-400">
                            {timeAgo(convo.last_message_at)}
                          </span>
                        )}
                      </div>
                      {other?.user_type && (
                        <span className="text-[10px] capitalize text-gray-400">{other.user_type}</span>
                      )}
                      {convo.last_message_text && (
                        <p className="mt-0.5 truncate text-xs text-gray-500">{convo.last_message_text}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
              {conversations.length > 8 && (
                <Link
                  href="/messaging"
                  className="block px-4 py-3 text-center text-sm font-medium hover:bg-gray-50"
                  style={{ color: "#0083ae" }}
                >
                  View all messages ({conversations.length})
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
