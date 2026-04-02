"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const POLL_INTERVAL = 5000; // 5 seconds

export function useUnreadCount(enabled: boolean) {
  const [count, setCount] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch("/api/messaging/unread");
      const json = await res.json();
      if (res.ok) {
        setCount(json.count ?? 0);
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setCount(0);
      return;
    }

    fetchCount();
    pollRef.current = setInterval(fetchCount, POLL_INTERVAL);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [enabled, fetchCount]);

  return count;
}
