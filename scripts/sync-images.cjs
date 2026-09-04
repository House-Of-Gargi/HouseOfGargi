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
  // ── Products (Items 1 to 10) ──
  1: { type: 'product', id: 'gota-patti-lehenga', name: 'Gota Patti Festive Lehenga', target: 'lehenga-gota-patti.jpg', category: 'lehengas' },
  2: { type: 'product', id: 'chikankari-anarkali-lehenga', name: 'Chikankari Ivory Anarkali', target: 'lehenga-chikankari.jpg', category: 'lehengas' },
  3: { type: 'product', id: 'mirror-work-lehenga', name: 'Mirror Work Chaniya Choli', target: 'lehenga-mirror-work.jpg', category: 'lehengas' },
  4: { type: 'product', id: 'chikankari-white-kurta', name: 'Chikankari White-on-White Kurta', target: 'kurta-chikankari-white.jpg', category: 'kurta-sets' },
  5: { type: 'product', id: 'ajrakh-silk-kurta', name: 'Ajrakh Silk Kurta Set', target: 'kurta-ajrakh-silk.jpg', category: 'kurta-sets' },
  6: { type: 'product', id: 'kalamkari-anarkali-kurta', name: 'Kalamkari Anarkali Kurta', target: 'kurta-kalamkari.jpg', category: 'kurta-sets' },
  7: { type: 'product', id: 'bandhani-silk-kurta', name: 'Bandhani Silk Festival Kurta', target: 'kurta-bandhani-silk.jpg', category: 'kurta-sets' },
  8: { type: 'product', id: 'meenakari-jhumka', name: 'Meenakari Jhumka Earrings', target: 'accessory-meenakari-jhumka.jpg', category: 'accessories' },
  9: { type: 'product', id: 'temple-jewellery-set', name: 'Temple Jewellery Necklace Set', target: 'accessory-temple-jewellery.jpg', category: 'accessories' },
  10: { type: 'product', id: 'phulkari-dupatta', name: 'Phulkari Silk Dupatta', target: 'accessory-phulkari-dupatta.jpg', category: 'accessories' },

  // ── Section 1: Explore More Collections Cards (Screenshot 1: Items 11 to 13) ──
  11: { type: 'collection', subType: 'explore', categoryId: 'sarees', name: 'Explore Sarees Lookbook', target: 'explore-sarees.jpg', dir: 'collections' },
  12: { type: 'collection', subType: 'explore', categoryId: 'lehengas', name: 'Explore Lehengas Lookbook', target: 'explore-lehengas.jpg', dir: 'collections' },
  13: { type: 'collection', subType: 'explore', categoryId: 'accessories', name: 'Explore Accessories Lookbook', target: 'explore-accessories.jpg', dir: 'collections' },

  // ── Section 2: Shop by Collection Homepage Tiles (Screenshot 2: Items 14 to 17) ──
  14: { type: 'collection', subType: 'tile', categoryId: 'sarees', name: 'Shop Sarees Tile', target: 'collection-sarees.jpg', dir: 'collections' },
  15: { type: 'collection', subType: 'tile', categoryId: 'lehengas', name: 'Shop Lehengas Tile', target: 'collection-lehengas.jpg', dir: 'collections' },
  16: { type: 'collection', subType: 'tile', categoryId: 'kurta-sets', name: 'Shop Kurta Sets Tile', target: 'collection-kurtas.jpg', dir: 'collections' },
  17: { type: 'collection', subType: 'tile', categoryId: 'accessories', name: 'Shop Accessories Tile', target: 'collection-accessories.jpg', dir: 'collections' },

  // ── Bonus Complete Coverage: Explore Kurta Sets Lookbook ──
  18: { type: 'collection', subType: 'explore', categoryId: 'kurta-sets', name: 'Explore Kurta Sets Lookbook', target: 'explore-kurtas.jpg', dir: 'collections' },
};

const INCOMING_DIR = path.join(__dirname, '..', 'public', 'images', 'incoming');
const PRODUCTS_DIR = path.join(__dirname, '..', 'public', 'images', 'products');
const COLLECTIONS_DIR = path.join(__dirname, '..', 'public', 'images', 'collections');
const PRODUCTS_TS = path.join(__dirname, '..', 'src', 'data', 'products.ts');

async function run() {
  console.log('\n🌸 House of Gargi — Royal Image Ingestion & Sync Pipeline 🌸\n');

  if (!fs.existsSync(PRODUCTS_DIR)) fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
  if (!fs.existsSync(COLLECTIONS_DIR)) fs.mkdirSync(COLLECTIONS_DIR, { recursive: true });

  const processed = [];

  for (const [numStr, info] of Object.entries(MAPPING)) {
    const num = parseInt(numStr, 10);
    const extensions = ['.png', '.jpg', '.jpeg', '.webp'];

    let foundFile = null;
    let sourceLocation = null;

    // Check incoming dir, products dir, and collections dir
    for (const ext of extensions) {
      const incomingCandidate = path.join(INCOMING_DIR, `${num}${ext}`);
      const productsCandidate = path.join(PRODUCTS_DIR, `${num}${ext}`);
      const collectionsCandidate = path.join(COLLECTIONS_DIR, `${num}${ext}`);

      if (fs.existsSync(incomingCandidate)) {
        foundFile = incomingCandidate;
        sourceLocation = 'incoming';
        break;
      } else if (fs.existsSync(productsCandidate)) {
        foundFile = productsCandidate;
        sourceLocation = 'products';
        break;
      } else if (fs.existsSync(collectionsCandidate)) {
        foundFile = collectionsCandidate;
        sourceLocation = 'collections';
        break;
      }
    }

    if (!foundFile) continue;

    const targetSubDir = info.dir === 'collections' ? COLLECTIONS_DIR : PRODUCTS_DIR;
    const destinationFile = path.join(targetSubDir, info.target);
    const webPath = info.dir === 'collections' 
      ? `/images/collections/${info.target}` 
      : `/images/products/${info.target}`;

    console.log(`[Found ${num}] Converting ${path.basename(foundFile)} -> ${info.target}...`);

    try {
      // Process with sharp to ensure standard 3:4 portrait JPEG
      await sharp(foundFile)
        .jpeg({ quality: 90, mozjpeg: true })
        .toFile(destinationFile);

      // Clean up raw numbered file
      if (foundFile !== destinationFile) {
        fs.unlinkSync(foundFile);
      }

      processed.push({ ...info, path: webPath });
      console.log(`  ✓ Saved to ${destinationFile}`);
    } catch (err) {
      console.error(`  ✗ Failed to process ${foundFile}:`, err.message);
    }
  }

  if (processed.length === 0) {
    console.log('No new numbered images found (1.png ... 18.png) in:');
    console.log(`  - ${INCOMING_DIR}`);
    console.log(`  - ${PRODUCTS_DIR}`);
    console.log(`  - ${COLLECTIONS_DIR}`);
    console.log('\nPlease save your Gemini-generated images as 11.png, 12.png, etc. into either folder and run again!');
    return;
  }

  console.log(`\nSuccessfully processed ${processed.length} image(s)!`);

  // 1. Update src/data/products.ts
  if (fs.existsSync(PRODUCTS_TS)) {
    let tsContent = fs.readFileSync(PRODUCTS_TS, 'utf-8');

    for (const item of processed) {
      if (item.type === 'product') {
        const regex = new RegExp(`(id:\\s*'${item.id}',[\\s\\S]*?images:\\s*\\[)(['"][^'"]+['\"])(\\])`, 'm');
        if (regex.test(tsContent)) {
          tsContent = tsContent.replace(regex, `$1'${item.path}'$3`);
          console.log(`  ✓ Updated product ${item.id} in src/data/products.ts`);
        }
      } else if (item.type === 'collection') {
        const field = item.subType === 'explore' ? 'exploreImage' : 'collectionTileImage';
        const catRegex = new RegExp(`(id:\\s*'${item.categoryId}',[\\s\\S]*?${field}:\\s*)(['"][^'"]+['\"])`, 'm');
        if (catRegex.test(tsContent)) {
          tsContent = tsContent.replace(catRegex, `$1'${item.path}'`);
          console.log(`  ✓ Updated category ${item.categoryId} ${field} in src/data/products.ts`);
        }
      }
    }
    fs.writeFileSync(PRODUCTS_TS, tsContent, 'utf-8');
  }

  // 2. Synchronize products to live Supabase database
  const productUpdates = processed.filter(p => p.type === 'product');
  if (supabaseUrl && supabaseKey && productUpdates.length > 0) {
    console.log('\nSynchronizing with live Supabase products table...');
    for (const item of productUpdates) {
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

  console.log('\n🎉 Pipeline complete! Images converted and synced.');
}

run().catch(console.error);
