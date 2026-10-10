import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { resend, NOREPLY_EMAIL } from '@/lib/resend';
import { supabase } from '@/lib/supabaseClient';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'artisan_applications.json');
export const ADMIN_OPERATIONS_EMAIL = 'admin@gargisaha.com';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      dob,
      age,
      gender,
      state,
      placeOfBirth,
      typeOfArt,
      phone,
      email,
      answers,
      agreedChildLabor,
      agreedInspection,
      signature,
      signatureDate,
    } = body;

    if (!name || !phone || !email) {
      return NextResponse.json(
        { success: false, message: 'Name, phone number, and email are required.' },
        { status: 400 }
      );
    }

    if (!agreedChildLabor || !agreedInspection) {
      return NextResponse.json(
        { success: false, message: 'Both Child Labor and Inspection agreement acknowledgements are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();
    const applicationId = `HG-ART-${Math.floor(100000 + Math.random() * 900000)}`;
    const submittedAt = new Date().toISOString();

    const applicationRecord = {
      applicationId,
      submittedAt,
      name,
      dob: dob || '',
      age: age ? Number(age) : null,
      gender: gender || '',
      state: state || '',
      placeOfBirth: placeOfBirth || '',
      typeOfArt: typeOfArt || '',
      phone: cleanPhone,
      email: cleanEmail,
      answers: answers || {},
      agreedChildLabor: Boolean(agreedChildLabor),
      agreedInspection: Boolean(agreedInspection),
      signature: signature || name,
      signatureDate: signatureDate || new Date().toISOString().split('T')[0],
      status: 'pending', // 'pending', 'under_review', 'approved', 'rejected'
      reviewedBy: null,
      reviewNotes: '',
    };

    // 1. Attempt write to Supabase artisan_applications table (graceful fallback)
    try {
      await supabase.from('artisan_applications').insert([
        {
          application_number: applicationId,
          name,
          email: cleanEmail,
          phone: cleanPhone,
          dob: dob || null,
          age: age ? Number(age) : null,
          gender: gender || null,
          state: state || 'India',
          place_of_birth: placeOfBirth || null,
          type_of_art: typeOfArt || 'Heritage Craft',
          answers: answers || {},
          agreed_child_labor: Boolean(agreedChildLabor),
          agreed_inspection: Boolean(agreedInspection),
          signature: signature || name,
          signature_date: signatureDate || new Date().toISOString().split('T')[0],
          status: 'pending',
        },
      ]);
    } catch (dbErr) {
      console.warn('Supabase DB write skipped or pending table migration:', dbErr);
    }

    // 2. Save to persistent JSON storage (ensures Admin Portal always receives applications)
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      let existingApps: any[] = [];
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        existingApps = JSON.parse(raw);
      }
      existingApps = existingApps.filter((a: any) => a.applicationId !== applicationId);
      existingApps.unshift(applicationRecord);
      fs.writeFileSync(DATA_FILE, JSON.stringify(existingApps, null, 2), 'utf8');
    } catch (saveErr) {
      console.warn('Could not save to artisan_applications.json file:', saveErr);
    }

    // 3. Send email to Artisan acknowledging receipt
    try {
      const artisanEmailHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>House of Gargi Artisan Application</title>
        </head>
        <body style="margin:0;padding:0;background-color:#FBF6EE;font-family:'Georgia',serif;color:#241A15;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#FBF6EE;padding:36px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" style="max-width:580px;background-color:#FFFFFF;border:1.5px solid #E4D3AE;border-radius:10px;overflow:hidden;">
                  <tr>
                    <td style="background-color:#7A2331;height:5px;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td align="center" style="padding:30px 24px 20px;text-align:center;border-bottom:1px solid #F4EDE0;">
                      <h1 style="margin:0;font-size:22px;color:#7A2331;letter-spacing:0.08em;font-weight:700;">HOUSE OF GARGI</h1>
                      <p style="margin:4px 0 0;font-size:12px;font-style:italic;color:#8C7B70;">— TRADITION &middot; CRAFT &middot; HERITAGE —</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px 26px;">
                      <h2 style="margin:0 0 12px;font-size:18px;color:#241A15;">Artisan Application Received &bull; আবেদন গৃহীত হয়েছে</h2>
                      <p style="font-size:14px;line-height:1.6;color:#4A3C33;">
                        Dear <strong>${name}</strong>,<br/><br/>
                        Thank you for applying to join the House of Gargi Master Artisan Guild. We have received your questionnaire and ethical craft agreement.
                      </p>
                      <p style="font-size:14px;line-height:1.6;color:#4A3C33;font-style:italic;">
                        হাউস অফ গার্গী কারিগর গিল্ডে যোগদানের জন্য আপনার আবেদন সফলভাবে জমা হয়েছে। আমাদের অ্যাডমিন কিউরেশন টিম অতি শীঘ্রই আপনার সাথে যোগাযোগ করবে।
                      </p>

                      <div style="background-color:#FAF7F2;border:1.5px solid #D4AF37;border-radius:8px;padding:16px 20px;margin:22px 0;">
                        <p style="margin:0;font-size:13px;color:#8C7B70;">Application Reference / আবেদন নং:</p>
                        <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#7A2331;font-family:'Courier New',monospace;">${applicationId}</p>
                        <p style="margin:10px 0 0;font-size:13px;color:#4A3C33;">
                          <strong>Craft / শিল্প:</strong> ${typeOfArt || 'Master Artisan Craft'}<br/>
                          <strong>State / রাজ্য:</strong> ${state || 'India'}<br/>
                          <strong>Phone / ফোন:</strong> ${cleanPhone}
                        </p>
                      </div>

                      <p style="font-size:13px;line-height:1.6;color:#66554B;">
                        Our Operations & Artisan Admin team will review your application dossier in the Admin Portal and update you within 48 to 72 hours.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color:#FAF7F2;border-top:1px solid #EAE2D5;padding:18px 24px;text-align:center;font-size:12px;color:#8C7B70;">
                      <p style="margin:0;">House of Gargi &bull; Handcrafted Heritage, Worn Today</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      await resend.emails.send({
        from: NOREPLY_EMAIL,
        to: cleanEmail,
        subject: `House of Gargi Artisan Application Received - ${applicationId}`,
        html: artisanEmailHtml,
      });

      // 4. Send official notification specifically to the ADMIN TEAM (Not Super Admin)
      const adminEmailHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>New Artisan Application - Admin Review</title>
        </head>
        <body style="margin:0;padding:0;background-color:#FBF6EE;font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:#241A15;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:28px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" style="max-width:620px;background:#FFFFFF;border:1.5px solid #E4D3AE;border-radius:8px;padding:28px;">
                  <tr>
                    <td>
                      <div style="display:inline-block;background:#7A2331;color:#FFFFFF;padding:4px 12px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
                        House of Gargi &bull; Admin Operations Desk
                      </div>
                      <h2 style="margin:14px 0 6px;color:#7A2331;font-size:20px;">
                        New Artisan Guild Application Received
                      </h2>
                      <p style="margin:0 0 16px;color:#6C5D53;font-size:13px;">
                        An artisan has submitted the complete 14-question heritage questionnaire. Review and take onboarding action in the Admin Portal.
                      </p>

                      <div style="background:#FAF7F2;border:1px solid #E4D3AE;border-radius:6px;padding:16px;margin-bottom:20px;">
                        <table width="100%" cellpadding="4" cellspacing="0" style="font-size:13px;color:#33261D;">
                          <tr>
                            <td width="35%" style="color:#7D6F64;">Application ID:</td>
                            <td><strong style="color:#7A2331;">${applicationId}</strong></td>
                          </tr>
                          <tr>
                            <td style="color:#7D6F64;">Artisan Name:</td>
                            <td><strong>${name}</strong></td>
                          </tr>
                          <tr>
                            <td style="color:#7D6F64;">Art / Craft Specialty:</td>
                            <td>${typeOfArt || 'Not specified'}</td>
                          </tr>
                          <tr>
                            <td style="color:#7D6F64;">State & Origin:</td>
                            <td>${placeOfBirth ? `${placeOfBirth}, ` : ''}${state}</td>
                          </tr>
                          <tr>
                            <td style="color:#7D6F64;">Phone:</td>
                            <td>${cleanPhone}</td>
                          </tr>
                          <tr>
                            <td style="color:#7D6F64;">Email:</td>
                            <td>${cleanEmail}</td>
                          </tr>
                          <tr>
                            <td style="color:#7D6F64;">Child Labor Agreement:</td>
                            <td><span style="color:#1F6F6B;font-weight:700;">&#10003; SIGNED & VERIFIED</span> (Signature: <em>${signature}</em>)</td>
                          </tr>
                        </table>
                      </div>

                      <div style="text-align:center;margin:24px 0 12px;">
                        <a href="https://gargisaha.com/admin/artisans/applications" style="background:#7A2331;color:#FFFFFF;text-decoration:none;padding:12px 28px;border-radius:4px;font-size:14px;font-weight:600;display:inline-block;letter-spacing:0.5px;">
                          Open Application Dossier in Admin Portal &rarr;
                        </a>
                      </div>

                      <p style="margin:20px 0 0;font-size:11px;color:#9B8D82;text-align:center;">
                        This notification is delivered strictly to the House of Gargi Admin Operations & Curation team.
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

      await resend.emails.send({
        from: NOREPLY_EMAIL,
        to: ADMIN_OPERATIONS_EMAIL,
        subject: `[Admin Action Required] New Artisan Application: ${name} (${typeOfArt}) - ${applicationId}`,
        html: adminEmailHtml,
      });
    } catch (emailErr) {
      console.warn('Resend email dispatch error:', emailErr);
    }

    return NextResponse.json({
      success: true,
      applicationId,
      message: 'Artisan application submitted successfully and sent to Admin review inbox.',
    });
  } catch (err: any) {
    console.error('Artisan Application Error:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Error processing application.' },
      { status: 500 }
    );
  }
}
