import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const DEFAULT_PROFILE = {
  id: 'HG-ART-260501',
  artisanNo: 'HG-84192',
  name: 'Gopal Chandraa',
  role: 'Master Tangail Jamdani Pit Loom Weaver',
  artStyle: 'Tangail Jamdani Pit Loom',
  region: 'Shantipur, Nadia, West Bengal, India',
  regionalBelonging: 'Shantipur, Nadia, West Bengal',
  experience: '32 Years',
  profileImage: '/images/artisans_split.png',
  email: 'team.anga9@gmail.com',
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = (url.searchParams.get('email') || '').toLowerCase().trim();
  const phone = (url.searchParams.get('phone') || '').replace(/\D/g, '').slice(-10);

  // If email or phone is passed, lookup their specific application record in Supabase
  if (email || phone) {
    try {
      let query = supabaseAdmin.from('artisan_applications').select('*');
      if (email) {
        query = query.eq('email', email);
      } else if (phone) {
        query = query.ilike('phone', `%${phone}%`);
      }
      const { data: appData } = await query.maybeSingle();
      if (appData) {
        return NextResponse.json({
          success: true,
          artisan: {
            ...DEFAULT_PROFILE,
            id: appData.application_number || appData.id,
            artisanNo: appData.artisanNo || appData.application_number,
            name: appData.name,
            artStyle: appData.type_of_art || DEFAULT_PROFILE.artStyle,
            regionalBelonging: appData.state || DEFAULT_PROFILE.regionalBelonging,
            email: appData.email,
          },
        });
      }
    } catch {}
  }

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
