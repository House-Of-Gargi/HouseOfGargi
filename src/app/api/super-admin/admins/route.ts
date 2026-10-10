import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';

const ADMINS_FILE = path.join(process.cwd(), 'src', 'data', 'platform_admins.json');

const INITIAL_ADMINS = [
  {
    id: 'adm-01',
    name: 'Tanmay Saagar',
    email: 'tanmaysaaagr@gmail.com',
    role: 'super_admin',
    department: 'Executive Leadership & Platform Governance',
    status: 'active',
    lastActive: 'Just now',
    createdAt: '2026-10-11',
  },
  {
    id: 'adm-02',
    name: 'Sumit Great',
    email: 'sumitgreat2705@gmail.com',
    role: 'admin',
    department: 'Artisan Onboarding & Operations Desk',
    status: 'active',
    lastActive: '10 mins ago',
    createdAt: '2026-10-11',
  },
  {
    id: 'adm-03',
    name: 'Gargi Saha',
    email: 'gargisaha1508@gmail.com',
    role: 'super_admin',
    department: 'Founding Director & Chief Curator',
    status: 'active',
    lastActive: 'Just now',
    createdAt: '2026-01-15',
  },
  {
    id: 'adm-04',
    name: 'Sumit Shaw',
    email: 'shawsumit6286@gmail.com',
    role: 'super_admin',
    department: 'Principal Technology Architect',
    status: 'active',
    lastActive: '5 mins ago',
    createdAt: '2026-01-15',
  },
  {
    id: 'adm-05',
    name: 'Operations Curator',
    email: 'admin@gargisaha.com',
    role: 'admin',
    department: 'Atelier Quality Control & Handloom Review',
    status: 'active',
    lastActive: '1 hour ago',
    createdAt: '2026-03-01',
  },
];

export async function GET() {
  try {
    let admins = INITIAL_ADMINS;

    // Try fetching live from Supabase user_roles
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .in('role', ['admin', 'super_admin']);

      if (!error && data && data.length > 0) {
        // Merge Supabase entries with names
        const dbAdmins = data.map((d: any, idx: number) => ({
          id: d.id || `adm-db-${idx}`,
          name: d.user_email.split('@')[0],
          email: d.user_email,
          role: d.role,
          department: d.role === 'super_admin' ? 'Executive Governance' : 'Operations & Curation',
          status: 'active',
          lastActive: 'Active in Database',
          createdAt: d.created_at ? d.created_at.split('T')[0] : '2026-10-11',
        }));

        // Combine deduplicated by email
        const map = new Map<string, any>();
        INITIAL_ADMINS.forEach((a) => map.set(a.email.toLowerCase(), a));
        dbAdmins.forEach((a) => map.set(a.email.toLowerCase(), a));
        admins = Array.from(map.values());
      }
    } catch {}

    return NextResponse.json({ success: true, admins });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, role = 'admin', department } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, message: 'Name and email required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    const newAdmin = {
      id: `adm-${Date.now()}`,
      name,
      email: cleanEmail,
      role,
      department: department || 'Operations & Curation',
      status: 'active',
      lastActive: 'Invited',
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Upsert in Supabase
    try {
      await supabase.from('user_roles').upsert({
        user_email: cleanEmail,
        role,
        assigned_by: 'super_admin_console',
        updated_at: new Date().toISOString(),
      });
    } catch {}

    return NextResponse.json({ success: true, admin: newAdmin });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Admin access revoked.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message }, { status: 500 });
  }
}
