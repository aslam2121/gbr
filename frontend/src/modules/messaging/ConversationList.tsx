"use client";

import { type Conversation } from "./MessagingApp";

interface ConversationListProps {
  conversations: Conversation[];
  activeConvo: Conversation | null;
  loading: boolean;
  userId: number;
  getOtherParticipant: (c: Conversation) => { display_name: string; user_type: string } | null;
  onSelect: (c: Conversation) => void;
}

function formatTime(dateStr: string | null) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

const USER_TYPE_BADGE: Record<string, { label: string; color: string }> = {
  company: { label: "Company", color: "#033443" },
  investor: { label: "Investor", color: "#059669" },
  expert: { label: "Expert", color: "#d97706" },
};

export function ConversationList({
  conversations,
  activeConvo,
  loading,
  getOtherParticipant,
  onSelect,
}: ConversationListProps) {
  if (loading) {
    return (
      <div className="h-full overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
        <div className="flex items-center justify-between p-3 text-white" style={{ backgroundColor: "#033443" }}>
          <h2 className="text-base font-semibold">Messages</h2>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
      <div className="flex items-center justify-between p-3 text-white" style={{ backgroundColor: "#033443" }}>
        <h2 className="text-base font-semibold">Messages</h2>
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{conversations.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <i className="bi bi-chat-dots text-4xl text-gray-300"></i>
            <p className="mt-2 text-sm text-gray-500">No conversations yet</p>
            <p className="text-xs text-gray-400">Start a new message to begin chatting</p>
          </div>
        ) : (
          conversations.map((convo) => {
            const other = getOtherParticipant(convo);
            const isActive = activeConvo?.documentId === convo.documentId;
            const badge = USER_TYPE_BADGE[other?.user_type ?? ""];

            return (
              <button
                key={convo.documentId}
                onClick={() => onSelect(convo)}
                className={`block w-full p-3 text-left transition-colors ${
                  isActive ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: badge?.color ?? "#6B7280" }}
                  >
                    {(other?.display_name ?? "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="truncate text-sm font-semibold text-gray-900">
                        {other?.display_name ?? "Unknown User"}
                      </span>
                      <span className="shrink-0 text-xs text-gray-400">
                        {formatTime(convo.last_message_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {badge && (
                        <span
                          className="shrink-0 rounded px-1 py-0.5 text-[10px] font-medium text-white"
                          style={{ backgroundColor: badge.color }}
                        >
                          {badge.label}
                        </span>
                      )}
                      <p className="truncate text-xs text-gray-500">
                        {convo.last_message_text || "No messages yet"}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
