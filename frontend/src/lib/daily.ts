const DAILY_API_KEY = process.env.DAILY_API_KEY;
const DAILY_API_URL = "https://api.daily.co/v1";

interface DailyRoomResponse {
  id: string;
  name: string;
  url: string;
  created_at: string;
  config: Record<string, unknown>;
}

interface DailyTokenResponse {
  token: string;
}

export async function createDailyRoom(
  roomName: string,
  options?: { isVideoCall?: boolean; expiryMinutes?: number }
): Promise<DailyRoomResponse> {
  if (!DAILY_API_KEY) {
    throw new Error("DAILY_API_KEY is not configured");
  }

  const expiry = Math.round(Date.now() / 1000) + (options?.expiryMinutes ?? 60) * 60;

  const res = await fetch(`${DAILY_API_URL}/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DAILY_API_KEY}`,
    },
    body: JSON.stringify({
      name: roomName,
      properties: {
        exp: expiry,
        enable_chat: true,
        enable_screenshare: true,
        start_video_off: !options?.isVideoCall,
        start_audio_off: false,
        max_participants: 10,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.info || `Daily API error: ${res.status}`);
  }

  return res.json();
}

export async function createDailyToken(
  roomName: string,
  userName: string,
  isOwner: boolean = false
): Promise<string> {
  if (!DAILY_API_KEY) {
    throw new Error("DAILY_API_KEY is not configured");
  }

  const expiry = Math.round(Date.now() / 1000) + 3600; // 1 hour

  const res = await fetch(`${DAILY_API_URL}/meeting-tokens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DAILY_API_KEY}`,
    },
    body: JSON.stringify({
      properties: {
        room_name: roomName,
        user_name: userName,
        is_owner: isOwner,
        exp: expiry,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.info || `Daily token error: ${res.status}`);
  }

  const data: DailyTokenResponse = await res.json();
  return data.token;
}

export async function deleteDailyRoom(roomName: string): Promise<void> {
  if (!DAILY_API_KEY) return;

  await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${DAILY_API_KEY}` },
  });
}
