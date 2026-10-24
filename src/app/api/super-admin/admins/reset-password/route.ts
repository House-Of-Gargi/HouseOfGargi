import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || '').toLowerCase().trim();
    const newPassword = (body.newPassword || '').trim() || '12345678';

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Target administrator email is required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters in length.' },
        { status: 400 }
      );
    }

    // 1. Try Fastify backend API proxy
    try {
      const res = await proxyToBackend(
        req,
        `/api/v1/super-admin/admins/${encodeURIComponent(email)}/reset-password`,
        {
          method: 'POST',
          body: { newPassword },
        }
      );

      if (res.status !== 502 && res.status !== 404) {
        return res;
      }
    } catch {
      // Fall through to direct Supabase fallback
    }

    // 2. Direct Supabase Fallback
    const hash = await bcrypt.hash(newPassword, 12);
    const { error } = await supabaseAdmin
      .from('user_roles')
      .update({
        password_hash: hash,
        updated_at: new Date().toISOString(),
      })
      .eq('user_email', email);

    if (error) {
      if (error.code === '42703') {
        return NextResponse.json(
          { success: false, message: 'Database column pending: Please run migration 0018_admin_password_auth.sql in Supabase SQL Editor.' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, message: error.message || 'Database update error' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Password for ${email} has been successfully reset.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error resetting password' },
      { status: 500 }
    );
  }
}
