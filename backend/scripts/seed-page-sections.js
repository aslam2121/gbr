'use strict';

/**
 * Seed script — creates homepage sections.
 *
 * Usage:
 *   STRAPI_TOKEN=your_token node scripts/seed-page-sections.js
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

if (!STRAPI_TOKEN) {
  console.error('Error: STRAPI_TOKEN env variable is required.');
  process.exit(1);
}

const sections = [
  {
    page: 'home',
    order: 1,
    section_type: 'hero',
    title: 'Connect with the right partners to grow your business',
    subtitle: 'Our B2B platform brings together companies, investors, and industry experts in one place. Find funding, discover opportunities, and get expert guidance.',
    cta_text: 'Get Started Free',
    cta_link: '/register',
    is_visible: true,
    metadata: null,
  },
  {
    page: 'home',
    order: 2,
    section_type: 'stats',
    title: 'Trusted by businesses worldwide',
    subtitle: 'Join a growing network of companies, investors, and experts.',
    is_visible: true,
    metadata: {
      stats: [
        { value: '500+', label: 'Companies Listed' },
        { value: '150+', label: 'Active Investors' },
        { value: '200+', label: 'Expert Consultants' },
        { value: '30+', label: 'Countries' },
      ],
    },
  },
  {
    page: 'home',
    order: 3,
    section_type: 'feature_grid',
    title: 'Everything you need to grow',
    subtitle: 'Powerful tools to connect, collaborate, and scale your business globally.',
    is_visible: true,
    metadata: {
      features: [
        {
          icon: 'directory',
          title: 'Company Directory',
          description: 'Browse and discover companies across industries and continents. Filter by sector, size, and location to find the perfect match.',
        },
        {
          icon: 'globe',
          title: 'Interactive World Map',
          description: 'Visualize the global business landscape. Explore companies by geography and find opportunities in emerging markets.',
        },
        {
          icon: 'video',
          title: 'Video & Voice Calls',
          description: 'Connect face-to-face with built-in video conferencing. Schedule calls with investors and experts directly from the platform.',
        },
        {
          icon: 'chart',
          title: 'Analytics Dashboard',
          description: 'Track your profile views, connection requests, and engagement metrics. Make data-driven decisions about your outreach.',
        },
        {
          icon: 'shield',
          title: 'Verified Profiles',
          description: 'Every company and investor goes through a verification process. Connect with confidence knowing profiles are authentic.',
        },
        {
          icon: 'users',
          title: 'Expert Network',
          description: 'Access a curated network of industry experts. Get consulting, mentorship, and strategic guidance from seasoned professionals.',
        },
      ],
    },
  },
  {
    page: 'home',
    order: 4,
    section_type: 'testimonial',
    title: 'What our users say',
    subtitle: 'Hear from companies, investors, and experts who use our platform.',
    is_visible: true,
    metadata: {
      testimonials: [
        {
          quote: 'This platform helped us connect with three investors in our first month. The directory and filtering tools made it incredibly easy to find the right fit for our Series A.',
          name: 'Sarah Chen',
          role: 'CEO',
          company: 'TechNova Inc',
        },
        {
          quote: 'As an investor, I love the world map view. Being able to discover companies by geography and industry has completely changed how I source deals.',
          name: 'Michael Brooks',
          role: 'Managing Partner',
          company: 'Meridian Ventures',
        },
        {
          quote: 'The video call feature is seamless. I can conduct consulting sessions with clients worldwide without leaving the platform. It has doubled my booking rate.',
          name: 'Dr. Amara Okafor',
          role: 'Strategy Consultant',
          company: 'Independent Expert',
        },
      ],
    },
  },
  {
    page: 'home',
    order: 5,
    section_type: 'cta_banner',
    title: 'Ready to find your next business partner?',
    subtitle: 'Join thousands of companies, investors, and experts already on the platform. Create your free account in minutes.',
    cta_text: 'Create Free Account',
    cta_link: '/register',
    is_visible: true,
    metadata: null,
  },
];

async function seed() {
  console.log(`Seeding ${sections.length} page sections to ${STRAPI_URL}...\n`);

  let created = 0;
  let failed = 0;

  for (const section of sections) {
    try {
      const res = await fetch(`${STRAPI_URL}/api/page-sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_TOKEN}`,
        },
        body: JSON.stringify({ data: section }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error(`  FAIL: ${section.section_type} (order ${section.order}) — ${err.error?.message || res.statusText}`);
        failed++;
        continue;
      }

      const result = await res.json();
      console.log(`  OK: ${section.section_type} (order ${section.order}, id: ${result.data.id})`);
      created++;
    } catch (err) {
      console.error(`  FAIL: ${section.section_type} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. Created: ${created}, Failed: ${failed}`);
}

seed();
