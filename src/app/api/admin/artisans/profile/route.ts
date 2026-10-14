import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PROFILES_FILE = path.join(process.cwd(), 'src', 'data', 'artisan_profiles_list.json');

const MASTER_PROFILE = {
  id: 'HG-ART-260501',
  artisanNo: 'HG-84192',
  name: 'Gopal Chandra Dey',
  role: 'Master Tangail Jamdani Pit Loom Weaver',
  artStyle: 'Tangail Jamdani Pit Loom',
  region: 'Shantipur, Nadia, West Bengal, India',
  regionalBelonging: 'Shantipur, Nadia, West Bengal',
  lineage: '4th Generation Pit Loom Lineage (Trained by Late Narayan Chandra Dey)',
  experience: '32 Years',
  experienceYears: 32,
  loomHoursTotal: '15,000+ Loom Hours Preserved',
  profileImage: '/images/artisans_split.png',
  philosophy: 'In Shantipur, every Jamdani motif is a sacred prayer of rhythm, breath, and patience. When the shuttle moves across mulberry silk on our pit loom, time stands still.',
  bio: 'Rooted in the historic weaving cluster of Shantipur, Nadia, Master Gopal Chandra Dey preserves the centuries-old royal Jamdani pit-loom craft. Mentoring 14 rural weaver families, his workshop utilizes 100% certified Murshidabad mulberry silk, combed fine cotton, and natural AZO-free dyes to handcraft timeless heirloom drapes originally celebrated in Royal Bengal courts.',
  description: 'Master weaver preserving 4 generations of royal Jamdani pit-loom craft. Mentoring 14 rural weaver families, his workshop utilizes 100% certified Murshidabad mulberry silk, combed fine cotton, and natural AZO-free dyes to handcraft timeless heirloom drapes originally celebrated in Royal Bengal courts.',
  specialties: [
    'Tangail Jamdani Pit Loom Weave',
    '100% Murshidabad Mulberry Silk',
    'Tested Real Silver & Gold Zari',
    'Natural AZO-Free Vegetable Dyes',
    'Terracotta & Geometric Peacock Motifs',
  ],
  communityImpact: 'Regular fair-wage employment for 14 rural weaver families and flexible home-spinning shifts for women artisans in Nadia district.',
};

function getProfiles(): any[] {
  if (fs.existsSync(PROFILES_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(PROFILES_FILE, 'utf8'));
      if (Array.isArray(data) && data.length > 0) {
        // Merge with master defaults so all fields exist safely
        return data.map((p) => ({ ...MASTER_PROFILE, ...p }));
      }
    } catch {}
  }
  return [MASTER_PROFILE];
}

function saveProfiles(data: any[]) {
  try {
    fs.writeFileSync(PROFILES_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch {}
}

export async function GET() {
  const profiles = getProfiles();
  return NextResponse.json({ success: true, profiles, profile: profiles[0] });
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const profiles = getProfiles();
    const targetId = body.id || body.artisanNo || 'HG-84192';

    let index = profiles.findIndex(
      (p) => p.id === targetId || p.artisanNo === targetId || p.name === body.name
    );

    if (index === -1) index = 0;

    profiles[index] = {
      ...profiles[index],
      name: body.name ?? profiles[index].name,
      artStyle: body.artStyle ?? profiles[index].artStyle,
      role: body.artStyle ?? profiles[index].role,
      regionalBelonging: body.regionalBelonging ?? profiles[index].regionalBelonging,
      region: body.regionalBelonging ?? profiles[index].region,
      experience: body.experience ?? profiles[index].experience,
      description: body.description ?? profiles[index].description,
      bio: body.description ?? profiles[index].bio,
      profileImage: body.profileImage ?? profiles[index].profileImage ?? profiles[index].image,
      image: body.profileImage ?? profiles[index].image ?? profiles[index].profileImage,
      updatedAt: new Date().toISOString(),
    };

    saveProfiles(profiles);

    return NextResponse.json({
      success: true,
      message: 'Artisan public profile updated successfully',
      profile: profiles[index],
      profiles,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
