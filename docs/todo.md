# TODO

> Last updated: 2026-04-07

## User Types Refactoring (ACTIVE)

### Phase 1: Delete old user types from Strapi — DONE (2026-04-04)
- [x] Truncated all data via SQL (9801 companies, 1 investor, 1 expert)
- [x] Deleted company, investor, expert collection types from Strapi admin
- [x] Strapi auto-deleted backend API folders and DB tables

### Phase 2: Create unified "user-profile" in Strapi admin — DONE (2026-04-04)
- [x] Created user-profile collection type with 28 fields
- [x] Relation: oneToOne to users-permissions.user (field: owner)
- [x] Fixed continent typo, added missing investment_policies field
- [x] Permissions configured (Authenticated: all, Public: find + findOne + register)

### Phase 3: Backend registration logic — DONE (2026-04-04)
- [x] Created /api/custom-auth/register endpoint (bypasses Strapi validation)
- [x] Handles user creation + profile creation in one request
- [x] XSS sanitization on all string inputs
- [x] Simplified strapi-server.js

### Phase 4: Update frontend types and auth — DONE (2026-04-07)
- [x] Replaced Company interface with UserProfile type in types/company.ts
- [x] Added Company as alias for backward compatibility
- [x] Added AREA_LABELS (replaces INDUSTRY_LABELS), COUNTRY_COORDS lookup
- [x] Removed EMPLOYEE_COUNT_LABELS, INDUSTRY_LABELS (no longer needed)
- [x] frontend/src/types/next-auth.d.ts — exported UserType (already done)
- [x] frontend/src/lib/auth.ts — no changes needed (already uses user_type from User model)

### Phase 5: Replace registration forms — DONE (2026-04-04)
- [x] Created DynamicRegisterForm.tsx with user_type dropdown
- [x] Uses strapiRegister() from lib/strapi.ts
- [x] Deleted 3 old forms + 3 old route pages
- [x] Updated barrel export

### Phase 6: Rewire dependent features — PARTIAL (2026-04-07)
- [x] Directory: CompanyCard, CompanyList, CompanyFilters — updated to /user-profiles API, area_of_specification filter
- [x] Directory detail: [slug]/page.tsx — updated API, shows headquarters/branches/founded/partners
- [x] Map: WorldMap, HomeMap — updated to /user-profiles API with owner.user_type filter
- [x] Map: CompanyMap — uses COUNTRY_COORDS lookup instead of lat/lng
- [x] Hooks: useAuth.ts — already works (uses user_type from session)
- [ ] Dashboard: DashboardLayout.tsx — already works (uses user_type from session)
- [ ] Messaging: MessagingApp.tsx, ConversationList.tsx — uses string labels only, may need profile data
- [ ] API routes: messaging/route.ts, messaging/users/route.ts — check if referencing old types
- [ ] Subscription: subscription.ts type — already correct (uses user_type enum)

## Backend Integration
- (list items as they come up)

## Frontend Features
- [ ] File upload integration for revenue data, CV, investment policies fields
- [ ] Logo field added to user-profile via Strapi admin (2026-04-07)

## Bug Fixes
- (list items as they come up)
