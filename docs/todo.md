# TODO

> Last updated: 2026-04-04

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

### Phase 4: Update frontend types and auth — PARTIAL
- [ ] Update frontend/src/types/company.ts — replace with unified UserProfile type
- [x] frontend/src/types/next-auth.d.ts — exported UserType
- [ ] Update frontend/src/lib/auth.ts if needed

### Phase 5: Replace registration forms — DONE (2026-04-04)
- [x] Created DynamicRegisterForm.tsx with user_type dropdown
- [x] Uses strapiRegister() from lib/strapi.ts
- [x] Deleted 3 old forms + 3 old route pages
- [x] Updated barrel export

### Phase 6: Rewire dependent features — PENDING
- [ ] Dashboard: DashboardLayout.tsx, dashboard/page.tsx, SubscriptionManager.tsx
- [ ] Messaging: MessagingApp.tsx, NewConversationModal.tsx, ConversationList.tsx, ChatWindow.tsx, LiveChatSidebar.tsx
- [ ] API routes: messaging/route.ts, messaging/users/route.ts
- [ ] Directory: CompanyCard.tsx, CompanyList.tsx, CompanyFilters.tsx, CompanyMap.tsx
- [ ] Hooks: useAuth.ts (isCompany/isInvestor/isExpert helpers)
- [ ] Subscription: subscription.ts type
- [ ] Static pages: what-is/*, faq, pricing, about (content references)

## Backend Integration
- (list items as they come up)

## Frontend Features
- [ ] File upload integration for revenue data, CV, investment policies fields

## Bug Fixes
- (list items as they come up)
