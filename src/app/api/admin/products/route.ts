import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';
import { products as catalogProducts } from '@/data/products';

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

// Consistent Sales Units Map
// Real orders counting (0 when no orders have happened yet)
const ORDERS_FILE = path.join(process.cwd(), 'src', 'data', 'backend_orders.json');
function getRealProductSalesMap(): Record<string, number> {
  const map: Record<string, number> = {};
  if (fs.existsSync(ORDERS_FILE)) {
    try {
      const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
      if (Array.isArray(orders)) {
        orders.forEach((o: any) => {
          if (Array.isArray(o.items)) {
            o.items.forEach((it: any) => {
              map[it.id] = (map[it.id] || 0) + (Number(it.quantity) || 1);
            });
          }
        });
      }
    } catch {}
  }
  return map;
}

export async function GET() {
  try {
    const productNumbers = getProductNumbers();
    const realSalesMap = getRealProductSalesMap();
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

    const mergedList: any[] = [];
    const processedIds = new Set<string>();

    // Process Supabase products — ALL attributed solely to Gopal Chandra Dey (HG-84192)
    supabaseProducts.forEach((sp) => {
      processedIds.add(sp.id);

      let pNo = productNumbers[sp.id];
      if (!pNo) {
        pNo = generateUniqueProductNo(existingCodes);
        productNumbers[sp.id] = pNo;
        existingCodes.add(pNo);
      }

      const catMatch = catalogProducts.find(
        (cp) => cp.name.toLowerCase() === (sp.name || '').toLowerCase()
      );

      const baseImages = catMatch?.images || [sp.image_url || '/images/category-sarees.png'];
      const images = (productOverrides[sp.id]?.images) || baseImages;

      mergedList.push({
        id: sp.id,
        productNo: pNo,
        name: productOverrides[sp.id]?.name || sp.name,
        category: sp.category || catMatch?.category || 'sarees',
        price: productOverrides[sp.id]?.price || sp.price_in_rupees || catMatch?.price || 0,
        stock: productOverrides[sp.id]?.stock ?? (sp.stock ?? 10),
        totalSales: realSalesMap[sp.id] || 0,
        images,
        description: productOverrides[sp.id]?.description || catMatch?.description || 'Authentic handcrafted heritage creation.',
        // All products listed solely under Gopal Chandra Dey (HG-84192)
        artisanName: 'Gopal Chandra Dey',
        artisanNo: 'HG-84192',
        artisanId: 'HG-ART-260501',
        artType: sp.craft_technique || catMatch?.technique || 'Tangail Jamdani Pit Loom',
        fabric: catMatch?.fabric || 'Pure Mulberry Silk',
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

        mergedList.push({
          id: cp.id,
          productNo: pNo,
          name: productOverrides[cp.id]?.name || cp.name,
          category: cp.category,
          price: productOverrides[cp.id]?.price || cp.price,
          stock: productOverrides[cp.id]?.stock ?? 12,
          totalSales: SALES_MAP[cp.id] || 36,
          images,
          description: productOverrides[cp.id]?.description || cp.description,
          // All products listed solely under Gopal Chandra Dey (HG-84192)
          artisanName: 'Gopal Chandra Dey',
          artisanNo: 'HG-84192',
          artisanId: 'HG-ART-260501',
          artType: cp.technique || 'Tangail Jamdani Pit Loom',
          fabric: cp.fabric || 'Pure Mulberry Silk',
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
