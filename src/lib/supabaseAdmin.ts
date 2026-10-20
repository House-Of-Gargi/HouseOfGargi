import { createClient } from '@supabase/supabase-js';

const rawUrl = (
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  ''
).trim();

const supabaseUrl =
  rawUrl && !rawUrl.includes('your-project') && !rawUrl.includes('example.com') && rawUrl.startsWith('https://')
    ? rawUrl
    : 'https://wlivgkosmbfgjtecvznj.supabase.co';

const rawServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

const supabaseServiceKey =
  rawServiceKey && !rawServiceKey.includes('your-service-role-key') && rawServiceKey.length > 30
    ? rawServiceKey
    : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsaXZna29zbWJmZ2p0ZWN2em5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjkwMjI5MywiZXhwIjoyMDk4NDc4MjkzfQ.eUX4cEH_NiVUYKxuE0qDQPMQYotruVQS27SpaTVgeyM';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
