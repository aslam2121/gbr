# Commit: Registration and Login Pages

**Date:** 2026-03-29

## Summary

Added role-specific registration forms (Company, Investor, Expert), a registration landing page with type selection cards, and a unified login page. All forms use React Hook Form, submit to Strapi, and auto-sign-in via NextAuth on success.

## What Was Added

### Shared Auth Components (`/frontend/src/modules/auth/`)
- **AuthLayout** — centered card layout with title, subtitle, footer
- **SubmitButton** — loading spinner state, disabled while submitting
- **ErrorAlert** — red alert box for API errors
- **FormField** — label + error message wrapper
- **Input / Select / Textarea** — styled form controls that accept RHF registration
- **MultiSelect** — dropdown with tag-style chips for multi-value fields (sectors, expertise areas)

### Registration Forms

**CompanyRegisterForm** — `/register/company`
- Fields: company_name, email, password, industry (dropdown), country, website, employee_count, description
- Sends `user_type: "company"` + `company_name` to Strapi

**InvestorRegisterForm** — `/register/investor`
- Fields: full_name, email, password, investment_focus (dropdown), sectors (multi-select), portfolio_size, country, linkedin_url, bio
- Sends `user_type: "investor"` + `investor_name` to Strapi

**ExpertRegisterForm** — `/register/expert`
- Fields: full_name, email, password, expertise_areas (multi-select), experience_years, hourly_rate, country, availability, bio
- Sends `user_type: "expert"` + `expert_name` + `specialty` to Strapi

### Login Form
**LoginForm** — `/login`
- Fields: identifier (email or username), password
- Uses NextAuth `signIn("credentials")` directly
- Works for all user types

### Route Pages (`/frontend/src/app/(auth)/`)
- `/register` — landing page with 3 cards linking to type-specific registration
- `/register/company`, `/register/investor`, `/register/expert` — thin page wrappers
- `/login` — login page

### Registration Flow
1. User fills form with React Hook Form validation
2. Form POSTs to Strapi `/api/auth/local/register` with user_type
3. On success, auto-signs-in via `signIn("credentials")`
4. Redirects to `/dashboard`
5. Errors from Strapi shown in ErrorAlert

## Dependencies Added
- `react-hook-form` — form state and validation
