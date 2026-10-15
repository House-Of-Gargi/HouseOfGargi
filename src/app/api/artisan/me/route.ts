import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';

const DEFAULT_PROFILE = {
  id: 'HG-ART-260501',
  artisanNo: 'HG-84192',
  name: 'Gopal Chandra Dey',
  role: 'Master Tangail Jamdani Pit Loom Weaver',
  artStyle: 'Tangail Jamdani Pit Loom',
  region: 'Shantipur, Nadia, West Bengal, India',
  regionalBelonging: 'Shantipur, Nadia, West Bengal',
  experience: '32 Years',
  profileImage: '/images/artisans_split.png',
  email: 'team.anga9@gmail.com',
};

export async function GET(req: Request) {
  try {
    const res = await proxyToBackend(req, '/api/v1/artisan/me');
    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.artisan) {
      return NextResponse.json({
        success: true,
        artisan: { ...DEFAULT_PROFILE, ...data.artisan },
      });
    }
  } catch {}

  return NextResponse.json({
    success: true,
    artisan: DEFAULT_PROFILE,
  });
}
