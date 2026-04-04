# TODO

> Last updated: 2026-04-04

## User Types Refactoring (ACTIVE)

### Phase 1: Delete old user types from Strapi — DONE (2026-04-04)
- [x] Truncated all data via SQL (9801 companies, 1 investor, 1 expert)
- [x] Deleted `company` collection type from Strapi admin
- [x] Deleted `investor` collection type from Strapi admin
- [x] Deleted `expert` collection type from Strapi admin
- [x] Strapi auto-deleted backend/src/api/company/, investor/, expert/ folders
- [x] DB tables dropped automatically (companies, companies_owner_lnk, investors, experts)

### Phase 2: Create new unified "user-profile" in Strapi admin — DONE (2026-04-04)
- [x] Created `user-profile` collection type with 28 fields via Strapi admin
- [x] Relation: oneToOne to users-permissions.user (field: users_permissions_user)
- [x] Fixed "Africa," typo in continent enum
- [x] Added missing investment_policies text field
- [ ] Configure permissions (Authenticated: all, Public: find + findOne) — PENDING

### Phase 3: Update backend registration logic — DONE (2026-04-04)
- [x] Updated strapi-server.js to create unified user-profile on registration
- [x] Preserves originalBody before Strapi strips non-user fields
- [x] Picks all profile fields (common + type-specific) from original request body
- [x] Creates user-profile with owner relation to newly created user

### Phase 4: Update frontend types and auth — PARTIAL
- [ ] Update frontend/src/types/ — replace Company/Investor/Expert types with unified UserProfile type
- [x] frontend/src/types/next-auth.d.ts — UserType enum stays same, no change needed
- [ ] Update frontend/src/lib/auth.ts if needed

### Phase 5: Replace registration forms — DONE (2026-04-04)
- [x] Deleted CompanyRegisterForm.tsx, InvestorRegisterForm.tsx, ExpertRegisterForm.tsx
- [x] Created DynamicRegisterForm.tsx — single form with user_type dropdown, shows/hides sections
- [x] Replaced /register page to use DynamicRegisterForm directly (no more card selection)
- [x] Deleted /register/company, /register/investor, /register/expert sub-routes
- [x] Updated modules/auth/index.ts barrel export

### Phase 6: Rewire all dependent features (43 files total)
- [ ] Dashboard: DashboardLayout.tsx, dashboard/page.tsx, SubscriptionManager.tsx
- [ ] Messaging: MessagingApp.tsx, NewConversationModal.tsx, ConversationList.tsx, ChatWindow.tsx, LiveChatSidebar.tsx
- [ ] API routes: messaging/route.ts, messaging/users/route.ts
- [ ] Directory: CompanyCard.tsx, CompanyList.tsx, CompanyFilters.tsx, CompanyMap.tsx (may become generic profile directory)
- [ ] Hooks: useAuth.ts (isCompany/isInvestor/isExpert helpers)
- [ ] Subscription: subscription.ts type
- [ ] Static pages: what-is/*, faq, pricing, about (content references)

## Backend Integration
- (list items as they come up)

## Frontend Features
- (list items as they come up)

## Bug Fixes
- (list items as they come up)
