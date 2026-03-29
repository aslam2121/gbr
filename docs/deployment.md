# Deployment Guide

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL 15+ (or Docker)
- npm or yarn

### Quick Start

```bash
# 1. Clone and setup
git clone <repo-url>
cd b2b-platform
cp .env.example .env    # fill in values

# 2. Start PostgreSQL (via Docker)
docker compose up postgres -d

# 3. Start Strapi
cd backend
npm install
npm run develop          # http://localhost:1337/admin
# Create your first admin user in the browser

# 4. Start Next.js (new terminal)
cd frontend
npm install
npm run dev              # http://localhost:3000
```

### Docker Compose (Full Stack)

```bash
docker compose up        # starts postgres + strapi + nextjs
docker compose down      # stops everything
docker compose up -d     # detached mode
```

---

## Third-Party Service Setup

### Stripe

1. Create account at https://stripe.com
2. Get test keys from Dashboard → Developers → API keys
3. Create products and prices in Stripe Dashboard matching your subscription plans
4. Copy Price IDs into Strapi's Subscription Plan entries
5. Set up webhook endpoint: `https://your-domain.com/api/stripe/webhook`
6. Listen for events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

**Local webhook testing:**
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Daily.co

1. Create account at https://www.daily.co
2. Get API key from Dashboard → Developers
3. Add to `.env` as `DAILY_API_KEY`
4. Rooms are created programmatically via the API — no manual setup needed

---

## Production Deployment Options

### Option A: VPS (DigitalOcean, Hetzner, AWS EC2)

Best for: full control, cost-effective at scale.

```
Server Setup:
├── Nginx (reverse proxy)
│   ├── yourdomain.com → Next.js (port 3000)
│   └── api.yourdomain.com → Strapi (port 1337)
├── PostgreSQL (managed or self-hosted)
├── PM2 (process manager for Node.js)
└── SSL via Let's Encrypt
```

Deploy with Docker Compose or PM2:
```bash
# PM2 approach
cd backend && pm2 start npm --name strapi -- run start
cd frontend && pm2 start npm --name nextjs -- run start
```

### Option B: Platform Services

| Component | Service | Free Tier? |
|-----------|---------|-----------|
| Strapi | Railway, Render, DigitalOcean App Platform | Limited |
| Next.js | Vercel (recommended), Netlify | Yes |
| PostgreSQL | Supabase, Neon, Railway | Yes |
| Media uploads | Cloudinary, AWS S3 | Yes (limited) |

**Recommended combo:** Vercel (Next.js) + Railway (Strapi + PostgreSQL)

### Option C: Docker on Any Cloud

Use the `docker-compose.yml` with production overrides:
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## Production Checklist

- [ ] Set all environment variables in production
- [ ] Change Strapi `APP_KEYS`, `JWT_SECRET`, `API_TOKEN_SALT` to strong random values
- [ ] Set `NODE_ENV=production` for both services
- [ ] Configure Strapi CORS to allow only your frontend domain
- [ ] Set up Strapi media uploads to cloud storage (S3/Cloudinary) — not local filesystem
- [ ] Enable Stripe live mode keys (replace `sk_test_` with `sk_live_`)
- [ ] Set up Stripe production webhook endpoint
- [ ] Configure Daily.co production domain
- [ ] Set `NEXTAUTH_URL` to production URL
- [ ] Set up SSL certificates
- [ ] Configure database backups
- [ ] Set up error monitoring (Sentry recommended)
- [ ] Enable rate limiting on Strapi API
- [ ] Test all user flows end-to-end
