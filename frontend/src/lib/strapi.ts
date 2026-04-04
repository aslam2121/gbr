import axios from "axios";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const api = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

// Strapi v5 wraps responses in { data, meta }
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiError {
  status: number;
  name: string;
  message: string;
}

function authHeader(token?: string): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function strapiGet<T>(
  path: string,
  params?: Record<string, unknown>,
  token?: string
): Promise<StrapiResponse<T>> {
  const res = await api.get<StrapiResponse<T>>(path, {
    params,
    headers: authHeader(token),
  });
  return res.data;
}

export async function strapiPost<T>(
  path: string,
  data: Record<string, unknown>,
  token?: string
): Promise<StrapiResponse<T>> {
  const res = await api.post<StrapiResponse<T>>(
    path,
    { data },
    { headers: authHeader(token) }
  );
  return res.data;
}

export async function strapiPut<T>(
  path: string,
  data: Record<string, unknown>,
  token?: string
): Promise<StrapiResponse<T>> {
  const res = await api.put<StrapiResponse<T>>(
    path,
    { data },
    { headers: authHeader(token) }
  );
  return res.data;
}

// Custom auth registration — sends flat body (not wrapped in { data })
export async function strapiRegister(
  body: Record<string, unknown>
): Promise<{ jwt: string; user: Record<string, unknown> }> {
  const res = await api.post("/custom-auth/register", body);
  return res.data;
}

// Helper to extract JWT from a NextAuth session object
export function getTokenFromSession(session: { jwt?: string } | null): string | undefined {
  return session?.jwt ?? undefined;
}
