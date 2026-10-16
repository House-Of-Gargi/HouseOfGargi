import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = (body.token || body.verificationToken || '').trim();

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification session. Please request a new code.' },
        { status: 400 }
      );
    }

    const payload = {
      email: body.email,
      otp: body.otp,
      token,
      expiresAt: body.expiresAt ? Number(body.expiresAt) : undefined,
      portal: body.portal,
    };

    const res = await proxyToBackend(req, '/api/v1/auth/otp/verify', {
      method: 'POST',
      body: payload,
    });

    if (!res.ok) {
      try {
        const errJson = await res.clone().json();
        const msg = String(errJson?.message || '');
        if (
          msg.includes('byte length') ||
          msg.includes('buffer') ||
          msg.includes('timingSafeEqual') ||
          msg.includes('ERR_CRYPTO')
        ) {
          return NextResponse.json(
            { success: false, message: 'Invalid or expired verification code. Please request a new code.' },
            { status: 400 }
          );
        }
      } catch {
        // Continue with original response if json parsing fails
      }
    }

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
}

