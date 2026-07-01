import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import WebSocket from 'ws';

globalThis.WebSocket = WebSocket;

const supabaseUrl = 'https://wlivgkosmbfgjtecvznj.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsaXZna29zbWJmZ2p0ZWN2em5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjkwMjI5MywiZXhwIjoyMDk4NDc4MjkzfQ.eUX4cEH_NiVUYKxuE0qDQPMQYotruVQS27SpaTVgeyM';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET_NAME = 'images'; // Standard name for image buckets

async function run() {
  await supabase.storage.createBucket(BUCKET_NAME, { public: true });
  
  const images = [
    'artisans_hero.png',
    'sustainability_hero.png',
    'press_hero.png',
    'size_guide_hero.png'
  ];

  const urls = {};

  for (const img of images) {
    const filePath = path.join(process.cwd(), 'src/assets', img);
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      continue;
    }
    
    const fileBuffer = fs.readFileSync(filePath);
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(img, fileBuffer, { contentType: 'image/png', upsert: true });
      
    if (error) {
      console.error(`Failed to upload ${img}:`, error.message);
    } else {
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(img);
      urls[img] = publicUrlData.publicUrl;
      console.log(`${img}: ${publicUrlData.publicUrl}`);
    }
  }
  
  fs.writeFileSync('urls.json', JSON.stringify(urls, null, 2));
}
run();
