"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ConversationList } from "./ConversationList";
import { ChatWindow } from "./ChatWindow";
import { NewConversationModal } from "./NewConversationModal";

export interface Conversation {
  id: number;
  documentId: string;
  participant_one: { id: number; display_name: string; user_type: string } | null;
  participant_two: { id: number; display_name: string; user_type: string } | null;
  last_message_text: string | null;
  last_message_at: string | null;
}

export interface Message {
  id: number;
  documentId: string;
  content: string;
  sender: { id: number; display_name: string } | null;
  read: boolean;
  createdAt: string;
}

export function MessagingApp() {
  const { user, isLoading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvo, setActiveConvo] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch conversations
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
      setLoadingConvos(false);
    }
  }, []);

  // Mark messages as read in a conversation
  const markAsRead = useCallback(async (convoDocId: string) => {
    try {
      await fetch("/api/messaging/read", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: convoDocId }),
      });
    } catch {
      // silent
    }
  }, []);

  // Fetch messages for active conversation
  const fetchMessages = useCallback(async (convoDocId: string) => {
    try {
      const res = await fetch(`/api/messaging/messages?conversationId=${convoDocId}`);
      const json = await res.json();
      if (res.ok) {
        setMessages(json.data ?? []);
      }
      // Mark messages as read after fetching
      await markAsRead(convoDocId);
    } catch {
      // silent
    }
  }, [markAsRead]);

  // Initial load
  useEffect(() => {
    if (user) fetchConversations();
  }, [user, fetchConversations]);

  // Poll messages every 4 seconds when a conversation is active
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (!activeConvo) return;

    setLoadingMessages(true);
    fetchMessages(activeConvo.documentId).finally(() => setLoadingMessages(false));

    pollRef.current = setInterval(() => {
      fetchMessages(activeConvo.documentId);
      fetchConversations(); // also refresh conversation list for last_message updates
    }, 4000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [activeConvo, fetchMessages, fetchConversations]);

  // Send message
  const sendMessage = async (content: string) => {
    if (!activeConvo || !content.trim()) return;

    // Optimistic update
    const optimistic: Message = {
      id: Date.now(),
      documentId: `temp-${Date.now()}`,
      content: content.trim(),
      sender: { id: Number(user!.id), display_name: user!.display_name || "You" },
      read: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      await fetch("/api/messaging/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConvo.documentId,
          content: content.trim(),
        }),
      });
      // Refresh real messages
      fetchMessages(activeConvo.documentId);
      fetchConversations();
    } catch {
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    }
  };

  // Start new conversation with a user
  const startConversation = async (recipientId: number) => {
    try {
      const res = await fetch("/api/messaging", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId }),
      });
      const json = await res.json();
      if (res.ok) {
        setShowNewModal(false);
        await fetchConversations();
        const newConvo = json.data;
        if (newConvo) {
          setActiveConvo(newConvo);
          setMobileShowChat(true);
        }
      }
    } catch {
      // silent
    }
  };

  // Get the "other" participant name
  const getOtherParticipant = (convo: Conversation) => {
    if (!user) return { display_name: "Unknown", user_type: "" };
    const isOne = convo.participant_one?.id === Number(user.id);
    return isOne ? convo.participant_two : convo.participant_one;
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Sign in to use messaging</h2>
          <p className="mt-2 text-gray-500">You need an account to send and receive messages.</p>
          <a href="/login" className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
            Sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gray-50" style={{ minHeight: "calc(100vh - 64px)" }}>
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
            <p className="text-sm text-gray-600">Chat with companies, investors, and experts.</p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="rounded-md px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: "#0083ae" }}
          >
            <i className="bi bi-pencil-square me-1"></i>New Message
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4" style={{ height: "calc(100vh - 180px)" }}>
          {/* Conversation list - hide on mobile when chat is open */}
          <div className={`lg:col-span-4 ${mobileShowChat ? "hidden lg:block" : ""}`}>
            <ConversationList
              conversations={conversations}
              activeConvo={activeConvo}
              loading={loadingConvos}
              userId={Number(user.id)}
              getOtherParticipant={getOtherParticipant}
              onSelect={(convo) => {
                setActiveConvo(convo);
                setMobileShowChat(true);
              }}
            />
          </div>

          {/* Chat window */}
          <div className={`lg:col-span-8 ${!mobileShowChat ? "hidden lg:block" : ""}`}>
            <ChatWindow
              conversation={activeConvo}
              messages={messages}
              loading={loadingMessages}
              userId={Number(user.id)}
              getOtherParticipant={getOtherParticipant}
              onSend={sendMessage}
              onBack={() => setMobileShowChat(false)}
            />
          </div>
        </div>
      </div>

      {showNewModal && (
        <NewConversationModal
          onClose={() => setShowNewModal(false)}
          onSelect={startConversation}
        />
      )}
    </main>
  );
}
