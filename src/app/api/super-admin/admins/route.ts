import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

function formatStaffName(email: string): string {
  const clean = email.toLowerCase().trim();
  if (clean.includes('gargisaha')) return 'Gargi Saha';
  if (clean.includes('tanmays')) return 'Tanmay Sagar';
  if (clean.includes('sumitgreat') || clean.includes('sumigreat')) return 'Sumit Great';
  if (clean.includes('shawsumit')) return 'Sumit Shaw';
  if (clean.includes('curator')) return 'Lead Heritage Curator';
  if (clean.includes('admin@')) return 'Operations Manager';
  const local = clean.split('@')[0];
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export async function GET(req: Request) {
  // 1. Try proxy to backend
  try {
    const res = await proxyToBackend(req, '/api/v1/super-admin/admins');
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      if (data?.success && Array.isArray(data.admins) && data.admins.length > 0) {
        return NextResponse.json(data);
      }
    }
  } catch {}

  // 2. Direct Supabase query using privileged service role client
  try {
    const { data: dbRoles, error } = await supabaseAdmin
      .from('user_roles')
      .select('*')
      .in('role', ['admin', 'super_admin'])
      .order('created_at', { ascending: false });

    const seenEmails = new Set<string>();
    const adminsList: any[] = [];

    if (!error && Array.isArray(dbRoles)) {
      for (const r of dbRoles) {
        const email = (r.user_email || '').toLowerCase().trim();
        if (!email || seenEmails.has(email)) continue;
        seenEmails.add(email);

        adminsList.push({
          id: r.id || `adm-${adminsList.length + 1}`,
          name: formatStaffName(email),
          email,
          role: r.role,
          department: r.role === 'super_admin' ? 'Executive Governance' : 'Operations & Curation',
          lastActive: r.updated_at ? r.updated_at.split('T')[0] : 'Today',
          status: 'active',
          createdAt: r.created_at ? r.created_at.split('T')[0] : '2026-10-10',
        });
      }
    }

    // 3. Guarantee authoritative administrators are always present
    const authoritativeDefaults = [
      { email: 'tanmaysaagr@gmail.com', role: 'super_admin', dept: 'Executive Governance' },
      { email: 'sumigreat2705@gmail.com', role: 'admin', dept: 'Operations & Curation' },
      { email: 'shawsumit6286@gmail.com', role: 'super_admin', dept: 'Executive Governance' },
      { email: 'gargisaha1508@gmail.com', role: 'super_admin', dept: 'Executive Governance' },
      { email: 'admin@gargisaha.com', role: 'admin', dept: 'Operations & Curation' },
      { email: 'curator@gargisaha.com', role: 'admin', dept: 'Operations & Curation' },
    ];

    for (const def of authoritativeDefaults) {
      const email = def.email.toLowerCase().trim();
      if (!seenEmails.has(email)) {
        seenEmails.add(email);
        adminsList.push({
          id: `auth-${email.replace(/[^a-z0-9]/g, '-')}`,
          name: formatStaffName(email),
          email,
          role: def.role,
          department: def.dept,
          lastActive: 'Today',
          status: 'active',
          createdAt: '2026-10-10',
        });
      }
    }

    // Sort: super_admin first, then admin
    adminsList.sort((a, b) => {
      if (a.role === 'super_admin' && b.role !== 'super_admin') return -1;
      if (a.role !== 'super_admin' && b.role === 'super_admin') return 1;
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({
      success: true,
      count: adminsList.length,
      admins: adminsList,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error loading admins' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || '').toLowerCase().trim();
    const role = body.role === 'super_admin' ? 'super_admin' : 'admin';

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    // Upsert into Supabase user_roles using service role
    await supabaseAdmin
      .from('user_roles')
      .upsert({
        user_email: email,
        role,
        assigned_by: 'super_admin_console',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_email' });

    // Also forward to backend if available
    try {
      await proxyToBackend(req, '/api/v1/super-admin/admins', {
        method: 'POST',
        body: { email, role, department: body.department },
      });
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Role ${role} assigned to ${email}`,
      admin: {
        id: `adm-${Date.now()}`,
        name: body.name || formatStaffName(email),
        email,
        role,
        department: role === 'super_admin' ? 'Executive Governance' : 'Operations & Curation',
        lastActive: 'Today',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const target = (searchParams.get('email') || searchParams.get('id') || '').toLowerCase().trim();

    if (!target) {
      return NextResponse.json({ success: false, message: 'Admin identifier required' }, { status: 400 });
    }

    if (
      target === 'tanmaysaagr@gmail.com' ||
      target === 'tanmaysaaagr@gmail.com' ||
      target === 'shawsumit6286@gmail.com' ||
      target === 'gargisaha1508@gmail.com'
    ) {
      return NextResponse.json(
        { success: false, message: 'Cannot revoke executive root founder privileges.' },
        { status: 403 }
      );
    }

    // Delete from Supabase user_roles
    await supabaseAdmin
      .from('user_roles')
      .delete()
      .or(`user_email.eq.${target},id.eq.${target}`);

    // Also forward to backend if available
    try {
      await proxyToBackend(req, `/api/v1/super-admin/admins/${encodeURIComponent(target)}`, {
        method: 'DELETE',
      });
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Admin privileges revoked for ${target}`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message }, { status: 500 });
  }
}
