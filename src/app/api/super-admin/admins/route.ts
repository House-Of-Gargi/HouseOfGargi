import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';

const ADMINS_FILE = path.join(process.cwd(), 'src', 'data', 'platform_admins.json');

const INITIAL_ADMINS = [
  {
    id: 'adm-01',
    name: 'Gargi Saha',
    email: 'gargisaha1508@gmail.com',
    role: 'super_admin',
    department: 'Founding Director & Chief Curator',
    status: 'active',
    lastActive: 'Just now',
    createdAt: '2026-01-15',
  },
  {
    id: 'adm-02',
    name: 'Sumit Shaw',
    email: 'shawsumit6286@gmail.com',
    role: 'super_admin',
    department: 'Principal Technology Architect',
    status: 'active',
    lastActive: '5 mins ago',
    createdAt: '2026-01-15',
  },
  {
    id: 'adm-03',
    name: 'Priya Sharma',
    email: 'admin@gargisaha.com',
    role: 'admin',
    department: 'Artisan Onboarding & Operations Desk',
    status: 'active',
    lastActive: '12 mins ago',
    createdAt: '2026-03-01',
  },
  {
    id: 'adm-04',
    name: 'Rajesh Sen',
    email: 'curator@gargisaha.com',
    role: 'admin',
    department: 'Handloom Quality Control & Silk Verification',
    status: 'active',
    lastActive: '1 hour ago',
    createdAt: '2026-04-10',
  },
];

export async function GET() {
  try {
    let admins = INITIAL_ADMINS;
    if (fs.existsSync(ADMINS_FILE)) {
      try {
        admins = JSON.parse(fs.readFileSync(ADMINS_FILE, 'utf8'));
      } catch {}
    } else {
      const dir = path.dirname(ADMINS_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(ADMINS_FILE, JSON.stringify(admins, null, 2), 'utf8');
    }

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

    let admins = INITIAL_ADMINS;
    if (fs.existsSync(ADMINS_FILE)) {
      admins = JSON.parse(fs.readFileSync(ADMINS_FILE, 'utf8'));
    }

    const newAdmin = {
      id: `adm-${Date.now()}`,
      name,
      email: email.toLowerCase().trim(),
      role,
      department: department || 'Operations & Curation',
      status: 'active',
      lastActive: 'Invited',
      createdAt: new Date().toISOString().split('T')[0],
    };

    admins.push(newAdmin);
    fs.writeFileSync(ADMINS_FILE, JSON.stringify(admins, null, 2), 'utf8');

    // Also upsert in Supabase user_roles
    try {
      await supabase.from('user_roles').upsert({
        user_email: newAdmin.email,
        role: newAdmin.role,
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

    let admins = INITIAL_ADMINS;
    if (fs.existsSync(ADMINS_FILE)) {
      admins = JSON.parse(fs.readFileSync(ADMINS_FILE, 'utf8'));
    }

    const target = admins.find((a: any) => a.id === id);
    if (target?.role === 'super_admin' && (target.email === 'gargisaha1508@gmail.com' || target.email === 'shawsumit6286@gmail.com')) {
      return NextResponse.json({ success: false, message: 'Primary Super Admin cannot be removed.' }, { status: 403 });
    }

    admins = admins.filter((a: any) => a.id !== id);
    fs.writeFileSync(ADMINS_FILE, JSON.stringify(admins, null, 2), 'utf8');

    return NextResponse.json({ success: true, message: 'Admin privileges revoked.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message }, { status: 500 });
  }
}
