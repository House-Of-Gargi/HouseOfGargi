import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CATEGORIES_FILE = path.join(process.cwd(), 'src', 'data', 'categories.json');

const INITIAL_CATEGORIES = [
  {
    id: 'sarees',
    name: 'Sarees',
    slug: 'sarees',
    description: 'Handloom Banarasi, Kanchipuram, and Paithani silk sarees.',
    imageUrl: '/images/category-sarees.png',
    displayOrder: 1,
    isActive: true,
    productCount: 14,
  },
  {
    id: 'lehengas',
    name: 'Lehengas',
    slug: 'lehengas',
    description: 'Hand-embroidered bridal and celebratory royal lehenga sets.',
    imageUrl: '/images/category-lehengas.png',
    displayOrder: 2,
    isActive: true,
    productCount: 8,
  },
  {
    id: 'kurta-sets',
    name: 'Kurta Sets',
    slug: 'kurta-sets',
    description: 'Artisan woven Chanderi and Chikankari kurta sets.',
    imageUrl: '/images/category-kurtas.png',
    displayOrder: 3,
    isActive: true,
    productCount: 6,
  },
  {
    id: 'accessories',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Handcrafted jewellery, Kundan polki crafts, and stoles.',
    imageUrl: '/images/category-accessories.png',
    displayOrder: 4,
    isActive: true,
    productCount: 11,
  },
  {
    id: 'bespoke',
    name: 'Bespoke',
    slug: 'bespoke',
    description: 'Custom commissioned heirloom pieces tailored on loom.',
    imageUrl: '/images/category-bespoke.png',
    displayOrder: 5,
    isActive: true,
    productCount: 4,
  },
];

function readCategories(): any[] {
  if (fs.existsSync(CATEGORIES_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CATEGORIES_FILE, 'utf8'));
    } catch {}
  }
  return INITIAL_CATEGORIES;
}

function writeCategories(categories: any[]) {
  const dir = path.dirname(CATEGORIES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf8');
}

export async function GET() {
  try {
    const categories = readCategories();
    return NextResponse.json({ success: true, categories });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, description, displayOrder } = body;

    if (!name?.trim()) {
      return NextResponse.json({ success: false, message: 'Category name is required' }, { status: 400 });
    }

    const categories = readCategories();
    const cleanSlug = (slug?.trim() || name.trim())
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Check duplicate slug
    if (categories.some((c) => c.slug === cleanSlug || c.id === cleanSlug)) {
      return NextResponse.json({ success: false, message: 'A category with this slug already exists' }, { status: 400 });
    }

    const newCategory = {
      id: cleanSlug,
      name: name.trim(),
      slug: cleanSlug,
      description: description?.trim() || `Curated collection of ${name.trim()} handcrafted by master artisans.`,
      imageUrl: `/images/category-${cleanSlug}.png`,
      displayOrder: displayOrder ? Number(displayOrder) : categories.length + 1,
      isActive: true,
      productCount: 0,
    };

    categories.push(newCategory);
    writeCategories(categories);

    return NextResponse.json({ success: true, category: newCategory });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, description, isActive, displayOrder } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Category ID required' }, { status: 400 });
    }

    const categories = readCategories();
    const idx = categories.findIndex((c) => c.id === id || c.slug === id);
    if (idx !== -1) {
      if (name?.trim()) categories[idx].name = name.trim();
      if (description !== undefined) categories[idx].description = description.trim();
      if (isActive !== undefined) categories[idx].isActive = Boolean(isActive);
      if (displayOrder !== undefined) categories[idx].displayOrder = Number(displayOrder);

      writeCategories(categories);
      return NextResponse.json({ success: true, category: categories[idx] });
    }

    return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Category ID is required' }, { status: 400 });
    }

    const categories = readCategories();
    const filtered = categories.filter((c) => c.id !== id && c.slug !== id);

    if (filtered.length === categories.length) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    writeCategories(filtered);
    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message }, { status: 500 });
  }
}
