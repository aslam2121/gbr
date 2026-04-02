import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { strapiGet, strapiPut } from "@/lib/strapi";

// PUT /api/messaging/read — mark all messages in a conversation as read
export async function PUT(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id || !session.jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { conversationId } = body;

  if (!conversationId) {
    return NextResponse.json({ error: "conversationId is required" }, { status: 400 });
  }

  const userId = Number(session.user.id);

  try {
    // Find unread messages in this conversation that were NOT sent by me
    const res = await strapiGet<{ id: number; documentId: string }[]>("/messages", {
      "filters[conversation][documentId][$eq]": conversationId,
      "filters[sender][id][$ne]": userId,
      "filters[read][$eq]": false,
      "fields[0]": "id",
      "pagination[pageSize]": 200,
    }, session.jwt);

    const unreadMessages = res.data ?? [];

    // Mark each as read
    await Promise.all(
      unreadMessages.map((msg) =>
        strapiPut(`/messages/${msg.documentId}`, { read: true }, session.jwt!)
      )
    );

    return NextResponse.json({ marked: unreadMessages.length });
  } catch (err) {
    console.error("Mark as read error:", err);
    return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 });
  }
}
