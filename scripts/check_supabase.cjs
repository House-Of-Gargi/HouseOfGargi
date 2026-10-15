const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// read env from .env.local if present
let url = process.env.NEXT_PUBLIC_SUPABASE_URL;
let key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const envFile = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envFile)) {
  const content = fs.readFileSync(envFile, 'utf8');
  content.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v) {
      const val = v.join('=').trim().replace(/^["']|["']$/g, '');
      if (k.trim() === 'NEXT_PUBLIC_SUPABASE_URL') url = val;
      if (k.trim() === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') key = val;
    }
  });
}

console.log('Using Supabase URL:', url);
const sb = createClient(url, key);

async function check() {
  try {
    const { data, error } = await sb.from('products').select('*');
    console.log('Error:', error);
    console.log('Count:', data?.length);
    if (data && data.length > 0) {
      console.log('Stocks:', data.map(d => ({ id: d.id, name: d.name, stock: d.stock })));
    }
  } catch (e) {
    console.error('Exception:', e);
  }
}

check();
