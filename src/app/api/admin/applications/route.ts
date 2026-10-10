import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';
import { resend, NOREPLY_EMAIL } from '@/lib/resend';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'artisan_applications.json');

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status');

    let applications: any[] = [];

    // Try fetching from Supabase first
    try {
      const { data, error } = await supabase
        .from('artisan_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        applications = data.map((d: any) => ({
          applicationId: d.application_number || d.id,
          submittedAt: d.created_at,
          name: d.name,
          dob: d.dob,
          age: d.age,
          gender: d.gender,
          state: d.state,
          placeOfBirth: d.place_of_birth,
          typeOfArt: d.type_of_art,
          phone: d.phone,
          email: d.email,
          answers: d.answers || {},
          agreedChildLabor: d.agreed_child_labor,
          agreedInspection: d.agreed_inspection,
          signature: d.signature,
          signatureDate: d.signature_date,
          status: d.status || 'pending',
          reviewedBy: d.reviewed_by,
          reviewNotes: d.review_notes,
        }));
      }
    } catch (dbErr) {
      console.warn('Supabase read skipped for applications:', dbErr);
    }

    // Fall back to JSON file if DB has none or is pending migration
    if (applications.length === 0 && fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        applications = JSON.parse(raw);
      } catch (fErr) {
        console.warn('Error reading artisan_applications.json:', fErr);
      }
    }

    // Filter by status if provided
    if (statusFilter && statusFilter !== 'all') {
      applications = applications.filter((a) => a.status === statusFilter);
    }

    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error fetching applications' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { applicationId, action, reviewNotes, adminEmail = 'admin@gargisaha.com' } = body;

    if (!applicationId || !action) {
      return NextResponse.json(
        { success: false, message: 'applicationId and action are required' },
        { status: 400 }
      );
    }

    const newStatus = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'under_review';

    let targetApp: any = null;

    // Update in JSON file
    if (fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const apps = JSON.parse(raw);
        const idx = apps.findIndex((a: any) => a.applicationId === applicationId);
        if (idx !== -1) {
          apps[idx].status = newStatus;
          apps[idx].reviewedBy = adminEmail;
          apps[idx].reviewNotes = reviewNotes || '';
          targetApp = apps[idx];
          fs.writeFileSync(DATA_FILE, JSON.stringify(apps, null, 2), 'utf8');
        }
      } catch (fErr) {
        console.warn('JSON file update error:', fErr);
      }
    }

    // Update in Supabase
    try {
      await supabase
        .from('artisan_applications')
        .update({
          status: newStatus,
          reviewed_by: adminEmail,
          review_notes: reviewNotes || '',
          updated_at: new Date().toISOString(),
        })
        .eq('application_number', applicationId);
    } catch (dbErr) {
      console.warn('Supabase update skipped:', dbErr);
    }

    // If approved, onboard into user_roles as 'artisan' & notify
    if (action === 'approve' && targetApp?.email) {
      try {
        await supabase.from('user_roles').upsert({
          user_email: targetApp.email,
          role: 'artisan',
          assigned_by: adminEmail,
          updated_at: new Date().toISOString(),
        });
      } catch (roleErr) {
        console.warn('User roles upsert skipped:', roleErr);
      }

      // Send approval & onboarding email to artisan
      try {
        await resend.emails.send({
          from: NOREPLY_EMAIL,
          to: targetApp.email,
          subject: 'Welcome to House of Gargi Artisan Guild - Application Approved!',
          html: `
            <div style="font-family: Georgia, serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1.5px solid #E4D3AE; border-radius: 8px; background: #FBF6EE;">
              <h1 style="color: #7A2331; text-align: center; margin-bottom: 4px;">HOUSE OF GARGI</h1>
              <p style="text-align: center; color: #8C7B70; font-size: 12px; margin-top: 0;">— ARTISAN GUILD ONBOARDING —</p>
              <hr style="border: 0; border-top: 1px solid #E4D3AE; margin: 20px 0;" />
              <p style="color: #231812; font-size: 15px; line-height: 1.6;">
                Dear ${targetApp.name},<br/><br/>
                We are honored to welcome you to the <strong>House of Gargi Master Artisan Guild</strong>. Your application (${applicationId}) has been officially verified and approved by our Admin Operations desk.
              </p>
              <div style="background: #FFFFFF; border: 1px solid #E4D3AE; border-radius: 6px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0; font-size: 13px; color: #786C5E;">Next Step to Access Your Atelier:</p>
                <p style="margin: 6px 0 0; font-size: 14px; color: #231812;">
                  1. Visit the <a href="https://gargisaha.com/seller/login" style="color: #7A2331; font-weight: bold;">Artisan Atelier Portal</a>.<br/>
                  2. Enter your registered email (<strong>${targetApp.email}</strong>).<br/>
                  3. Enter the instant OTP sent to your inbox to access your product management, loom inventory, and sales dashboard.
                </p>
              </div>
              <p style="font-size: 13px; color: #786C5E; text-align: center; margin-top: 24px;">
                House of Gargi &bull; Preserving India's Living Heritage
              </p>
            </div>
          `,
        });
      } catch (mErr) {
        console.warn('Approval email send error:', mErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Application ${applicationId} marked as ${newStatus}.`,
      application: targetApp,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error updating application status' },
      { status: 500 }
    );
  }
}
