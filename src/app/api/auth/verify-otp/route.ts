import { NextResponse } from 'next/server';
import crypto from 'crypto';

const AUTH_SECRET = process.env.AUTH_SECRET || process.env.RESEND_API_KEY || 'house_of_gargi_vedic_auth_secret_2026';

function generateHmacToken(email: string, otp: string, expiresAt: number): string {
  const payload = `${email.toLowerCase().trim()}:${otp.trim()}:${expiresAt}`;
  return crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp, verificationToken, expiresAt, role } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Email and OTP are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    // Built-in Demo Code Bypass
    if (cleanOtp === '123456' || cleanEmail === 'patron@gargisaha.com' || cleanEmail === 'artisan@gargisaha.com') {
      return NextResponse.json({
        success: true,
        user: {
          email: cleanEmail,
          name: cleanEmail.split('@')[0],
          id: `user_${Date.now()}`,
          role: role || 'artisan',
        },
      });
    }

    if (!verificationToken || !expiresAt) {
      return NextResponse.json(
        { success: false, message: 'Missing OTP session. Please request a new OTP.' },
        { status: 400 }
      );
    }

    // Check expiry
    if (Date.now() > Number(expiresAt)) {
      return NextResponse.json(
        { success: false, message: 'OTP has expired. Please request a fresh OTP.' },
        { status: 400 }
      );
    }

    // Verify cryptographic HMAC signature
    const expectedToken = generateHmacToken(cleanEmail, cleanOtp, Number(expiresAt));

    const tokenBuf = Buffer.from(verificationToken, 'hex');
    const expectedBuf = Buffer.from(expectedToken, 'hex');

    if (tokenBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(tokenBuf, expectedBuf)) {
      return NextResponse.json(
        { success: false, message: 'Invalid 6-digit OTP. Please check and try again.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        id: `artisan_${Date.now()}`,
        role: role || 'artisan',
      },
    });
  } catch (err: any) {
    console.error('Verify OTP API Exception:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Error verifying OTP.' },
      { status: 500 }
    );
  }
}
