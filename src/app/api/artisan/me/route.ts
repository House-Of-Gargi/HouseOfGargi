import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const DEFAULT_PROFILE = {
  id: 'HG-ART-260501',
  artisanNo: 'HG-84192',
  name: 'Gopal Chandra De',
  role: 'Maharaja Embroidary Design',
  artStyle: 'Maharaja Embroidary Design',
  region: 'Kolkata, West Bengal',
  regionalBelonging: 'Kolkata, West Bengal',
  experience: '32 Years',
  profileImage: '/images/artisans_split.png',
  email: 'team.anga9@gmail.com',
};

function getDynamicDefaultProfile() {
  try {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'src/data/artisan_profiles_list.json');
    if (fs.existsSync(filePath)) {
      const list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const master = list.find((p: any) => p.artisanNo?.toLowerCase() === 'hg-84192' || p.id === 'HG-ART-260501');
      if (master) return { ...DEFAULT_PROFILE, ...master };
    }
  } catch {}
  return DEFAULT_PROFILE;
}

export async function GET(req: Request) {
  const dynamicProfile = getDynamicDefaultProfile();
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
            ...dynamicProfile,
            id: appData.application_number || appData.id,
            artisanNo: appData.artisanNo || appData.application_number,
            name: appData.name,
            artStyle: appData.type_of_art || dynamicProfile.artStyle,
            regionalBelonging: appData.state || dynamicProfile.regionalBelonging,
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
        artisan: { ...dynamicProfile, ...data.artisan },
      });
    }
  } catch {}

  return NextResponse.json({
    success: true,
    artisan: dynamicProfile,
  });
}
