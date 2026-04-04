# Decisions

> Architecture and design decisions made during development

## Template Conversion
- **No CMS for page content** — HTML templates are converted exactly as-is to Next.js components, no Strapi-driven content for static pages
- **Tailwind CSS only** — No CSS modules or styled-components
- **Server components by default** — `"use client"` only when needed for hooks/interactivity

## Auth
- Strapi Users & Permissions + NextAuth.js
- Three user types: Company, Investor, Expert (separate registration flows)
- Protected routes check auth in layout, redirect to `/login`

## Architecture
- Module pattern: each feature is self-contained (Strapi content type + frontend module + page route)
- All Strapi calls go through `lib/strapi.ts`
- Business logic never in page files — pages only import from `/modules/` and call `/lib/`

## User Types Refactoring (2026-04-04) — PENDING APPROVAL

### Decision: Replace 3 separate collection types with 1 "user-profile" collection type
- Currently: company, investor, expert are 3 separate Strapi collection types + 3 separate registration forms
- Proposed: Single `user-profile` collection type with common fields + type-prefixed specific fields
- The `user_type` enum on User model stays as-is (company/investor/expert)
- Dynamic registration form replaces 3 separate forms — shows/hides fields based on selected type

### Why:
- ~60% of fields are shared across types (continent, person name, email, phone, description, membership)
- Company and Investor share even more (~80% overlap)
- Reduces 43 affected files significantly
- Enables a single dynamic registration form
- Simpler API queries and type definitions

### New Field Structure (from user's txt files):

**Common fields (all types):**
- continent (enum/checkbox)
- person_name (text)
- email (email)
- telephone (text)
- description (richtext)
- membership_duration (enum: 1yr/2yr/3yr)

**Company + Investor shared:**
- company_name (text)
- foundation_year (number)
- country (enum/dropdown)
- hq_location (text)
- branch_locations (text)

**Company only:**
- company_industry (enum: Health, Financial Services, IT, Consumer Products, Logistics, Business Products, Construction, Trading, Manufacturing, Advertising, Agriculture)
- company_revenue_data (media)
- company_partnership_requirements (richtext)
- company_existing_partners (text)

**Investor only:**
- investor_type (enum: Private Equity, Venture Capital, Private Investors, Angel Investors, Business Lenders)
- investor_policies (richtext + media)
- investor_eligibility_criteria (richtext)

**Expert only:**
- expert_dob (date)
- expert_field (enum: Economics, Politics, Law)
- expert_specialisation (text)
- expert_years_experience (number)
- expert_work_experience (richtext)
- expert_cv (media)
- expert_fee (decimal)
