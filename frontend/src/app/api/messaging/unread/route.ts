import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { strapiGet } from "@/lib/strapi";

// GET /api/messaging/unread — count of unread messages for current user
export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.id || !session.jwt) {
    return NextResponse.json({ count: 0 });
  }

  const userId = session.user.id;

  try {
    // Find messages where: sender is NOT me, read is false,
    // and conversation involves me (participant_one or participant_two)
    const res = await strapiGet<unknown[]>("/messages", {
      "filters[sender][id][$ne]": userId,
      "filters[read][$eq]": false,
      "filters[$or][0][conversation][participant_one][id][$eq]": userId,
      "filters[$or][1][conversation][participant_two][id][$eq]": userId,
      "pagination[pageSize]": 1,
      "pagination[withCount]": true,
    }, session.jwt);

    const count = res.meta?.pagination?.total ?? 0;
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
