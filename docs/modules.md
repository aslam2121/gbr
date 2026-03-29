# Module System — Architecture & Guide

## How Modules Work

This project follows a strict module pattern. Each feature is isolated into its own module, making it possible to add, remove, or replace features without touching unrelated code.

A complete module consists of three layers:

```
STRAPI (Data Layer)              MODULES (UI Layer)              APP (Route Layer)
backend/src/api/company/    →    frontend/src/modules/directory/  →   frontend/src/app/directory/
  content-types/schema.json        CompanyCard.tsx                      page.tsx
  controllers/company.js           CompanyList.tsx                      [slug]/page.tsx
  services/company.js              CompanyFilters.tsx
  routes/company.js                index.ts
```

## Current Modules

| Module | Strapi Content Type | Frontend Module | Route | Removable? |
|--------|-------------------|-----------------|-------|-----------|
| Auth | users-permissions (extended) | `/modules/auth/` | `/login`, `/register/*` | NO — core |
| Dashboard | — | `/modules/dashboard/` | `/dashboard/*` | NO — core |
| Company Directory | `company` | `/modules/directory/` | `/directory/*` | YES |
| World Map | uses `company` data | `/modules/map/` | `/map` | YES |
| Video/Voice Calls | `call-room` | `/modules/calls/` | `/calls/*` | YES |
| Subscription Plans | `subscription-plan` | `/modules/pricing/` | `/pricing` | YES |
| CMS Page Sections | `page-section` | `/modules/cms-sections/` | homepage + any page | YES (hardcode pages instead) |

## Module Dependencies

```
auth (core)
├── dashboard (core)
│   ├── directory (standalone)
│   ├── map (depends on: company data from directory)
│   ├── calls (depends on: daily.co, auth)
│   ├── pricing (depends on: stripe, auth)
│   └── cms-sections (standalone)
```

## How to Add a New Module

Example: Adding a "Blog" module.

### Step 1 — Strapi Content Type

Create `/backend/src/api/blog-post/content-types/blog-post/schema.json`:
```json
{
  "kind": "collectionType",
  "collectionName": "blog_posts",
  "info": {
    "singularName": "blog-post",
    "pluralName": "blog-posts",
    "displayName": "Blog Post"
  },
  "attributes": {
    "title": { "type": "string", "required": true },
    "slug": { "type": "uid", "targetField": "title" },
    "content": { "type": "richtext" },
    "cover_image": { "type": "media", "allowedTypes": ["images"] },
    "author": { "type": "relation", "relation": "manyToOne", "target": "plugin::users-permissions.user" },
    "published_at": { "type": "datetime" },
    "tags": { "type": "json" }
  }
}
```

Create controller, service, routes files following the pattern of existing modules.

### Step 2 — Frontend Module

Create `/frontend/src/modules/blog/`:
```
blog/
├── BlogCard.tsx          # Card component for list view
├── BlogList.tsx          # Grid/list of blog posts
├── BlogPost.tsx          # Full post view
├── BlogSidebar.tsx       # Tags, recent posts, search
└── index.ts              # Barrel export
```

`index.ts`:
```typescript
export { default as BlogCard } from './BlogCard';
export { default as BlogList } from './BlogList';
export { default as BlogPost } from './BlogPost';
export { default as BlogSidebar } from './BlogSidebar';
```

### Step 3 — TypeScript Types

Add `/frontend/src/types/blog.ts`:
```typescript
export interface BlogPost {
  id: number;
  attributes: {
    title: string;
    slug: string;
    content: string;
    cover_image: StrapiMedia;
    published_at: string;
    tags: string[];
  };
}
```

### Step 4 — Page Routes

Create `/frontend/src/app/blog/`:
```
blog/
├── page.tsx              # Blog listing page (server component)
└── [slug]/
    └── page.tsx          # Individual post page
```

### Step 5 — Navigation

Add the blog link to `Navbar.tsx` nav items array:
```typescript
{ label: 'Blog', href: '/blog' }
```

### Step 6 — Dashboard (optional)

If the module needs a dashboard section, add it to `DashboardLayout.tsx` sidebar:
```typescript
{ label: 'My Posts', href: '/dashboard/blog', roles: ['company', 'expert'] }
```

## How to Remove a Module

Example: Removing the "World Map" module.

### Required Steps
1. Delete the page route: `rm -rf frontend/src/app/map/`
2. Remove from Navbar: delete the `{ label: 'Map', href: '/map' }` entry

### Optional Cleanup
3. Delete the module folder: `rm -rf frontend/src/modules/map/`
4. Remove unused dependencies: `npm uninstall leaflet react-leaflet @types/leaflet`
5. The Strapi content type can stay (it shares `company` data) or be removed if dedicated

### What NOT to Do
- Don't delete shared types that other modules use
- Don't delete `lib/strapi.ts` helpers — they're shared
- Don't remove auth or dashboard — they're core dependencies

## Module Communication

Modules should NOT import from each other directly. Instead:

1. **Shared data:** Fetch from Strapi independently in each module
2. **Shared UI:** Put truly shared components in `/frontend/src/components/` (not a module)
3. **Shared logic:** Put in `/frontend/src/lib/` or `/frontend/src/hooks/`
4. **Cross-module navigation:** Use Next.js `<Link>` with route paths, never component imports

```
GOOD:  import { CompanyCard } from '@/modules/directory';     ← inside directory page
BAD:   import { CompanyCard } from '@/modules/directory';     ← inside map module
GOOD:  <Link href="/directory/company-name">View Company</Link>  ← in map module
```

## Adding CMS Sections

To add a new section type to the page builder:

1. Add the type to the `section_type` enum in Strapi schema
2. Create the component in `/frontend/src/modules/cms-sections/`
3. Register it in `SectionRenderer.tsx`:

```typescript
const SECTION_MAP: Record<string, React.ComponentType<SectionProps>> = {
  hero: HeroSection,
  feature_grid: FeatureGrid,
  cta_banner: CTABanner,
  testimonial: TestimonialSlider,
  text_block: TextBlock,
  stats: StatsSection,
  // Add new ones here:
  pricing_preview: PricingPreview,
  partner_logos: PartnerLogos,
};
```

4. Create entries in Strapi admin for the new section type on any page
