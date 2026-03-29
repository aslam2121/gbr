# Commit: User Roles and Custom Registration

**Date:** 2026-03-29

## Summary

Extended Strapi Users & Permissions plugin with custom user types (company, investor, expert) and a custom registration flow that creates linked profile entries.

## What Was Added

### Extended User Schema (`/backend/src/extensions/users-permissions/content-types/user/schema.json`)
- `user_type` — enum: company, investor, expert (required, defaults to "investor")
- `display_name` — string (max 255)
- `avatar` — single image media field
- `subscription_status` — enum: free, active, cancelled (defaults to "free")
- `stripe_customer_id` — string (private, not exposed in API responses)

### Profile Content Types
Each user type gets a linked profile with type-specific fields:

- **Company** (`api::company.company`) — name, description, industry, website, user relation
- **Investor** (`api::investor.investor`) — name, focus_areas, investment_range, user relation
- **Expert** (`api::expert.expert`) — name, specialty, hourly_rate, bio, user relation

All use `oneToOne` relation to the user and have `draftAndPublish: false`.

### Custom Registration Controller (`/backend/src/extensions/users-permissions/strapi-server.js`)
- Overrides the plugin's `auth.register` controller
- If `user_type` is not provided, falls back to default Strapi registration
- Validates required fields per type:
  - company: `company_name`
  - investor: `investor_name`
  - expert: `expert_name`, `specialty`
- After user creation, creates the corresponding profile entry linked to the user
- Uses `strapi.documents()` API (Strapi v5) for profile creation

### Plugin Config (`/backend/config/plugins.ts`)
- Whitelists custom fields (`user_type`, `display_name`, profile-specific fields) in the registration `allowedFields` so Strapi doesn't reject them

## Registration API

**POST** `/api/auth/local/register`

```json
{
  "username": "acme",
  "email": "acme@example.com",
  "password": "Password123",
  "user_type": "company",
  "display_name": "Acme Corp",
  "company_name": "Acme Corporation"
}
```

Returns: `{ jwt, user }` — same format as default Strapi register.
