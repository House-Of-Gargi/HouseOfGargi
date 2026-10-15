import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';

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
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    if (email) {
      const res = await proxyToBackend(req, `/api/v1/admin/artisans/${encodeURIComponent(email)}`);
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.profile) {
        return NextResponse.json({
          success: true,
          profile: { ...MASTER_PROFILE, ...data.profile },
          profiles: [{ ...MASTER_PROFILE, ...data.profile }],
        });
      }
    }
  } catch {}

  return NextResponse.json({
    success: true,
    profile: MASTER_PROFILE,
    profiles: [MASTER_PROFILE],
  });
}

export async function PATCH(req: Request) {
  return proxyToBackend(req, '/api/v1/artisan/me');
}
