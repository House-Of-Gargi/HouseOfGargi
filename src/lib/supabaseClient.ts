import { createClient } from '@supabase/supabase-js';

const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();

// Reject any unconfigured template placeholders like 'your-project'
const supabaseUrl = 
  rawUrl && !rawUrl.includes('your-project') && !rawUrl.includes('example.com') && rawUrl.startsWith('https://')
    ? rawUrl
    : 'https://wlivgkosmbfgjtecvznj.supabase.co';

const rawAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim();

const supabaseAnonKey = 
  rawAnonKey && !rawAnonKey.includes('your-anon-key') && rawAnonKey.length > 30
    ? rawAnonKey
    : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsaXZna29zbWJmZ2p0ZWN2em5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MDIyOTMsImV4cCI6MjA5ODQ3ODI5M30.HpO4Zstb2HCJoU8mQbqX1iS2fN-qi6Cg4jjwG-rRR7g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

