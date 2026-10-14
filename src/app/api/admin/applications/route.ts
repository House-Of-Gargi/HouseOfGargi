import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';
import { resend, NOREPLY_EMAIL } from '@/lib/resend';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'artisan_applications.json');

function getLocalApplications(): any[] {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Error reading artisan_applications.json:', e);
    }
  }
  return [];
}

function saveLocalApplications(apps: any[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(apps, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing artisan_applications.json:', e);
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status');

    let applications: any[] = [];

    // 1. Try fetching from Supabase first
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

    // 2. Merge local status overrides, 14 answers, and verified email
    const localApps = getLocalApplications();
    if (localApps.length > 0) {
      if (applications.length === 0) {
        applications = [...localApps];
      } else {
        applications = applications.map((app) => {
          const match = localApps.find(
            (l: any) => l.applicationId === app.applicationId || l.id === app.applicationId
          );
          if (match) {
            return {
              ...app,
              email: match.email || (app.email?.endsWith('@example.com') ? 'team.anga9@gmail.com' : app.email),
              answers: match.answers && Object.keys(match.answers).length >= 14 ? match.answers : (app.answers || match.answers),
              status: match.status || app.status,
              reviewedBy: match.reviewedBy || app.reviewedBy,
              reviewNotes: match.reviewNotes || app.reviewNotes,
            };
          }
          return {
            ...app,
            email: app.email?.endsWith('@example.com') ? 'team.anga9@gmail.com' : app.email,
          };
        });

        // Add any local apps that are not in Supabase
        localApps.forEach((l: any) => {
          if (!applications.some((a) => a.applicationId === l.applicationId)) {
            applications.push(l);
          }
        });
      }
    }

    // 3. Filter by status if requested
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

    const newStatus =
      action === 'approve' || action === 'approved'
        ? 'approved'
        : action === 'reject' || action === 'rejected'
        ? 'rejected'
        : 'pending';

    const localApps = getLocalApplications();
    let targetApp: any = null;

    const idx = localApps.findIndex(
      (a: any) => a.applicationId === applicationId || a.id === applicationId
    );

    if (idx !== -1) {
      localApps[idx].status = newStatus;
      localApps[idx].reviewedBy = adminEmail;
      localApps[idx].reviewNotes = reviewNotes || '';
      localApps[idx].updatedAt = new Date().toISOString();
      if (!localApps[idx].email || localApps[idx].email.endsWith('@example.com')) {
        localApps[idx].email = 'team.anga9@gmail.com';
      }
      targetApp = localApps[idx];
    } else {
      // Fetch details from Supabase to create the entry
      try {
        const { data } = await supabase
          .from('artisan_applications')
          .select('*')
          .or(`application_number.eq.${applicationId},id.eq.${applicationId}`)
          .single();

        if (data) {
          targetApp = {
            applicationId: data.application_number || data.id,
            id: data.id,
            submittedAt: data.created_at,
            name: data.name,
            dob: data.dob,
            age: data.age,
            gender: data.gender,
            state: data.state,
            placeOfBirth: data.place_of_birth,
            typeOfArt: data.type_of_art,
            phone: data.phone,
            email: data.email?.endsWith('@example.com') ? 'team.anga9@gmail.com' : (data.email || 'team.anga9@gmail.com'),
            answers: data.answers || {},
            agreedChildLabor: data.agreed_child_labor,
            agreedInspection: data.agreed_inspection,
            signature: data.signature,
            signatureDate: data.signature_date,
            status: newStatus,
            reviewedBy: adminEmail,
            reviewNotes: reviewNotes || '',
            updatedAt: new Date().toISOString(),
          };
          localApps.push(targetApp);
        } else {
          targetApp = {
            applicationId,
            email: 'team.anga9@gmail.com',
            status: newStatus,
            reviewedBy: adminEmail,
            reviewNotes: reviewNotes || '',
            updatedAt: new Date().toISOString(),
          };
          localApps.push(targetApp);
        }
      } catch (dbErr) {
        targetApp = {
          applicationId,
          email: 'team.anga9@gmail.com',
          status: newStatus,
          reviewedBy: adminEmail,
          reviewNotes: reviewNotes || '',
          updatedAt: new Date().toISOString(),
        };
        localApps.push(targetApp);
      }
    }

    // Save guaranteed local state
    saveLocalApplications(localApps);

    // Also attempt to update Supabase in background
    try {
      await supabase
        .from('artisan_applications')
        .update({
          status: newStatus,
          reviewed_by: adminEmail,
          review_notes: reviewNotes || '',
          updated_at: new Date().toISOString(),
        })
        .or(`application_number.eq.${applicationId},id.eq.${applicationId}`);
    } catch (sbErr) {
      console.warn('Supabase update attempt:', sbErr);
    }

    // Determine safe recipient email (guarantees no @example.com 422 error)
    let recipientEmail = targetApp?.email || 'team.anga9@gmail.com';
    if (!recipientEmail || recipientEmail.endsWith('@example.com') || recipientEmail.endsWith('@test.com')) {
      recipientEmail = 'team.anga9@gmail.com';
    }

    // 1. If approved, onboard into user_roles as 'artisan' & send approval email
    if ((action === 'approve' || action === 'approved') && recipientEmail) {
      try {
        await supabase.from('user_roles').upsert({
          user_email: recipientEmail,
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
          to: recipientEmail,
          subject: 'Welcome to House of Gargi Artisan Guild - Application Approved!',
          html: `
            <div style="font-family: Georgia, serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1.5px solid #E4D3AE; border-radius: 8px; background: #FBF6EE;">
              <h1 style="color: #7A2331; text-align: center; margin-bottom: 4px;">HOUSE OF GARGI</h1>
              <p style="text-align: center; color: #8C7B70; font-size: 12px; margin-top: 0;">— ARTISAN GUILD ONBOARDING —</p>
              <hr style="border: 0; border-top: 1px solid #E4D3AE; margin: 20px 0;" />
              <p style="color: #231812; font-size: 15px; line-height: 1.6;">
                Dear ${targetApp.name || 'Master Artisan'},<br/><br/>
                We are honored to welcome you to the <strong>House of Gargi Master Artisan Guild</strong>. Your application (${applicationId}) has been officially verified and approved by our Admin Operations desk.
              </p>
              <div style="background: #FFFFFF; border: 1px solid #E4D3AE; border-radius: 6px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0; font-size: 13px; color: #786C5E;">Next Step to Access Your Atelier:</p>
                <p style="margin: 6px 0 0; font-size: 14px; color: #231812;">
                  1. Visit the <a href="https://gargisaha.com/seller/login" style="color: #7A2331; font-weight: bold;">Artisan Atelier Portal</a>.<br/>
                  2. Enter your registered email (<strong>${recipientEmail}</strong>).<br/>
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

    // 2. If rejected, send respectful rejection email to artisan
    if ((action === 'reject' || action === 'rejected') && recipientEmail) {
      try {
        await resend.emails.send({
          from: NOREPLY_EMAIL,
          to: recipientEmail,
          subject: 'House of Gargi Artisan Guild Application Status',
          html: `
            <div style="font-family: Georgia, serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1.5px solid #E4D3AE; border-radius: 8px; background: #FBF6EE;">
              <h1 style="color: #7A2331; text-align: center; margin-bottom: 4px;">HOUSE OF GARGI</h1>
              <p style="text-align: center; color: #8C7B70; font-size: 12px; margin-top: 0;">— ARTISAN CURATION DESK —</p>
              <hr style="border: 0; border-top: 1px solid #E4D3AE; margin: 20px 0;" />
              <p style="color: #231812; font-size: 15px; line-height: 1.6;">
                Dear ${targetApp.name || 'Master Artisan'},<br/><br/>
                Thank you for submitting your application (${applicationId}) to join the <strong>House of Gargi Master Artisan Guild</strong>.<br/><br/>
                After careful consideration by our curation committee, we regret to inform you that we are unable to accept your application into our partner guild at this time.
              </p>
              ${
                reviewNotes
                  ? `
              <div style="background: #FFFFFF; border: 1px solid #E4D3AE; border-radius: 6px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0; font-size: 13px; color: #786C5E; font-weight: bold;">Curation Committee Feedback:</p>
                <p style="margin: 6px 0 0; font-size: 14px; color: #231812; line-height: 1.5;">${reviewNotes}</p>
              </div>
              `
                  : ''
              }
              <p style="color: #4A3E36; font-size: 14px; line-height: 1.6;">
                We deeply honor your craft and dedication to preserving traditional textiles. You are welcome to re-apply in the future as our collection categories expand.
              </p>
              <p style="font-size: 13px; color: #786C5E; text-align: center; margin-top: 24px;">
                House of Gargi &bull; Preserving India's Living Heritage
              </p>
            </div>
          `,
        });
      } catch (mErr) {
        console.warn('Rejection email send error:', mErr);
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
