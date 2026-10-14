import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PROFILE_FILE = path.join(process.cwd(), 'src', 'data', 'artisan_profile.json');

function getProfile() {
  if (fs.existsSync(PROFILE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PROFILE_FILE, 'utf8'));
    } catch {}
  }
  return null;
}

function saveProfile(data: any) {
  try {
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch {}
}

export async function GET() {
  const profile = getProfile();
  return NextResponse.json({ success: true, profile });
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const current = getProfile() || {};
    const updated = {
      ...current,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    saveProfile(updated);
    return NextResponse.json({ success: true, message: 'Artisan profile updated successfully', profile: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || 'Failed to update profile' }, { status: 500 });
  }
}
