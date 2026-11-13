import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import localApplications from '@/data/artisan_applications.json';

// Primary Master Artisan partner seeds
const MASTER_ARTISAN_PHONES = new Set([
  '9876543210',
  '919876543210',
  '+919876543210',
]);

const MASTER_ARTISAN_EMAILS = new Set([
  'team.anga9@gmail.com',
  'artisan@gargisaha.com',
]);

function extractPhoneDigits(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.slice(3).trim();
  }
  let digits = cleaned.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length > 10) {
    digits = digits.slice(2);
  }
  return digits.slice(0, 10);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawPhone = (body.phone || '').trim();
    const rawEmail = (body.email || '').trim().toLowerCase();

    // 1. Phone-based Artisan Verification
    if (rawPhone) {
      const cleanDigits = extractPhoneDigits(rawPhone);

      if (cleanDigits.length < 10) {
        return NextResponse.json(
          { registered: false, message: 'Please enter a valid 10-digit mobile number.' },
          { status: 400 }
        );
      }

      // Check master artisan permanent number
      if (cleanDigits === '9876543210' || MASTER_ARTISAN_PHONES.has(cleanDigits)) {
        return NextResponse.json({
          registered: true,
          isMasterArtisan: true,
          artisanName: 'Gopal Chandra Dey',
          email: 'team.anga9@gmail.com',
          artisanNo: 'HG-84192',
          applicationNumber: 'HG-ART-260501',
          phone: '+91 98765 43210',
        });
      }

      // Check local registered artisan applications file
      try {
        const matchedLocal = (localApplications as any[]).find(app => {
          const appPhone = extractPhoneDigits(app.phone || '');
          return appPhone === cleanDigits;
        });

        if (matchedLocal) {
          return NextResponse.json({
            registered: true,
            isMasterArtisan: matchedLocal.email === 'team.anga9@gmail.com',
            artisanName: matchedLocal.name,
            email: matchedLocal.email,
            applicationNumber: matchedLocal.applicationId || matchedLocal.applicationNumber,
            phone: matchedLocal.phone,
          });
        }
      } catch {}

      // Query Supabase artisan_applications
      try {
        const { data: matchedApp, error } = await supabaseAdmin
          .from('artisan_applications')
          .select('id, application_number, name, email, phone, status')
          .ilike('phone', `%${cleanDigits}%`)
          .neq('status', 'rejected')
          .limit(1)
          .maybeSingle();

        if (!error && matchedApp) {
          return NextResponse.json({
            registered: true,
            isMasterArtisan: false,
            artisanName: matchedApp.name,
            email: matchedApp.email,
            applicationNumber: matchedApp.application_number,
            phone: matchedApp.phone,
          });
        }
      } catch (dbErr) {
        console.warn('[Check Artisan] Supabase phone query error:', dbErr);
      }

      // Query Supabase artisan_profiles if table exists
      try {
        const { data: matchedProfile, error: profErr } = await supabaseAdmin
          .from('artisan_profiles')
          .select('id, full_name, user_email, phone')
          .ilike('phone', `%${cleanDigits}%`)
          .limit(1)
          .maybeSingle();

        if (!profErr && matchedProfile) {
          return NextResponse.json({
            registered: true,
            isMasterArtisan: false,
            artisanName: matchedProfile.full_name,
            email: matchedProfile.user_email,
            phone: matchedProfile.phone,
          });
        }
      } catch {}

      // Number is not registered in the artisan registry
      return NextResponse.json(
        {
          registered: false,
          message: 'This mobile number is not associated with an artisan account.',
        },
        { status: 404 }
      );
    }

    // 2. Email-based Artisan Verification
    if (rawEmail) {
      if (!rawEmail.includes('@') || !rawEmail.includes('.')) {
        return NextResponse.json(
          { registered: false, message: 'Please enter a valid email address.' },
          { status: 400 }
        );
      }

      if (MASTER_ARTISAN_EMAILS.has(rawEmail)) {
        return NextResponse.json({
          registered: true,
          isMasterArtisan: true,
          artisanName: 'Gopal Chandra Dey',
          email: rawEmail,
          artisanNo: 'HG-84192',
          applicationNumber: 'HG-ART-260501',
        });
      }

      // Check local registered artisan applications file
      try {
        const matchedLocal = (localApplications as any[]).find(app => {
          return (app.email || '').toLowerCase().trim() === rawEmail;
        });

        if (matchedLocal) {
          return NextResponse.json({
            registered: true,
            isMasterArtisan: matchedLocal.email === 'team.anga9@gmail.com',
            artisanName: matchedLocal.name,
            email: matchedLocal.email,
            applicationNumber: matchedLocal.applicationId || matchedLocal.applicationNumber,
          });
        }
      } catch {}

      // Query Supabase user_roles for artisan privilege
      try {
        const { data: roleData } = await supabaseAdmin
          .from('user_roles')
          .select('role')
          .eq('user_email', rawEmail)
          .maybeSingle();

        if (roleData && roleData.role === 'artisan') {
          return NextResponse.json({
            registered: true,
            email: rawEmail,
            role: 'artisan',
          });
        }
      } catch {}

      // Query artisan_applications
      try {
        const { data: appData } = await supabaseAdmin
          .from('artisan_applications')
          .select('id, name, email, status')
          .eq('email', rawEmail)
          .neq('status', 'rejected')
          .maybeSingle();

        if (appData) {
          return NextResponse.json({
            registered: true,
            artisanName: appData.name,
            email: appData.email,
          });
        }
      } catch {}

      return NextResponse.json(
        {
          registered: false,
          message: 'This email is not associated with an artisan account.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { registered: false, message: 'Please provide a mobile number or email address.' },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { registered: false, message: err?.message || 'Verification check failed.' },
      { status: 500 }
    );
  }
}
