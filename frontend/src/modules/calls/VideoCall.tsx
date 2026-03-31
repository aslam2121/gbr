"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  DailyProvider,
  useDaily,
  useParticipantIds,
  useLocalParticipant,
  DailyVideo,
} from "@daily-co/daily-react";
import { CallControls } from "./CallControls";

interface VideoCallProps {
  roomUrl: string;
  token: string;
  callType: "video" | "voice";
}

function CallGrid() {
  const participantIds = useParticipantIds();
  const localParticipant = useLocalParticipant();

  const gridCols =
    participantIds.length <= 1
      ? "grid-cols-1"
      : participantIds.length <= 4
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-2 sm:grid-cols-3";

  return (
    <div className={`grid ${gridCols} gap-2 p-2 sm:gap-3 sm:p-4 h-[calc(100vh-80px)]`}>
      {participantIds.map((id) => {
        const isLocal = id === localParticipant?.session_id;
        return (
          <div
            key={id}
            className="relative overflow-hidden rounded-xl bg-gray-800"
          >
            <DailyVideo
              automirror
              sessionId={id}
              type="video"
              className="h-full w-full object-cover"
            />
            {/* Name tag */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-gray-900/70 px-2 py-1">
              <span className="text-xs font-medium text-white">
                {isLocal ? "You" : `Participant`}
              </span>
            </div>
          </div>
        );
      })}

      {participantIds.length === 0 && (
        <div className="flex items-center justify-center rounded-xl bg-gray-800">
          <div className="text-center">
            <div className="h-8 w-8 mx-auto animate-spin rounded-full border-2 border-white border-t-transparent" />
            <p className="mt-3 text-sm text-gray-300">Connecting...</p>
          </div>
        </div>
      )}
    </div>
  );
}

function CallContent({ onLeave }: { onLeave: () => void }) {
  return (
    <div className="h-screen w-full bg-gray-900">
      <CallGrid />
      <CallControls onLeave={onLeave} />
    </div>
  );
}

export function VideoCall({ roomUrl, token, callType }: VideoCallProps) {
  const router = useRouter();

  const handleLeave = useCallback(() => {
    router.push("/calls");
  }, [router]);

  return (
    <DailyProvider
      url={roomUrl}
      token={token}
    >
      <CallContent onLeave={handleLeave} />
    </DailyProvider>
  );
}
