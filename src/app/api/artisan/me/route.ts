import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PROFILES_FILE = path.join(process.cwd(), 'src', 'data', 'artisan_profiles_list.json');
const APPS_FILE = path.join(process.cwd(), 'src', 'data', 'artisan_applications.json');

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email')?.toLowerCase().trim();

    let profiles: any[] = [];
    if (fs.existsSync(PROFILES_FILE)) {
      try {
        profiles = JSON.parse(fs.readFileSync(PROFILES_FILE, 'utf8'));
      } catch {}
    }

    let applications: any[] = [];
    if (fs.existsSync(APPS_FILE)) {
      try {
        applications = JSON.parse(fs.readFileSync(APPS_FILE, 'utf8'));
      } catch {}
    }

    // Master default profile
    let matchedProfile = profiles[0] || {
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

    if (email) {
      // Find in applications first
      const app = applications.find((a: any) => a.email?.toLowerCase().trim() === email);
      if (app) {
        matchedProfile = {
          ...matchedProfile,
          name: app.name || matchedProfile.name,
          artisanNo: app.artisanNo || matchedProfile.artisanNo,
          email: app.email || email,
          artStyle: app.typeOfArt || matchedProfile.artStyle,
          regionalBelonging: `${app.placeOfBirth || ''}, ${app.state || ''}`.trim() || matchedProfile.regionalBelonging,
        };
      } else {
        const prof = profiles.find((p: any) => p.email?.toLowerCase().trim() === email);
        if (prof) {
          matchedProfile = { ...matchedProfile, ...prof };
        }
      }
    }

    return NextResponse.json({
      success: true,
      artisan: matchedProfile,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error fetching artisan profile' },
      { status: 500 }
    );
  }
}
