import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'bespoke_requests.json');

function getFromLocal(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch {}
  return [];
}

function updateInLocal(id: string, updates: any) {
  try {
    if (!fs.existsSync(DATA_FILE)) return;
    let list = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    list = list.map((item: any) => {
      if (item.id === id || item.request_number === id) {
        return { ...item, ...updates, updated_at: new Date().toISOString() };
      }
      return item;
    });
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.warn('Local bespoke update error:', err);
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let commissions: any[] = [];
    try {
      let query = supabase.from('bespoke_requests').select('*').order('created_at', { ascending: false });
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        commissions = data;
      }
    } catch {}

    if (commissions.length === 0) {
      commissions = getFromLocal();
      if (status && status !== 'all') {
        commissions = commissions.filter((c: any) => c.status === status);
      }
    }

    return NextResponse.json({
      success: true,
      count: commissions.length,
      commissions,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, adminNotes, assignedArtisan, adminEmail = 'admin@gargisaha.com' } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Commission ID is required.' }, { status: 400 });
    }

    const updates: any = {
      reviewed_by: adminEmail,
      updated_at: new Date().toISOString(),
    };
    if (status) updates.status = status;
    if (adminNotes !== undefined) updates.admin_notes = adminNotes;
    if (assignedArtisan !== undefined) updates.assigned_artisan = assignedArtisan;

    try {
      const { data, error } = await supabase
        .from('bespoke_requests')
        .update(updates)
        .or(`id.eq.${id},request_number.eq.${id}`)
        .select()
        .single();

      if (!error && data) {
        updateInLocal(id, updates);
        return NextResponse.json({ success: true, commission: data });
      }
    } catch (dbErr) {
      console.warn('Supabase update failed, using local update:', dbErr);
    }

    updateInLocal(id, updates);
    return NextResponse.json({ success: true, message: 'Commission updated successfully.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
