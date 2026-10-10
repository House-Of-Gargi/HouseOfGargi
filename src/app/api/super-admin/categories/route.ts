import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';

const CATEGORIES_FILE = path.join(process.cwd(), 'src', 'data', 'categories.json');

const INITIAL_CATEGORIES = [
  {
    id: 'sarees',
    name: 'Royal Sarees',
    sanskritLipi: 'गार्गी सूत्रम्',
    slug: 'sarees',
    description: 'Master handloom Banarasi, Kanchipuram, and Paithani silks woven on traditional pit looms.',
    imageUrl: '/images/category-sarees.png',
    displayOrder: 1,
    isActive: true,
    productCount: 14,
  },
  {
    id: 'lehengas',
    name: 'Bridal Lehengas',
    sanskritLipi: 'राज दरबार',
    slug: 'lehengas',
    description: 'Hand-embroidered zardozi and gota patti bridal ensembles for royal weddings.',
    imageUrl: '/images/category-lehengas.png',
    displayOrder: 2,
    isActive: true,
    productCount: 8,
  },
  {
    id: 'kurta-sets',
    name: 'Heritage Kurta Sets',
    sanskritLipi: 'पवित्र परम्परा',
    slug: 'kurta-sets',
    description: 'Chanderi silk and Awadhi Chikankari artisan kurtas with handcrafted buttons.',
    imageUrl: '/images/category-kurtas.png',
    displayOrder: 3,
    isActive: true,
    productCount: 6,
  },
  {
    id: 'accessories',
    name: 'Courtly Jewellery & Dupattas',
    sanskritLipi: 'শৃঙ্গার অলঙ্কার',
    slug: 'accessories',
    description: 'Kundan polki crafts and pure zari pashmina stoles handcrafted by heritage guild artisans.',
    imageUrl: '/images/category-accessories.png',
    displayOrder: 4,
    isActive: true,
    productCount: 11,
  },
  {
    id: 'bespoke',
    name: 'Bespoke Atelier Trousseau',
    sanskritLipi: 'राजকীয় সৃষ্টি',
    slug: 'bespoke',
    description: 'Commissioned heirloom textiles custom woven with personalized motifs and weaver signatures.',
    imageUrl: '/images/category-bespoke.png',
    displayOrder: 5,
    isActive: true,
    productCount: 4,
  },
];

export async function GET() {
  try {
    let categories = INITIAL_CATEGORIES;
    if (fs.existsSync(CATEGORIES_FILE)) {
      try {
        categories = JSON.parse(fs.readFileSync(CATEGORIES_FILE, 'utf8'));
      } catch {}
    } else {
      const dir = path.dirname(CATEGORIES_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf8');
    }

    return NextResponse.json({ success: true, categories });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, sanskritLipi, slug, description, imageUrl, displayOrder } = body;

    if (!name || !slug) {
      return NextResponse.json({ success: false, message: 'Name and slug are required' }, { status: 400 });
    }

    let categories = INITIAL_CATEGORIES;
    if (fs.existsSync(CATEGORIES_FILE)) {
      categories = JSON.parse(fs.readFileSync(CATEGORIES_FILE, 'utf8'));
    }

    const newCategory = {
      id: slug.toLowerCase().trim().replace(/[^a-z0-9]/g, '-'),
      name,
      sanskritLipi: sanskritLipi || 'पवित्र शिल्प',
      slug: slug.toLowerCase().trim(),
      description: description || '',
      imageUrl: imageUrl || '/images/category-sarees.png',
      displayOrder: displayOrder ? Number(displayOrder) : categories.length + 1,
      isActive: true,
      productCount: 0,
    };

    categories.push(newCategory);
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf8');

    return NextResponse.json({ success: true, category: newCategory });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, sanskritLipi, description, isActive, displayOrder } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Category ID required' }, { status: 400 });
    }

    let categories = INITIAL_CATEGORIES;
    if (fs.existsSync(CATEGORIES_FILE)) {
      categories = JSON.parse(fs.readFileSync(CATEGORIES_FILE, 'utf8'));
    }

    const idx = categories.findIndex((c: any) => c.id === id);
    if (idx !== -1) {
      if (name) categories[idx].name = name;
      if (sanskritLipi) categories[idx].sanskritLipi = sanskritLipi;
      if (description !== undefined) categories[idx].description = description;
      if (isActive !== undefined) categories[idx].isActive = isActive;
      if (displayOrder !== undefined) categories[idx].displayOrder = Number(displayOrder);

      fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf8');
      return NextResponse.json({ success: true, category: categories[idx] });
    }

    return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message }, { status: 500 });
  }
}
