# API Reference

All API endpoints used in this project. Strapi endpoints are auto-generated. Next.js API routes are custom.

## Base URLs

| Service | URL | Notes |
|---------|-----|-------|
| Strapi API | `http://localhost:1337/api` | All content CRUD |
| Strapi Admin | `http://localhost:1337/admin` | CMS admin panel |
| Next.js App | `http://localhost:3000` | Frontend + API routes |
| Next.js API | `http://localhost:3000/api` | Custom server routes |

## Authentication Headers

```
Authorization: Bearer <jwt_token>
```

JWT is obtained from Strapi login and stored in NextAuth session.

---

## Strapi — Auth Endpoints

### POST /api/auth/local
Login with email and password.

```json
// Request
{ "identifier": "user@example.com", "password": "password123" }

// Response
{
  "jwt": "eyJhbGci...",
  "user": {
    "id": 1,
    "username": "user",
    "email": "user@example.com",
    "user_type": "company",
    "display_name": "Acme Corp",
    "subscription_status": "free"
  }
}
```

### POST /api/auth/local/register
Register a new user (custom extended).

```json
// Request
{
  "username": "acmecorp",
  "email": "admin@acme.com",
  "password": "SecurePass123!",
  "user_type": "company",
  "display_name": "Acme Corporation",
  // Additional fields depending on user_type:
  // company: company_name, industry, country, website, employee_count, description
  // investor: investment_focus, sectors, portfolio_size, country, linkedin_url, bio
  // expert: expertise, experience_years, hourly_rate, country, availability, bio
}

// Response — same format as login
{ "jwt": "...", "user": { ... } }
```

---

## Strapi — Company Endpoints

### GET /api/companies
List companies with filtering and pagination.

```
# Basic list
GET /api/companies?populate=logo,owner

# Filtered
GET /api/companies?filters[industry][$eq]=tech&filters[continent][$eq]=asia&populate=logo

# Search by name
GET /api/companies?filters[name][$containsi]=acme&populate=logo

# Paginated
GET /api/companies?pagination[page]=1&pagination[pageSize]=12&populate=logo

# For map (minimal fields + coordinates)
GET /api/companies?fields[0]=name&fields[1]=country&fields[2]=latitude&fields[3]=longitude&fields[4]=industry
```

**Response format:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Acme Corp",
        "slug": "acme-corp",
        "industry": "tech",
        "country": "United States",
        "continent": "north_america",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "logo": { "data": { "attributes": { "url": "/uploads/logo.png" } } }
      }
    }
  ],
  "meta": {
    "pagination": { "page": 1, "pageSize": 12, "pageCount": 5, "total": 58 }
  }
}
```

### GET /api/companies/:id
Single company by ID.

### GET /api/companies?filters[slug][$eq]=acme-corp
Single company by slug (used for detail pages).

### POST /api/companies
Create company (authenticated, company user_type only).

### PUT /api/companies/:id
Update company (authenticated, owner only).

### DELETE /api/companies/:id
Delete company (authenticated, owner only).

---

## Strapi — Investor Endpoints

### GET /api/investors?populate=avatar,user
### GET /api/investors/:id?populate=avatar,user
### PUT /api/investors/:id (owner only)

Same pattern as companies. Filter by `investment_focus`, `country`, `sectors`.

---

## Strapi — Expert Endpoints

### GET /api/experts?populate=avatar,user
### GET /api/experts/:id?populate=avatar,user
### PUT /api/experts/:id (owner only)

Same pattern. Filter by `availability`, `country`, `expertise`.

---

## Strapi — Subscription Plan Endpoints

### GET /api/subscription-plans
All plans. Filter by user_type for pricing page tabs.

```
# Company plans only
GET /api/subscription-plans?filters[user_type][$eq]=company&sort=price_monthly:asc
```

### GET /api/subscription-plans/:id
Single plan details.

---

## Strapi — Page Section Endpoints

### GET /api/page-sections
Fetch sections for a specific page.

```
# Homepage sections
GET /api/page-sections?filters[page][$eq]=home&filters[is_visible][$eq]=true&sort=order:asc&populate=background_image
```

---

## Strapi — Call Room Endpoints

### GET /api/call-rooms?filters[created_by][id][$eq]=USER_ID
User's call history.

### GET /api/call-rooms/:id?populate=created_by,participants
Single room details.

### POST /api/call-rooms
Create a room record (called by Next.js API after Daily.co room creation).

### PUT /api/call-rooms/:id
Update room status (active, ended).

---

## Next.js — Custom API Routes

### POST /api/auth/[...nextauth]
NextAuth.js handler. Manages sessions, JWT, callbacks.

### POST /api/stripe/create-checkout
Create a Stripe Checkout Session.

```json
// Request
{
  "plan_id": 2,
  "billing_period": "monthly"    // or "yearly"
}

// Response
{
  "checkout_url": "https://checkout.stripe.com/c/pay/cs_..."
}
```

**Flow:** Frontend calls this → gets URL → redirects user to Stripe Checkout → Stripe redirects back to `/dashboard/subscription?success=true`

### POST /api/stripe/webhook
Stripe webhook handler. Receives events from Stripe.

**Handled events:**
- `checkout.session.completed` — set user's `subscription_status` to `active` in Strapi
- `customer.subscription.updated` — update plan details
- `customer.subscription.deleted` — set `subscription_status` to `cancelled`

### POST /api/calls/create-room
Create a Daily.co video call room.

```json
// Request (authenticated)
{
  "call_type": "video",          // or "voice"
  "room_name": "meeting-abc123"  // optional, auto-generated if empty
}

// Response
{
  "room_url": "https://your-domain.daily.co/meeting-abc123",
  "room_name": "meeting-abc123",
  "token": "eyJ...",            // participant token
  "expires_at": "2025-01-01T01:00:00Z"
}
```

**Flow:** Frontend calls this → gets room URL + token → initializes Daily.co client → user joins call

---

## Strapi API Client Usage (Frontend)

All calls go through `/frontend/src/lib/strapi.ts`:

```typescript
import { strapiGet, strapiPost, strapiPut } from '@/lib/strapi';

// Public fetch (no auth)
const companies = await strapiGet('/companies', {
  filters: { industry: { $eq: 'tech' } },
  populate: 'logo',
  pagination: { page: 1, pageSize: 12 }
});

// Authenticated fetch
const myProfile = await strapiGet('/companies', {
  filters: { owner: { id: { $eq: userId } } },
  populate: '*'
}, token);

// Create
const newCompany = await strapiPost('/companies', {
  data: { name: 'New Corp', industry: 'tech', country: 'India' }
}, token);

// Update
const updated = await strapiPut(`/companies/${id}`, {
  data: { description: 'Updated description' }
}, token);
```

---

## Error Responses

All Strapi errors follow this format:
```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Missing required field: name",
    "details": {}
  }
}
```

Common status codes:
- `400` — validation error, bad request
- `401` — not authenticated
- `403` — not authorized (e.g., editing someone else's company)
- `404` — resource not found
- `500` — server error
