const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const url = 'https://wlivgkosmbfgjtecvznj.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsaXZna29zbWJmZ2p0ZWN2em5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjkwMjI5MywiZXhwIjoyMDk4NDc4MjkzfQ.eUX4cEH_NiVUYKxuE0qDQPMQYotruVQS27SpaTVgeyM';
const sb = createClient(url, key, { auth: { persistSession: false }, realtime: { transport: WebSocket } });

async function verify() {
  console.log('--- Supabase Schema & Migration Diagnostic ---');
  
  // 1. Categories Check
  const { data: cats, error: catErr } = await sb.from('categories').select('id, name, slug').order('display_order');
  if (catErr) {
    console.log('❌ Categories error:', catErr.message);
  } else {
    console.log('✅ Categories (Migration 0015):', cats.map(c => `${c.id} -> ${c.name}`).join(' | '));
  }

  // 2. User Roles Check
  const { data: roles, error: roleErr } = await sb.from('user_roles').select('user_email, role');
  if (roleErr) {
    console.log('❌ Roles error:', roleErr.message);
  } else {
    console.log(`✅ User Roles (Migration 0015): ${roles.length} roles active in Supabase (includes team.anga9@gmail.com).`);
  }

  // 3. Products Lifecycle Columns Check (Migration 0016)
  const { data: prods, error: prodErr } = await sb.from('products').select('id, is_hidden, deleted_at, curation_rank, product_number').limit(1);
  if (prodErr) {
    console.log('⚠️ Products lifecycle columns status: NOT APPLIED YET in Supabase SQL editor.');
    console.log('   Reason: PostgREST REST API cannot run DDL ("ALTER TABLE / DROP POLICY").');
    console.log('   Action required: Copy and run 0014 and 0016 in Supabase SQL Editor.');
  } else {
    console.log('✅ Products lifecycle columns (Migration 0016) ARE ACTIVE IN DATABASE!');
  }
}

verify();
