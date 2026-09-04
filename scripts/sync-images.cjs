const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Load environment variables from .env
const envPath = path.join(__dirname, '..', '.env');
const env = {};
if (fs.existsSync(envPath)) {
  const envText = fs.readFileSync(envPath, 'utf-8');
  envText.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) {
      env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.VITE_SUPABASE_URL || 'https://wlivgkosmbfgjtecvznj.supabase.co';
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || '';

const MAPPING = {
  1: { id: 'gota-patti-lehenga', name: 'Gota Patti Festive Lehenga', target: 'lehenga-gota-patti.jpg', category: 'lehengas' },
  2: { id: 'chikankari-anarkali-lehenga', name: 'Chikankari Ivory Anarkali', target: 'lehenga-chikankari.jpg', category: 'lehengas' },
  3: { id: 'mirror-work-lehenga', name: 'Mirror Work Chaniya Choli', target: 'lehenga-mirror-work.jpg', category: 'lehengas' },
  4: { id: 'chikankari-white-kurta', name: 'Chikankari White-on-White Kurta', target: 'kurta-chikankari-white.jpg', category: 'kurta-sets' },
  5: { id: 'ajrakh-silk-kurta', name: 'Ajrakh Silk Kurta Set', target: 'kurta-ajrakh-silk.jpg', category: 'kurta-sets' },
  6: { id: 'kalamkari-anarkali-kurta', name: 'Kalamkari Anarkali Kurta', target: 'kurta-kalamkari.jpg', category: 'kurta-sets' },
  7: { id: 'bandhani-silk-kurta', name: 'Bandhani Silk Festival Kurta', target: 'kurta-bandhani-silk.jpg', category: 'kurta-sets' },
  8: { id: 'meenakari-jhumka', name: 'Meenakari Jhumka Earrings', target: 'accessory-meenakari-jhumka.jpg', category: 'accessories' },
  9: { id: 'temple-jewellery-set', name: 'Temple Jewellery Necklace Set', target: 'accessory-temple-jewellery.jpg', category: 'accessories' },
  10: { id: 'phulkari-dupatta', name: 'Phulkari Silk Dupatta', target: 'accessory-phulkari-dupatta.jpg', category: 'accessories' },
};

const INCOMING_DIR = path.join(__dirname, '..', 'public', 'images', 'incoming');
const PRODUCTS_DIR = path.join(__dirname, '..', 'public', 'images', 'products');
const PRODUCTS_TS = path.join(__dirname, '..', 'src', 'data', 'products.ts');
const SELLER_PRODUCTS_PAGE = path.join(__dirname, '..', 'src', 'app', 'seller', 'products', 'page.tsx');

async function run() {
  console.log('\n🌸 House of Gargi — Royal Image Ingestion & Supabase Sync 🌸\n');

  if (!fs.existsSync(PRODUCTS_DIR)) {
    fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
  }

  const processed = [];

  for (const [numStr, info] of Object.entries(MAPPING)) {
    const num = parseInt(numStr, 10);
    const extensions = ['.png', '.jpg', '.jpeg', '.webp'];

    let foundFile = null;
    let sourceLocation = null;

    // Check incoming dir first, then products dir
    for (const ext of extensions) {
      const incomingCandidate = path.join(INCOMING_DIR, `${num}${ext}`);
      const productsCandidate = path.join(PRODUCTS_DIR, `${num}${ext}`);

      if (fs.existsSync(incomingCandidate)) {
        foundFile = incomingCandidate;
        sourceLocation = 'incoming';
        break;
      } else if (fs.existsSync(productsCandidate)) {
        foundFile = productsCandidate;
        sourceLocation = 'products';
        break;
      }
    }

    if (!foundFile) continue;

    const destinationFile = path.join(PRODUCTS_DIR, info.target);
    console.log(`[Found ${num}] Converting ${path.basename(foundFile)} -> ${info.target}...`);

    try {
      // Process with sharp to ensure standard 3:4 portrait JPEG
      await sharp(foundFile)
        .jpeg({ quality: 90, mozjpeg: true })
        .toFile(destinationFile);

      // Clean up raw numbered file if in incoming
      if (sourceLocation === 'incoming') {
        fs.unlinkSync(foundFile);
      } else if (foundFile !== destinationFile) {
        fs.unlinkSync(foundFile);
      }

      processed.push({ ...info, path: `/images/products/${info.target}` });
      console.log(`  ✓ Saved to ${destinationFile}`);
    } catch (err) {
      console.error(`  ✗ Failed to process ${foundFile}:`, err.message);
    }
  }

  if (processed.length === 0) {
    console.log('No new numbered images found (1.png ... 10.png) in:');
    console.log(`  - ${INCOMING_DIR}`);
    console.log(`  - ${PRODUCTS_DIR}`);
    console.log('\nPlease save your Gemini-generated images as 1.png, 2.png, etc. into either folder and run again!');
    return;
  }

  console.log(`\nSuccessfully ingested ${processed.length} image(s)!`);

  // 1. Update src/data/products.ts
  if (fs.existsSync(PRODUCTS_TS)) {
    let tsContent = fs.readFileSync(PRODUCTS_TS, 'utf-8');
    for (const item of processed) {
      const regex = new RegExp(`(id:\\s*'${item.id}',[\\s\\S]*?images:\\s*\\[)(['"][^'"]+['\"])(\\])`, 'm');
      if (regex.test(tsContent)) {
        tsContent = tsContent.replace(regex, `$1'${item.path}'$3`);
        console.log(`  ✓ Updated ${item.id} in src/data/products.ts`);
      }
    }
    fs.writeFileSync(PRODUCTS_TS, tsContent, 'utf-8');
  }

  // 2. Synchronize to live Supabase database
  if (supabaseUrl && supabaseKey) {
    console.log('\nSynchronizing with live Supabase products table...');
    for (const item of processed) {
      try {
        const encodedName = encodeURIComponent(item.name);
        const res = await fetch(`${supabaseUrl}/rest/v1/products?name=eq.${encodedName}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Prefer: 'return=representation'
          },
          body: JSON.stringify({ image_url: item.path })
        });
        if (res.ok) {
          console.log(`  ✓ Supabase updated for: ${item.name}`);
        } else {
          console.warn(`  ⚠ Supabase status ${res.status} for: ${item.name}`);
        }
      } catch (err) {
        console.error(`  ✗ Supabase sync error for ${item.name}:`, err.message);
      }
    }
  }

  console.log('\n🎉 All done! Ingested, renamed, and synced to live Supabase.');
}

run().catch(console.error);
