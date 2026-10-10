import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { resend, NOREPLY_EMAIL, CONCIERGE_EMAIL } from '@/lib/resend';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'artisan_applications.json');

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
      age: age || '',
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
    };

    // 1. Save to persistent JSON storage
    try {
      let existingApps: any[] = [];
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        existingApps = JSON.parse(raw);
      }
      existingApps.unshift(applicationRecord);
      fs.writeFileSync(DATA_FILE, JSON.stringify(existingApps, null, 2), 'utf8');
    } catch (saveErr) {
      console.warn('Could not save to artisan_applications.json file:', saveErr);
    }

    // 2. Send email via Resend to the artisan applicant
    try {
      const emailHtml = `
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
                        Thank you for applying to join the House of Gargi Master Artisan Guild. We have safely received your questionnaire and ethical agreement.
                      </p>
                      <p style="font-size:14px;line-height:1.6;color:#4A3C33;font-style:italic;">
                        হাউস অফ গার্গী কারিগর গিল্ডে যোগদানের জন্য আপনার আবেদন সফলভাবে জমা হয়েছে। আমাদের কিউরেশন টিম অতি শীঘ্রই আপনার সাথে যোগাযোগ করবে।
                      </p>

                      <div style="background-color:#FAF7F2;border:1.5px solid #D4AF37;border-radius:8px;padding:16px 20px;margin:22px 0;">
                        <p style="margin:0;font-size:13px;color:#8C7B70;">Application ID / আবেদন নং:</p>
                        <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#7A2331;font-family:'Courier New',monospace;">${applicationId}</p>
                        <p style="margin:10px 0 0;font-size:13px;color:#4A3C33;">
                          <strong>Craft / শিল্প:</strong> ${typeOfArt || 'Master Artisan Craft'}<br/>
                          <strong>State / রাজ্য:</strong> ${state || 'India'}<br/>
                          <strong>Phone / ফোন:</strong> ${cleanPhone}
                        </p>
                      </div>

                      <p style="font-size:13px;line-height:1.6;color:#66554B;">
                        Our senior artisan curator will review your story and reach out to you within 48 to 72 hours.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color:#FAF7F2;border-top:1px solid #EAE2D5;padding:18px 24px;text-align:center;font-size:12px;color:#8C7B70;">
                      <p style="margin:0;">House of Gargi &bull; Handcrafted Heritage, Worn Today</p>
                      <p style="margin:4px 0 0;"><a href="https://gargisaha.com/seller" style="color:#B88E18;text-decoration:none;">Artisan Atelier Portal</a></p>
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
        html: emailHtml,
      });

      // Also send admin notification
      await resend.emails.send({
        from: NOREPLY_EMAIL,
        to: CONCIERGE_EMAIL,
        subject: `[New Artisan Application] ${name} - ${typeOfArt} (${applicationId})`,
        html: `
          <h2>New Artisan Partner Application</h2>
          <p><strong>Applicant Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${cleanEmail}</p>
          <p><strong>Phone:</strong> ${cleanPhone}</p>
          <p><strong>Craft:</strong> ${typeOfArt}</p>
          <p><strong>Location:</strong> ${placeOfBirth}, ${state}</p>
          <p><strong>Gender:</strong> ${gender} | <strong>DOB/Age:</strong> ${dob} (Age: ${age})</p>
          <p><strong>Child Labor Agreement Signed:</strong> ${agreedChildLabor ? 'YES' : 'NO'}</p>
          <p><strong>Signed by:</strong> ${signature} on ${signatureDate}</p>
          <hr/>
          <h3>Questionnaire Answers:</h3>
          <pre style="background:#f4f4f4;padding:15px;border-radius:6px;">${JSON.stringify(answers, null, 2)}</pre>
        `,
      });
    } catch (emailErr) {
      console.warn('Resend email dispatch error:', emailErr);
    }

    return NextResponse.json({
      success: true,
      applicationId,
      message: 'Artisan application submitted successfully.',
    });
  } catch (err: any) {
    console.error('Artisan Application Error:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Error processing application.' },
      { status: 500 }
    );
  }
}
