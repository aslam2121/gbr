# Current State

> Last updated: 2026-04-04

## Completed
- All HTML template conversions to Next.js (homepage, login, register, dashboard, map, about, how-it-works, what-is pages, contact, FAQ, policies, directory, messaging, videochat)
- Auth-aware navbar (logged in vs logged out states)
- Layout: Navbar, Footer, accent bar, Poppins font
- Homepage: HeroBanner, AuthHeader, LiveChatSidebar, HomeMap with Strapi company data
- Messaging: Contacts list + chat window with real conversations, unread counts
- Backend: Strapi v5 with PostgreSQL

## User Types Refactoring — Phases 1-5 DONE

### What changed:
- **Old:** 3 separate Strapi collection types (company, investor, expert) + 3 registration forms + 3 route pages
- **New:** 1 unified `user-profile` collection type + 1 dynamic registration form at `/register`

### Backend:
- Old collection types deleted (company, investor, expert) — schemas, controllers, routes, services, DB tables all gone
- New `user-profile` collection type with 28 fields (common + type-specific) + `owner` relation to User
- Custom API endpoint: `/api/custom-auth/register` — handles user creation + profile creation in one request
- XSS sanitization on all string inputs
- `strapi-server.js` simplified — redirects typed registrations to custom endpoint
- Relation field renamed from `users_permissions_user` to `owner`
- Permissions: Authenticated (all), Public (find, findOne, register)

### Frontend:
- `DynamicRegisterForm.tsx` — single form with user_type dropdown, shows/hides type-specific sections
- Desktop: radio buttons for continent, expertise, membership | Mobile: dropdowns
- Registration calls `strapiRegister()` from `lib/strapi.ts` (not raw axios)
- `UserType` exported from `types/next-auth.d.ts` and used across codebase
- Old forms deleted: CompanyRegisterForm, InvestorRegisterForm, ExpertRegisterForm
- Old routes deleted: /register/company, /register/investor, /register/expert

### DB cleanup done:
- Truncated 9801 companies, 1 investor, 1 expert
- Deleted 4 test user accounts
- Removed 9 duplicate subscription plans (kept original 9)
- All old tables dropped

## In Progress
- **Phase 6:** Rewiring dependent features (dashboard, messaging, directory, hooks, types) to work with unified user-profile

## Known Incomplete
- File upload fields (revenue data, CV, investment policies) are visible in form but don't upload yet
- Frontend type definitions still have old Company interface in `types/company.ts`

## Recent Changes
- Fixed unread count by querying per-conversation instead of deep $or filter
- Fixed notifications not clearing after reading messages
- Activated homepage messaging sidebar with real conversations
- Mark messages as read when conversation is opened
- Removed map border and constrained panning to world bounds
