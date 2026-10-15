import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CATEGORIES_FILE = path.join(process.cwd(), 'src', 'data', 'categories.json');

const DEFAULT_CATEGORIES = [
  { id: 'sarees', name: 'Sarees', slug: 'sarees', isActive: true },
  { id: 'lehengas', name: 'Lehengas', slug: 'lehengas', isActive: true },
  { id: 'kurta-sets', name: 'Kurta Sets', slug: 'kurta-sets', isActive: true },
  { id: 'accessories', name: 'Accessories', slug: 'accessories', isActive: true },
  { id: 'bespoke', name: 'Bespoke', slug: 'bespoke', isActive: true },
];

export async function GET() {
  try {
    let categories = DEFAULT_CATEGORIES;
    if (fs.existsSync(CATEGORIES_FILE)) {
      try {
        categories = JSON.parse(fs.readFileSync(CATEGORIES_FILE, 'utf8'));
      } catch {}
    }
    return NextResponse.json({ success: true, categories });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message, categories: DEFAULT_CATEGORIES }, { status: 500 });
  }
}
