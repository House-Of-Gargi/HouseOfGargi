import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const DEFAULT_PROFILE = {
  id: 'HG-ART-260501',
  artisanNo: 'HG-84192',
  name: 'Gopal Chandra Dey',
  role: 'Master Tangail Jamdani Pit Loom Weaver',
  artStyle: 'Maharaja Embroidary Design',
  region: 'Kolkata, West Bengal',
  regionalBelonging: 'Kolkata, West Bengal',
  lineage: '4th Generation Pit Loom Lineage (Trained by Late Narayan Chandra Dey)',
  experience: '32 Years',
  experienceYears: 32,
  loomHoursTotal: '15,000+ Loom Hours Preserved',
  profileImage: '/images/artisans_split.png',
  philosophy: 'In Shantipur, every Jamdani motif is a sacred prayer of rhythm, breath, and patience. When the shuttle moves across mulberry silk on our pit loom, time stands still.',
  bio: 'Master weaver preserving 4 generations of royal Jamdani pit-loom craft. Mentoring 14 rural weaver families, his workshop utilizes 100% certified Murshidabad mulberry silk, combed fine cotton, and natural AZO-free dyes to handcraft heirloom drapes.',
  description: 'Master weaver preserving 4 generations of royal Jamdani pit-loom craft. Mentoring 14 rural weaver families, his workshop utilizes 100% certified Murshidabad mulberry silk, combed fine cotton, and natural AZO-free dyes to handcraft heirloom drapes.',
  specialties: [
    'Tangail Jamdani Pit Loom Weave',
    '100% Murshidabad Mulberry Silk',
    'Tested Real Silver & Gold Zari',
    'Natural AZO-Free Vegetable Dyes',
    'Terracotta & Geometric Peacock Motifs',
  ],
  communityImpact: 'Regular fair-wage employment for 14 rural weaver families and flexible home-spinning shifts for women artisans in Nadia district.',
};

export async function GET(req: Request) {
  let profile: any = { ...DEFAULT_PROFILE };
  let application: any = null;

  const url = new URL(req.url);
  const queryEmail = (url.searchParams.get('email') || '').toLowerCase().trim();
  const queryPhone = (url.searchParams.get('phone') || '').replace(/\D/g, '').slice(-10);

  // 1. Try Backend Gateway proxy
  try {
    const res = await proxyToBackend(req, '/api/v1/artisan/me');
    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data?.artisan) {
        profile = { ...DEFAULT_PROFILE, ...data.artisan };
      }
      if (data?.application) {
        application = data.application;
      }
    }
  } catch {}

  // 2. Direct Supabase Query for Application & Questionnaire Answers
  try {
    if (queryEmail) {
      const { data: matchedApp } = await supabaseAdmin
        .from('artisan_applications')
        .select('*')
        .eq('email', queryEmail)
        .maybeSingle();
      if (matchedApp) {
        application = matchedApp;
      }
    }

    if (!application && queryPhone) {
      const { data: matchedByPhone } = await supabaseAdmin
        .from('artisan_applications')
        .select('*')
        .ilike('phone', `%${queryPhone}%`)
        .maybeSingle();
      if (matchedByPhone) {
        application = matchedByPhone;
      }
    }

    // Fallback to primary application ONLY if neither email nor phone matched
    if (!application && !queryEmail && !queryPhone) {
      const { data: defaultApp } = await supabaseAdmin
        .from('artisan_applications')
        .select('*')
        .or(`email.eq.team.anga9@gmail.com,application_number.eq.HG-ART-260501`)
        .limit(1)
        .maybeSingle();

      if (defaultApp) {
        application = defaultApp;
      } else {
        const { data: firstApp } = await supabaseAdmin
          .from('artisan_applications')
          .select('*')
          .limit(1)
          .maybeSingle();
        if (firstApp) application = firstApp;
      }
    }
    if (application) {
      profile.id = application.application_number || application.id;
      profile.artisanNo = application.artisanNo || application.application_number || profile.artisanNo;
      if (application.name) profile.name = application.name;
      if (application.type_of_art) {
        profile.artStyle = application.type_of_art;
        profile.role = application.type_of_art;
      }
      if (application.state) {
        profile.regionalBelonging = application.state;
        profile.region = application.state;
      }
      if (application.email) profile.email = application.email;
    }

    // Direct check of artisan_profiles in Supabase
    try {
      const { data: profRecord } = await supabaseAdmin
        .from('artisan_profiles')
        .select('*')
        .or(`user_email.eq.${queryEmail || 'team.anga9@gmail.com'},artisan_no.eq.HG-84192`)
        .limit(1)
        .maybeSingle();

      if (profRecord) {
        if (profRecord.full_name) profile.name = profRecord.full_name;
        if (profRecord.craft_specialty) {
          profile.artStyle = profRecord.craft_specialty;
          profile.role = profRecord.craft_specialty;
        }
        if (profRecord.region) {
          profile.regionalBelonging = profRecord.region;
          profile.region = profRecord.region;
        }
        if (profRecord.lineage_story) {
          profile.description = profRecord.lineage_story;
          profile.bio = profRecord.lineage_story;
        }
        if (profRecord.avatar_url) {
          profile.profileImage = profRecord.avatar_url;
        }
      }
    } catch {}

    // Check saved local JSON database for this artisan
    try {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'src/data/artisan_profiles_list.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        const list = JSON.parse(raw);
        const match = list.find(
          (item: any) =>
            (queryEmail && item.email?.toLowerCase() === queryEmail) ||
            (queryPhone && item.phone?.includes(queryPhone)) ||
            (!queryEmail && !queryPhone && (item.artisanNo?.toLowerCase() === 'hg-84192' || item.id === 'HG-ART-260501'))
        );
        if (match) {
          profile = { ...profile, ...match, name: match.name || profile.name };
        }
      }
    } catch {}
  } catch (err) {
    console.warn('[Artisan Profile API] Supabase application fetch warning:', err);
  }

  return NextResponse.json({
    success: true,
    profile,
    profiles: [profile],
    application,
  });
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const cleanEmail = (body.email || '').toLowerCase().trim();
    const targetAppNumber = body.id || (cleanEmail === 'team.anga9@gmail.com' ? 'HG-ART-260501' : '');
    const isMasterArtisan =
      !cleanEmail ||
      cleanEmail === 'team.anga9@gmail.com' ||
      targetAppNumber === 'HG-ART-260501' ||
      body.artisanNo === 'HG-84192';

    // 1. Update in-memory DEFAULT_PROFILE only for master artisan
    if (isMasterArtisan) {
      if (body.name) DEFAULT_PROFILE.name = body.name.trim();
      if (body.artStyle || body.role) {
        DEFAULT_PROFILE.artStyle = (body.artStyle || body.role).trim();
        DEFAULT_PROFILE.role = (body.artStyle || body.role).trim();
      }
      if (body.regionalBelonging || body.region) {
        DEFAULT_PROFILE.regionalBelonging = (body.regionalBelonging || body.region).trim();
        DEFAULT_PROFILE.region = (body.regionalBelonging || body.region).trim();
      }
      if (body.experience) DEFAULT_PROFILE.experience = body.experience.trim();
      if (body.description || body.bio) {
        DEFAULT_PROFILE.description = (body.description || body.bio).trim();
        DEFAULT_PROFILE.bio = (body.description || body.bio).trim();
      }
      if (body.profileImage || body.image) {
        DEFAULT_PROFILE.profileImage = body.profileImage || body.image;
      }
    }

    // 2. Direct Update to Supabase artisan_applications
    try {
      const updatePayload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (body.name) updatePayload.name = body.name.trim();
      if (body.artStyle || body.role) updatePayload.type_of_art = (body.artStyle || body.role).trim();
      if (body.regionalBelonging || body.region) updatePayload.state = (body.regionalBelonging || body.region).trim();

      const updateQuery = supabaseAdmin.from('artisan_applications').update(updatePayload);
      if (cleanEmail && targetAppNumber) {
        await updateQuery.or(`email.eq.${cleanEmail},application_number.eq.${targetAppNumber}`);
      } else if (cleanEmail) {
        await updateQuery.eq('email', cleanEmail);
      } else if (targetAppNumber) {
        await updateQuery.eq('application_number', targetAppNumber);
      }
    } catch (dbErr) {
      console.warn('[Artisan Profile PATCH] Supabase artisan_applications update warning:', dbErr);
    }

    // 3. Direct Update to Supabase artisan_profiles (if exists)
    try {
      const profUpdate: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (body.name) profUpdate.full_name = body.name.trim();
      if (body.artStyle || body.role) profUpdate.craft_specialty = (body.artStyle || body.role).trim();
      if (body.regionalBelonging || body.region) profUpdate.region = (body.regionalBelonging || body.region).trim();
      if (body.description || body.bio) profUpdate.lineage_story = (body.description || body.bio).trim();

      await supabaseAdmin
        .from('artisan_profiles')
        .update(profUpdate)
        .eq('user_email', cleanEmail);
    } catch {}

    // 4. Also forward to backend gateway with artisan identifier header if running
    try {
      await proxyToBackend(req, '/api/v1/artisan/me', {
        method: 'PATCH',
        body: {
          ...body,
          email: cleanEmail,
        },
      });
    } catch {}

    // 5. Persist to local JSON data file so SSR and static fallbacks pick it up immediately
    try {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'src/data/artisan_profiles_list.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        const list = JSON.parse(raw);
        const idx = list.findIndex(
          (item: any) =>
            item.artisanNo?.toLowerCase() === 'hg-84192' ||
            item.id?.toLowerCase() === targetAppNumber.toLowerCase()
        );
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...body, updatedAt: new Date().toISOString() };
        } else {
          list.push({ id: targetAppNumber, artisanNo: 'HG-84192', ...body, updatedAt: new Date().toISOString() });
        }
        fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf8');
      }
    } catch (fsErr) {
      console.warn('[Artisan Profile PATCH] JSON file sync note:', fsErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Artisan profile updated successfully and published live.',
      profile: { ...DEFAULT_PROFILE },
    });
  } catch (err: any) {
    console.error('[Artisan Profile PATCH Error]:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to update artisan profile.' },
      { status: 500 }
    );
  }
}
