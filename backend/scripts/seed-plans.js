'use strict';

/**
 * Seed script — creates 9 subscription plans (3 per user type).
 *
 * Usage:
 *   STRAPI_TOKEN=your_token node scripts/seed-plans.js
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

if (!STRAPI_TOKEN) {
  console.error('Error: STRAPI_TOKEN env variable is required.');
  console.error('Create an API token in Strapi Admin → Settings → API Tokens,');
  console.error('then run: STRAPI_TOKEN=your_token node scripts/seed-plans.js');
  process.exit(1);
}

const plans = [
  // ── Company Plans ──
  {
    name: 'Company Free',
    user_type: 'company',
    price_monthly: 0,
    price_yearly: 0,
    stripe_price_id_monthly: null,
    stripe_price_id_yearly: null,
    features: [
      'Basic directory listing',
      '1 company profile',
      '10 contact requests/month',
      'Community support',
    ],
    is_popular: false,
    call_minutes: 0,
    directory_listings: 1,
    max_contacts: 10,
  },
  {
    name: 'Company Pro',
    user_type: 'company',
    price_monthly: 49,
    price_yearly: 470,
    stripe_price_id_monthly: null,
    stripe_price_id_yearly: null,
    features: [
      'Featured directory listing',
      'Up to 3 company profiles',
      '50 contact requests/month',
      '60 min video calls/month',
      'Analytics dashboard',
      'Priority support',
    ],
    is_popular: true,
    call_minutes: 60,
    directory_listings: 3,
    max_contacts: 50,
  },
  {
    name: 'Company Enterprise',
    user_type: 'company',
    price_monthly: 149,
    price_yearly: 1430,
    stripe_price_id_monthly: null,
    stripe_price_id_yearly: null,
    features: [
      'Premium directory placement',
      'Unlimited company profiles',
      'Unlimited contact requests',
      '300 min video calls/month',
      'Advanced analytics & reports',
      'API access',
      'Dedicated account manager',
    ],
    is_popular: false,
    call_minutes: 300,
    directory_listings: 999,
    max_contacts: 999,
  },

  // ── Investor Plans ──
  {
    name: 'Investor Free',
    user_type: 'investor',
    price_monthly: 0,
    price_yearly: 0,
    stripe_price_id_monthly: null,
    stripe_price_id_yearly: null,
    features: [
      'Browse company directory',
      '5 contact requests/month',
      'Basic company profiles',
      'Community support',
    ],
    is_popular: false,
    call_minutes: 0,
    directory_listings: 0,
    max_contacts: 5,
  },
  {
    name: 'Investor Pro',
    user_type: 'investor',
    price_monthly: 79,
    price_yearly: 758,
    stripe_price_id_monthly: null,
    stripe_price_id_yearly: null,
    features: [
      'Full company directory access',
      '30 contact requests/month',
      'Detailed company analytics',
      '90 min video calls/month',
      'Deal flow alerts',
      'Priority support',
    ],
    is_popular: true,
    call_minutes: 90,
    directory_listings: 0,
    max_contacts: 30,
  },
  {
    name: 'Investor Enterprise',
    user_type: 'investor',
    price_monthly: 199,
    price_yearly: 1910,
    stripe_price_id_monthly: null,
    stripe_price_id_yearly: null,
    features: [
      'Premium directory access',
      'Unlimited contact requests',
      'Full company analytics & exports',
      'Unlimited video calls',
      'Custom deal flow pipeline',
      'API access',
      'Dedicated relationship manager',
    ],
    is_popular: false,
    call_minutes: 999,
    directory_listings: 0,
    max_contacts: 999,
  },

  // ── Expert Plans ──
  {
    name: 'Expert Free',
    user_type: 'expert',
    price_monthly: 0,
    price_yearly: 0,
    stripe_price_id_monthly: null,
    stripe_price_id_yearly: null,
    features: [
      'Basic expert profile',
      '5 call bookings/month',
      'Standard visibility',
      'Community support',
    ],
    is_popular: false,
    call_minutes: 30,
    directory_listings: 1,
    max_contacts: 5,
  },
  {
    name: 'Expert Pro',
    user_type: 'expert',
    price_monthly: 39,
    price_yearly: 374,
    stripe_price_id_monthly: null,
    stripe_price_id_yearly: null,
    features: [
      'Featured expert profile',
      '20 call bookings/month',
      'Enhanced visibility & ranking',
      '120 min video calls/month',
      'Client management tools',
      'Priority support',
    ],
    is_popular: true,
    call_minutes: 120,
    directory_listings: 1,
    max_contacts: 20,
  },
  {
    name: 'Expert Enterprise',
    user_type: 'expert',
    price_monthly: 99,
    price_yearly: 950,
    stripe_price_id_monthly: null,
    stripe_price_id_yearly: null,
    features: [
      'Premium expert placement',
      'Unlimited call bookings',
      'Top visibility & featured badge',
      'Unlimited video calls',
      'Advanced client analytics',
      'Custom scheduling page',
      'Dedicated support',
    ],
    is_popular: false,
    call_minutes: 999,
    directory_listings: 1,
    max_contacts: 999,
  },
];

async function seed() {
  console.log(`Seeding ${plans.length} subscription plans to ${STRAPI_URL}...\n`);

  let created = 0;
  let failed = 0;

  for (const plan of plans) {
    try {
      const res = await fetch(`${STRAPI_URL}/api/subscription-plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_TOKEN}`,
        },
        body: JSON.stringify({ data: plan }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error(`  FAIL: ${plan.name} — ${err.error?.message || res.statusText}`);
        failed++;
        continue;
      }

      const result = await res.json();
      console.log(`  OK: ${plan.name} (id: ${result.data.id})`);
      created++;
    } catch (err) {
      console.error(`  FAIL: ${plan.name} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. Created: ${created}, Failed: ${failed}`);
}

seed();
