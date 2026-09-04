import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.VITE_SUPABASE_URL || 
  'https://wlivgkosmbfgjtecvznj.supabase.co';

const supabaseAnonKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsaXZna29zbWJmZ2p0ZWN2em5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MDIyOTMsImV4cCI6MjA5ODQ3ODI5M30.HpO4Zstb2HCJoU8mQbqX1iS2fN-qi6Cg4jjwG-rRR7g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
