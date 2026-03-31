"use client";

import { useState, useEffect, useCallback } from "react";
import {
  useDaily,
  useLocalParticipant,
  useParticipantIds,
  useScreenShare,
} from "@daily-co/daily-react";

interface CallControlsProps {
  onLeave: () => void;
}

export function CallControls({ onLeave }: CallControlsProps) {
  const daily = useDaily();
  const localParticipant = useLocalParticipant();
  const participantIds = useParticipantIds();
  const { isSharingScreen, startScreenShare, stopScreenShare } = useScreenShare();

  const [elapsed, setElapsed] = useState(0);

  const isAudioOn = localParticipant?.tracks?.audio?.state === "playable";
  const isVideoOn = localParticipant?.tracks?.video?.state === "playable";

  // Call duration timer
  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const toggleAudio = useCallback(() => {
    daily?.setLocalAudio(!isAudioOn);
  }, [daily, isAudioOn]);

  const toggleVideo = useCallback(() => {
    daily?.setLocalVideo(!isVideoOn);
  }, [daily, isVideoOn]);

  const toggleScreen = useCallback(() => {
    if (isSharingScreen) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  }, [isSharingScreen, startScreenShare, stopScreenShare]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-4">
        {/* Left: timer + participant count */}
        <div className="flex items-center gap-3 text-sm text-white">
          <span className="font-mono">{formatTime(elapsed)}</span>
          <span className="flex items-center gap-1 rounded-full bg-gray-700 px-2.5 py-0.5 text-xs">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            {participantIds.length}
          </span>
        </div>

        {/* Center: controls */}
        <div className="flex items-center gap-2">
          {/* Mic */}
          <button
            onClick={toggleAudio}
            className={`rounded-full p-3 transition-colors ${
              isAudioOn
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
            title={isAudioOn ? "Mute" : "Unmute"}
          >
            {isAudioOn ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
              </svg>
            )}
          </button>

          {/* Camera */}
          <button
            onClick={toggleVideo}
            className={`rounded-full p-3 transition-colors ${
              isVideoOn
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
            title={isVideoOn ? "Camera off" : "Camera on"}
          >
            {isVideoOn ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
              </svg>
            )}
          </button>

          {/* Screen share (hide on mobile) */}
          <button
            onClick={toggleScreen}
            className={`hidden rounded-full p-3 transition-colors sm:block ${
              isSharingScreen
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
            title={isSharingScreen ? "Stop sharing" : "Share screen"}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
            </svg>
          </button>

          {/* End call */}
          <button
            onClick={onLeave}
            className="rounded-full bg-red-600 p-3 text-white transition-colors hover:bg-red-700"
            title="Leave call"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 3.75L18 6m0 0l2.25 2.25M18 6l2.25-2.25M18 6l-2.25 2.25m1.5 13.5c-8.284 0-15-6.716-15-15M21.75 18c0 1.243-1.007 2.25-2.25 2.25h-1.372c-.516 0-.966-.351-1.091-.852l-1.106-4.423c-.11-.44.055-.902.417-1.173l1.293-.97a1.062 1.062 0 00.38-1.21 12.035 12.035 0 00-7.143-7.143 1.062 1.062 0 00-1.21.38l-.97 1.293a1.125 1.125 0 01-1.173.417L3.102 4.963c-.5-.125-.852-.575-.852-1.091V2.5A2.25 2.25 0 014.5.25h2.25" />
            </svg>
          </button>
        </div>

        {/* Right: spacer for balance */}
        <div className="w-20" />
      </div>
    </div>
  );
}
