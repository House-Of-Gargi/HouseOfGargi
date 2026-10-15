import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { products, categories } from '@/data/products';

const PRODUCT_OVERRIDES_FILE = path.join(process.cwd(), 'src', 'data', 'product_overrides.json');
const DELETED_PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'deleted_products.json');

function getDeletedProducts(): Set<string> {
  if (fs.existsSync(DELETED_PRODUCTS_FILE)) {
    try {
      const arr = JSON.parse(fs.readFileSync(DELETED_PRODUCTS_FILE, 'utf8'));
      if (Array.isArray(arr)) {
        return new Set(arr.map((s: string) => String(s).toLowerCase().trim()));
      }
    } catch {}
  }
  return new Set();
}

function getProductOverrides(): Record<string, any> {
  if (fs.existsSync(PRODUCT_OVERRIDES_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PRODUCT_OVERRIDES_FILE, 'utf8'));
    } catch {}
  }
  return {};
}

function findOverride(p: any, overrides: Record<string, any>): any {
  if (overrides[p.id]) return overrides[p.id];
  const pName = String(p.name || '').toLowerCase().trim();
  for (const [key, ov] of Object.entries(overrides)) {
    if (key.toLowerCase().trim() === pName) return ov;
    if (ov && ov.name && String(ov.name).toLowerCase().trim() === pName) {
      return ov;
    }
  }
  return {};
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const overrides = getProductOverrides();
  const deletedSet = getDeletedProducts();

  let result = products
    .filter((p) => {
      const idKey = String(p.id).toLowerCase().trim();
      const nameKey = String(p.name).toLowerCase().trim();
      if (deletedSet.has(idKey) || deletedSet.has(nameKey)) return false;
      const ov = findOverride(p, overrides);
      if (ov.isDeleted) return false;
      if (ov.isHidden) return false;
      return true;
    })
    .map((p) => {
      const ov = findOverride(p, overrides);
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
