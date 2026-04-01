"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { type Conversation, type Message } from "./MessagingApp";

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  userId: number;
  getOtherParticipant: (c: Conversation) => { display_name: string; user_type: string } | null;
  onSend: (content: string) => void;
  onBack: () => void;
}

function formatMessageTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function formatDateSeparator(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

export function ChatWindow({
  conversation,
  messages,
  loading,
  userId,
  getOtherParticipant,
  onSend,
  onBack,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(0);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (messages.length > prevCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevCountRef.current = messages.length;
  }, [messages.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  // Empty state — no conversation selected
  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
        <div className="text-center p-8">
          <i className="bi bi-chat-left-text text-5xl text-gray-300"></i>
          <h3 className="mt-3 text-lg font-semibold text-gray-900">Select a conversation</h3>
          <p className="mt-1 text-sm text-gray-500">Choose from your existing conversations or start a new one.</p>
        </div>
      </div>
    );
  }

  const other = getOtherParticipant(conversation);

  // Group messages by date for date separators
  let lastDate = "";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
      {/* Chat header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white p-3">
        <div className="flex items-center gap-3">
          {/* Back button — mobile only */}
          <button onClick={onBack} className="lg:hidden rounded p-1 text-gray-500 hover:bg-gray-100">
            <i className="bi bi-arrow-left text-lg"></i>
          </button>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: "#033443" }}
          >
            {(other?.display_name ?? "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">{other?.display_name ?? "Unknown"}</h2>
            {other?.user_type && (
              <span className="text-xs text-gray-500 capitalize">{other.user_type}</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/calls"
            className="rounded border px-2 py-1 text-sm"
            style={{ borderColor: "#0083ae", color: "#0083ae" }}
          >
            <i className="bi bi-telephone"></i>
          </Link>
          <Link
            href="/calls"
            className="rounded border px-2 py-1 text-sm"
            style={{ borderColor: "#0083ae", color: "#0083ae" }}
          >
            <i className="bi bi-camera-video"></i>
          </Link>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4" style={{ backgroundColor: "#f7fafb" }}>
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <i className="bi bi-chat-dots text-4xl text-gray-300"></i>
            <p className="mt-2 text-sm text-gray-500">No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender?.id === userId;
            const msgDate = new Date(msg.createdAt).toDateString();
            let showDateSep = false;
            if (msgDate !== lastDate) {
              showDateSep = true;
              lastDate = msgDate;
            }

            return (
              <div key={msg.documentId}>
                {showDateSep && (
                  <div className="my-4 flex items-center gap-3">
                    <div className="flex-1 border-t border-gray-200" />
                    <span className="text-xs text-gray-400">{formatDateSeparator(msg.createdAt)}</span>
                    <div className="flex-1 border-t border-gray-200" />
                  </div>
                )}
                <div className={`mb-3 flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      isMine
                        ? "text-white"
                        : "border border-gray-200 bg-white text-gray-900"
                    }`}
                    style={isMine ? { backgroundColor: "#0582ad" } : undefined}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                    <p className={`mt-1 text-[10px] ${isMine ? "text-blue-100" : "text-gray-400"}`}>
                      {formatMessageTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="border-t border-gray-200 bg-white p-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: "#0083ae" }}
          >
            <i className="bi bi-send"></i>
          </button>
        </form>
      </div>
    </div>
  );
}
