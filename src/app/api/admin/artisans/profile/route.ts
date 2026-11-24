import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const MASTER_PROFILE = {
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
  let profile = { ...MASTER_PROFILE };

  try {
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'src/data/artisan_profiles_list.json');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const list = JSON.parse(raw);
      const match = list.find((item: any) => item.artisanNo?.toLowerCase() === 'hg-84192');
      if (match) {
        profile = { ...profile, ...match, name: match.name || profile.name };
      }
    }
  } catch {}

  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    if (email) {
      const res = await proxyToBackend(req, `/api/v1/admin/artisans/${encodeURIComponent(email)}`);
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.profile) {
        profile = { ...profile, ...data.profile, name: data.profile.name || profile.name };
      }
    }
  } catch {}

  return NextResponse.json({
    success: true,
    profile,
    profiles: [profile],
  });
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const cleanEmail = (body.email || 'team.anga9@gmail.com').toLowerCase().trim();
    const targetAppNumber = body.id || 'HG-ART-260501';

    if (body.name) MASTER_PROFILE.name = body.name.trim();
    if (body.artStyle || body.role) {
      MASTER_PROFILE.artStyle = (body.artStyle || body.role).trim();
      MASTER_PROFILE.role = (body.artStyle || body.role).trim();
    }
    if (body.regionalBelonging || body.region) {
      MASTER_PROFILE.regionalBelonging = (body.regionalBelonging || body.region).trim();
      MASTER_PROFILE.region = (body.regionalBelonging || body.region).trim();
    }

    try {
      await supabaseAdmin
        .from('artisan_applications')
        .update({
          name: body.name,
          type_of_art: body.artStyle || body.role,
          state: body.regionalBelonging || body.region,
          updated_at: new Date().toISOString(),
        })
        .or(`email.eq.${cleanEmail},application_number.eq.${targetAppNumber}`);
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Artisan profile updated successfully.',
      profile: { ...MASTER_PROFILE },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || 'Update failed' }, { status: 500 });
  }
}
