# Coding Conventions & Patterns

Rules and patterns to follow when working in this codebase. Consistency matters for vibe coding — Claude Code needs predictable patterns to extend the project correctly.

---

## File Naming

| Type | Convention | Example |
|------|-----------|---------|
| React components | PascalCase | `CompanyCard.tsx` |
| Pages (App Router) | `page.tsx` in folder | `app/directory/page.tsx` |
| Layouts | `layout.tsx` in folder | `app/dashboard/layout.tsx` |
| Utilities/lib | camelCase | `strapi.ts`, `auth.ts` |
| Hooks | `use` prefix, camelCase | `useAuth.ts`, `useStrapi.ts` |
| Types | camelCase | `company.ts`, `user.ts` |
| Strapi schemas | kebab-case folder, `schema.json` | `company/content-types/company/schema.json` |
| CSS | Tailwind only — no separate CSS files | — |

---

## Component Patterns

### Server vs Client Components

Default to **server components**. Add `"use client"` only when the component needs:
- React hooks (`useState`, `useEffect`, `useRef`)
- Browser APIs (`window`, `document`, `localStorage`)
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- Third-party client libraries (Leaflet, Daily.co)

```typescript
// SERVER component (default) — fetches data directly
// app/directory/page.tsx
import { strapiGet } from '@/lib/strapi';
import { CompanyList } from '@/modules/directory';

export default async function DirectoryPage() {
  const companies = await strapiGet('/companies', { populate: 'logo' });
  return <CompanyList companies={companies.data} />;
}

// CLIENT component — has interactivity
// modules/directory/CompanyFilters.tsx
"use client";
import { useState } from 'react';

export default function CompanyFilters({ onFilterChange }: Props) {
  const [industry, setIndustry] = useState('');
  // ...
}
```

### Component Structure

Every component follows this order:
```typescript
"use client"; // only if needed

// 1. Imports
import { useState } from 'react';
import { SomeType } from '@/types/something';

// 2. Types/interfaces for this component
interface CompanyCardProps {
  company: Company;
  onClick?: () => void;
}

// 3. Component
export default function CompanyCard({ company, onClick }: CompanyCardProps) {
  // hooks first
  const [isHovered, setIsHovered] = useState(false);

  // handlers
  const handleClick = () => { /* ... */ };

  // render
  return (
    <div className="rounded-lg border p-4 hover:shadow-md transition-shadow">
      {/* ... */}
    </div>
  );
}
```

### Module Barrel Exports

Every module has an `index.ts` that exports all public components:
```typescript
// modules/directory/index.ts
export { default as CompanyCard } from './CompanyCard';
export { default as CompanyList } from './CompanyList';
export { default as CompanyFilters } from './CompanyFilters';
```

Page files import from the barrel:
```typescript
// GOOD
import { CompanyCard, CompanyList } from '@/modules/directory';

// BAD
import CompanyCard from '@/modules/directory/CompanyCard';
```

---

## Strapi API Patterns

### Always Use lib/strapi.ts

Never call `fetch` or `axios` directly in components:

```typescript
// GOOD
import { strapiGet } from '@/lib/strapi';
const data = await strapiGet('/companies');

// BAD
const res = await fetch('http://localhost:1337/api/companies');
```

### Filtering Convention

Use Strapi's `qs`-style filter format consistently:
```typescript
// Standard filter pattern
const params = {
  filters: {
    industry: { $eq: 'tech' },
    name: { $containsi: searchQuery },
  },
  populate: 'logo,owner',
  sort: 'name:asc',
  pagination: { page: 1, pageSize: 12 },
};
```

### Strapi Response Handling

Always account for Strapi v5 response structure:
```typescript
// Response shape: { data: [...], meta: { pagination: {...} } }
const response = await strapiGet('/companies', params);
const companies = response.data;           // array of items
const total = response.meta.pagination.total;  // total count

// Single item: { data: { id, attributes: {...} } }
const company = await strapiGet(`/companies/${id}`);
const name = company.data.attributes.name;
```

---

## TypeScript Rules

### No `any`

```typescript
// BAD
const handleData = (data: any) => { ... }

// GOOD
const handleData = (data: Company[]) => { ... }

// If truly unknown, use unknown and narrow
const handleData = (data: unknown) => {
  if (isCompany(data)) { ... }
};
```

### Types Live in /types/

```typescript
// types/company.ts
export interface Company {
  id: number;
  attributes: {
    name: string;
    slug: string;
    industry: Industry;
    country: string;
    // ...
  };
}

export type Industry = 'tech' | 'finance' | 'healthcare' | 'energy' | 'manufacturing' | 'logistics' | 'education' | 'other';
```

### Strapi Response Types

```typescript
// types/strapi.ts
export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: {
    id: number;
    attributes: T;
  };
}

export interface StrapiMedia {
  data: {
    id: number;
    attributes: {
      url: string;
      width: number;
      height: number;
      alternativeText: string | null;
    };
  } | null;
}
```

---

## Tailwind CSS Rules

### Use Utility Classes Only

No custom CSS files, no `@apply`, no CSS modules.

```tsx
// GOOD
<div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">

// BAD
<div className={styles.card}>
```

### Responsive Design Pattern

Mobile-first. Use breakpoint prefixes:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### Color Consistency

Use a consistent palette throughout. Define in `tailwind.config.ts`:
```
Primary:    blue-600 (buttons, links, accents)
Secondary:  gray-600 (body text)
Background: white / gray-50 (sections)
Border:     gray-200
Success:    green-600
Error:      red-600
Warning:    amber-500
```

### Component Spacing

```
Page padding:     px-4 md:px-8 lg:px-16
Section spacing:  py-12 md:py-16 lg:py-20
Card padding:     p-4 md:p-6
Card gap:         gap-4 md:gap-6
```

---

## Form Patterns

All forms use React Hook Form:

```typescript
"use client";
import { useForm } from 'react-hook-form';

interface FormData {
  name: string;
  email: string;
  industry: string;
}

export default function CompanyRegForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await strapiPost('/auth/local/register', { ...data, user_type: 'company' });
      router.push('/dashboard');
    } catch (error) {
      // handle error
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Company Name</label>
        <input
          {...register('name', { required: 'Company name is required' })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Creating...' : 'Register'}
      </button>
    </form>
  );
}
```

---

## Error Handling

### API Calls
```typescript
try {
  const data = await strapiGet('/companies');
  return data;
} catch (error) {
  if (error instanceof StrapiError) {
    if (error.status === 401) redirect('/login');
    if (error.status === 404) notFound();
  }
  throw error; // let error boundary handle it
}
```

### Loading States
```typescript
// Server components: use loading.tsx
// app/directory/loading.tsx
export default function Loading() {
  return <CompanyListSkeleton />;
}

// Client components: use state
const [isLoading, setIsLoading] = useState(true);
```

### Error Boundaries
```typescript
// app/directory/error.tsx
"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="text-center py-12">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <button onClick={reset} className="mt-4 text-blue-600 hover:underline">Try again</button>
    </div>
  );
}
```

---

## Git Conventions

### Branch Naming
```
feature/module-name       feature/blog-module
fix/module-name-issue     fix/directory-search-bug
chore/description         chore/update-dependencies
```

### Commit Messages
```
feat(directory): add industry filter component
fix(auth): handle expired JWT redirect
chore(deps): update strapi to v5.1
docs(modules): add blog module guide
```

### Commit After Each Working Phase
```bash
git add -A && git commit -m "feat(directory): complete company directory module"
```

---

## Environment Variables

### Naming Convention
```
# Strapi backend — plain names
DATABASE_HOST=localhost
STRIPE_SECRET_KEY=sk_test_...

# Next.js frontend — NEXT_PUBLIC_ prefix for client-side
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Next.js server-only — no prefix
NEXTAUTH_SECRET=super-secret-key
DAILY_API_KEY=abc123
```

### Never Commit Secrets
`.env` is in `.gitignore`. Use `.env.example` with placeholder values.
