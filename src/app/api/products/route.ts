import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { products, categories } from '@/data/products';

const PRODUCT_OVERRIDES_FILE = path.join(process.cwd(), 'src', 'data', 'product_overrides.json');

function getProductOverrides(): Record<string, any> {
  if (fs.existsSync(PRODUCT_OVERRIDES_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PRODUCT_OVERRIDES_FILE, 'utf8'));
    } catch {}
  }
  return {};
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const overrides = getProductOverrides();

  let result = products.map((p) => {
    const ov = overrides[p.id] || {};
    return {
      ...p,
      name: ov.name || p.name,
      price: ov.price !== undefined ? ov.price : p.price,
      stock: ov.stock !== undefined ? ov.stock : ((p as any).stock ?? 10),
      images: ov.images || p.images,
      description: ov.description || p.description,
      craftTechnique: ov.artType || ov.technique || (p as any).craftTechnique || p.technique,
      fabric: ov.fabric || p.fabric,
    };
  });

  if (category) {
    result = result.filter((p) => p.category === category);
  }

  return NextResponse.json(
    { success: true, count: result.length, categories, products: result },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}
