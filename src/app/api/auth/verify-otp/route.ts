import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getUserRole } from '@/lib/rbac';

const AUTH_SECRET = process.env.AUTH_SECRET || (process.env.NODE_ENV !== 'production' ? 'house_of_gargi_dev_auth_secret_only' : '');

function generateHmacToken(email: string, otp: string, expiresAt: number): string {
  const payload = `${email.toLowerCase().trim()}:${otp.trim()}:${expiresAt}`;
  return crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp, verificationToken, expiresAt, portal, role } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Email and OTP are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    // Verify cryptographic HMAC signature (test mode only active if explicitly enabled in non-production)
    const allowTestOtp = process.env.NODE_ENV !== 'production' && process.env.ALLOW_TEST_OTP === 'true';
    const isSpecialTest = Boolean(allowTestOtp && process.env.TEST_OTP_CODE && cleanOtp === process.env.TEST_OTP_CODE);

    if (!isSpecialTest) {
      if (!verificationToken || !expiresAt) {
        return NextResponse.json(
          { success: false, message: 'Missing OTP session. Please request a new OTP.' },
          { status: 400 }
        );
      }

      if (Date.now() > Number(expiresAt)) {
        return NextResponse.json(
          { success: false, message: 'OTP has expired. Please request a fresh OTP.' },
          { status: 400 }
        );
      }

      const expectedToken = generateHmacToken(cleanEmail, cleanOtp, Number(expiresAt));
      const tokenBuf = Buffer.from(verificationToken, 'hex');
      const expectedBuf = Buffer.from(expectedToken, 'hex');

      if (tokenBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(tokenBuf, expectedBuf)) {
        return NextResponse.json(
          { success: false, message: 'Invalid 6-digit OTP. Please check and try again.' },
          { status: 400 }
        );
      }
    }

    // Resolve user's actual role using strict RBAC
    let actualRole = await getUserRole(cleanEmail);

    // If logging into the Artisan Atelier portal, ensure role is 'artisan' (unless super_admin/admin)
    if (
      (portal === 'artisan' || portal === 'seller' || role === 'artisan') &&
      actualRole !== 'admin' &&
      actualRole !== 'super_admin'
    ) {
      actualRole = 'artisan';
    }

    if (portal === 'admin' && actualRole !== 'admin' && actualRole !== 'super_admin') {
      return NextResponse.json(
        { success: false, message: 'Access denied. Account is not registered with Administrative privileges.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        id: `user_${Date.now()}`,
        role: actualRole,
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
