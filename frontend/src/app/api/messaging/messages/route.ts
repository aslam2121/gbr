import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { strapiGet, strapiPost, strapiPut } from "@/lib/strapi";

// GET /api/messaging/messages?conversationId=xxx — fetch messages for a conversation
export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id || !session.jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversationId = req.nextUrl.searchParams.get("conversationId");
  if (!conversationId) {
    return NextResponse.json({ error: "conversationId is required" }, { status: 400 });
  }

  try {
    const res = await strapiGet<unknown[]>("/messages", {
      "filters[conversation][documentId][$eq]": conversationId,
      "populate[sender][fields][0]": "id",
      "populate[sender][fields][1]": "display_name",
      "sort": "createdAt:asc",
      "pagination[pageSize]": 200,
    }, session.jwt);

    return NextResponse.json(res);
  } catch (err) {
    console.error("Fetch messages error:", err);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// POST /api/messaging/messages — send a message
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id || !session.jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { conversationId, content } = body;

  if (!conversationId || !content?.trim()) {
    return NextResponse.json({ error: "conversationId and content are required" }, { status: 400 });
  }

  const userId = Number(session.user.id);

  try {
    // Create the message
    const msgRes = await strapiPost("/messages", {
      content: content.trim(),
      sender: userId,
      conversation: conversationId,
      read: false,
    }, session.jwt);

    // Update conversation's last_message_text and last_message_at
    await strapiPut(`/conversations/${conversationId}`, {
      last_message_text: content.trim().slice(0, 200),
      last_message_at: new Date().toISOString(),
    }, session.jwt);

    return NextResponse.json(msgRes);
  } catch (err) {
    console.error("Send message error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
