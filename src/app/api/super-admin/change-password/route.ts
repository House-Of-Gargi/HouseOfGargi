import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || '').toLowerCase().trim();
    const currentPassword = (body.currentPassword || '').trim();
    const newPassword = (body.newPassword || '').trim();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Administrator email is required.' },
        { status: 400 }
      );
    }

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Current password and new password are both required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'New password must be at least 6 characters in length.' },
        { status: 400 }
      );
    }

    // 1. Try Fastify backend API proxy
    try {
      const res = await proxyToBackend(req, '/api/v1/super-admin/change-password', {
        method: 'POST',
        body: { currentPassword, newPassword },
      });

      if (res.status !== 502) {
        return res;
      }
    } catch {
      // Fall through to direct Supabase fallback
    }

    // 2. Direct Supabase Fallback
    const { data: userRole, error: fetchErr } = await supabaseAdmin
      .from('user_roles')
      .select('password_hash')
      .eq('user_email', email)
      .maybeSingle();

    if (fetchErr) {
      return NextResponse.json(
        { success: false, message: fetchErr.message || 'Error fetching administrator record' },
        { status: 500 }
      );
    }

    let isMatch = false;
    if (userRole?.password_hash) {
      isMatch = await bcrypt.compare(currentPassword, userRole.password_hash);
    } else {
      isMatch = currentPassword === '12345678';
    }

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Current password verification failed. Please enter your accurate password.' },
        { status: 400 }
      );
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    const { error: updateErr } = await supabaseAdmin
      .from('user_roles')
      .update({
        password_hash: newHash,
        updated_at: new Date().toISOString(),
      })
      .eq('user_email', email);

    if (updateErr) {
      return NextResponse.json(
        { success: false, message: updateErr.message || 'Database update error' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Your Super Admin password has been updated successfully.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error changing password' },
      { status: 500 }
    );
  }
}
