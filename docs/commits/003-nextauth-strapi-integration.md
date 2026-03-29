# Commit: NextAuth.js Integration with Strapi

**Date:** 2026-03-29

## Summary

Set up NextAuth.js v4 with a Strapi credentials provider, typed sessions carrying user_type, and client/server auth helpers.

## What Was Added

### Type Augmentations (`/frontend/src/types/next-auth.d.ts`)
Extends NextAuth's `User`, `Session`, and `JWT` types to include:
- `jwt` — Strapi JWT token
- `user_type` — "company" | "investor" | "expert"
- `display_name` — user's display name

### Auth Config (`/frontend/src/lib/auth.ts`)
- `authOptions` — NextAuth config with Strapi credentials provider
  - Calls `POST /api/auth/local` on Strapi with identifier + password
  - `jwt` callback stores Strapi JWT + user fields in the token
  - `session` callback exposes jwt, id, email, user_type, display_name
  - Custom sign-in page at `/login`
  - JWT session strategy, 30-day max age
- `getServerSession()` — pre-configured helper for server components

### Route Handler (`/frontend/src/app/api/auth/[...nextauth]/route.ts`)
- Exports GET and POST handlers using authOptions

### Auth Hook (`/frontend/src/hooks/useAuth.ts`)
- `useAuth()` — client-side hook wrapping `useSession()` with:
  - `user`, `session`, `status`, `isLoading`
  - `isLoggedIn()`, `isCompany()`, `isInvestor()`, `isExpert()`

### AuthProvider (`/frontend/src/modules/auth/AuthProvider.tsx`)
- Client component wrapping NextAuth's `SessionProvider`
- Barrel-exported from `@/modules/auth/index.ts`
- Added to root `layout.tsx` wrapping all children

## Usage

**Server component:**
```ts
import { getServerSession } from "@/lib/auth";
const session = await getServerSession();
```

**Client component:**
```ts
import { useAuth } from "@/hooks/useAuth";
const { user, isCompany, isLoggedIn } = useAuth();
```

**Strapi API calls with auth:**
```ts
import { getTokenFromSession } from "@/lib/strapi";
const token = getTokenFromSession(session);
const data = await strapiGet("/companies", {}, token);
```
