# B2B Platform — Project Context for Claude Code

## What Is This Project?

A modular B2B web platform connecting Companies, Investors, and Experts. Built with **Strapi v5** (backend CMS) and **Next.js 14 App Router** (frontend). Everything is module-based — features can be added or removed independently.

## Tech Stack

- **Backend:** Strapi v5, Node.js, PostgreSQL
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Auth:** Strapi Users & Permissions + NextAuth.js
- **Payments:** Stripe (subscriptions)
- **Video/Voice:** Daily.co WebRTC SDK
- **Maps:** Leaflet + React-Leaflet
- **Deployment:** Docker Compose

## Project Structure

```
b2b-platform/
├── CLAUDE.md                    ← You are here
├── docker-compose.yml
├── .env.example
├── backend/                     ← Strapi CMS (port 1337)
│   └── src/api/                 ← Each module = a folder here
│       ├── company/
│       ├── investor/
│       ├── expert/
│       ├── subscription-plan/
│       ├── call-room/
│       └── page-section/
├── frontend/                    ← Next.js App (port 3000)
│   └── src/
│       ├── app/                 ← Route pages (App Router)
│       ├── modules/             ← Feature modules (components)
│       │   ├── directory/
│       │   ├── map/
│       │   ├── calls/
│       │   ├── auth/
│       │   ├── pricing/
│       │   ├── cms-sections/
│       │   └── dashboard/
│       ├── lib/                 ← Shared utilities (strapi.ts, stripe.ts, auth.ts, daily.ts)
│       ├── hooks/               ← Custom React hooks
│       └── types/               ← TypeScript type definitions
└── docs/                        ← Architecture documentation
    ├── modules.md
    ├── strapi-schemas.md
    ├── api-reference.md
    └── conventions.md
```

## Core Concepts

### Module Pattern
Every feature is a self-contained module with:
1. **Strapi side:** Content type in `/backend/src/api/{module}/`
2. **Frontend side:** Components in `/frontend/src/modules/{module}/`
3. **Page route:** In `/frontend/src/app/{route}/`

To add a module: create all three. To remove: delete the page route (optionally delete the rest).

### Three User Types
- **Company** — businesses listed in the directory
- **Investor** — users who browse and connect with companies
- **Expert** — consultants available for calls

Each has: separate registration form, different dashboard views, different subscription plans.

### CMS-Driven Pages
The homepage and landing pages are built from `page-section` entries in Strapi. The `SectionRenderer` component maps `section_type` to React components. To add a new section type: create a component, add it to the renderer map.

## Key Files to Know

| File | Purpose |
|------|---------|
| `frontend/src/lib/strapi.ts` | All Strapi API calls go through here |
| `frontend/src/lib/auth.ts` | NextAuth config and session helpers |
| `frontend/src/modules/cms-sections/SectionRenderer.tsx` | Maps CMS sections to components |
| `frontend/src/hooks/useAuth.ts` | Auth hook with role helpers |
| `backend/src/extensions/users-permissions/` | Custom user roles and registration |
| `docker-compose.yml` | Full stack local setup |

## How to Run

```bash
# Start database
docker compose up postgres

# Start Strapi (terminal 2)
cd backend && npm run develop    # http://localhost:1337/admin

# Start Next.js (terminal 3)
cd frontend && npm run dev       # http://localhost:3000
```

## Environment Variables

See `.env.example` for the full list. Critical ones:
- `DATABASE_*` — PostgreSQL connection
- `NEXT_PUBLIC_STRAPI_URL` — Strapi base URL
- `NEXTAUTH_SECRET` — NextAuth encryption key
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` — Stripe billing
- `DAILY_API_KEY` — Daily.co video calls

## Rules for Working in This Codebase

1. **Never put business logic in page files** — pages only import from `/modules/` and call `/lib/`
2. **All Strapi calls go through `lib/strapi.ts`** — no raw fetch/axios in components
3. **Every module exports via `index.ts`** barrel file
4. **Use TypeScript types from `/types/`** — don't use `any`
5. **Tailwind only for styling** — no CSS modules, no styled-components
6. **Server components by default** — add `"use client"` only when needed (hooks, interactivity)
7. **Keep Strapi content types flat** — avoid deep nesting, use relations instead
8. **All forms use React Hook Form** for validation and state management
9. **Protected routes check auth in layout** — redirect to `/login` if unauthenticated

## Documentation

Read these before making significant changes:
- `docs/modules.md` — How to add/remove/modify feature modules
- `docs/strapi-schemas.md` — All Strapi content type schemas and field details
- `docs/api-reference.md` — Every API endpoint with request/response examples
- `docs/conventions.md` — Code style, naming, file organization rules
