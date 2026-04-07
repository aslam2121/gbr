# Current State

> Last updated: 2026-04-07

## Completed
- All HTML template conversions to Next.js (homepage, login, register, dashboard, map, about, how-it-works, what-is pages, contact, FAQ, policies, directory, messaging, videochat)
- Auth-aware navbar (logged in vs logged out states)
- Layout: Navbar, Footer, accent bar, Poppins font
- Homepage: HeroBanner, AuthHeader, LiveChatSidebar, HomeMap with Strapi company data
- Messaging: Contacts list + chat window with real conversations, unread counts
- Backend: Strapi v5 with PostgreSQL

## User Types Refactoring — Phases 1-6 (mostly done)

### What changed:
- **Old:** 3 separate Strapi collection types (company, investor, expert) + 3 registration forms + 3 route pages
- **New:** 1 unified `user-profile` collection type + 1 dynamic registration form at `/register`

### Backend:
- Old collection types deleted (company, investor, expert) — schemas, controllers, routes, services, DB tables all gone
- New `user-profile` collection type with 28+ fields (common + type-specific) + `owner` relation to User + `logo` media field
- Custom API endpoint: `/api/custom-auth/register` — handles user creation + profile creation in one request
- XSS sanitization on all string inputs
- `user_type` lives on User model only — directory queries filter via `owner.user_type`

### Frontend (Phase 6 — rewired):
- `UserProfile` type replaces old `Company` interface (`Company` kept as alias)
- All API calls updated: `/companies` → `/user-profiles` with `filters[owner][user_type][$eq]=company`
- Directory filters: search + area_of_specification + continent (removed industry + employee_count)
- Map: uses `COUNTRY_COORDS` lookup table instead of lat/lng fields (country-level positioning)
- Detail page shows: headquarters, branches, founded year, partners, contact person
- `AREA_LABELS` replaces `INDUSTRY_LABELS`
- `COUNTRY_COORDS` (197 countries) replaces lat/lng fields

### DB cleanup done:
- Truncated 9801 companies, 1 investor, 1 expert
- Deleted 4 test user accounts
- Removed 9 duplicate subscription plans (kept original 9)
- All old tables dropped

## In Progress
- Remaining Phase 6 items: messaging profile data, dashboard verification

## Known Incomplete
- File upload fields (revenue data, CV, investment policies) are visible in form but don't upload yet
- Logo media field added to user-profile in Strapi admin but upload not wired in registration form yet

## Recent Changes (2026-04-07)
- Rewired directory components (CompanyCard, CompanyList, CompanyFilters) to user-profiles API
- Rewired map components (WorldMap, HomeMap, CompanyMap) to user-profiles API with country coords
- Updated directory detail page with new fields (headquarters, branches, founded, partners)
- Replaced lat/lng with COUNTRY_COORDS lookup table (197 countries)
- TypeScript builds cleanly with no errors
