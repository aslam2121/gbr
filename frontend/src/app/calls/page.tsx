import type { Metadata } from "next";
import { CallLobby } from "@/modules/calls";

export const metadata: Metadata = {
  title: "Calls | B2B Platform",
  description: "Start or join video and voice calls with companies, investors, and experts.",
};

export default function CallsPage() {
  return <CallLobby />;
}
