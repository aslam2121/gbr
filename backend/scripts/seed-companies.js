'use strict';

/**
 * Seed script — creates 50 companies per country (197 countries = 9,850 total).
 *
 * Usage:
 *   STRAPI_TOKEN=your_token node scripts/seed-companies.js
 *
 * Requires Strapi to be running at STRAPI_URL (default http://localhost:1337)
 * and a valid API token passed via STRAPI_TOKEN env var.
 *
 * Create a full-access API token in Strapi Admin → Settings → API Tokens.
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
const CONCURRENCY = 10; // parallel requests

if (!STRAPI_TOKEN) {
  console.error('Error: STRAPI_TOKEN env variable is required.');
  console.error('Create an API token in Strapi Admin → Settings → API Tokens,');
  console.error('then run: STRAPI_TOKEN=your_token node scripts/seed-companies.js');
  process.exit(1);
}

// ── Enums matching Strapi schema exactly ──

const INDUSTRIES = ['tech', 'finance', 'healthcare', 'energy', 'manufacturing', 'logistics', 'education', 'other'];

const EMPLOYEE_COUNTS = ['s_1_10', 's_11_50', 's_51_200', 's_201_500', 's_500_plus'];

const AREAS_OF_SPECIFICATION = [
  'Health', 'Financial services', 'IT', 'Consumer products and services',
  'Logistics and Transportation', 'Business products and services',
  'Construction and real estate', 'Trading', 'Manufacturing',
  'Advertising and marketing', 'Agriculture',
];

const MEMBERSHIP_DURATIONS = ['year 1', 'years 2', 'years 3'];

const CONTINENTS = ['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'];

// ── Country → continent mapping ──

const COUNTRY_CONTINENT = {
  'Afghanistan': 'Asia', 'Albania': 'Europe', 'Algeria': 'Africa', 'Andorra': 'Europe',
  'Angola': 'Africa', 'Antigua & Deps': 'North America', 'Argentina': 'South America',
  'Armenia': 'Asia', 'Australia': 'Oceania', 'Austria': 'Europe', 'Azerbaijan': 'Asia',
  'Bahamas': 'North America', 'Bahrain': 'Asia', 'Bangladesh': 'Asia', 'Barbados': 'North America',
  'Belarus': 'Europe', 'Belgium': 'Europe', 'Belize': 'North America', 'Benin': 'Africa',
  'Bhutan': 'Asia', 'Bolivia': 'South America', 'Bosnia Herzegovina': 'Europe',
  'Botswana': 'Africa', 'Brazil': 'South America', 'Brunei': 'Asia', 'Bulgaria': 'Europe',
  'Burkina': 'Africa', 'Burundi': 'Africa', 'Cambodia': 'Asia', 'Cameroon': 'Africa',
  'Canada': 'North America', 'Cape Verde': 'Africa', 'Central African Rep': 'Africa',
  'Chad': 'Africa', 'Chile': 'South America', 'China': 'Asia', 'Colombia': 'South America',
  'Comoros': 'Africa', 'Congo': 'Africa', 'Congo {Democratic Rep}': 'Africa',
  'Costa Rica': 'North America', 'Croatia': 'Europe', 'Cuba': 'North America',
  'Cyprus': 'Europe', 'Czech Republic': 'Europe', 'Denmark': 'Europe', 'Djibouti': 'Africa',
  'Dominica': 'North America', 'Dominican Republic': 'North America', 'East Timor': 'Asia',
  'Ecuador': 'South America', 'Egypt': 'Africa', 'El Salvador': 'North America',
  'Equatorial Guinea': 'Africa', 'Eritrea': 'Africa', 'Estonia': 'Europe', 'Ethiopia': 'Africa',
  'Fiji': 'Oceania', 'Finland': 'Europe', 'France': 'Europe', 'Gabon': 'Africa',
  'Gambia': 'Africa', 'Georgia': 'Asia', 'Germany': 'Europe', 'Ghana': 'Africa',
  'Greece': 'Europe', 'Grenada': 'North America', 'Guatemala': 'North America',
  'Guinea': 'Africa', 'Guinea-Bissau': 'Africa', 'Guyana': 'South America',
  'Haiti': 'North America', 'Honduras': 'North America', 'Hungary': 'Europe',
  'Iceland': 'Europe', 'India': 'Asia', 'Indonesia': 'Asia', 'Iran': 'Asia', 'Iraq': 'Asia',
  'Ireland {Republic}': 'Europe', 'Israel': 'Asia', 'Italy': 'Europe', 'Ivory Coast': 'Africa',
  'Jamaica': 'North America', 'Japan': 'Asia', 'Jordan': 'Asia', 'Kazakhstan': 'Asia',
  'Kenya': 'Africa', 'Kiribati': 'Oceania', 'Korea North': 'Asia', 'Korea South': 'Asia',
  'Kosovo': 'Europe', 'Kuwait': 'Asia', 'Kyrgyzstan': 'Asia', 'Laos': 'Asia',
  'Latvia': 'Europe', 'Lebanon': 'Asia', 'Lesotho': 'Africa', 'Liberia': 'Africa',
  'Libya': 'Africa', 'Liechtenstein': 'Europe', 'Lithuania': 'Europe', 'Luxembourg': 'Europe',
  'Macedonia': 'Europe', 'Madagascar': 'Africa', 'Malawi': 'Africa', 'Malaysia': 'Asia',
  'Maldives': 'Asia', 'Mali': 'Africa', 'Malta': 'Europe', 'Marshall Islands': 'Oceania',
  'Mauritania': 'Africa', 'Mauritius': 'Africa', 'Mexico': 'North America',
  'Micronesia': 'Oceania', 'Moldova': 'Europe', 'Monaco': 'Europe', 'Mongolia': 'Asia',
  'Montenegro': 'Europe', 'Morocco': 'Africa', 'Mozambique': 'Africa',
  'Myanmar, {Burma}': 'Asia', 'Namibia': 'Africa', 'Nauru': 'Oceania', 'Nepal': 'Asia',
  'Netherlands': 'Europe', 'New Zealand': 'Oceania', 'Nicaragua': 'North America',
  'Niger': 'Africa', 'Nigeria': 'Africa', 'Norway': 'Europe', 'Oman': 'Asia',
  'Pakistan': 'Asia', 'Palau': 'Oceania', 'Panama': 'North America',
  'Papua New Guinea': 'Oceania', 'Paraguay': 'South America', 'Peru': 'South America',
  'Philippines': 'Asia', 'Poland': 'Europe', 'Portugal': 'Europe', 'Qatar': 'Asia',
  'Romania': 'Europe', 'Russian Federation': 'Europe', 'Rwanda': 'Africa',
  'St Kitts & Nevis': 'North America', 'St Lucia': 'North America',
  'Saint Vincent & the Grenadines': 'North America', 'Samoa': 'Oceania',
  'San Marino': 'Europe', 'Sao Tome & Principe': 'Africa', 'Saudi Arabia': 'Asia',
  'Senegal': 'Africa', 'Serbia': 'Europe', 'Seychelles': 'Africa',
  'Sierra Leone': 'Africa', 'Singapore': 'Asia', 'Slovakia': 'Europe', 'Slovenia': 'Europe',
  'Solomon Islands': 'Oceania', 'Somalia': 'Africa', 'South Africa': 'Africa',
  'South Sudan': 'Africa', 'Spain': 'Europe', 'Sri Lanka': 'Asia', 'Sudan': 'Africa',
  'Suriname': 'South America', 'Swaziland': 'Africa', 'Sweden': 'Europe',
  'Switzerland': 'Europe', 'Syria': 'Asia', 'Taiwan': 'Asia', 'Tajikistan': 'Asia',
  'Tanzania': 'Africa', 'Thailand': 'Asia', 'Togo': 'Africa', 'Tonga': 'Oceania',
  'Trinidad & Tobago': 'North America', 'Tunisia': 'Africa', 'Turkey': 'Asia',
  'Turkmenistan': 'Asia', 'Tuvalu': 'Oceania', 'Uganda': 'Africa', 'Ukraine': 'Europe',
  'United Arab Emirates': 'Asia', 'United Kingdom': 'Europe', 'United States': 'North America',
  'Uruguay': 'South America', 'Uzbekistan': 'Asia', 'Vanuatu': 'Oceania',
  'Vatican City': 'Europe', 'Venezuela': 'South America', 'Vietnam': 'Asia',
  'Yemen': 'Asia', 'Zambia': 'Africa', 'Zimbabwe': 'Africa',
};

// ── Country center coordinates ──

const COUNTRY_COORDS = {
  'Afghanistan': [34.53, 69.17], 'Albania': [41.33, 19.82], 'Algeria': [36.75, 3.04],
  'Andorra': [42.51, 1.52], 'Angola': [-8.84, 13.23], 'Antigua & Deps': [17.12, -61.85],
  'Argentina': [-34.60, -58.38], 'Armenia': [40.18, 44.51], 'Australia': [-35.28, 149.13],
  'Austria': [48.21, 16.37], 'Azerbaijan': [40.41, 49.87], 'Bahamas': [25.05, -77.34],
  'Bahrain': [26.23, 50.58], 'Bangladesh': [23.81, 90.41], 'Barbados': [13.10, -59.61],
  'Belarus': [53.90, 27.57], 'Belgium': [50.85, 4.35], 'Belize': [17.25, -88.77],
  'Benin': [6.50, 2.63], 'Bhutan': [27.47, 89.64], 'Bolivia': [-16.49, -68.15],
  'Bosnia Herzegovina': [43.86, 18.41], 'Botswana': [-24.65, 25.91],
  'Brazil': [-15.79, -47.88], 'Brunei': [4.94, 114.95], 'Bulgaria': [42.70, 23.32],
  'Burkina': [12.37, -1.52], 'Burundi': [-3.38, 29.36], 'Cambodia': [11.56, 104.92],
  'Cameroon': [3.87, 11.52], 'Canada': [45.42, -75.70], 'Cape Verde': [14.93, -23.51],
  'Central African Rep': [4.39, 18.56], 'Chad': [12.13, 15.05], 'Chile': [-33.45, -70.67],
  'China': [39.90, 116.40], 'Colombia': [4.71, -74.07], 'Comoros': [-11.70, 43.26],
  'Congo': [-4.27, 15.28], 'Congo {Democratic Rep}': [-4.32, 15.31],
  'Costa Rica': [9.93, -84.08], 'Croatia': [45.81, 15.98], 'Cuba': [23.11, -82.37],
  'Cyprus': [35.17, 33.36], 'Czech Republic': [50.08, 14.42], 'Denmark': [55.68, 12.57],
  'Djibouti': [11.59, 43.15], 'Dominica': [15.30, -61.39],
  'Dominican Republic': [18.47, -69.90], 'East Timor': [-8.56, 125.57],
  'Ecuador': [-0.18, -78.47], 'Egypt': [30.04, 31.24], 'El Salvador': [13.69, -89.19],
  'Equatorial Guinea': [3.75, 8.78], 'Eritrea': [15.33, 38.93], 'Estonia': [59.44, 24.75],
  'Ethiopia': [9.01, 38.75], 'Fiji': [-18.14, 178.44], 'Finland': [60.17, 24.94],
  'France': [48.86, 2.35], 'Gabon': [0.39, 9.45], 'Gambia': [13.45, -16.58],
  'Georgia': [41.72, 44.79], 'Germany': [52.52, 13.41], 'Ghana': [5.60, -0.19],
  'Greece': [37.98, 23.73], 'Grenada': [12.06, -61.75], 'Guatemala': [14.63, -90.51],
  'Guinea': [9.64, -13.58], 'Guinea-Bissau': [11.86, -15.60], 'Guyana': [6.80, -58.16],
  'Haiti': [18.54, -72.34], 'Honduras': [14.07, -87.19], 'Hungary': [47.50, 19.04],
  'Iceland': [64.15, -21.94], 'India': [28.61, 77.21], 'Indonesia': [-6.21, 106.85],
  'Iran': [35.69, 51.39], 'Iraq': [33.31, 44.37], 'Ireland {Republic}': [53.35, -6.26],
  'Israel': [31.77, 35.22], 'Italy': [41.90, 12.50], 'Ivory Coast': [6.83, -5.29],
  'Jamaica': [18.01, -76.79], 'Japan': [35.68, 139.69], 'Jordan': [31.95, 35.93],
  'Kazakhstan': [51.17, 71.43], 'Kenya': [-1.29, 36.82], 'Kiribati': [1.45, 173.00],
  'Korea North': [39.02, 125.75], 'Korea South': [37.57, 126.98],
  'Kosovo': [42.66, 21.17], 'Kuwait': [29.38, 47.99], 'Kyrgyzstan': [42.87, 74.59],
  'Laos': [17.97, 102.63], 'Latvia': [56.95, 24.11], 'Lebanon': [33.89, 35.50],
  'Lesotho': [-29.31, 27.48], 'Liberia': [6.30, -10.80], 'Libya': [32.90, 13.18],
  'Liechtenstein': [47.14, 9.52], 'Lithuania': [54.69, 25.28], 'Luxembourg': [49.61, 6.13],
  'Macedonia': [42.00, 21.43], 'Madagascar': [-18.88, 47.51], 'Malawi': [-13.97, 33.79],
  'Malaysia': [3.14, 101.69], 'Maldives': [4.18, 73.51], 'Mali': [12.64, -8.00],
  'Malta': [35.90, 14.51], 'Marshall Islands': [7.09, 171.38],
  'Mauritania': [18.09, -15.98], 'Mauritius': [-20.16, 57.50],
  'Mexico': [19.43, -99.13], 'Micronesia': [6.92, 158.16], 'Moldova': [47.01, 28.86],
  'Monaco': [43.73, 7.42], 'Mongolia': [47.89, 106.91], 'Montenegro': [42.44, 19.26],
  'Morocco': [33.97, -6.85], 'Mozambique': [-25.97, 32.57],
  'Myanmar, {Burma}': [19.76, 96.07], 'Namibia': [-22.56, 17.08],
  'Nauru': [-0.52, 166.93], 'Nepal': [27.72, 85.32], 'Netherlands': [52.37, 4.90],
  'New Zealand': [-41.29, 174.78], 'Nicaragua': [12.11, -86.27],
  'Niger': [13.51, 2.13], 'Nigeria': [9.08, 7.49], 'Norway': [59.91, 10.75],
  'Oman': [23.59, 58.55], 'Pakistan': [33.69, 73.04], 'Palau': [7.50, 134.62],
  'Panama': [8.98, -79.52], 'Papua New Guinea': [-6.31, 143.96],
  'Paraguay': [-25.26, -57.58], 'Peru': [-12.05, -77.04],
  'Philippines': [14.60, 120.98], 'Poland': [52.23, 21.01], 'Portugal': [38.72, -9.14],
  'Qatar': [25.29, 51.53], 'Romania': [44.43, 26.10],
  'Russian Federation': [55.76, 37.62], 'Rwanda': [-1.94, 29.87],
  'St Kitts & Nevis': [17.30, -62.73], 'St Lucia': [14.01, -60.99],
  'Saint Vincent & the Grenadines': [13.16, -61.23], 'Samoa': [-13.83, -171.76],
  'San Marino': [43.94, 12.46], 'Sao Tome & Principe': [0.34, 6.73],
  'Saudi Arabia': [24.69, 46.72], 'Senegal': [14.72, -17.47],
  'Serbia': [44.79, 20.47], 'Seychelles': [-4.62, 55.45],
  'Sierra Leone': [8.48, -13.23], 'Singapore': [1.35, 103.82],
  'Slovakia': [48.15, 17.11], 'Slovenia': [46.06, 14.51],
  'Solomon Islands': [-9.43, 160.03], 'Somalia': [2.05, 45.32],
  'South Africa': [-25.75, 28.19], 'South Sudan': [4.85, 31.60],
  'Spain': [40.42, -3.70], 'Sri Lanka': [6.93, 79.85], 'Sudan': [15.59, 32.53],
  'Suriname': [5.85, -55.20], 'Swaziland': [-26.31, 31.14], 'Sweden': [59.33, 18.07],
  'Switzerland': [46.95, 7.45], 'Syria': [33.51, 36.29], 'Taiwan': [25.03, 121.57],
  'Tajikistan': [38.56, 68.77], 'Tanzania': [-6.79, 39.28],
  'Thailand': [13.76, 100.50], 'Togo': [6.17, 1.23], 'Tonga': [-21.21, -175.20],
  'Trinidad & Tobago': [10.66, -61.51], 'Tunisia': [36.81, 10.18],
  'Turkey': [39.93, 32.85], 'Turkmenistan': [37.95, 58.38], 'Tuvalu': [-8.52, 179.20],
  'Uganda': [0.35, 32.62], 'Ukraine': [50.45, 30.52],
  'United Arab Emirates': [24.45, 54.65], 'United Kingdom': [51.51, -0.13],
  'United States': [38.91, -77.04], 'Uruguay': [-34.88, -56.17],
  'Uzbekistan': [41.30, 69.28], 'Vanuatu': [-17.73, 168.32],
  'Vatican City': [41.90, 12.45], 'Venezuela': [10.49, -66.88],
  'Vietnam': [21.03, 105.85], 'Yemen': [15.35, 44.21],
  'Zambia': [-15.39, 28.32], 'Zimbabwe': [-17.83, 31.05],
};

// ── Generic descriptions per industry ──

const DESCRIPTIONS = {
  tech: 'Provider of digital solutions and software services.',
  finance: 'Provider of financial advisory and investment services.',
  healthcare: 'Provider of medical supplies and healthcare services.',
  energy: 'Provider of sustainable energy and power solutions.',
  manufacturing: 'Producer of industrial goods and materials.',
  logistics: 'Provider of supply chain and freight services.',
  education: 'Provider of training and educational programs.',
  other: 'Provider of general business services.',
};

// ── Helpers ──

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Seeded random for reproducibility per country+index */
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/** Offset lat/lng from center so 50 companies spread out within ~2 degrees */
function offsetCoord(center, index) {
  const angle = (index / 50) * 2 * Math.PI;
  const radius = 0.3 + seededRandom(index * 137) * 1.7; // 0.3–2.0 degrees
  return [
    +(center[0] + Math.cos(angle) * radius).toFixed(4),
    +(center[1] + Math.sin(angle) * radius).toFixed(4),
  ];
}

function generateCompany(country, index) {
  const continent = COUNTRY_CONTINENT[country];
  const coords = COUNTRY_COORDS[country] || [0, 0];
  const [lat, lng] = offsetCoord(coords, index);
  const industry = INDUSTRIES[index % INDUSTRIES.length];
  const area = AREAS_OF_SPECIFICATION[index % AREAS_OF_SPECIFICATION.length];
  const empCount = EMPLOYEE_COUNTS[index % EMPLOYEE_COUNTS.length];
  const membership = MEMBERSHIP_DURATIONS[index % MEMBERSHIP_DURATIONS.length];
  const num = index + 1;

  // Sanitize country name for use in email (remove special chars)
  const countrySlug = country.toLowerCase().replace(/[^a-z0-9]/g, '');

  return {
    name_of_the_company: `${country} Company ${num}`,
    name_of_the_person: `Person ${num}`,
    email: `company${num}.${countrySlug}@example.com`,
    industry,
    employee_count: empCount,
    area_of_specification: area,
    short_description: `${country} Company ${num} - ${DESCRIPTIONS[industry]}`,
    continent,
    country,
    membership_duration: membership,
    latitude: lat,
    longitude: lng,
    website: `https://company${num}.${countrySlug}.example.com`,
  };
}

// ── Batch runner with concurrency limit ──

async function runBatch(tasks, concurrency) {
  const results = [];
  let index = 0;

  async function next() {
    while (index < tasks.length) {
      const i = index++;
      results[i] = await tasks[i]();
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, () => next());
  await Promise.all(workers);
  return results;
}

// ── Main ──

async function seed() {
  const countries = Object.keys(COUNTRY_CONTINENT);
  const companiesPerCountry = 50;
  const total = countries.length * companiesPerCountry;

  console.log(`Seeding ${total} companies (${companiesPerCountry} per country, ${countries.length} countries)...`);
  console.log(`Strapi URL: ${STRAPI_URL}`);
  console.log(`Concurrency: ${CONCURRENCY}\n`);

  let created = 0;
  let failed = 0;
  let countryIndex = 0;

  for (const country of countries) {
    countryIndex++;
    const companies = [];
    for (let i = 0; i < companiesPerCountry; i++) {
      companies.push(generateCompany(country, i));
    }

    const tasks = companies.map((company) => async () => {
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
          const err = await res.json().catch(() => ({}));
          const msg = err.error?.message || res.statusText;
          failed++;
          return `FAIL: ${company.name_of_the_company} — ${msg}`;
        }

        created++;
        return `OK`;
      } catch (err) {
        failed++;
        return `FAIL: ${company.name_of_the_company} — ${err.message}`;
      }
    });

    await runBatch(tasks, CONCURRENCY);

    // Progress log per country
    const pct = ((countryIndex / countries.length) * 100).toFixed(1);
    process.stdout.write(`\r  [${pct}%] ${countryIndex}/${countries.length} countries | Created: ${created} | Failed: ${failed} | Current: ${country}          `);
  }

  console.log(`\n\nDone! Created: ${created}, Failed: ${failed}, Total attempted: ${total}`);
}

seed().catch((err) => {
  console.error('\nFatal error:', err);
  process.exit(1);
});
