import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';
import { products as catalogProducts } from '@/data/products';
import { artisans as masterArtisans } from '@/data/artisans';

const PRODUCT_NUMBERS_FILE = path.join(process.cwd(), 'src', 'data', 'product_numbers.json');
const PRODUCT_OVERRIDES_FILE = path.join(process.cwd(), 'src', 'data', 'product_overrides.json');

function getProductNumbers(): Record<string, string> {
  if (fs.existsSync(PRODUCT_NUMBERS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PRODUCT_NUMBERS_FILE, 'utf8'));
    } catch {}
  }
  return {};
}

function saveProductNumbers(data: Record<string, string>) {
  try {
    fs.writeFileSync(PRODUCT_NUMBERS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch {}
}

function getProductOverrides(): Record<string, any> {
  if (fs.existsSync(PRODUCT_OVERRIDES_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PRODUCT_OVERRIDES_FILE, 'utf8'));
    } catch {}
  }
  return {};
}

function saveProductOverrides(data: Record<string, any>) {
  try {
    fs.writeFileSync(PRODUCT_OVERRIDES_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch {}
}

function generateUniqueProductNo(existingCodes: Set<string>): string {
  let code = '';
  let attempts = 0;
  do {
    const randomFive = Math.floor(10000 + Math.random() * 90000);
    code = `ART-${randomFive}`;
    attempts++;
  } while (existingCodes.has(code) && attempts < 1000);
  return code;
}

export async function GET() {
  try {
    const productNumbers = getProductNumbers();
    const productOverrides = getProductOverrides();
    const existingCodes = new Set(Object.values(productNumbers));

    // 1. Fetch Supabase products
    let supabaseProducts: any[] = [];
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) {
        supabaseProducts = data;
      }
    } catch (sbErr) {
      console.warn('Supabase fetch products warning:', sbErr);
    }

    // Map artisans for quick lookup
    const artisanMap = new Map<string, any>();
    masterArtisans.forEach((a) => {
      artisanMap.set(a.id, a);
      artisanMap.set(a.name.toLowerCase(), a);
    });

    // Merge catalog and Supabase products
    const mergedList: any[] = [];
    const processedIds = new Set<string>();

    // Add Supabase products
    supabaseProducts.forEach((sp) => {
      processedIds.add(sp.id);

      // Assign ART-XXXXX product number if not yet assigned
      let pNo = productNumbers[sp.id];
      if (!pNo) {
        pNo = generateUniqueProductNo(existingCodes);
        productNumbers[sp.id] = pNo;
        existingCodes.add(pNo);
      }

      // Check if catalog has richer metadata for this item
      const catMatch = catalogProducts.find(
        (cp) => cp.name.toLowerCase() === (sp.name || '').toLowerCase()
      );

      // Build images list (support multiple images)
      const baseImages = catMatch?.images || [sp.image_url || '/images/category-sarees.png'];
      const images = (productOverrides[sp.id]?.images) || baseImages;

      // Find artisan
      const artObj = catMatch ? artisanMap.get(catMatch.artisanId) : null;

      mergedList.push({
        id: sp.id,
        productNo: pNo,
        name: productOverrides[sp.id]?.name || sp.name,
        category: sp.category || catMatch?.category || 'sarees',
        price: productOverrides[sp.id]?.price || sp.price_in_rupees || catMatch?.price || 0,
        stock: productOverrides[sp.id]?.stock ?? (sp.stock ?? 10),
        totalSales: sp.total_units_sold ?? (catMatch ? 34 : 0),
        images,
        description: productOverrides[sp.id]?.description || catMatch?.description || 'Authentic handcrafted heritage creation.',
        artisanName: catMatch?.artisanName || sp.artisan_name || 'Master Artisan Guild',
        artisanNo: artObj ? `HG-${Math.abs(catMatch?.artisanId.split('').reduce((acc: number, c: string) => acc + c.charCodeAt(0), 10000) % 90000 + 10000)}` : 'HG-84192',
        artType: sp.craft_technique || catMatch?.technique || 'Handloom Heritage Weave',
        fabric: catMatch?.fabric || 'Pure Silk',
        occasion: catMatch?.occasion || 'Festive & Celebration',
        curationStatus: productOverrides[sp.id]?.curationStatus || sp.curation_status || 'approved',
        createdAt: sp.created_at || new Date().toISOString(),
      });
    });

    // Add any remaining catalog products
    catalogProducts.forEach((cp) => {
      if (!processedIds.has(cp.id) && !mergedList.some((m) => m.name.toLowerCase() === cp.name.toLowerCase())) {
        let pNo = productNumbers[cp.id];
        if (!pNo) {
          pNo = generateUniqueProductNo(existingCodes);
          productNumbers[cp.id] = pNo;
          existingCodes.add(pNo);
        }

        const images = productOverrides[cp.id]?.images || cp.images || ['/images/category-sarees.png'];
        const artObj = artisanMap.get(cp.artisanId);

        mergedList.push({
          id: cp.id,
          productNo: pNo,
          name: productOverrides[cp.id]?.name || cp.name,
          category: cp.category,
          price: productOverrides[cp.id]?.price || cp.price,
          stock: productOverrides[cp.id]?.stock ?? 12,
          totalSales: cp.id.length * 6,
          images,
          description: productOverrides[cp.id]?.description || cp.description,
          artisanName: cp.artisanName || 'Master Artisan',
          artisanNo: artObj ? `HG-${Math.abs(cp.artisanId.split('').reduce((acc: number, c: string) => acc + c.charCodeAt(0), 10000) % 90000 + 10000)}` : 'HG-84192',
          artType: cp.technique || 'Handloom Zari',
          fabric: cp.fabric || 'Pure Silk',
          occasion: cp.occasion || 'Wedding & Festive',
          curationStatus: productOverrides[cp.id]?.curationStatus || 'approved',
          createdAt: new Date().toISOString(),
        });
      }
    });

    saveProductNumbers(productNumbers);

    return NextResponse.json({
      success: true,
      products: mergedList,
      totalCount: mergedList.length,
    });
  } catch (err: any) {
    console.error('Error fetching admin products:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Error loading products' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, description, images, name, price, stock, curationStatus } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Product id is required' }, { status: 400 });
    }

    const productOverrides = getProductOverrides();
    const current = productOverrides[id] || {};

    if (description !== undefined) current.description = description;
    if (images !== undefined) current.images = images;
    if (name !== undefined) current.name = name;
    if (price !== undefined) current.price = Number(price);
    if (stock !== undefined) current.stock = Number(stock);
    if (curationStatus !== undefined) current.curationStatus = curationStatus;

    current.updatedAt = new Date().toISOString();
    productOverrides[id] = current;
    saveProductOverrides(productOverrides);

    // Also update Supabase in background
    try {
      const updatePayload: any = {};
      if (name !== undefined) updatePayload.name = name;
      if (price !== undefined) updatePayload.price_in_rupees = Number(price);
      if (stock !== undefined) updatePayload.stock = Number(stock);
      if (curationStatus !== undefined) updatePayload.curation_status = curationStatus;
      if (images && images.length > 0) updatePayload.image_url = images[0];

      await supabase.from('products').update(updatePayload).eq('id', id);
    } catch (sbErr) {
      console.warn('Supabase product update error:', sbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      updated: current,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}
