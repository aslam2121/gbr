"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const VideoCall = dynamic(
  () => import("@/modules/calls/VideoCall").then((m) => m.VideoCall),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
          <p className="text-sm text-gray-300">Loading call...</p>
        </div>
      </div>
    ),
  }
);

function RoomContent() {
  const searchParams = useSearchParams();

  const roomUrl = searchParams.get("url");
  const token = searchParams.get("token");
  const callType = (searchParams.get("type") as "video" | "voice") || "video";

  if (!roomUrl || !token) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Room Not Found</h2>
          <p className="mt-2 text-gray-400">
            This room link is invalid or has expired.
          </p>
          <a
            href="/calls"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Back to Calls
          </a>
        </div>
      </div>
    );
  }

  return <VideoCall roomUrl={roomUrl} token={token} callType={callType} />;
}

export default function RoomPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-gray-900">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
        </div>
      }
    >
      <RoomContent />
    </Suspense>
  );
}
