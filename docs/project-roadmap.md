# B2B Platform — Project Architecture & Claude Code CLI Roadmap

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Backend CMS | Strapi v5 (Node.js) | You know it, headless, API-first, admin panel |
| Frontend | Next.js 14 (App Router) | SSR, API routes, dynamic rendering |
| Database | PostgreSQL | Production-grade, Strapi-native |
| Styling | Tailwind CSS | Utility-first, matches your HTML/CSS knowledge |
| Video/Voice | Daily.co SDK | Drop-in WebRTC, no infrastructure to manage |
| Payments | Stripe | Subscription billing, webhooks |
| Maps | Leaflet + React-Leaflet | Free, open-source, no API key needed |
| Auth | Strapi Users & Permissions + NextAuth.js | Role-based (Company, Investor, Expert) |
| Deployment | Docker Compose | One-command deploy for both services |

---

## Folder Structure

```
b2b-platform/
│
├── docker-compose.yml
├── .env.example
├── README.md
│
├── backend/                          # Strapi CMS
│   ├── config/
│   │   ├── database.js
│   │   ├── server.js
│   │   ├── plugins.js
│   │   └── middlewares.js
│   │
│   ├── src/
│   │   ├── api/                      # Each module = separate API folder
│   │   │   ├── company/
│   │   │   │   ├── content-types/company/schema.json
│   │   │   │   ├── controllers/company.js
│   │   │   │   ├── routes/company.js
│   │   │   │   └── services/company.js
│   │   │   │
│   │   │   ├── investor/
│   │   │   │   ├── content-types/investor/schema.json
│   │   │   │   ├── controllers/investor.js
│   │   │   │   ├── routes/investor.js
│   │   │   │   └── services/investor.js
│   │   │   │
│   │   │   ├── expert/
│   │   │   │   ├── content-types/expert/schema.json
│   │   │   │   ├── controllers/expert.js
│   │   │   │   ├── routes/expert.js
│   │   │   │   └── services/expert.js
│   │   │   │
│   │   │   ├── subscription-plan/
│   │   │   │   ├── content-types/subscription-plan/schema.json
│   │   │   │   ├── controllers/subscription-plan.js
│   │   │   │   ├── routes/subscription-plan.js
│   │   │   │   └── services/subscription-plan.js
│   │   │   │
│   │   │   ├── call-room/
│   │   │   │   ├── content-types/call-room/schema.json
│   │   │   │   ├── controllers/call-room.js
│   │   │   │   ├── routes/call-room.js
│   │   │   │   └── services/call-room.js
│   │   │   │
│   │   │   └── page-section/           # CMS-driven frontend sections
│   │   │       ├── content-types/page-section/schema.json
│   │   │       ├── controllers/page-section.js
│   │   │       ├── routes/page-section.js
│   │   │       └── services/page-section.js
│   │   │
│   │   ├── components/                 # Reusable Strapi components
│   │   │   ├── shared/
│   │   │   │   ├── seo.json
│   │   │   │   ├── social-link.json
│   │   │   │   └── address.json
│   │   │   └── sections/
│   │   │       ├── hero.json
│   │   │       ├── feature-grid.json
│   │   │       ├── cta-banner.json
│   │   │       └── testimonial.json
│   │   │
│   │   └── extensions/
│   │       └── users-permissions/      # Custom roles: company, investor, expert
│   │
│   ├── public/uploads/
│   └── package.json
│
├── frontend/                           # Next.js App
│   ├── public/
│   │   └── images/
│   │
│   ├── src/
│   │   ├── app/                        # App Router pages
│   │   │   ├── layout.tsx              # Root layout with nav/footer
│   │   │   ├── page.tsx                # Homepage (CMS-driven)
│   │   │   ├── globals.css
│   │   │   │
│   │   │   ├── (auth)/                 # Auth route group
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/
│   │   │   │   │   ├── company/page.tsx
│   │   │   │   │   ├── investor/page.tsx
│   │   │   │   │   └── expert/page.tsx
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   ├── directory/              # Company directory module
│   │   │   │   ├── page.tsx            # List with filters
│   │   │   │   └── [slug]/page.tsx     # Company detail
│   │   │   │
│   │   │   ├── map/                    # World map module
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── calls/                  # Video/voice call module
│   │   │   │   ├── page.tsx            # Call lobby
│   │   │   │   └── [roomId]/page.tsx   # Active call room
│   │   │   │
│   │   │   ├── pricing/                # Subscription plans module
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── dashboard/              # User dashboard
│   │   │   │   ├── page.tsx
│   │   │   │   ├── profile/page.tsx
│   │   │   │   └── subscription/page.tsx
│   │   │   │
│   │   │   └── api/                    # Next.js API routes
│   │   │       ├── auth/[...nextauth]/route.ts
│   │   │       ├── stripe/
│   │   │       │   ├── create-checkout/route.ts
│   │   │       │   └── webhook/route.ts
│   │   │       └── calls/
│   │   │           └── create-room/route.ts
│   │   │
│   │   ├── modules/                    # Feature modules (add/remove here)
│   │   │   ├── directory/
│   │   │   │   ├── CompanyCard.tsx
│   │   │   │   ├── CompanyList.tsx
│   │   │   │   ├── CompanyFilters.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── map/
│   │   │   │   ├── WorldMap.tsx
│   │   │   │   ├── MapMarker.tsx
│   │   │   │   ├── CountryPopup.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── calls/
│   │   │   │   ├── VideoCall.tsx
│   │   │   │   ├── CallControls.tsx
│   │   │   │   ├── CallLobby.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── CompanyRegForm.tsx
│   │   │   │   ├── InvestorRegForm.tsx
│   │   │   │   ├── ExpertRegForm.tsx
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── pricing/
│   │   │   │   ├── PlanCard.tsx
│   │   │   │   ├── PricingGrid.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── cms-sections/           # CMS-driven page builder
│   │   │   │   ├── SectionRenderer.tsx # Maps Strapi sections to components
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── FeatureGrid.tsx
│   │   │   │   ├── CTABanner.tsx
│   │   │   │   ├── TestimonialSlider.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── dashboard/
│   │   │       ├── DashboardLayout.tsx
│   │   │       ├── ProfileEditor.tsx
│   │   │       ├── SubscriptionManager.tsx
│   │   │       └── index.ts
│   │   │
│   │   ├── lib/                        # Shared utilities
│   │   │   ├── strapi.ts               # Strapi API client
│   │   │   ├── stripe.ts               # Stripe helpers
│   │   │   ├── daily.ts                # Daily.co helpers
│   │   │   └── auth.ts                 # Auth config
│   │   │
│   │   ├── hooks/                      # Custom React hooks
│   │   │   ├── useStrapi.ts
│   │   │   ├── useAuth.ts
│   │   │   └── useCall.ts
│   │   │
│   │   └── types/                      # TypeScript types
│   │       ├── company.ts
│   │       ├── user.ts
│   │       ├── plan.ts
│   │       └── strapi.ts
│   │
│   ├── tailwind.config.ts
│   ├── next.config.js
│   └── package.json
│
└── docs/
    ├── modules.md                      # How to add/remove modules
    ├── strapi-schemas.md               # Content type documentation
    └── deployment.md
```

---

## Strapi Content Type Schemas

### Company
```json
{
  "kind": "collectionType",
  "collectionName": "companies",
  "attributes": {
    "name":        { "type": "string", "required": true },
    "slug":        { "type": "uid", "targetField": "name" },
    "description": { "type": "richtext" },
    "logo":        { "type": "media", "allowedTypes": ["images"] },
    "industry":    { "type": "enumeration", "enum": ["tech","finance","healthcare","energy","manufacturing","other"] },
    "country":     { "type": "string", "required": true },
    "continent":   { "type": "enumeration", "enum": ["asia","europe","north_america","south_america","africa","oceania"] },
    "latitude":    { "type": "float" },
    "longitude":   { "type": "float" },
    "website":     { "type": "string" },
    "founded_year":{ "type": "integer" },
    "employee_count": { "type": "enumeration", "enum": ["1-10","11-50","51-200","201-500","500+"] },
    "owner":       { "type": "relation", "relation": "manyToOne", "target": "plugin::users-permissions.user" }
  }
}
```

### Investor
```json
{
  "attributes": {
    "display_name":    { "type": "string", "required": true },
    "slug":            { "type": "uid", "targetField": "display_name" },
    "bio":             { "type": "richtext" },
    "avatar":          { "type": "media", "allowedTypes": ["images"] },
    "investment_focus": { "type": "enumeration", "enum": ["seed","series_a","series_b","growth","late_stage"] },
    "sectors":         { "type": "json" },
    "portfolio_size":  { "type": "enumeration", "enum": ["1-5","6-20","21-50","50+"] },
    "country":         { "type": "string" },
    "linkedin_url":    { "type": "string" },
    "user":            { "type": "relation", "relation": "oneToOne", "target": "plugin::users-permissions.user" }
  }
}
```

### Expert
```json
{
  "attributes": {
    "display_name":  { "type": "string", "required": true },
    "slug":          { "type": "uid", "targetField": "display_name" },
    "bio":           { "type": "richtext" },
    "avatar":        { "type": "media", "allowedTypes": ["images"] },
    "expertise":     { "type": "json" },
    "experience_years": { "type": "integer" },
    "hourly_rate":   { "type": "decimal" },
    "country":       { "type": "string" },
    "availability":  { "type": "enumeration", "enum": ["available","busy","unavailable"] },
    "user":          { "type": "relation", "relation": "oneToOne", "target": "plugin::users-permissions.user" }
  }
}
```

### Subscription Plan
```json
{
  "attributes": {
    "name":          { "type": "string", "required": true },
    "user_type":     { "type": "enumeration", "enum": ["company","investor","expert"], "required": true },
    "price_monthly": { "type": "decimal", "required": true },
    "price_yearly":  { "type": "decimal" },
    "stripe_price_id": { "type": "string" },
    "features":      { "type": "json" },
    "is_popular":    { "type": "boolean", "default": false },
    "call_minutes":  { "type": "integer", "default": 0 },
    "directory_listings": { "type": "integer", "default": 1 }
  }
}
```

### Page Section (CMS-driven frontend)
```json
{
  "attributes": {
    "page":          { "type": "string", "required": true },
    "order":         { "type": "integer", "default": 0 },
    "section_type":  { "type": "enumeration", "enum": ["hero","feature_grid","cta_banner","testimonial","text_block","stats"] },
    "title":         { "type": "string" },
    "subtitle":      { "type": "text" },
    "content":       { "type": "richtext" },
    "background_image": { "type": "media" },
    "cta_text":      { "type": "string" },
    "cta_link":      { "type": "string" },
    "metadata":      { "type": "json" },
    "is_visible":    { "type": "boolean", "default": true }
  }
}
```

---

## Implementation Roadmap — Claude Code CLI Prompts

Below are copy-paste prompts for Claude Code CLI. Run them **in order**, one phase at a time. After each prompt, test before moving on.

---

### PHASE 1: Project Scaffolding

**Prompt 1.1 — Initialize monorepo**
```
Create a monorepo for a B2B platform with two workspaces:

1. /backend — Strapi v5 with PostgreSQL:
   - Run `npx create-strapi@latest backend --quickstart --no-run`
   - Configure it for PostgreSQL in config/database.js (read from env vars: DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD)
   - Add config/server.js with CORS allowing http://localhost:3000

2. /frontend — Next.js 14 with App Router + TypeScript + Tailwind CSS:
   - Run `npx create-next-app@latest frontend --typescript --tailwind --app --src-dir --no-eslint`
   - Install dependencies: axios, next-auth, @stripe/stripe-js

3. Root level:
   - Create docker-compose.yml with services: postgres (port 5432), strapi (port 1337), nextjs (port 3000)
   - Create .env.example with all required env vars
   - Create a root package.json with scripts: "dev:backend", "dev:frontend", "dev" (runs both)

Do not start any servers. Just scaffold everything.
```

**Prompt 1.2 — Strapi API client for frontend**
```
In /frontend/src/lib/strapi.ts, create a typed Strapi API client:

- Base URL from env var NEXT_PUBLIC_STRAPI_URL (default http://localhost:1337)
- Helper functions: strapiGet(path, params?), strapiPost(path, data, token?), strapiPut(path, data, token?)
- All functions should handle Strapi v5 response format { data, meta }
- Add proper TypeScript generics so responses are typed
- Add an auth header helper that reads JWT from NextAuth session
- Export everything from the file

Keep it simple. No over-abstraction.
```

---

### PHASE 2: User System & Authentication

**Prompt 2.1 — Strapi custom roles and registration**
```
In the Strapi backend, set up user roles and registration:

1. Extend the Users & Permissions plugin:
   - Add a custom field "user_type" (enum: company, investor, expert) to the User content type by creating /backend/src/extensions/users-permissions/content-types/user/schema.json
   - Add fields: user_type (enum), display_name (string), avatar (media), subscription_status (enum: free, active, cancelled), stripe_customer_id (string)

2. Create a custom registration controller at /backend/src/extensions/users-permissions/controllers/auth-custom.js:
   - Override the register endpoint
   - Accept user_type in the registration body
   - Validate that required fields differ per user_type
   - After user creation, create the corresponding Company/Investor/Expert profile entry linked to the user

3. Add the custom route in /backend/src/extensions/users-permissions/routes/auth-custom.js

Make sure the default Strapi register still works but now also accepts user_type.
```

**Prompt 2.2 — NextAuth integration**
```
In the Next.js frontend, set up NextAuth.js with Strapi as the credentials provider:

1. Create /frontend/src/app/api/auth/[...nextauth]/route.ts:
   - Credentials provider that calls Strapi's /api/auth/local endpoint
   - Store JWT, user id, user_type, display_name in the session
   - Add callbacks for jwt and session to pass user_type through

2. Create /frontend/src/lib/auth.ts:
   - Export authOptions config
   - Export a getServerSession helper for server components

3. Create /frontend/src/hooks/useAuth.ts:
   - Wrapper around useSession with typed user data
   - Helper functions: isCompany(), isInvestor(), isExpert(), isLoggedIn()

4. Create an AuthProvider component at /frontend/src/modules/auth/AuthProvider.tsx that wraps SessionProvider
   - Add it to the root layout.tsx
```

**Prompt 2.3 — Three registration forms**
```
In the Next.js frontend, create three separate registration pages:

1. /frontend/src/app/(auth)/register/company/page.tsx
   Company registration form fields: company_name, email, password, industry (dropdown), country, website, employee_count, description
   
2. /frontend/src/app/(auth)/register/investor/page.tsx
   Investor registration form fields: full_name, email, password, investment_focus (dropdown), sectors (multi-select), portfolio_size, country, linkedin_url, bio

3. /frontend/src/app/(auth)/register/expert/page.tsx
   Expert registration form fields: full_name, email, password, expertise_areas (multi-select tags), experience_years, hourly_rate, country, availability, bio

4. /frontend/src/app/(auth)/register/page.tsx — A landing page with 3 cards (Company, Investor, Expert) each linking to their form

5. /frontend/src/app/(auth)/login/page.tsx — Single login form (email + password) that works for all user types

Each form should:
- Use React Hook Form for validation
- Submit to Strapi's custom register endpoint
- Show loading states and error messages
- Redirect to /dashboard on success
- Use Tailwind CSS, clean and professional design
- Be a separate module component in /frontend/src/modules/auth/
```

---

### PHASE 3: Company Directory

**Prompt 3.1 — Strapi company content type**
```
In Strapi, create the Company content type:

1. Create /backend/src/api/company/content-types/company/schema.json with these fields:
   - name (string, required)
   - slug (uid, targetField: name)
   - description (richtext)
   - logo (media, images only)
   - industry (enumeration: tech, finance, healthcare, energy, manufacturing, logistics, education, other)
   - country (string, required)
   - continent (enumeration: asia, europe, north_america, south_america, africa, oceania)
   - latitude (float)
   - longitude (float)
   - website (string)
   - founded_year (integer)
   - employee_count (enumeration: 1-10, 11-50, 51-200, 201-500, 500+)
   - owner (relation: manyToOne to users-permissions.user)

2. Create the standard controller, service, and routes files
3. Add seed data script at /backend/scripts/seed-companies.js that creates 20 sample companies across 6 continents with real lat/lng coordinates

Make the API publicly readable but require auth for create/update/delete.
```

**Prompt 3.2 — Directory frontend**
```
Build the company directory frontend module:

1. /frontend/src/modules/directory/CompanyCard.tsx
   - Card component showing: logo, name, industry badge, country flag emoji, employee count
   - Click navigates to /directory/[slug]
   - Clean card design with hover effects

2. /frontend/src/modules/directory/CompanyFilters.tsx
   - Filter sidebar with: search text input, industry dropdown, continent dropdown, employee size dropdown
   - Filters update URL query params (shallow routing)
   - "Clear filters" button

3. /frontend/src/modules/directory/CompanyList.tsx
   - Grid layout (3 columns desktop, 2 tablet, 1 mobile)
   - Pagination with page numbers
   - Loading skeleton cards
   - "No results" empty state
   - Fetches from Strapi with filters applied

4. /frontend/src/app/directory/page.tsx
   - Server component that renders CompanyFilters + CompanyList
   - Fetches initial data server-side
   - SEO meta tags

5. /frontend/src/app/directory/[slug]/page.tsx
   - Company detail page: full description, map pin (small Leaflet map), contact info, website link
   - "Request a Call" button (links to calls module)
   - Back to directory link

Use Tailwind CSS throughout. Make it responsive.
```

---

### PHASE 4: World Map

**Prompt 4.1 — Interactive world map**
```
Build the world map module showing companies by country:

1. Install in frontend: npm install leaflet react-leaflet @types/leaflet

2. /frontend/src/modules/map/WorldMap.tsx
   - Full-page Leaflet map with a clean tile layer (use CartoDB Positron tiles for a professional B2B look)
   - Fetch all companies from Strapi, group by country
   - Show cluster markers — one per country with a count badge
   - On marker click, show a popup with: country name, company count, list of company names (max 5, with "and X more" link to filtered directory)
   - Add a legend showing total companies and countries represented
   - Zoom controls and fullscreen button
   - Dynamic import with next/dynamic (SSR: false) since Leaflet needs window

3. /frontend/src/modules/map/MapMarker.tsx
   - Custom marker component with company count
   - Color-coded by continent

4. /frontend/src/modules/map/CountryPopup.tsx
   - Popup content component
   - Links to /directory?country=XX

5. /frontend/src/app/map/page.tsx
   - Page that renders the WorldMap component full-width
   - Minimal header overlay with search

Make the map responsive and touch-friendly for mobile.
```

---

### PHASE 5: Subscription Plans & Stripe

**Prompt 5.1 — Strapi subscription content type + Stripe integration**
```
Set up subscription plans:

1. Create Strapi content type /backend/src/api/subscription-plan/content-types/subscription-plan/schema.json:
   - name (string, required)
   - user_type (enum: company, investor, expert, required)
   - price_monthly (decimal, required)
   - price_yearly (decimal)
   - stripe_price_id_monthly (string)
   - stripe_price_id_yearly (string)
   - features (json — array of feature strings)
   - is_popular (boolean, default false)
   - call_minutes (integer, default 0)
   - directory_listings (integer, default 1)
   - max_contacts (integer, default 10)

2. Create standard controller/service/routes

3. Create a Stripe webhook handler in Next.js at /frontend/src/app/api/stripe/webhook/route.ts:
   - Handle events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
   - On subscription change, update the user's subscription_status in Strapi via API

4. Create /frontend/src/app/api/stripe/create-checkout/route.ts:
   - Accept plan_id and billing_period (monthly/yearly)
   - Look up the Stripe price ID from Strapi
   - Create a Stripe Checkout Session
   - Return the session URL

5. Create seed data with 3 plans per user type (Free, Pro, Enterprise)
```

**Prompt 5.2 — Pricing page frontend**
```
Build the pricing page:

1. /frontend/src/modules/pricing/PlanCard.tsx
   - Card showing: plan name, price (monthly/yearly toggle), feature list with checkmarks, CTA button
   - Highlight "popular" plan with a badge and border
   - Different button text: "Current Plan" (if active), "Upgrade", "Get Started"
   - Disabled state for free plan if already on it

2. /frontend/src/modules/pricing/PricingGrid.tsx
   - Tab bar to switch between Company/Investor/Expert plans
   - Monthly/Yearly toggle with "Save 20%" badge
   - 3-column grid of PlanCards
   - Comparison table below the cards showing all features

3. /frontend/src/app/pricing/page.tsx
   - Server component fetching plans from Strapi
   - FAQ section below pricing (editable via Strapi page-sections)
   
Make the pricing page conversion-optimized with clear CTAs and professional design.
```

---

### PHASE 6: Video & Voice Calls

**Prompt 6.1 — Daily.co call integration**
```
Set up video/voice calling with Daily.co:

1. Create Strapi content type /backend/src/api/call-room/content-types/call-room/schema.json:
   - room_name (string, required, unique)
   - daily_room_url (string)
   - created_by (relation to user)
   - participants (relation: manyToMany to users)
   - status (enum: waiting, active, ended)
   - started_at (datetime)
   - ended_at (datetime)
   - call_type (enum: video, voice)

2. Create /frontend/src/app/api/calls/create-room/route.ts:
   - Requires auth
   - Calls Daily.co REST API to create a room (POST https://api.daily.co/v1/rooms)
   - Stores room details in Strapi
   - Returns the room URL and token

3. Install in frontend: npm install @daily-co/daily-js @daily-co/daily-react

4. /frontend/src/modules/calls/CallLobby.tsx
   - Shows user's upcoming/recent calls
   - "Start New Call" button — creates a room and generates an invite link
   - "Join Call" input field for entering a room code
   - Camera/mic preview before joining

5. /frontend/src/modules/calls/VideoCall.tsx
   - Uses Daily.co React components (DailyProvider, DailyVideo)
   - Shows video grid of participants
   - Support for both video and audio-only modes

6. /frontend/src/modules/calls/CallControls.tsx
   - Mute/unmute mic, camera on/off, screen share, end call buttons
   - Participant count badge
   - Call duration timer

7. /frontend/src/app/calls/page.tsx — Renders CallLobby
8. /frontend/src/app/calls/[roomId]/page.tsx — Renders VideoCall with controls

Ensure calls work on mobile browsers too.
```

---

### PHASE 7: CMS-Driven Frontend Sections

**Prompt 7.1 — Dynamic page builder**
```
Build the CMS-driven page section system so the homepage (and any page) can be edited from Strapi without code changes:

1. The Strapi page-section content type is already defined. Create the controller/service/routes.

2. /frontend/src/modules/cms-sections/SectionRenderer.tsx
   - Takes a section_type and data props
   - Maps section_type to the correct component:
     "hero" → HeroSection
     "feature_grid" → FeatureGrid
     "cta_banner" → CTABanner
     "testimonial" → TestimonialSlider
     "text_block" → TextBlock
     "stats" → StatsSection
   - Returns null for unknown types (future-proof)

3. Create each section component:
   - /frontend/src/modules/cms-sections/HeroSection.tsx — Full-width hero with title, subtitle, CTA button, background image
   - /frontend/src/modules/cms-sections/FeatureGrid.tsx — 3-column grid of feature cards (icon, title, description) from metadata JSON
   - /frontend/src/modules/cms-sections/CTABanner.tsx — Colored banner with title, subtitle, button
   - /frontend/src/modules/cms-sections/TestimonialSlider.tsx — Carousel of testimonial cards from metadata JSON
   - /frontend/src/modules/cms-sections/TextBlock.tsx — Rich text rendered as HTML
   - /frontend/src/modules/cms-sections/StatsSection.tsx — 4-column stats (number + label) from metadata JSON

4. /frontend/src/app/page.tsx (Homepage):
   - Fetch all page-sections where page="home" and is_visible=true, ordered by "order"
   - Map through and render each with SectionRenderer
   - This makes the entire homepage editable from Strapi admin

5. Seed Strapi with sample homepage sections: hero, feature_grid (3 features), stats (4 stats), testimonial (3 quotes), cta_banner

All sections should be responsive and use Tailwind CSS with a professional B2B aesthetic.
```

---

### PHASE 8: Dashboard & Navigation

**Prompt 8.1 — User dashboard**
```
Build the user dashboard:

1. /frontend/src/modules/dashboard/DashboardLayout.tsx
   - Sidebar navigation with links based on user_type:
     All users: Profile, Subscription, Calls
     Company: My Company, Directory Analytics
     Investor: My Portfolio, Saved Companies
     Expert: My Expertise, Availability Settings
   - Top bar with user avatar, name, notification bell
   - Mobile responsive with hamburger menu

2. /frontend/src/modules/dashboard/ProfileEditor.tsx
   - Form pre-filled with user data from Strapi
   - Different fields shown based on user_type
   - Avatar upload with preview
   - Save changes button that PUTs to Strapi

3. /frontend/src/modules/dashboard/SubscriptionManager.tsx
   - Shows current plan name, status, renewal date
   - "Change Plan" button links to /pricing
   - "Cancel Subscription" button with confirmation modal
   - Usage stats (calls used, listings, etc.)

4. /frontend/src/app/dashboard/page.tsx — Protected route, renders DashboardLayout with overview
5. /frontend/src/app/dashboard/profile/page.tsx — ProfileEditor
6. /frontend/src/app/dashboard/subscription/page.tsx — SubscriptionManager

Add route protection: redirect to /login if not authenticated.
```

**Prompt 8.2 — Global navigation**
```
Build the global navigation and footer:

1. /frontend/src/app/layout.tsx — Update root layout with:
   - Navbar component
   - Footer component
   - AuthProvider wrapper

2. Create /frontend/src/modules/cms-sections/Navbar.tsx:
   - Logo on left
   - Nav links: Directory, Map, Pricing (fetched from Strapi or hardcoded)
   - Right side: Login/Register buttons (logged out) OR avatar dropdown (logged in)
   - Mobile hamburger menu
   - Sticky on scroll

3. Create /frontend/src/modules/cms-sections/Footer.tsx:
   - 4-column layout: About, Platform links, Resources, Contact
   - Social media icons
   - Copyright text
   - All content ideally from Strapi single-type "footer"

Professional B2B design. Dark navbar, clean footer.
```

---

### PHASE 9: Polish & Module Docs

**Prompt 9.1 — Module system documentation**
```
Create /docs/modules.md with:

1. Architecture overview explaining the module pattern:
   - Each feature = a folder in /frontend/src/modules/ + a Strapi content type
   - Modules export components via index.ts barrel files
   - Pages in /app/ import from modules
   - To disable a module: remove its page from /app/ and optionally its Strapi content type

2. Step-by-step guide: "How to add a new module" with example of adding a "Blog" module:
   - Create Strapi content type
   - Create frontend module folder with components
   - Create page route
   - Add to navigation
   - Add to dashboard sidebar (if needed)

3. Step-by-step guide: "How to remove a module":
   - Delete the page route
   - Remove from navigation config
   - Optionally delete the module folder and Strapi content type

4. List of all current modules with their status and dependencies

5. Environment variables reference

Make it clear and practical for someone who will use vibe coding to extend this.
```

---

## Quick Reference: Module Dependencies

```
Module              Depends On          Can Be Removed Safely?
─────────────────────────────────────────────────────────────
Auth                (core)              NO — required
Directory           Company schema      YES
World Map           Company schema      YES
Calls               Daily.co, Auth      YES
Pricing             Stripe, Plans       YES (free-only mode)
CMS Sections        Page Sections       YES (hardcode pages)
Dashboard           Auth                NO — required
```

---

## Running the Project

```bash
# Terminal 1 — Database
docker compose up postgres

# Terminal 2 — Strapi
cd backend && npm run develop

# Terminal 3 — Next.js
cd frontend && npm run dev
```

Then open:
- Frontend: http://localhost:3000
- Strapi Admin: http://localhost:1337/admin

---

## Tips for Claude Code CLI

1. **Run one prompt per session** — don't stack all phases
2. **Test after each phase** before moving to the next
3. **If something breaks**, paste the error into Claude Code and ask it to fix
4. **For design tweaks**, say: "Make the directory page look more professional — add subtle shadows, better spacing, and a gradient header"
5. **To add a new module later**, follow the pattern in docs/modules.md and describe what you need
6. **Always commit after each working phase**: `git add -A && git commit -m "Phase X complete"`
