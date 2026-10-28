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
  let profile = { ...DEFAULT_PROFILE };
  let application: any = null;

  const url = new URL(req.url);
  const queryEmail = (url.searchParams.get('email') || '').toLowerCase().trim();

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
    let query = supabaseAdmin.from('artisan_applications').select('*');

    if (queryEmail) {
      const { data: matchedApp } = await query.eq('email', queryEmail).maybeSingle();
      if (matchedApp) {
        application = matchedApp;
      }
    }

    // Fallback to primary application if none matched or no email passed
    if (!application) {
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
  return proxyToBackend(req, '/api/v1/artisan/me');
}
