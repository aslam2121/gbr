# Current State

> Last updated: 2026-04-04

## Completed
- All HTML template conversions to Next.js (homepage, login, register, dashboard, map, about, how-it-works, what-is pages, contact, FAQ, policies, directory, messaging, videochat)
- Auth-aware navbar (logged in vs logged out states)
- Layout: Navbar, Footer, accent bar, Poppins font
- Homepage: HeroBanner, AuthHeader, LiveChatSidebar, HomeMap with Strapi company data
- Messaging: Contacts list + chat window with real conversations, unread counts
- Backend: Strapi v5 with PostgreSQL

## In Progress
- **User Types Refactoring** — Phase 1 complete. Old types deleted. Next: create unified `user-profile` collection type in Strapi admin.

## Old User Types — DELETED (2026-04-04)
- 3 Strapi collection types deleted (company, investor, expert)
- 3 API folders auto-removed by Strapi
- 4 DB tables dropped
- Frontend still has old registration forms and type references (to be rewired in later phases)
- User model `user_type` enum field ["company", "investor", "expert"] stays

## Files Affected by User Type Refactoring
See docs/todo.md for the complete file list organized by phase.

## Recent Changes
- Fixed unread count by querying per-conversation instead of deep $or filter
- Fixed notifications not clearing after reading messages
- Activated homepage messaging sidebar with real conversations
- Mark messages as read when conversation is opened
- Removed map border and constrained panning to world bounds
