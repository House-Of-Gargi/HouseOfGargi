import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PROFILES_FILE = path.join(process.cwd(), 'src', 'data', 'artisan_profiles_list.json');

const DEFAULT_PROFILES = [
  {
    id: 'HG-ART-260501',
    artisanNo: 'HG-84192',
    name: 'Gopal Chandra Dey',
    artStyle: 'Tangail Jamdani Pit Loom',
    regionalBelonging: 'Shantipur, Nadia, West Bengal',
    experience: '32 Years',
    description: 'Master weaver preserving 4 generations of royal Jamdani pit-loom craft. Mentoring 14 rural weaver families, his workshop utilizes 100% certified Murshidabad mulberry silk, combed fine cotton, and natural AZO-free dyes to handcraft heirloom drapes.',
    profileImage: '/images/artisans_split.png',
  },
];

function getProfiles(): any[] {
  if (fs.existsSync(PROFILES_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(PROFILES_FILE, 'utf8'));
      if (Array.isArray(data) && data.length > 0) return data;
    } catch {}
  }
  return DEFAULT_PROFILES;
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

    if (index === -1) {
      index = 0; // Default to primary profile
    }

    profiles[index] = {
      ...profiles[index],
      name: body.name ?? profiles[index].name,
      artStyle: body.artStyle ?? profiles[index].artStyle,
      regionalBelonging: body.regionalBelonging ?? profiles[index].regionalBelonging,
      experience: body.experience ?? profiles[index].experience,
      description: body.description ?? profiles[index].description,
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
