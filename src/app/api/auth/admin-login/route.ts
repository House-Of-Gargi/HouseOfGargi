import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import bcrypt from 'bcryptjs';

const SUPER_ADMIN_SEEDS = new Set([
  'tanmaysaaagr@gmail.com',
  'tanmaysaagr@gmail.com',
  'tanmaysaagar@gmail.com',
  'shawsumit6286@gmail.com',
  'gargisaha1508@gmail.com',
]);

const ADMIN_SEEDS = new Set([
  'sumigreat2705@gmail.com',
  'sumitgreat2705@gmail.com',
  'admin@gargisaha.com',
  'curator@gargisaha.com',
]);

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const email = (rawBody.email || '').toLowerCase().trim();
    const password = (rawBody.password || '').trim();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // 1. Try Fastify backend API proxy first
    try {
      const res = await proxyToBackend(req, '/api/v1/auth/admin/login', {
        method: 'POST',
        body: { email, password },
      });

      // If backend responded with valid auth response (200, 401, 403, 400), return it.
      // If 502 (offline) or 404 (endpoint not yet deployed to remote Render), use local fallback.
      if (res.status !== 502 && res.status !== 404) {
        return res;
      }
    } catch {
      // Fall through to direct Supabase fallback
    }

    // 2. Direct Supabase Fallback (if backend dev server is restarting/offline)
    let role: string | null = null;
    if (SUPER_ADMIN_SEEDS.has(email)) {
      role = 'super_admin';
    } else if (ADMIN_SEEDS.has(email)) {
      role = 'admin';
    }

    // Query user_roles table
    const { data: dbRole } = await supabaseAdmin
      .from('user_roles')
      .select('role, password_hash')
      .eq('user_email', email)
      .maybeSingle();

    if (dbRole?.role) {
      role = dbRole.role;
    }

    if (role !== 'admin' && role !== 'super_admin') {
      return NextResponse.json(
        {
          success: false,
          message: 'Access restricted. This email is not registered as an Admin or Super Admin with House of Gargi.',
        },
        { status: 403 }
      );
    }

    // Verify password against stored bcrypt hash, or default '12345678' if not configured
    let isValid = false;
    const storedHash = dbRole?.password_hash;
    if (storedHash) {
      isValid = await bcrypt.compare(password, storedHash);
    } else {
      isValid = password === '12345678';
    }

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid administrative email or password. Please verify your credentials.',
        },
        { status: 401 }
      );
    }

    const sessionToken = `admin_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    return NextResponse.json({
      success: true,
      message: 'Administrative authentication successful.',
      token: sessionToken,
      user: {
        email,
        role,
        authenticatedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Authentication error occurred.' },
      { status: 500 }
    );
  }
}
