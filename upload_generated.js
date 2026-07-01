import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import WebSocket from 'ws';

globalThis.WebSocket = WebSocket;

const supabaseUrl = 'https://wlivgkosmbfgjtecvznj.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsaXZna29zbWJmZ2p0ZWN2em5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjkwMjI5MywiZXhwIjoyMDk4NDc4MjkzfQ.eUX4cEH_NiVUYKxuE0qDQPMQYotruVQS27SpaTVgeyM';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET_NAME = 'images';

async function run() {
  const dirPath = 'C:\\Users\\shaws\\.gemini\\antigravity-ide\\brain\\d85ce9e6-99f9-41bf-b919-2bd612957da8';
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.png'));

  const urls = {};

  for (const file of files) {
    if (!file.includes('_banner') && !file.includes('_split')) continue;
    
    // clean up the filename (remove timestamp)
    // e.g. artisans_banner_1782920544693.png -> artisans_banner.png
    const cleanName = file.replace(/_\d+\.png$/, '.png');
    
    const filePath = path.join(dirPath, file);
    const fileBuffer = fs.readFileSync(filePath);
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(cleanName, fileBuffer, { contentType: 'image/png', upsert: true });
      
    if (error) {
      console.error(`Failed to upload ${cleanName}:`, error.message);
    } else {
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(cleanName);
      urls[cleanName] = publicUrlData.publicUrl;
      console.log(`${cleanName}: ${publicUrlData.publicUrl}`);
    }
  }
  
  fs.writeFileSync('urls.json', JSON.stringify(urls, null, 2));
}
run();
