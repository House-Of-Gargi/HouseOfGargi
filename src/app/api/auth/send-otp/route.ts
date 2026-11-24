import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { resend, NOREPLY_EMAIL } from '@/lib/resend';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import localApplications from '@/data/artisan_applications.json';

const AUTH_SECRET = process.env.AUTH_SECRET || 'house_of_gargi_vedic_auth_secret_2026';

const MASTER_ARTISAN_PHONES = new Set([
  '9876543210',
  '919876543210',
  '+919876543210',
]);

function generateHmacToken(identifier: string, otp: string, expiresAt: number): string {
  const payload = `${identifier.toLowerCase().trim()}:${otp.trim()}:${expiresAt}`;
  return crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
}

function getMasterArtisanName(): string {
  try {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'src/data/artisan_profiles_list.json');
    if (fs.existsSync(filePath)) {
      const list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const master = list.find((p: any) => p.artisanNo?.toLowerCase() === 'hg-84192' || p.id === 'HG-ART-260501');
      if (master?.name) return master.name;
    }
  } catch {}
  return 'Gopal Chandra De';
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawPhone = (body.phone || '').toString().trim();
    const cleanEmail = (body.email || '').toLowerCase().trim();
    const portal = (body.portal || 'customer').toLowerCase().trim();

    // 0. Phone OTP Handling
    if (rawPhone) {
      let cleanDigits = rawPhone.replace(/^\+91\s*/, '').replace(/\D/g, '');
      if (cleanDigits.startsWith('91') && cleanDigits.length > 10) {
        cleanDigits = cleanDigits.slice(2);
      }
      cleanDigits = cleanDigits.slice(-10);

      if (cleanDigits.length !== 10) {
        return NextResponse.json(
          { success: false, message: 'Please enter a valid 10-digit mobile number.' },
          { status: 400 }
        );
      }

      // Check if already registered when applying as artisan
      if (portal === 'artisan_apply' || portal === 'artisan') {
        if (cleanDigits === '9876543210' || MASTER_ARTISAN_PHONES.has(cleanDigits)) {
          const masterName = getMasterArtisanName();
          return NextResponse.json({
            success: false,
            alreadyRegistered: true,
            artisanName: masterName,
            message: `This mobile number is already registered with Master Artisan ${masterName}. Please sign in to your artisan portal.`,
          }, { status: 400 });
        }

        // Check local applications
        try {
          const matchedLocal = (localApplications as any[]).find(app => {
            const p = (app.phone || '').replace(/\D/g, '').slice(-10);
            return p === cleanDigits;
          });
          if (matchedLocal) {
            return NextResponse.json({
              success: false,
              alreadyRegistered: true,
              artisanName: matchedLocal.name || 'Registered Artisan',
              message: `This mobile number is already registered with an artisan account (${matchedLocal.name || 'Artisan'}). Please log in instead.`,
            }, { status: 400 });
          }
        } catch {}

        // Check Supabase artisan_applications
        try {
          const { data: matchedApp } = await supabaseAdmin
            .from('artisan_applications')
            .select('id, name, phone, status')
            .ilike('phone', `%${cleanDigits}%`)
            .neq('status', 'rejected')
            .limit(1)
            .maybeSingle();

          if (matchedApp) {
            return NextResponse.json({
              success: false,
              alreadyRegistered: true,
              artisanName: matchedApp.name || 'Registered Artisan',
              message: `This mobile number is already registered with an artisan account (${matchedApp.name || 'Artisan'}). Please log in instead.`,
            }, { status: 400 });
          }
        } catch {}

        // Check Supabase artisan_profiles
        try {
          const { data: matchedProfile } = await supabaseAdmin
            .from('artisan_profiles')
            .select('id, full_name, phone')
            .ilike('phone', `%${cleanDigits}%`)
            .limit(1)
            .maybeSingle();

          if (matchedProfile) {
            return NextResponse.json({
              success: false,
              alreadyRegistered: true,
              artisanName: matchedProfile.full_name || 'Registered Artisan',
              message: `This mobile number is already registered with an artisan account (${matchedProfile.full_name || 'Artisan'}). Please log in instead.`,
            }, { status: 400 });
          }
        } catch {}
      }

      // Generate OTP and verification token
      const otp = crypto.randomInt(100000, 1000000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
      const verificationToken = generateHmacToken(`phone:${cleanDigits}`, otp, expiresAt);

      // Attempt Supabase SMS dispatch if configured
      try {
        await supabaseAdmin.auth.signInWithOtp({
          phone: `+91${cleanDigits}`,
        });
      } catch (smsErr) {
        console.warn('[Phone OTP SMS dispatch notice]:', smsErr);
      }

      return NextResponse.json({
        success: true,
        message: `Verification code sent to +91 ${cleanDigits}.`,
        token: verificationToken,
        verificationToken,
        expiresAt,
        phone: cleanDigits,
        debugOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
      });
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Administrative access is strictly restricted to email and password authentication at /admin/login.
    if (portal === 'admin') {
      return NextResponse.json(
        {
          success: false,
          message: 'Administrative portal access requires email and password authentication at /admin/login.',
        },
        { status: 403 }
      );
    }

    // 1. Direct Resend Dispatch (Strictly Customer or Artisan Template Only)
    // There is NO administrative template in this system.
    const otp = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    const verificationToken = generateHmacToken(cleanEmail, otp, expiresAt);

    const isArtisan = portal === 'artisan';
    let emailSubject = '';
    let emailTitle = '';
    let emailSubtitle = '';
    let bodyContent = '';
    let expiryNotice = '';

    if (isArtisan) {
      emailSubject = `${otp} is your House of Gargi Artisan Portal Access Code`;
      emailTitle = 'House of Gargi Artisan Portal Access Code';
      emailSubtitle = 'ARTISAN PORTAL';
      bodyContent = `
        <p style="margin: 0 0 16px 0; font-size: 15px; color: #4A3C33; line-height: 1.65;">
          Artisan workshop login requested for <a href="mailto:${cleanEmail}" style="color: #0b57d0; text-decoration: underline; font-weight: 600;">${cleanEmail}</a>.
        </p>
        <p style="margin: 0 0 20px 0; font-size: 13.5px; color: #8C7B70;">
          Role Privilege: <strong style="color: #7A2331;">Master Artisan Partner</strong>
        </p>
      `;
      expiryNotice = 'This code expires in <strong>10 minutes</strong>. Strictly restricted to registered House of Gargi artisan partners.';
    } else {
      // Pure Customer / Patron Portal Template (Strictly for all shoppers, customers, and any email on storefront)
      emailSubject = `Your House of Gargi Verification Code: ${otp}`;
      emailTitle = 'House of Gargi Verification Code';
      emailSubtitle = 'HOUSE OF GARGI PORTAL';
      bodyContent = `
        <p style="margin: 0 0 22px 0; font-size: 15px; color: #4A3C33; line-height: 1.65;">
          Here is your single-use verification code to sign into your House of Gargi account.
        </p>
      `;
      expiryNotice = 'This code expires in <strong>10 minutes</strong>. If you did not request this, you may safely ignore this email.';
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${emailTitle}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #FBF6EE; font-family: 'Georgia', -apple-system, BlinkMacSystemFont, 'Segoe UI', serif; color: #241A15; -webkit-font-smoothing: antialiased;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FBF6EE; padding: 40px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" style="max-width: 540px; background-color: #FFFFFF; border: 1.5px solid #E4D3AE; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(43, 31, 24, 0.05);">
                <tr>
                  <td style="background-color: #7A2331; height: 5px; line-height: 5px; font-size: 5px;">&nbsp;</td>
                </tr>
                <tr>
                  <td align="center" style="padding: 34px 32px 20px 32px; text-align: center; border-bottom: 1px solid #F4EDE0;">
                    <a href="https://gargisaha.com" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img 
                        src="https://wlivgkosmbfgjtecvznj.supabase.co/storage/v1/object/public/images/logo-email.png" 
                        alt="House of Gargi" 
                        width="200" 
                        style="display: block; margin: 0 auto; width: 200px; height: auto; max-width: 100%; border: 0;"
                      />
                    </a>
                    <div style="font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #7A2331; font-weight: 700; margin-top: 14px;">
                      ${emailSubtitle}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 36px 32px 28px 32px; text-align: center;">
                    ${bodyContent}
                    <div style="background-color: #FAF7F2; border: 1.5px solid #D4AF37; border-radius: 8px; padding: 18px 28px; margin: 16px auto 24px; display: inline-block;">
                      <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 700; letter-spacing: 0.35em; color: #7A2331; display: inline-block; padding-left: 10px;">
                        ${otp}
                      </span>
                    </div>
                    <p style="margin: 16px 0 0 0; font-size: 12.5px; color: #8C7B70; line-height: 1.5;">
                      ${expiryNotice}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="border-top: 1px solid #EAE2D5; background-color: #FAF7F2; padding: 20px 24px; text-align: center; font-size: 12px; color: #8C7B70;">
                    <p style="margin: 0;">
                      Secure authentication dispatched from <a href="mailto:noreply@gargisaha.com" style="color: #0b57d0; text-decoration: underline;">noreply@gargisaha.com</a>
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

    try {
      const { error } = await resend.emails.send({
        from: NOREPLY_EMAIL,
        to: [cleanEmail],
        subject: emailSubject,
        html: emailHtml,
      });

      if (error) {
        console.error('[Resend Error Next.js Direct]:', error);
      }
    } catch (sendErr) {
      console.error('[Resend Send Exception Next.js Direct]:', sendErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code dispatched to your email.',
      token: verificationToken,
      verificationToken,
      expiresAt,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to dispatch verification code.' },
      { status: 500 }
    );
  }
}
