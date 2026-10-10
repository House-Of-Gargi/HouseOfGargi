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
    const { email, portal } = body;

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

    let emailHtml = '';
    let emailSubject = '';

    if (portal === 'artisan') {
      emailSubject = `${otp} is your House of Gargi Artisan Portal Code`;
      emailHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>House of Gargi Access Code</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #FBF6EE; font-family: 'Georgia', -apple-system, BlinkMacSystemFont, 'Segoe UI', serif; color: #241A15; -webkit-font-smoothing: antialiased;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FBF6EE; padding: 40px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" style="max-width: 540px; background-color: #FFFFFF; border: 1.5px solid #E4D3AE; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 24px rgba(43, 31, 24, 0.06);">
                  <!-- Top Accent Ribbon -->
                  <tr>
                    <td style="background-color: #7A2331; height: 4px; padding: 0; line-height: 4px; font-size: 4px;">&nbsp;</td>
                  </tr>

                  <!-- Header Crest -->
                  <tr>
                    <td align="center" style="padding: 36px 32px 20px 32px; text-align: center; border-bottom: 1px solid #F4EDE0;">
                      <h1 style="margin: 0; font-size: 27px; color: #7A2331; font-weight: 500; letter-spacing: 0.03em; font-family: 'Georgia', serif;">
                        House of Gargi
                      </h1>
                      <p style="margin: 6px 0 0; font-size: 13px; font-style: italic; color: #8C7B70; letter-spacing: 0.04em;">
                        Handcrafted Heritage, Worn Today
                      </p>
                    </td>
                  </tr>

                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 36px 32px 28px 32px; text-align: center;">
                      <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.65; color: #4A3C33;">
                        Welcome to House Of Gargi Artisan Portal. Use the 6-digit one-time OTP below to complete your sign-in:
                      </p>

                      <!-- OTP Card -->
                      <div style="background-color: #FAF7F2; border: 1.5px solid #D4AF37; border-radius: 6px; padding: 18px 28px; margin: 12px auto 24px; display: inline-block;">
                        <span style="font-size: 34px; font-weight: 700; letter-spacing: 10px; color: #7A2331; font-family: 'Courier New', Courier, monospace; display: inline-block; padding-left: 10px;">
                          ${otp}
                        </span>
                      </div>

                      <p style="margin: 0; font-size: 13px; color: #8C7B70; line-height: 1.5;">
                        This access code is valid for <strong>10 minutes</strong> and should not be shared.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="border-top: 1px solid #EAE2D5; background-color: #FAF7F2; padding: 22px 32px; text-align: center; font-size: 12px; color: #8C7B70; line-height: 1.6;">
                      <p style="margin: 0;">
                        Sent securely from <strong style="color: #241A15;">noreply@gargisaha.com</strong>
                      </p>
                      <p style="margin: 4px 0 0; font-size: 11.5px;">
                        If you did not request this OTP, you can safely disregard this email.
                      </p>
                      <p style="margin: 10px 0 0; font-size: 11px; letter-spacing: 0.08em;">
                        <a href="https://gargisaha.com" style="color: #B88E18; text-decoration: none; font-weight: 600;">www.gargisaha.com</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;
    } else {
      // Customer Atelier Login Template
      emailSubject = `${otp} is your one-time access code`;
      emailHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>House of Gargi Access Code</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #FBF6EE; font-family: 'Georgia', -apple-system, BlinkMacSystemFont, 'Segoe UI', serif; color: #241A15; -webkit-font-smoothing: antialiased;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FBF6EE; padding: 40px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" style="max-width: 540px; background-color: #FFFFFF; border: 1.5px solid #E4D3AE; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 24px rgba(43, 31, 24, 0.06);">
                  <!-- Gold Accent Header Bar -->
                  <tr>
                    <td style="background-color: #7A2331; height: 4px; padding: 0; line-height: 4px; font-size: 4px;">&nbsp;</td>
                  </tr>

                  <!-- Header Crest -->
                  <tr>
                    <td align="center" style="padding: 36px 32px 20px 32px; text-align: center; border-bottom: 1px solid #F4EDE0;">
                      <h1 style="margin: 0; font-size: 27px; color: #7A2331; font-weight: 500; letter-spacing: 0.03em; font-family: 'Georgia', serif;">
                        House of Gargi
                      </h1>
                      <p style="margin: 6px 0 0; font-size: 13px; font-style: italic; color: #8C7B70; letter-spacing: 0.04em;">
                        Handcrafted Heritage, Worn Today
                      </p>
                    </td>
                  </tr>

                  <!-- Main Body -->
                  <tr>
                    <td style="padding: 36px 32px 28px 32px; text-align: center;">
                      <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.65; color: #4A3C33;">
                        Welcome to House of Gargi. Use the 6-digit one-time OTP below to complete your sign-in:
                      </p>

                      <!-- OTP Card -->
                      <div style="background-color: #FAF7F2; border: 1.5px solid #D4AF37; border-radius: 6px; padding: 18px 28px; margin: 12px auto 24px; display: inline-block;">
                        <span style="font-size: 34px; font-weight: 700; letter-spacing: 10px; color: #7A2331; font-family: 'Courier New', Courier, monospace; display: inline-block; padding-left: 10px;">
                          ${otp}
                        </span>
                      </div>

                      <p style="margin: 0; font-size: 13px; color: #8C7B70; line-height: 1.5;">
                        This access code is valid for <strong>10 minutes</strong> and should not be shared.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="border-top: 1px solid #EAE2D5; background-color: #FAF7F2; padding: 22px 32px; text-align: center; font-size: 12px; color: #8C7B70; line-height: 1.6;">
                      <p style="margin: 0;">
                        Sent securely from <strong style="color: #241A15;">noreply@gargisaha.com</strong>
                      </p>
                      <p style="margin: 4px 0 0; font-size: 11.5px;">
                        If you did not request this OTP, you can safely disregard this email.
                      </p>
                      <p style="margin: 10px 0 0; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;">
                        <a href="https://gargisaha.com" style="color: #B88E18; text-decoration: none; font-weight: 600;">www.gargisaha.com</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;
    }

    // Send email using Resend SDK
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: NOREPLY_EMAIL,
      to: cleanEmail,
      subject: emailSubject,
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
      message: 'OTP sent successfully.',
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
