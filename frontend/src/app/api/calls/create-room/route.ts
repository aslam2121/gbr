import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { createDailyRoom, createDailyToken } from "@/lib/daily";
import { strapiPost } from "@/lib/strapi";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id || !session.jwt) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const callType = body.call_type === "voice" ? "voice" : "video";

    // Generate a unique room name
    const roomName = `b2b-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    // Create room on Daily.co
    const dailyRoom = await createDailyRoom(roomName, {
      isVideoCall: callType === "video",
      expiryMinutes: 60,
    });

    // Generate a meeting token for the creator
    const token = await createDailyToken(
      roomName,
      session.user.display_name || "Host",
      true
    );

    // Store in Strapi
    await strapiPost(
      "/call-rooms",
      {
        room_name: roomName,
        daily_room_url: dailyRoom.url,
        created_by_user: session.user.id,
        status: "waiting",
        call_type: callType,
        started_at: new Date().toISOString(),
      },
      session.jwt
    );

    return NextResponse.json({
      room_name: roomName,
      room_url: dailyRoom.url,
      token,
    });
  } catch (err) {
    console.error("Create room error:", err);
    const message = err instanceof Error ? err.message : "Failed to create room";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
