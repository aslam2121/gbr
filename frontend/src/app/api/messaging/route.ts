import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { strapiGet, strapiPost } from "@/lib/strapi";

// GET /api/messaging — list conversations for current user
export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.id || !session.jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Fetch conversations where user is participant_one OR participant_two
    const res = await strapiGet<unknown[]>("/conversations", {
      "filters[$or][0][participant_one][id][$eq]": userId,
      "filters[$or][1][participant_two][id][$eq]": userId,
      "populate[participant_one][fields][0]": "id",
      "populate[participant_one][fields][1]": "display_name",
      "populate[participant_one][fields][2]": "user_type",
      "populate[participant_two][fields][0]": "id",
      "populate[participant_two][fields][1]": "display_name",
      "populate[participant_two][fields][2]": "user_type",
      "sort": "last_message_at:desc",
      "pagination[pageSize]": 50,
    }, session.jwt);

    return NextResponse.json(res);
  } catch (err) {
    console.error("Fetch conversations error:", err);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}

// POST /api/messaging — start a new conversation
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id || !session.jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { recipientId } = body;

  if (!recipientId) {
    return NextResponse.json({ error: "recipientId is required" }, { status: 400 });
  }

  const userId = Number(session.user.id);

  try {
    // Check if conversation already exists between these two users
    const existing = await strapiGet<unknown[]>("/conversations", {
      "filters[$or][0][$and][0][participant_one][id][$eq]": userId,
      "filters[$or][0][$and][1][participant_two][id][$eq]": recipientId,
      "filters[$or][1][$and][0][participant_one][id][$eq]": recipientId,
      "filters[$or][1][$and][1][participant_two][id][$eq]": userId,
      "populate": "*",
    }, session.jwt);

    const existingConvos = existing.data ?? [];
    if (Array.isArray(existingConvos) && existingConvos.length > 0) {
      return NextResponse.json({ data: existingConvos[0], existing: true });
    }

    // Create new conversation
    const res = await strapiPost("/conversations", {
      participant_one: userId,
      participant_two: recipientId,
      last_message_at: new Date().toISOString(),
    }, session.jwt);

    return NextResponse.json(res);
  } catch (err) {
    console.error("Create conversation error:", err);
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
  }
}
