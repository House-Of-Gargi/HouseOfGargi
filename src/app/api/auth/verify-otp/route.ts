import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payload = {
      email: body.email,
      otp: body.otp,
      token: body.token || body.verificationToken,
      expiresAt: body.expiresAt ? Number(body.expiresAt) : undefined,
      portal: body.portal,
    };
    return proxyToBackend(req, '/api/v1/auth/otp/verify', {
      method: 'POST',
      body: payload,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
}
