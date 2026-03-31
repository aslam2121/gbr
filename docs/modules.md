# Module System — Architecture & Guide

> This doc is written for someone using vibe coding (Claude Code, Cursor, etc.) to extend the platform. Give your AI this file as context and it will know how everything connects.

---

## Architecture Overview

Every feature in this platform is a **self-contained module** with three layers:

```
STRAPI (Data Layer)              MODULES (UI Layer)              APP (Route Layer)
backend/src/api/company/    →    frontend/src/modules/directory/  →   frontend/src/app/directory/
  content-types/schema.json        CompanyCard.tsx                      page.tsx
  controllers/company.ts           CompanyList.tsx                      [slug]/page.tsx
  services/company.ts              CompanyFilters.tsx
  routes/company.ts                index.ts (barrel export)
```

### Rules

1. **Pages are thin** — `/app/` route files only import from `/modules/` and call `/lib/`. No business logic in page files.
2. **Modules export via `index.ts`** — every module folder has a barrel file. Pages import from the barrel, never from internal files.
3. **All Strapi calls go through `lib/strapi.ts`** — no raw fetch/axios in components.
4. **Server components by default** — add `"use client"` only when the component needs hooks or interactivity.
5. **To disable a module** — delete its page route from `/app/`. That's it. The module folder and Strapi content type can stay dormant.

### How Data Flows

```
User visits /directory
    ↓
/app/directory/page.tsx (server component)
    ↓
calls strapiGet<Company[]>("/companies") from lib/strapi.ts
    ↓
passes data as props to <CompanyList /> from modules/directory/
    ↓
CompanyList renders <CompanyCard /> for each company
```

For client-side interactivity (filters, forms, real-time):

```
<CompanyFilters />  ← "use client", reads/writes URL query params
    ↓
URL changes trigger re-fetch via useEffect + strapiGet()
    ↓
re-renders <CompanyCard /> components
```

---

## Current Modules

| Module | Strapi Content Type | Frontend Module | Route(s) | Status | Removable? |
|--------|-------------------|-----------------|-----------|--------|------------|
| **Auth** | `users-permissions` (extended) | `/modules/auth/` | `/login`, `/register/*` | Working | NO — core |
| **Dashboard** | — | `/modules/dashboard/` | `/dashboard/*` | Working | NO — core |
| **Company Directory** | `company` | `/modules/directory/` | `/directory`, `/directory/[slug]` | Working | YES |
| **World Map** | uses `company` data | `/modules/map/` | `/map` | Working | YES |
| **Video/Voice Calls** | `call-room` | `/modules/calls/` | `/calls`, `/calls/[roomId]` | Needs Daily.co API key | YES |
| **Pricing** | `subscription-plan` | `/modules/pricing/` | `/pricing` | Needs Stripe keys | YES |
| **CMS Page Sections** | `page-section` | `/modules/cms-sections/` | Homepage (any page) | Working | YES (hardcode pages instead) |

### Module Dependencies

```
auth (core — required by everything)
├── dashboard (core — user settings, profile, subscription)
│
├── directory (standalone — fetches company data from Strapi)
│   └── map (depends on company data from directory's Strapi content type)
│
├── calls (depends on: auth for room creation, Daily.co for WebRTC)
│
├── pricing (depends on: auth for checkout, Stripe for payments)
│
└── cms-sections (standalone — fetches page-section data from Strapi)
    ├── Navbar (global — appears on all pages except /dashboard/*)
    └── Footer (global — appears on all pages)
```

### Module File Inventory

<details>
<summary><strong>auth/</strong> — 8 components</summary>

| File | Purpose |
|------|---------|
| `AuthProvider.tsx` | SessionProvider wrapper for NextAuth |
| `AuthLayout.tsx` | Shared layout for login/register pages, exports SubmitButton, ErrorAlert |
| `LoginForm.tsx` | Email + password login form |
| `CompanyRegisterForm.tsx` | Company registration (name, industry, country, etc.) |
| `InvestorRegisterForm.tsx` | Investor registration |
| `ExpertRegisterForm.tsx` | Expert registration |
| `FormField.tsx` | Reusable form field components (Input, Select, Textarea) |
| `MultiSelect.tsx` | Multi-select dropdown for array fields |

</details>

<details>
<summary><strong>dashboard/</strong> — 3 components</summary>

| File | Purpose |
|------|---------|
| `DashboardLayout.tsx` | Sidebar nav with role-based items, mobile responsive |
| `ProfileEditor.tsx` | Avatar upload, display name edit, Strapi API update |
| `SubscriptionManager.tsx` | Current plan, usage stats, cancel subscription modal |

</details>

<details>
<summary><strong>directory/</strong> — 4 components</summary>

| File | Purpose |
|------|---------|
| `CompanyCard.tsx` | Card with logo/initial, badges, skeleton variant |
| `CompanyList.tsx` | Paginated grid, fetches on filter/page change |
| `CompanyFilters.tsx` | URL query param-based filters (search, industry, continent, size) |
| `CompanyMap.tsx` | Single-company Leaflet map for detail page |

</details>

<details>
<summary><strong>map/</strong> — 3 components</summary>

| File | Purpose |
|------|---------|
| `WorldMap.tsx` | Full-page Leaflet map, groups companies by country, search overlay |
| `MapMarker.tsx` | Custom DivIcon markers, continent color-coded, sized by count |
| `CountryPopup.tsx` | Country flag, company count, links to directory |

</details>

<details>
<summary><strong>calls/</strong> — 3 components</summary>

| File | Purpose |
|------|---------|
| `CallLobby.tsx` | Camera preview, video/voice toggle, create/join room |
| `VideoCall.tsx` | DailyProvider wrapper, video grid with participant tiles |
| `CallControls.tsx` | Mic, camera, screen share, end call, timer |

</details>

<details>
<summary><strong>pricing/</strong> — 2 components</summary>

| File | Purpose |
|------|---------|
| `PlanCard.tsx` | Price display, feature checkmarks, popular badge, CTA |
| `PricingGrid.tsx` | User type tabs, monthly/yearly toggle, comparison table |

</details>

<details>
<summary><strong>cms-sections/</strong> — 8 components</summary>

| File | Purpose |
|------|---------|
| `Navbar.tsx` | Global sticky dark navbar, auth-aware, mobile hamburger |
| `Footer.tsx` | 4-column footer with links, social icons, copyright |
| `SectionRenderer.tsx` | Maps section_type string → React component |
| `HeroSection.tsx` | Full-width hero with gradient overlay, dual CTA |
| `FeatureGrid.tsx` | 3-column feature cards with icons |
| `StatsSection.tsx` | 4-column stats from metadata |
| `TestimonialSlider.tsx` | Carousel with dots nav, quote cards |
| `CTABanner.tsx` | Blue banner with white CTA button |
| `TextBlock.tsx` | Rich text via dangerouslySetInnerHTML |

</details>

---

## How to Add a New Module

Full walkthrough using a **Blog** module as an example.

### Step 1 — Create the Strapi Content Type

Option A: Create it manually in Strapi Admin → Content-Type Builder.

Option B: Create the schema file directly:

```
backend/src/api/blog-post/
├── content-types/blog-post/schema.json
├── controllers/blog-post.ts
├── services/blog-post.ts
└── routes/blog-post.ts
```

**`schema.json`:**
```json
{
  "kind": "collectionType",
  "collectionName": "blog_posts",
  "info": {
    "singularName": "blog-post",
    "pluralName": "blog-posts",
    "displayName": "Blog Post"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "title": { "type": "string", "required": true },
    "slug": { "type": "uid", "targetField": "title" },
    "content": { "type": "richtext" },
    "cover_image": { "type": "media", "allowedTypes": ["images"] },
    "author": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "tags": { "type": "json" }
  }
}
```

**`controllers/blog-post.ts`:**
```typescript
import { factories } from "@strapi/strapi";
export default factories.createCoreController("api::blog-post.blog-post");
```

**`services/blog-post.ts`:**
```typescript
import { factories } from "@strapi/strapi";
export default factories.createCoreService("api::blog-post.blog-post");
```

**`routes/blog-post.ts`:**
```typescript
import { factories } from "@strapi/strapi";
export default factories.createCoreRouter("api::blog-post.blog-post");
```

After restart, go to **Strapi Admin → Settings → Users & Permissions → Roles → Public** and enable `find` and `findOne` for Blog Post.

### Step 2 — Create TypeScript Types

**`frontend/src/types/blog.ts`:**
```typescript
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  cover_image?: { url: string };
  tags: string[];
  publishedAt: string;
}
```

### Step 3 — Create the Frontend Module

```
frontend/src/modules/blog/
├── BlogCard.tsx
├── BlogList.tsx
├── BlogPost.tsx
└── index.ts
```

**`index.ts`** (barrel export — required):
```typescript
export { BlogCard } from "./BlogCard";
export { BlogList } from "./BlogList";
export { BlogPost } from "./BlogPost";
```

**`BlogCard.tsx`:**
```tsx
import Link from "next/link";
import { type BlogPost } from "@/types/blog";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
        {post.title}
      </h3>
      <p className="mt-2 text-sm text-gray-500 line-clamp-2">
        {post.content?.replace(/<[^>]*>/g, "").slice(0, 150)}...
      </p>
    </Link>
  );
}
```

### Step 4 — Create Page Routes

**`frontend/src/app/blog/page.tsx`** (server component):
```tsx
import { strapiGet } from "@/lib/strapi";
import { type BlogPost } from "@/types/blog";
import { BlogList } from "@/modules/blog";

export const metadata = { title: "Blog — GBR Platform" };

export default async function BlogPage() {
  const { data } = await strapiGet<BlogPost[]>("/blog-posts", {
    sort: "publishedAt:desc",
    "pagination[pageSize]": "12",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
      <BlogList posts={data} />
    </div>
  );
}
```

**`frontend/src/app/blog/[slug]/page.tsx`:**
```tsx
import { strapiGet } from "@/lib/strapi";
import { type BlogPost } from "@/types/blog";
import { BlogPost as BlogPostView } from "@/modules/blog";
import { notFound } from "next/navigation";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { data } = await strapiGet<BlogPost[]>("/blog-posts", {
    "filters[slug][$eq]": params.slug,
  });

  if (!data?.[0]) notFound();

  return <BlogPostView post={data[0]} />;
}
```

### Step 5 — Add to Navigation

**`frontend/src/modules/cms-sections/Navbar.tsx`** — add to the `NAV_LINKS` array:

```typescript
const NAV_LINKS = [
  { label: "Directory", href: "/directory" },
  { label: "Map", href: "/map" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },        // ← add this
];
```

### Step 6 — Add to Dashboard Sidebar (Optional)

If users need to manage their blog posts from the dashboard, add to `DashboardLayout.tsx`:

```typescript
// In the NAV_ITEMS array, add a role-gated item:
{ label: "My Posts", href: "/dashboard/blog", icon: /* pencil svg */, roles: ["company", "expert"] },
```

Then create `frontend/src/app/dashboard/blog/page.tsx` to render the management UI.

### Step 7 — Add to Footer (Optional)

In `Footer.tsx`, add to the `PLATFORM_LINKS` array:

```typescript
{ label: "Blog", href: "/blog" },
```

### Done!

Your new module is now:
- Serving data from Strapi at `/api/blog-posts`
- Rendering at `/blog` and `/blog/[slug]`
- Linked in the navbar and footer
- Optionally manageable from the dashboard

---

## How to Remove a Module

Example: Removing the **World Map** module.

### Required (2 steps)

1. **Delete the page route:**
   ```bash
   rm -rf frontend/src/app/map/
   ```

2. **Remove from navigation** — delete `{ label: "Map", href: "/map" }` from:
   - `frontend/src/modules/cms-sections/Navbar.tsx` → `NAV_LINKS` array
   - `frontend/src/modules/cms-sections/Footer.tsx` → `PLATFORM_LINKS` array (if listed)

That's it. The module is now unreachable. Everything else is optional cleanup.

### Optional Cleanup

3. **Delete the module folder:**
   ```bash
   rm -rf frontend/src/modules/map/
   ```

4. **Remove unused npm dependencies:**
   ```bash
   cd frontend && npm uninstall leaflet react-leaflet @types/leaflet
   ```

5. **Delete the Strapi content type** (only if the module has its own — map shares `company` data):
   ```bash
   rm -rf backend/src/api/call-room/   # example for calls module
   ```

### What NOT to Delete

- `lib/strapi.ts`, `lib/auth.ts` — shared by all modules
- `hooks/useAuth.ts` — shared by all modules
- `types/` files that other modules import from
- The `auth` or `dashboard` modules — they're core, everything depends on them

---

## Adding CMS Page Sections

The homepage and landing pages are assembled from `page-section` entries in Strapi. To add a new section type:

1. **Add the enum value** to the `section_type` field in Strapi Admin (Content-Type Builder → Page Section → section_type → add value)

2. **Create the component** in `/frontend/src/modules/cms-sections/`:
   ```tsx
   // PartnerLogos.tsx
   import { type PageSection } from "@/types/page-section";

   export function PartnerLogos({ section }: { section: PageSection }) {
     const logos = section.metadata?.logos ?? [];
     return (
       <section className="py-16">
         {/* render logos */}
       </section>
     );
   }
   ```

3. **Register in `SectionRenderer.tsx`:**
   ```typescript
   import { PartnerLogos } from "./PartnerLogos";

   const SECTION_MAP = {
     hero: HeroSection,
     feature_grid: FeatureGrid,
     // ...existing entries...
     partner_logos: PartnerLogos,  // ← add here
   };
   ```

4. **Export from `index.ts`:**
   ```typescript
   export { PartnerLogos } from "./PartnerLogos";
   ```

5. **Create content in Strapi Admin** — add a new Page Section entry with `section_type: "partner_logos"`, set the page and order.

### Current Section Types

| Type | Component | Description |
|------|-----------|-------------|
| `hero` | HeroSection | Full-width hero with gradient, background image, dual CTA |
| `feature_grid` | FeatureGrid | 3-column feature cards with icons (`metadata.features` array) |
| `stats` | StatsSection | 4-column stats counter (`metadata.stats` array) |
| `testimonial` | TestimonialSlider | Carousel of quote cards (`metadata.testimonials` array) |
| `cta_banner` | CTABanner | Blue full-width banner with CTA button |
| `text_block` | TextBlock | Rich text content block |

---

## Shared Infrastructure

These files are **not modules** — they're shared utilities used by all modules.

### `/frontend/src/lib/`

| File | What It Does | Key Exports |
|------|-------------|-------------|
| `strapi.ts` | Axios-based Strapi API client | `strapiGet<T>()`, `strapiPost<T>()`, `strapiPut<T>()` |
| `auth.ts` | NextAuth.js configuration | `authOptions`, `getServerSession()` |
| `stripe.ts` | Stripe SDK singleton | `stripe` |
| `daily.ts` | Daily.co room/token management | `createDailyRoom()`, `createDailyToken()`, `deleteDailyRoom()` |

### `/frontend/src/hooks/`

| File | What It Does | Key Exports |
|------|-------------|-------------|
| `useAuth.ts` | Auth state + role helpers | `useAuth()` → `{ user, isLoggedIn(), isCompany(), isInvestor(), isExpert() }` |

### `/frontend/src/types/`

| File | Types Defined |
|------|--------------|
| `company.ts` | `Company`, `INDUSTRY_LABELS`, `CONTINENT_LABELS`, `EMPLOYEE_COUNT_LABELS`, `countryFlag()` |
| `subscription.ts` | `SubscriptionPlan` |
| `page-section.ts` | `PageSection`, `SectionType`, `FeatureItem`, `TestimonialItem`, `StatItem` |

---

## API Routes

These are Next.js API routes in `/frontend/src/app/api/`:

| Route | Method | Auth Required | Purpose |
|-------|--------|---------------|---------|
| `/api/auth/[...nextauth]` | GET/POST | — | NextAuth.js handler |
| `/api/calls/create-room` | POST | Yes | Creates Daily.co room + Strapi record |
| `/api/stripe/create-checkout` | POST | Yes | Creates Stripe Checkout Session |
| `/api/stripe/webhook` | POST | No (Stripe signature) | Handles subscription lifecycle events |

---

## Environment Variables Reference

### Frontend (`frontend/.env.local`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_STRAPI_URL` | Yes | Strapi backend URL (public, exposed to browser) | `http://localhost:1337` |
| `NEXTAUTH_URL` | Yes | Next.js app URL for NextAuth callbacks | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Yes | Encryption key for JWT sessions (generate with `openssl rand -base64 32`) | Random string |
| `STRAPI_API_TOKEN` | Yes | Strapi API token for server-side calls (create in Strapi Admin → Settings → API Tokens) | `50878c9d...` |
| `STRIPE_SECRET_KEY` | For payments | Stripe secret key (starts with `sk_test_` or `sk_live_`) | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | For payments | Stripe webhook signing secret (starts with `whsec_`) | `whsec_...` |
| `DAILY_API_KEY` | For calls | Daily.co API key for video/voice calls | `abc123...` |

### Backend (`backend/.env`)

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `HOST` | Yes | Server bind address | `0.0.0.0` |
| `PORT` | Yes | Server port | `1337` |
| `APP_KEYS` | Yes | Strapi application keys (comma-separated base64) | Auto-generated |
| `API_TOKEN_SALT` | Yes | Salt for API token hashing | Auto-generated |
| `ADMIN_JWT_SECRET` | Yes | Admin panel JWT secret | Auto-generated |
| `TRANSFER_TOKEN_SALT` | Yes | Salt for transfer tokens | Auto-generated |
| `ENCRYPTION_KEY` | Yes | Data encryption key | Auto-generated |
| `JWT_SECRET` | Yes | User JWT secret | Auto-generated |
| `DATABASE_CLIENT` | Yes | Database type | `postgres` |
| `DATABASE_HOST` | Yes | Database host | `localhost` |
| `DATABASE_PORT` | Yes | Database port | `5433` |
| `DATABASE_NAME` | Yes | Database name | `strapi` |
| `DATABASE_USERNAME` | Yes | Database user | `strapi` |
| `DATABASE_PASSWORD` | Yes | Database password | `strapi` |
| `DATABASE_SSL` | Yes | Enable SSL for database | `false` |

### Getting API Keys

| Service | Where to Get It |
|---------|----------------|
| **Stripe** | [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) — use test mode keys for development |
| **Daily.co** | [dashboard.daily.co/developers](https://dashboard.daily.co/developers) — free tier includes 2,000 participant minutes/month |
| **Strapi API Token** | Strapi Admin → Settings → API Tokens → Create new token (Full access) |

---

## Module Communication Rules

Modules should **not** import from each other. Use these patterns instead:

```
GOOD:  import { CompanyCard } from "@/modules/directory";     ← inside /app/directory/ page
BAD:   import { CompanyCard } from "@/modules/directory";     ← inside /modules/map/ component
GOOD:  <Link href="/directory/company-slug">View</Link>       ← cross-module navigation
GOOD:  import { strapiGet } from "@/lib/strapi";              ← shared utility, fine anywhere
GOOD:  import { useAuth } from "@/hooks/useAuth";             ← shared hook, fine anywhere
GOOD:  import { type Company } from "@/types/company";        ← shared type, fine anywhere
```

If two modules need the same UI component, move it to a shared location (`/frontend/src/components/`) rather than importing across module boundaries.

---

## Quick Reference: Key File Locations

```
frontend/src/
├── app/                         ← Route pages only. No business logic.
│   ├── layout.tsx               ← Root layout: AuthProvider + Navbar + Footer
│   ├── page.tsx                 ← Homepage (CMS-driven)
│   ├── (auth)/                  ← Auth routes (login, register)
│   ├── dashboard/               ← Protected routes (layout checks session)
│   ├── directory/               ← Company listing + detail
│   ├── map/                     ← World map
│   ├── pricing/                 ← Subscription plans
│   ├── calls/                   ← Video/voice calls
│   └── api/                     ← API routes (auth, stripe, calls)
├── modules/                     ← Feature UI. All components live here.
│   ├── auth/                    ← Login, register forms, auth provider
│   ├── dashboard/               ← Dashboard layout, profile, subscription
│   ├── directory/               ← Company cards, list, filters, map
│   ├── map/                     ← World map, markers, popups
│   ├── calls/                   ← Call lobby, video call, controls
│   ├── pricing/                 ← Plan cards, pricing grid
│   └── cms-sections/            ← Navbar, Footer, CMS section components
├── lib/                         ← Shared utilities (strapi, auth, stripe, daily)
├── hooks/                       ← Custom React hooks (useAuth)
└── types/                       ← TypeScript interfaces
```
