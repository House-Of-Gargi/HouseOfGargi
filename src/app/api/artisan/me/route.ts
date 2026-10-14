import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PROFILES_LIST_FILE = path.join(process.cwd(), 'src', 'data', 'artisan_profiles_list.json');
const PROFILE_SINGLE_FILE = path.join(process.cwd(), 'src', 'data', 'artisan_profile.json');
const APPS_FILE = path.join(process.cwd(), 'src', 'data', 'artisan_applications.json');

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email')?.toLowerCase().trim();

    let singleProfile: any = null;
    if (fs.existsSync(PROFILE_SINGLE_FILE)) {
      try {
        singleProfile = JSON.parse(fs.readFileSync(PROFILE_SINGLE_FILE, 'utf8'));
      } catch {}
    }

    let profilesList: any[] = [];
    if (fs.existsSync(PROFILES_LIST_FILE)) {
      try {
        profilesList = JSON.parse(fs.readFileSync(PROFILES_LIST_FILE, 'utf8'));
      } catch {}
    }

    let applications: any[] = [];
    if (fs.existsSync(APPS_FILE)) {
      try {
        applications = JSON.parse(fs.readFileSync(APPS_FILE, 'utf8'));
      } catch {}
    }

    // Default master profile (Gopal Chandra Dey)
    let matchedProfile = {
      id: singleProfile?.applicationId || 'HG-ART-260501',
      artisanNo: singleProfile?.artisanNo || 'HG-84192',
      name: singleProfile?.name || 'Gopal Chandra Dey',
      role: singleProfile?.role || 'Master Tangail Jamdani Pit Loom Weaver',
      artStyle: singleProfile?.specialties?.[0] || 'Tangail Jamdani Pit Loom',
      region: singleProfile?.region || 'Shantipur, Nadia, West Bengal, India',
      regionalBelonging: 'Shantipur, Nadia, West Bengal',
      experience: `${singleProfile?.experienceYears || 32} Years`,
      profileImage: singleProfile?.profileImage || '/images/artisans_split.png',
      email: singleProfile?.contactEmail || 'team.anga9@gmail.com',
    };

    if (email) {
      // 1. Check if email matches single master profile
      if (
        singleProfile?.contactEmail?.toLowerCase().trim() === email ||
        email === 'team.anga9@gmail.com'
      ) {
        // Matched master profile
        matchedProfile.email = email;
      }
      // 2. Check applications for dynamic registered artisan
      else {
        const app = applications.find((a: any) => a.email?.toLowerCase().trim() === email);
        if (app) {
          matchedProfile = {
            id: app.applicationId || app.id || `HG-ART-${Date.now()}`,
            artisanNo: app.artisanNo || 'HG-84192',
            name: app.name || 'Artisan Partner',
            role: `Master ${app.typeOfArt || 'Handloom'} Artisan`,
            artStyle: app.typeOfArt || 'Heritage Handloom Weave',
            region: `${app.placeOfBirth || ''}, ${app.state || ''}, India`.trim(),
            regionalBelonging: `${app.placeOfBirth || ''}, ${app.state || ''}`.trim() || 'India',
            experience: `${app.age ? Math.max(5, app.age - 18) : 20} Years`,
            profileImage: '/images/artisans_split.png',
            email: app.email || email,
          };
        } else {
          // 3. Check profiles list
          const prof = profilesList.find(
            (p: any) => p.email?.toLowerCase().trim() === email || p.contactEmail?.toLowerCase().trim() === email
          );
          if (prof) {
            matchedProfile = {
              ...matchedProfile,
              ...prof,
              email,
            };
          }
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
