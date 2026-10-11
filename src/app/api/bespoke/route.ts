import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'bespoke_requests.json');

function saveToLocal(item: any) {
  try {
    let list: any[] = [];
    if (fs.existsSync(DATA_FILE)) {
      list = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
    list.unshift(item);
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.warn('Local bespoke save error:', err);
  }
}

function getFromLocal(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch {}
  return [];
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, category, material, size, details, customerId } = body;

    if (!name || !email || !phone || !details) {
      return NextResponse.json(
        { success: false, message: 'Name, email, phone, and commission details are required.' },
        { status: 400 }
      );
    }

    const requestNumber = `HG-BESP-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRecord = {
      request_number: requestNumber,
      customer_id: customerId || email,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      category: category || 'Sarees',
      material: material?.trim() || '',
      size: size?.trim() || '',
      details: details.trim(),
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Try Supabase insert
    try {
      const { data, error } = await supabase
        .from('bespoke_requests')
        .insert([newRecord])
        .select()
        .single();

      if (!error && data) {
        saveToLocal(data);
        return NextResponse.json({
          success: true,
          requestNumber: data.request_number,
          commission: data,
        });
      }
    } catch (dbErr) {
      console.warn('Supabase bespoke insert skipped:', dbErr);
    }

    // Local JSON fallback
    saveToLocal(newRecord);
    return NextResponse.json({
      success: true,
      requestNumber,
      commission: newRecord,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed processing commission request.' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    try {
      let query = supabase.from('bespoke_requests').select('*').order('created_at', { ascending: false });
      if (email) query = query.eq('email', email.toLowerCase().trim());
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, count: data.length, commissions: data });
      }
    } catch {}

    let local = getFromLocal();
    if (email) {
      local = local.filter((item: any) => item.email?.toLowerCase() === email.toLowerCase().trim());
    }
    return NextResponse.json({ success: true, count: local.length, commissions: local });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
