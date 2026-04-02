import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { strapiGet } from "@/lib/strapi";

// GET /api/messaging/unread — count of unread messages for current user
export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.id || !session.jwt) {
    return NextResponse.json({ count: 0 });
  }

  const userId = Number(session.user.id);

  try {
    // Step 1: Get the user's conversation documentIds
    const convos = await strapiGet<{ documentId: string }[]>("/conversations", {
      "filters[$or][0][participant_one][id][$eq]": userId,
      "filters[$or][1][participant_two][id][$eq]": userId,
      "fields[0]": "documentId",
      "pagination[pageSize]": 100,
    }, session.jwt);

    const convoIds = (convos.data ?? []).map((c) => c.documentId);
    if (convoIds.length === 0) {
      return NextResponse.json({ count: 0 });
    }

    // Step 2: Count unread messages in those conversations not sent by me
    let totalUnread = 0;
    for (const convoId of convoIds) {
      const res = await strapiGet<unknown[]>("/messages", {
        "filters[conversation][documentId][$eq]": convoId,
        "filters[sender][id][$ne]": userId,
        "filters[read][$eq]": false,
        "pagination[pageSize]": 1,
        "pagination[withCount]": true,
      }, session.jwt);
      totalUnread += res.meta?.pagination?.total ?? 0;
    }

    return NextResponse.json({ count: totalUnread });
  } catch (err) {
    console.error("Unread count error:", err);
    return NextResponse.json({ count: 0 });
  }
}
