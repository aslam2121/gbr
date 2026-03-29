# Strapi Content Type Schemas

All content types, their fields, relationships, and validation rules.

## User (Extended — Users & Permissions Plugin)

**Location:** `backend/src/extensions/users-permissions/content-types/user/schema.json`

Extends the default Strapi user with platform-specific fields.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| username | string | yes | default Strapi field |
| email | email | yes | default Strapi field |
| password | password | yes | default Strapi field |
| user_type | enum | yes | `company`, `investor`, `expert` |
| display_name | string | yes | shown in UI instead of username |
| avatar | media (image) | no | profile picture |
| subscription_status | enum | no | `free`, `active`, `cancelled` — default: `free` |
| stripe_customer_id | string | no | set when user subscribes via Stripe |
| company_profile | relation | no | oneToOne → Company (if user_type = company) |
| investor_profile | relation | no | oneToOne → Investor (if user_type = investor) |
| expert_profile | relation | no | oneToOne → Expert (if user_type = expert) |

**Custom registration logic:** When a user registers, the custom auth controller creates the corresponding profile (Company/Investor/Expert) and links it to the user automatically.

---

## Company

**Location:** `backend/src/api/company/content-types/company/schema.json`

Companies listed in the directory and shown on the world map.

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| name | string | yes | — | company name |
| slug | uid | auto | — | auto-generated from `name` |
| description | richtext | no | — | full company description |
| logo | media (image) | no | — | company logo |
| industry | enum | no | — | `tech`, `finance`, `healthcare`, `energy`, `manufacturing`, `logistics`, `education`, `other` |
| country | string | yes | — | country name |
| continent | enum | no | — | `asia`, `europe`, `north_america`, `south_america`, `africa`, `oceania` |
| latitude | float | no | — | for map placement |
| longitude | float | no | — | for map placement |
| website | string | no | — | company URL |
| founded_year | integer | no | — | year established |
| employee_count | enum | no | — | `1-10`, `11-50`, `51-200`, `201-500`, `500+` |
| owner | relation | no | — | manyToOne → User (the company account owner) |

**Permissions:**
- Public: `find`, `findOne` (directory is public)
- Authenticated: `create`, `update` (own only), `delete` (own only)

**Used by:** Directory module, Map module

---

## Investor

**Location:** `backend/src/api/investor/content-types/investor/schema.json`

Investor profiles linked to user accounts.

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| display_name | string | yes | — | investor name |
| slug | uid | auto | — | auto-generated from `display_name` |
| bio | richtext | no | — | background, investment thesis |
| avatar | media (image) | no | — | profile photo |
| investment_focus | enum | no | — | `seed`, `series_a`, `series_b`, `growth`, `late_stage` |
| sectors | json | no | `[]` | array of sector strings: `["tech", "healthcare"]` |
| portfolio_size | enum | no | — | `1-5`, `6-20`, `21-50`, `50+` |
| country | string | no | — | investor location |
| linkedin_url | string | no | — | LinkedIn profile URL |
| user | relation | yes | — | oneToOne → User |

**Permissions:**
- Public: `find`, `findOne` (investors can be browsed)
- Authenticated (owner only): `update`

---

## Expert

**Location:** `backend/src/api/expert/content-types/expert/schema.json`

Expert/consultant profiles linked to user accounts.

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| display_name | string | yes | — | expert name |
| slug | uid | auto | — | auto-generated from `display_name` |
| bio | richtext | no | — | professional background |
| avatar | media (image) | no | — | profile photo |
| expertise | json | no | `[]` | array of skill strings: `["M&A", "IP Law", "Go-to-Market"]` |
| experience_years | integer | no | — | years of experience |
| hourly_rate | decimal | no | — | consultation rate in USD |
| country | string | no | — | expert location |
| availability | enum | no | `available` | `available`, `busy`, `unavailable` |
| user | relation | yes | — | oneToOne → User |

**Permissions:**
- Public: `find`, `findOne`
- Authenticated (owner only): `update`

---

## Subscription Plan

**Location:** `backend/src/api/subscription-plan/content-types/subscription-plan/schema.json`

Plans shown on the pricing page and used to gate features.

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| name | string | yes | — | plan display name (e.g., "Pro", "Enterprise") |
| user_type | enum | yes | — | `company`, `investor`, `expert` — determines which pricing tab |
| price_monthly | decimal | yes | — | monthly price in USD |
| price_yearly | decimal | no | — | yearly price (usually discounted) |
| stripe_price_id_monthly | string | no | — | Stripe Price ID for monthly billing |
| stripe_price_id_yearly | string | no | — | Stripe Price ID for yearly billing |
| features | json | no | `[]` | array of feature strings for the pricing card |
| is_popular | boolean | no | `false` | highlights this plan on pricing page |
| call_minutes | integer | no | `0` | monthly video call minutes included |
| directory_listings | integer | no | `1` | number of company listings allowed |
| max_contacts | integer | no | `10` | max saved contacts/connections |

**Permissions:**
- Public: `find`, `findOne` (pricing page is public)
- Admin only: `create`, `update`, `delete`

**Example seed data:**
```json
[
  { "name": "Free", "user_type": "company", "price_monthly": 0, "features": ["1 listing", "5 contacts", "No calls"], "call_minutes": 0 },
  { "name": "Pro", "user_type": "company", "price_monthly": 49, "features": ["5 listings", "50 contacts", "120 min calls"], "is_popular": true, "call_minutes": 120 },
  { "name": "Enterprise", "user_type": "company", "price_monthly": 199, "features": ["Unlimited listings", "Unlimited contacts", "Unlimited calls"], "call_minutes": -1 }
]
```

---

## Call Room

**Location:** `backend/src/api/call-room/content-types/call-room/schema.json`

Tracks video/voice call sessions between users.

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| room_name | string | yes (unique) | — | human-readable room identifier |
| daily_room_url | string | no | — | full Daily.co room URL |
| daily_room_name | string | no | — | Daily.co internal room name |
| created_by | relation | yes | — | manyToOne → User (who started the call) |
| participants | relation | no | — | manyToMany → User (who joined) |
| status | enum | no | `waiting` | `waiting`, `active`, `ended` |
| started_at | datetime | no | — | when the call actually began |
| ended_at | datetime | no | — | when the call ended |
| call_type | enum | no | `video` | `video`, `voice` |
| duration_minutes | integer | no | — | calculated from started_at/ended_at |

**Permissions:**
- Authenticated: `find` (own calls only), `create`
- Custom policy: users can only see calls they created or participated in

---

## Page Section

**Location:** `backend/src/api/page-section/content-types/page-section/schema.json`

CMS-driven page builder. Each entry is a section rendered on a page.

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| page | string | yes | — | which page this belongs to: `home`, `about`, `contact`, etc. |
| order | integer | no | `0` | display order on the page (ascending) |
| section_type | enum | yes | — | `hero`, `feature_grid`, `cta_banner`, `testimonial`, `text_block`, `stats` |
| title | string | no | — | section heading |
| subtitle | text | no | — | section subheading |
| content | richtext | no | — | body content (for text_block type) |
| background_image | media | no | — | section background |
| cta_text | string | no | — | call-to-action button text |
| cta_link | string | no | — | call-to-action button URL |
| metadata | json | no | `{}` | flexible data per section type (see below) |
| is_visible | boolean | no | `true` | toggle sections on/off without deleting |

**Metadata shapes by section_type:**

```
hero:
  { "alignment": "center" | "left", "overlay_opacity": 0.5 }

feature_grid:
  { "features": [
    { "icon": "shield", "title": "Secure", "description": "Enterprise-grade security" },
    { "icon": "globe", "title": "Global", "description": "150+ countries" }
  ]}

stats:
  { "stats": [
    { "number": "500+", "label": "Companies" },
    { "number": "50", "label": "Countries" }
  ]}

testimonial:
  { "testimonials": [
    { "quote": "Amazing platform", "author": "Jane Doe", "role": "CEO, TechCo", "avatar_url": "/images/jane.jpg" }
  ]}

cta_banner:
  { "bg_color": "#1a56db", "text_color": "#ffffff" }

text_block:
  { "max_width": "800px", "alignment": "center" }
```

**Permissions:**
- Public: `find` (pages need to load sections)
- Admin only: `create`, `update`, `delete`

**Querying for a page:**
```
GET /api/page-sections?filters[page][$eq]=home&filters[is_visible][$eq]=true&sort=order:asc&populate=background_image
```

---

## Strapi Components (Reusable)

These are embedded components, not standalone content types.

### shared.seo
`backend/src/components/shared/seo.json`
```json
{ "metaTitle": "string", "metaDescription": "text", "ogImage": "media" }
```

### shared.social-link
`backend/src/components/shared/social-link.json`
```json
{ "platform": "enum (linkedin, twitter, website, github)", "url": "string" }
```

### shared.address
`backend/src/components/shared/address.json`
```json
{ "street": "string", "city": "string", "state": "string", "country": "string", "zip": "string" }
```

---

## Relationship Map

```
User (1) ──── (1) Company
User (1) ──── (1) Investor
User (1) ──── (1) Expert
User (1) ──── (N) CallRoom (as creator)
User (N) ──── (N) CallRoom (as participant)
SubscriptionPlan ── no direct relation, linked via user.subscription_status + stripe
PageSection ── no relations, standalone CMS entries
```
