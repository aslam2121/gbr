import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import axios from "axios";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// GET /api/messaging/users?search=xxx — search users to start a conversation
export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id || !session.jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const search = req.nextUrl.searchParams.get("search") ?? "";

  try {
    // Strapi users-permissions /users endpoint returns array directly
    const params: Record<string, unknown> = {
      "filters[id][$ne]": session.user.id,
    };

    if (search.trim()) {
      params["filters[$or][0][display_name][$containsi]"] = search;
      params["filters[$or][1][email][$containsi]"] = search;
    }

    const res = await axios.get(`${STRAPI_URL}/api/users`, {
      params,
      headers: { Authorization: `Bearer ${session.jwt}` },
    });

    // /api/users returns array directly in Strapi
    const allUsers = Array.isArray(res.data) ? res.data : [];

    // Only return needed fields
    const users = allUsers.map((u: Record<string, unknown>) => ({
      id: u.id,
      display_name: u.display_name || u.username,
      email: u.email,
      user_type: u.user_type,
    }));

    return NextResponse.json({ data: users });
  } catch (err) {
    console.error("Search users error:", err);
    return NextResponse.json({ error: "Failed to search users" }, { status: 500 });
  }
}
