import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';
import { products as catalogProducts } from '@/data/products';

const PRODUCT_OVERRIDES_FILE = path.join(process.cwd(), 'src', 'data', 'product_overrides.json');
const PRODUCT_NUMBERS_FILE = path.join(process.cwd(), 'src', 'data', 'product_numbers.json');

function getProductOverrides(): Record<string, any> {
  if (fs.existsSync(PRODUCT_OVERRIDES_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PRODUCT_OVERRIDES_FILE, 'utf8'));
    } catch {}
  }
  return {};
}

function saveProductOverrides(overrides: Record<string, any>) {
  try {
    fs.writeFileSync(PRODUCT_OVERRIDES_FILE, JSON.stringify(overrides, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving overrides:', e);
  }
}

function getProductNumbers(): Record<string, string> {
  if (fs.existsSync(PRODUCT_NUMBERS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PRODUCT_NUMBERS_FILE, 'utf8'));
    } catch {}
  }
  return {};
}

export async function GET() {
  try {
    const overrides = getProductOverrides();
    const productNumbers = getProductNumbers();

    // 1. Fetch live products from Supabase
    let supabaseProducts: any[] = [];
    try {
      const { data } = await supabase.from('products').select('*');
      if (data && data.length > 0) supabaseProducts = data;
    } catch {}

    const itemsMap = new Map<string, any>();

    catalogProducts.forEach((cp, idx) => {
      const ov = overrides[cp.id] || {};
      const pNo = productNumbers[cp.id] || `HG-CREATION-${1000 + idx}`;

      itemsMap.set(cp.id, {
        id: cp.id,
        productNo: pNo,
        title: ov.name || cp.name,
        category: ov.category || cp.category,
        artisan: cp.artisanName || 'Gopal Chandra Dey Guild',
        price: ov.price || cp.price,
        stock: ov.stock ?? 10,
        isVisible: ov.isVisible !== undefined ? ov.isVisible : true,
        isHero: ov.isHero !== undefined ? ov.isHero : (cp.isFeatured ?? false),
        imageUrl: ov.images?.[0] || cp.images?.[0] || '/images/category-sarees.png',
      });
    });

    supabaseProducts.forEach((sp, idx) => {
      const ov = overrides[sp.id] || {};
      const existing = itemsMap.get(sp.id);
      const pNo = productNumbers[sp.id] || (existing?.productNo || `HG-CREATION-${2000 + idx}`);

      itemsMap.set(sp.id, {
        id: sp.id,
        productNo: pNo,
        title: ov.name || sp.name || existing?.title,
        category: ov.category || sp.category || existing?.category || 'sarees',
        artisan: sp.artisan_name || existing?.artisan || 'Master Handloom Guild',
        price: ov.price || sp.price_in_rupees || existing?.price || 0,
        stock: ov.stock ?? (sp.stock ?? 10),
        isVisible: ov.isVisible !== undefined ? ov.isVisible : (existing?.isVisible ?? true),
        isHero: ov.isHero !== undefined ? ov.isHero : (existing?.isHero ?? false),
        imageUrl: ov.images?.[0] || sp.image_url || existing?.imageUrl || '/images/category-sarees.png',
      });
    });

    const items = Array.from(itemsMap.values());

    return NextResponse.json({
      success: true,
      items,
      count: items.length,
    });
  } catch (err: any) {
    console.error('Master catalog API error:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Error fetching master catalog' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, isVisible, isHero } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Product ID required' }, { status: 400 });
    }

    const overrides = getProductOverrides();
    if (!overrides[id]) {
      overrides[id] = {};
    }

    if (isVisible !== undefined) {
      overrides[id].isVisible = Boolean(isVisible);
    }
    if (isHero !== undefined) {
      overrides[id].isHero = Boolean(isHero);
    }

    saveProductOverrides(overrides);

    return NextResponse.json({
      success: true,
      message: `Product ${id} storefront display settings updated`,
      id,
      isVisible: overrides[id].isVisible,
      isHero: overrides[id].isHero,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message }, { status: 500 });
  }
}
