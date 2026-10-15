const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const url = 'https://wlivgkosmbfgjtecvznj.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsaXZna29zbWJmZ2p0ZWN2em5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjkwMjI5MywiZXhwIjoyMDk4NDc4MjkzfQ.eUX4cEH_NiVUYKxuE0qDQPMQYotruVQS27SpaTVgeyM';
const sb = createClient(url, key, { auth: { persistSession: false }, realtime: { transport: WebSocket } });

const CURATED_FEATURED_RANK = [
  'royal-zardozi-lehenga',
  'banarasi-gold-weave',
  'sanganeri-block-print-kurta',
  'kundan-choker-set',
  'kanchipuram-temple-border',
  'chanderi-floral-jaal',
  'gota-patti-lehenga',
  'tussar-block-print',
  'paithani-peacock',
  'chikankari-white-kurta',
  'ajrakh-silk-kurta',
  'meenakari-jhumka',
  'temple-jewellery-set',
  'phulkari-dupatta',
  'chikankari-anarkali-lehenga',
  'mirror-work-lehenga',
  'kalamkari-anarkali-kurta',
  'bandhani-silk-kurta',
];

const SLUG_MAP = {
  'f74771ff-9243-492f-a434-ccfe2b26a286': 'royal-zardozi-lehenga',
  '0bb4b132-4a1e-409b-a9bb-94ab8b88b3b7': 'banarasi-gold-weave',
  'c88b8436-1613-441b-a3c6-92b1b0f64661': 'sanganeri-block-print-kurta',
  '610dd780-9f3b-49d6-8285-407bfb4de67d': 'kundan-choker-set',
  '90bc0c34-9fb1-4d25-bf0b-8c979ac14536': 'kanchipuram-temple-border',
  '3f1db2bb-96ff-4539-8734-f4c2513f7e81': 'chanderi-floral-jaal',
  'c70ba56a-0166-4fcd-b82d-4bf02591a05a': 'tussar-block-print',
  'aa0ea4dd-b7bf-4d79-953b-a7feaa3b16e2': 'paithani-peacock',
  'abab2b08-0f46-4576-bc10-fcc0138cd069': 'gota-patti-lehenga',
  '64acc112-fcaf-4a16-a5e2-ea453775bfcd': 'chikankari-anarkali-lehenga',
  'b13a7dfc-e94f-4c80-9c1e-3817c2c98330': 'mirror-work-lehenga',
  '534baac0-875f-45fa-8eb4-920ae9ed67d3': 'chikankari-white-kurta',
  'c6f66650-c497-4571-bf35-1c7cf6cf9253': 'ajrakh-silk-kurta',
  'c1751cdb-42ae-45c3-b64d-53326b611b0f': 'kalamkari-anarkali-kurta',
  '1e9105e9-45e3-4a51-b92e-c25fb3624c4d': 'bandhani-silk-kurta',
  '16efcc0c-1612-4150-a16b-5b0c28a4d5b7': 'meenakari-jhumka',
  '33d95ab6-a919-4ee5-80a8-c0209efc18ef': 'temple-jewellery-set',
  'e7bc019a-924c-411f-a5f2-93ab4f961252': 'phulkari-dupatta',
};

async function importData() {
  console.log('--- Starting Idempotent Data Import ---');

  // Load JSON files safely
  const dataDir = path.join(__dirname, '..', 'src', 'data');
  const overrides = fs.existsSync(path.join(dataDir, 'product_overrides.json'))
    ? JSON.parse(fs.readFileSync(path.join(dataDir, 'product_overrides.json'), 'utf8'))
    : {};
  const deletedList = fs.existsSync(path.join(dataDir, 'deleted_products.json'))
    ? JSON.parse(fs.readFileSync(path.join(dataDir, 'deleted_products.json'), 'utf8'))
    : [];
  const productNumbers = fs.existsSync(path.join(dataDir, 'product_numbers.json'))
    ? JSON.parse(fs.readFileSync(path.join(dataDir, 'product_numbers.json'), 'utf8'))
    : {};

  const deletedSet = new Set(deletedList.map(s => String(s).toLowerCase().trim()));

  // 1. Fetch products from Supabase
  const { data: dbProducts, error } = await sb.from('products').select('*');
  if (error) {
    console.error('Error querying products:', error);
    return;
  }

  console.log(`Processing ${dbProducts.length} catalog creations in database...`);

  for (const prod of dbProducts) {
    const slug = SLUG_MAP[prod.id] || prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const prodNumber = productNumbers[prod.id] || productNumbers[slug] || `ART-${Math.floor(10000 + Math.random() * 90000)}`;
    const ov = overrides[prod.id] || overrides[slug] || {};

    const isDeleted = deletedSet.has(prod.id.toLowerCase()) || deletedSet.has(slug.toLowerCase()) || Boolean(ov.isDeleted);
    const isHidden = Boolean(ov.isHidden);

    const rankIdx = CURATED_FEATURED_RANK.indexOf(slug);
    const curationRank = rankIdx >= 0 ? rankIdx + 1 : 99;

    const updatePayload = {
      slug,
      product_number: prodNumber,
      is_hidden: isHidden,
      deleted_at: isDeleted ? (prod.deleted_at || new Date().toISOString()) : null,
      stock: ov.stock !== undefined ? Number(ov.stock) : (prod.stock || 10),
      curation_rank: curationRank,
      updated_at: new Date().toISOString(),
    };

    if (ov.price !== undefined) updatePayload.price_in_rupees = Number(ov.price);
    if (ov.name) updatePayload.name = ov.name;
    if (ov.description) updatePayload.description = ov.description;
    if (ov.category) updatePayload.category = ov.category;

    const { error: updErr } = await sb.from('products').update(updatePayload).eq('id', prod.id);
    if (updErr) {
      console.error(`Failed updating ${prod.name}:`, updErr.message);
    } else {
      console.log(`Synced: ${prod.name} (hidden: ${isHidden}, deleted: ${isDeleted}, rank: ${curationRank}, number: ${prodNumber})`);
    }
  }

  // 2. Sync artisan applications if any
  const appsFile = path.join(dataDir, 'artisan_applications.json');
  if (fs.existsSync(appsFile)) {
    const apps = JSON.parse(fs.readFileSync(appsFile, 'utf8'));
    if (Array.isArray(apps) && apps.length > 0) {
      for (const a of apps) {
        if (!a.email) continue;
        const appPayload = {
          application_number: a.applicationNumber || a.id || `APP-${Date.now()}`,
          full_name: a.fullName || a.name || 'Artisan Applicant',
          email: a.email,
          phone: a.phone || '',
          state_region: a.stateRegion || a.region || 'India',
          craft_style: a.craftStyle || a.craft || 'Handloom',
          years_experience: Number(a.yearsExperience) || 5,
          status: a.status || 'pending',
          created_at: a.submittedAt || new Date().toISOString(),
        };
        await sb.from('artisan_applications').upsert(appPayload, { onConflict: 'application_number' });
      }
      console.log(`Synced ${apps.length} artisan applications to Supabase.`);
    }
  }

  // 3. Sync bespoke requests if any
  const bespokeFile = path.join(dataDir, 'bespoke_requests.json');
  if (fs.existsSync(bespokeFile)) {
    const reqs = JSON.parse(fs.readFileSync(bespokeFile, 'utf8'));
    if (Array.isArray(reqs) && reqs.length > 0) {
      for (const b of reqs) {
        if (!b.patronName && !b.patron_name) continue;
        const bPayload = {
          request_number: b.requestNumber || b.id || `BSK-${Date.now()}`,
          patron_name: b.patronName || b.patron_name || 'Patron',
          patron_phone: b.patronPhone || b.patron_phone || '',
          patron_email: b.patronEmail || b.patron_email || 'patron@example.com',
          craft_type: b.craftType || b.craft_type || 'Bespoke Handloom',
          budget_bracket: b.budgetBracket || b.budget_bracket || 'Flexible',
          special_instructions: b.specialInstructions || b.description || '',
          status: b.status || 'inquiry',
          created_at: b.createdAt || new Date().toISOString(),
        };
        await sb.from('bespoke_requests').upsert(bPayload, { onConflict: 'request_number' });
      }
      console.log(`Synced ${reqs.length} bespoke requests to Supabase.`);
    }
  }

  console.log('--- Data Import Complete ---');
}

importData();
