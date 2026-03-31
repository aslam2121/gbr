'use strict';

/**
 * Seed script — creates 20 sample companies across 6 continents.
 *
 * Usage:
 *   node scripts/seed-companies.js
 *
 * Requires Strapi to be running at STRAPI_URL (default http://localhost:1337)
 * and a valid API token or admin JWT passed via STRAPI_TOKEN env var.
 *
 * To get a token, log in as admin via:
 *   curl -X POST http://localhost:1337/admin/login \
 *     -H "Content-Type: application/json" \
 *     -d '{"email":"admin@example.com","password":"yourpass"}'
 *
 * Or create a full-access API token in Strapi Admin → Settings → API Tokens.
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

if (!STRAPI_TOKEN) {
  console.error('Error: STRAPI_TOKEN env variable is required.');
  console.error('Create an API token in Strapi Admin → Settings → API Tokens,');
  console.error('then run: STRAPI_TOKEN=your_token node scripts/seed-companies.js');
  process.exit(1);
}

const companies = [
  // North America (4)
  {
    name: 'TechNova Inc',
    description: 'AI-powered enterprise software solutions for Fortune 500 companies.',
    industry: 'tech',
    country: 'United States',
    continent: 'north_america',
    latitude: 37.7749,
    longitude: -122.4194,
    website: 'https://technova.example.com',
    founded_year: 2018,
    employee_count: 's_51_200',
  },
  {
    name: 'MediCore Health',
    description: 'Digital health platform connecting patients with specialists worldwide.',
    industry: 'healthcare',
    country: 'United States',
    continent: 'north_america',
    latitude: 40.7128,
    longitude: -74.006,
    website: 'https://medicore.example.com',
    founded_year: 2020,
    employee_count: 's_11_50',
  },
  {
    name: 'Maple Logistics',
    description: 'Cross-border supply chain and freight management across North America.',
    industry: 'logistics',
    country: 'Canada',
    continent: 'north_america',
    latitude: 43.6532,
    longitude: -79.3832,
    website: 'https://maplelogistics.example.com',
    founded_year: 2015,
    employee_count: 's_201_500',
  },
  {
    name: 'FinEdge Capital',
    description: 'Fintech platform providing real-time analytics for hedge funds.',
    industry: 'finance',
    country: 'United States',
    continent: 'north_america',
    latitude: 41.8781,
    longitude: -87.6298,
    website: 'https://finedge.example.com',
    founded_year: 2019,
    employee_count: 's_11_50',
  },

  // Europe (4)
  {
    name: 'GreenVolt Energy',
    description: 'Renewable energy solutions for commercial and industrial buildings.',
    industry: 'energy',
    country: 'Germany',
    continent: 'europe',
    latitude: 52.52,
    longitude: 13.405,
    website: 'https://greenvolt.example.com',
    founded_year: 2016,
    employee_count: 's_51_200',
  },
  {
    name: 'EduSpark',
    description: 'Online learning platform with AI-driven personalized curriculums.',
    industry: 'education',
    country: 'United Kingdom',
    continent: 'europe',
    latitude: 51.5074,
    longitude: -0.1278,
    website: 'https://eduspark.example.com',
    founded_year: 2021,
    employee_count: 's_11_50',
  },
  {
    name: 'Précision Manufacturing',
    description: 'High-precision CNC machining and aerospace component fabrication.',
    industry: 'manufacturing',
    country: 'France',
    continent: 'europe',
    latitude: 48.8566,
    longitude: 2.3522,
    website: 'https://precision-mfg.example.com',
    founded_year: 2010,
    employee_count: 's_201_500',
  },
  {
    name: 'NordPay',
    description: 'Cross-border payment infrastructure for European SMEs.',
    industry: 'finance',
    country: 'Sweden',
    continent: 'europe',
    latitude: 59.3293,
    longitude: 18.0686,
    website: 'https://nordpay.example.com',
    founded_year: 2022,
    employee_count: 's_1_10',
  },

  // Asia (4)
  {
    name: 'SakuraTech',
    description: 'Robotics and automation for semiconductor manufacturing.',
    industry: 'tech',
    country: 'Japan',
    continent: 'asia',
    latitude: 35.6762,
    longitude: 139.6503,
    website: 'https://sakuratech.example.com',
    founded_year: 2014,
    employee_count: 's_500_plus',
  },
  {
    name: 'BharatHealth',
    description: 'Affordable telemedicine platform serving rural communities in India.',
    industry: 'healthcare',
    country: 'India',
    continent: 'asia',
    latitude: 19.076,
    longitude: 72.8777,
    website: 'https://bharathealth.example.com',
    founded_year: 2019,
    employee_count: 's_51_200',
  },
  {
    name: 'Dragon Logistics',
    description: 'E-commerce fulfillment and last-mile delivery across Southeast Asia.',
    industry: 'logistics',
    country: 'Singapore',
    continent: 'asia',
    latitude: 1.3521,
    longitude: 103.8198,
    website: 'https://dragonlogistics.example.com',
    founded_year: 2017,
    employee_count: 's_201_500',
  },
  {
    name: 'Gulf Energy Solutions',
    description: 'Solar and wind energy installations for commercial projects.',
    industry: 'energy',
    country: 'UAE',
    continent: 'asia',
    latitude: 25.2048,
    longitude: 55.2708,
    website: 'https://gulfenergy.example.com',
    founded_year: 2020,
    employee_count: 's_11_50',
  },

  // South America (3)
  {
    name: 'AgroTech Brasil',
    description: 'Precision agriculture and drone-based crop monitoring platform.',
    industry: 'tech',
    country: 'Brazil',
    continent: 'south_america',
    latitude: -23.5505,
    longitude: -46.6333,
    website: 'https://agrotech.example.com',
    founded_year: 2018,
    employee_count: 's_51_200',
  },
  {
    name: 'Pampas Manufacturing',
    description: 'Automotive parts and industrial equipment manufacturer.',
    industry: 'manufacturing',
    country: 'Argentina',
    continent: 'south_america',
    latitude: -34.6037,
    longitude: -58.3816,
    website: 'https://pampasmfg.example.com',
    founded_year: 2012,
    employee_count: 's_201_500',
  },
  {
    name: 'Andes Finance',
    description: 'Microfinance and lending platform for small businesses.',
    industry: 'finance',
    country: 'Colombia',
    continent: 'south_america',
    latitude: 4.711,
    longitude: -74.0721,
    website: 'https://andesfinance.example.com',
    founded_year: 2021,
    employee_count: 's_11_50',
  },

  // Africa (3)
  {
    name: 'Safari EdTech',
    description: 'Mobile-first education platform for K-12 students in East Africa.',
    industry: 'education',
    country: 'Kenya',
    continent: 'africa',
    latitude: -1.2921,
    longitude: 36.8219,
    website: 'https://safariedtech.example.com',
    founded_year: 2020,
    employee_count: 's_11_50',
  },
  {
    name: 'Lagos HealthHub',
    description: 'Health insurance and clinic management SaaS for West Africa.',
    industry: 'healthcare',
    country: 'Nigeria',
    continent: 'africa',
    latitude: 6.5244,
    longitude: 3.3792,
    website: 'https://lagoshealthhub.example.com',
    founded_year: 2019,
    employee_count: 's_51_200',
  },
  {
    name: 'Cape Solar',
    description: 'Off-grid solar energy systems for residential and commercial use.',
    industry: 'energy',
    country: 'South Africa',
    continent: 'africa',
    latitude: -33.9249,
    longitude: 18.4241,
    website: 'https://capesolar.example.com',
    founded_year: 2017,
    employee_count: 's_51_200',
  },

  // Oceania (2)
  {
    name: 'OceanMind AI',
    description: 'Marine data analytics and ocean sustainability monitoring platform.',
    industry: 'tech',
    country: 'Australia',
    continent: 'oceania',
    latitude: -33.8688,
    longitude: 151.2093,
    website: 'https://oceanmind.example.com',
    founded_year: 2021,
    employee_count: 's_11_50',
  },
  {
    name: 'KiwiGreen Energy',
    description: 'Geothermal and hydroelectric energy solutions for New Zealand.',
    industry: 'energy',
    country: 'New Zealand',
    continent: 'oceania',
    latitude: -36.8485,
    longitude: 174.7633,
    website: 'https://kiwigreen.example.com',
    founded_year: 2016,
    employee_count: 's_51_200',
  },
];

async function seed() {
  console.log(`Seeding ${companies.length} companies to ${STRAPI_URL}...\n`);

  let created = 0;
  let failed = 0;

  for (const company of companies) {
    try {
      const res = await fetch(`${STRAPI_URL}/api/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_TOKEN}`,
        },
        body: JSON.stringify({ data: company }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error(`  FAIL: ${company.name} — ${err.error?.message || res.statusText}`);
        failed++;
        continue;
      }

      const result = await res.json();
      console.log(`  OK: ${company.name} (id: ${result.data.id})`);
      created++;
    } catch (err) {
      console.error(`  FAIL: ${company.name} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. Created: ${created}, Failed: ${failed}`);
}

seed();
