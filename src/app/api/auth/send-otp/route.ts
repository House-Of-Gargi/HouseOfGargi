import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { resend, NOREPLY_EMAIL } from '@/lib/resend';

const AUTH_SECRET = process.env.AUTH_SECRET || process.env.RESEND_API_KEY || 'house_of_gargi_vedic_auth_secret_2026';

function generateHmacToken(email: string, otp: string, expiresAt: number): string {
  const payload = `${email.toLowerCase().trim()}:${otp.trim()}:${expiresAt}`;
  return crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    const verificationToken = generateHmacToken(cleanEmail, otp, expiresAt);

    // Luxury Vedic Email Template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>House of Gargi Passcode</title>
      </head>
      <body style="margin: 0; padding: 32px 16px; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Georgia, serif; color: #2C2420;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #FFFFFF; border: 1px solid #E4D3AE; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(122, 35, 49, 0.06);">
          
          <!-- Header Bar -->
          <tr>
            <td style="padding: 28px 24px 20px; text-align: center; background-color: #FAF7F2; border-bottom: 1px solid #E4D3AE;">
              <p style="margin: 0 0 6px 0; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #B88E18; font-weight: 600;">
                ✦ गार्गी सूत्रम् • ATELIER ACCESS
              </p>
              <h1 style="margin: 0; font-size: 24px; font-weight: 400; color: #7A2331; font-family: Georgia, serif; letter-spacing: 0.04em;">
                House of Gargi
              </h1>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px 28px; text-align: center;">
              <h2 style="margin: 0 0 12px 0; font-size: 19px; font-weight: 500; color: #2C2420;">
                Your 6-Digit Patron Passcode
              </h2>
              <p style="margin: 0 0 28px 0; font-size: 14px; line-height: 1.6; color: #5C504A;">
                Please enter the following one-time passcode into the boutique portal to access your private salon wishlist, cart, and patron privileges.
              </p>

              <!-- OTP Code Display Card -->
              <div style="background: #FAF7F2; border: 1px dashed #B88E18; border-radius: 6px; padding: 18px 24px; display: inline-block; margin-bottom: 24px;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 700; letter-spacing: 8px; color: #7A2331;">
                  ${otp}
                </span>
              </div>

              <p style="margin: 0 0 6px 0; font-size: 12.5px; color: #7D7268;">
                This access code is valid for <strong>10 minutes</strong>.
              </p>
              <p style="margin: 0; font-size: 12px; color: #9C9188;">
                If you did not request this login code, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #FAF7F2; border-top: 1px solid #EAE2D5; text-align: center;">
              <p style="margin: 0; font-size: 11.5px; color: #7D7268; letter-spacing: 0.05em;">
                House of Gargi • Handcrafted Heritage, Worn Today<br>
                <a href="https://gargisaha.com" style="color: #B88E18; text-decoration: none;">www.gargisaha.com</a>
              </p>
            </td>
          </tr>

        </table>
      </body>
      </html>
    `;

    // Send email using Resend SDK
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: NOREPLY_EMAIL,
      to: cleanEmail,
      subject: `${otp} is your House of Gargi Atelier access passcode`,
      html: emailHtml,
    });

    if (resendError) {
      console.error('Direct Resend Error:', resendError);
      return NextResponse.json(
        { 
          success: false, 
          message: resendError.message || 'Failed to dispatch email via Resend.',
          error: resendError 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Passcode sent successfully.',
      verificationToken,
      expiresAt,
      resendId: resendData?.id,
    });
  } catch (err: any) {
    console.error('Send OTP API Exception:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Internal server error while sending OTP.' },
      { status: 500 }
    );
  }
}
