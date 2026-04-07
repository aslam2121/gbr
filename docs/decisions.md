# Decisions

> Architecture and design decisions made during development

## Template Conversion
- **No CMS for page content** — HTML templates are converted exactly as-is to Next.js components, no Strapi-driven content for static pages
- **Tailwind CSS only** — No CSS modules or styled-components
- **Server components by default** — `"use client"` only when needed for hooks/interactivity

## Auth
- Strapi Users & Permissions + NextAuth.js
- Three user types: Company, Investor, Expert
- Protected routes check auth in layout, redirect to `/login`

## Architecture
- Module pattern: each feature is self-contained (Strapi content type + frontend module + page route)
- All Strapi calls go through `lib/strapi.ts`
- Business logic never in page files — pages only import from `/modules/` and call `/lib/`

## User Types Refactoring (2026-04-04) — IMPLEMENTED

### Decision: Single `user-profile` collection type replaces 3 separate types
- `user_type` enum on User model stays as-is (company/investor/expert)
- Dynamic registration form shows/hides fields based on selected type
- One API query for any profile, one component to render/filter

### Custom registration endpoint
- `/api/custom-auth/register` — custom API (not Strapi's built-in auth/local/register)
- **Why:** Strapi v5's built-in register route has middleware-level validation that rejects unknown fields. We cannot pass profile fields through it.
- Backend picks profile fields from request body via whitelist (`PROFILE_FIELDS`), creates user and profile in one transaction
- Frontend sends single request via `strapiRegister()` in `lib/strapi.ts`

### Desktop/Mobile dual inputs (continent, expertise, membership)
- Hidden input holds the react-hook-form registered value
- Desktop radio buttons and mobile dropdowns both call `setValue()` to update hidden input
- **Why:** React-hook-form conflicts when two visible inputs register the same field name

### Input sanitization
- All string fields stripped of `<>` characters on backend before DB write
- Email lowercased and trimmed

### Membership duration values
- Strapi enum doesn't allow values starting with numbers
- Values: `One Year`, `Two Years`, `Three Years` (not `1 Year`, `2 Years`, `3 Years`)

### Relation field naming
- `owner` (not `users_permissions_user`) — matches old schema convention, clearer intent

### user_type location (2026-04-07)
- `user_type` stays on User model only — NOT duplicated on user-profile
- Directory queries filter via relation: `filters[owner][user_type][$eq]=company`
- **Why:** Avoids duplication, practical for subscription-based access control

### Location approach (2026-04-07)
- Country-level positioning via `COUNTRY_COORDS` lookup table (197 countries)
- No latitude/longitude fields on user-profile
- **Why:** Users can't easily provide lat/lng. Country-level sufficient since HomeMap groups by country. Can upgrade to city-level geocoding later.

### Removed fields (2026-04-07)
- `employee_count`, `website`, `industry` — no longer on user-profile
- `area_of_specification` replaces `industry` with different enum values
- `logo` added as media field via Strapi admin
- **Why:** Simplifies schema. area_of_specification better matches the B2B business categories.
