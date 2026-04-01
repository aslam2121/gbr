import type { Metadata } from "next";
import { MessagingApp } from "@/modules/messaging";

export const metadata: Metadata = {
  title: "Messages | B2B Platform",
  description: "Chat with companies, investors, and experts on GBR.",
};

export default function MessagingPage() {
  return <MessagingApp />;
}
