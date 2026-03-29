# Commit: Initial Monorepo Scaffold + Strapi API Client

**Date:** 2026-03-29

## Summary

Scaffolded the full B2B platform monorepo with backend (Strapi v5), frontend (Next.js 14), and root-level orchestration. Added a typed Strapi API client for all frontend–backend communication.

## What Was Added

### Root Level
- `package.json` — monorepo scripts (`dev`, `dev:backend`, `dev:frontend`) using `concurrently`
- `docker-compose.yml` — postgres (5432), strapi (1337), nextjs (3000) services
- `.env.example` — all required environment variables
- `.gitignore` — node_modules, .env, build artifacts

### Backend (`/backend`)
- Strapi v5 scaffolded via `create-strapi@latest`
- PostgreSQL driver (`pg`) installed
- `config/database.ts` — reads from `DATABASE_*` env vars, supports postgres/mysql/sqlite
- `config/server.ts` — CORS configured to allow `http://localhost:3000`

### Frontend (`/frontend`)
- Next.js 14 with App Router, TypeScript, Tailwind CSS
- Dependencies: `axios`, `next-auth`, `@stripe/stripe-js`
- `src/app/layout.tsx` — root layout with metadata
- `src/app/page.tsx` — landing page placeholder
- `src/app/globals.css` — Tailwind directives
- `tailwind.config.ts`, `postcss.config.js`, `next.config.js`, `tsconfig.json`

### Strapi API Client (`/frontend/src/lib/strapi.ts`)
- `StrapiResponse<T>` — generic type for Strapi v5 `{ data, meta }` envelope
- `strapiGet<T>(path, params?, token?)` — typed GET requests
- `strapiPost<T>(path, data, token?)` — typed POST (wraps body in `{ data }`)
- `strapiPut<T>(path, data, token?)` — typed PUT
- `authHeader(token?)` — Bearer token helper
- `getTokenFromSession(session)` — extracts JWT from NextAuth session

## Key Decisions
- Strapi's default `database.ts` already supports multiple DB clients via `DATABASE_CLIENT` env var — no custom rewrite needed
- Frontend manually scaffolded (not via `create-next-app`) to avoid interactive prompts
- CORS origins configurable via `CORS_ORIGINS` env var, defaults to localhost:3000
