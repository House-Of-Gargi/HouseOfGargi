import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';
import { products as catalogProducts } from '@/data/products';

const APPLICATIONS_FILE = path.join(process.cwd(), 'src', 'data', 'artisan_applications.json');
const PRODUCT_OVERRIDES_FILE = path.join(process.cwd(), 'src', 'data', 'product_overrides.json');

function getProductOverrides(): Record<string, any> {
  if (fs.existsSync(PRODUCT_OVERRIDES_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PRODUCT_OVERRIDES_FILE, 'utf8'));
    } catch {}
  }
  return {};
}

function getLocalApplications(): any[] {
  if (fs.existsSync(APPLICATIONS_FILE)) {
    try {
      const raw = fs.readFileSync(APPLICATIONS_FILE, 'utf8');
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Error reading artisan_applications.json:', e);
    }
  }
  return [];
}

function saveLocalApplications(apps: any[]) {
  try {
    fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(apps, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing artisan_applications.json:', e);
  }
}

/**
 * Generates a non-colliding unique artisan code:
 * Format: "HG" + 5 random numbers (e.g. "HG-58291" or "HG58291")
 */
export function generateUniqueArtisanNo(existingCodes: Set<string>): string {
  let code = '';
  let attempts = 0;
  do {
    const randomFiveDigits = Math.floor(10000 + Math.random() * 90000); // 5 digits: 10000-99999
    code = `HG-${randomFiveDigits}`;
    attempts++;
  } while (existingCodes.has(code) && attempts < 1000);
  return code;
}

/**
 * GET /api/admin/artisans
 * Returns ONLY real verified artisans (status === 'approved')
 * Automatically guarantees every verified artisan has a unique non-colliding artisan code.
 * Calculates real registered products and sales figures.
 */
export async function GET() {
  try {
    const localApps = getLocalApplications();
    let supabaseApps: any[] = [];

    try {
      const { data, error } = await supabase
        .from('artisan_applications')
        .select('*')
        .eq('status', 'approved');

      if (!error && data) {
        supabaseApps = data;
      }
    } catch (sbErr) {
      console.warn('Supabase fetch artisan_applications warning:', sbErr);
    }

    // Combine verified applications
    const approvedMap = new Map<string, any>();

    localApps
      .filter((a) => a.status === 'approved')
      .forEach((a) => {
        const key = a.applicationId || a.id || a.email;
        approvedMap.set(key, { ...a });
      });

    supabaseApps.forEach((sa) => {
      const key = sa.application_number || sa.id || sa.email;
      const existing = approvedMap.get(key) || {};
      approvedMap.set(key, {
        applicationId: sa.application_number || sa.id || existing.applicationId,
        id: sa.id || existing.id,
        name: sa.name || existing.name,
        email: sa.email || existing.email,
        phone: sa.phone || existing.phone,
        state: sa.state || existing.state,
        typeOfArt: sa.type_of_art || existing.typeOfArt,
        status: 'approved',
        artisanNo: sa.artisan_no || sa.artisan_code || existing.artisanNo,
        submittedAt: sa.created_at || existing.submittedAt,
        updatedAt: sa.updated_at || existing.updatedAt,
      });
    });

    const verifiedArtisans = Array.from(approvedMap.values());

    // Gather all existing artisan codes to prevent any collision
    const existingCodes = new Set<string>();
    verifiedArtisans.forEach((a) => {
      if (a.artisanNo) existingCodes.add(a.artisanNo);
    });

    let hasAssignedNewCode = false;

    // Ensure every verified artisan has a unique code starting with HG and 5 random numbers
    verifiedArtisans.forEach((artisan) => {
      if (!artisan.artisanNo) {
        const newCode = generateUniqueArtisanNo(existingCodes);
        artisan.artisanNo = newCode;
        existingCodes.add(newCode);
        hasAssignedNewCode = true;

        // Update localApps record
        const localTarget = localApps.find(
          (la) => la.applicationId === artisan.applicationId || la.email === artisan.email
        );
        if (localTarget) {
          localTarget.artisanNo = newCode;
        }

        // Also update Supabase in background
        try {
          supabase
            .from('artisan_applications')
            .update({ artisan_no: newCode, updated_at: new Date().toISOString() })
            .or(`application_number.eq.${artisan.applicationId},id.eq.${artisan.applicationId}`)
            .then(({ error }: any) => {
              if (error) console.warn('Supabase update artisan_no attempt:', error);
            });
        } catch {}
      }
    });

    if (hasAssignedNewCode) {
      saveLocalApplications(localApps);
    }

    // Fetch registered products with live database state & artisan overrides
    const productOverrides = getProductOverrides();
    let supabaseProducts: any[] = [];
    try {
      const { data: pData } = await supabase.from('products').select('*');
      if (pData) supabaseProducts = pData;
    } catch (pErr) {
      console.warn('Products query error:', pErr);
    }

    const allProductsMap = new Map<string, any>();

    // 1. Base from catalogProducts
    catalogProducts.forEach((cp) => {
      const ov = productOverrides[cp.id] || {};
      allProductsMap.set(cp.id, {
        id: cp.id,
        name: ov.name || cp.name,
        category: ov.category || cp.category,
        price: ov.price !== undefined ? ov.price : cp.price,
        stock: ov.stock !== undefined ? ov.stock : 10,
        image: ov.images?.[0] || cp.images?.[0] || '/images/category-sarees.png',
        created_at: cp.createdAt || new Date().toISOString(),
        artisan_id: cp.artisanId || 'HG-ART-260501',
        artisan_no: 'HG-84192',
        artisan_name: 'Gopal Chandra Dey',
      });
    });

    // 2. Supabase live records merged with live overrides
    supabaseProducts.forEach((sp) => {
      const catMatch = catalogProducts.find(
        (cp) => cp.name.toLowerCase().trim() === (sp.name || '').toLowerCase().trim() || cp.id === sp.id
      );
      // Look up overrides by Supabase ID, catalog slug, or name
      let ov = productOverrides[sp.id] || (catMatch ? productOverrides[catMatch.id] : undefined);
      if (!ov && sp.name) {
        const matchKey = Object.keys(productOverrides).find(
          (k) => productOverrides[k]?.name && productOverrides[k].name.toLowerCase().trim() === sp.name.toLowerCase().trim()
        );
        if (matchKey) ov = productOverrides[matchKey];
      }
      const existing = allProductsMap.get(sp.id) || (catMatch ? allProductsMap.get(catMatch.id) : undefined);

      allProductsMap.set(sp.id, {
        id: sp.id,
        name: ov?.name || sp.name || existing?.name,
        category: ov?.category || sp.category || existing?.category || 'sarees',
        price: ov?.price !== undefined ? ov.price : (sp.price_in_rupees || existing?.price || 0),
        stock: ov?.stock !== undefined ? ov.stock : (sp.stock !== undefined ? sp.stock : (existing?.stock ?? 10)),
        image: ov?.images?.[0] || sp.image_url || existing?.image || '/images/category-sarees.png',
        created_at: sp.created_at || existing?.created_at,
        artisan_id: sp.artisan_id || existing?.artisan_id || 'HG-ART-260501',
        artisan_no: sp.artisan_no || existing?.artisan_no || 'HG-84192',
        artisan_name: sp.artisan_name || existing?.artisan_name || 'Gopal Chandra Dey',
      });
    });

    // 3. Custom artisan-created products in productOverrides
    Object.entries(productOverrides).forEach(([id, ov]: [string, any]) => {
      if (!allProductsMap.has(id)) {
        allProductsMap.set(id, {
          id,
          name: ov.name || 'Artisan Couture Creation',
          category: ov.category || 'sarees',
          price: ov.price || 0,
          stock: ov.stock !== undefined ? ov.stock : 10,
          image: ov.images?.[0] || '/images/category-sarees.png',
          created_at: ov.createdAt || new Date().toISOString(),
          artisan_id: ov.artisanId || 'HG-ART-260501',
          artisan_no: ov.artisanNo || 'HG-84192',
          artisan_name: ov.artisanName || 'Gopal Chandra Dey',
        });
      }
    });

    const allProducts = Array.from(allProductsMap.values());

    // Fetch orders if available to compute real sales
    let allOrders: any[] = [];
    try {
      const { data: oData } = await supabase.from('orders').select('*');
      if (oData) allOrders = oData;
    } catch (oErr) {
      // Non-blocking
    }

    // Format response strictly with real data
    const formattedArtisans = verifiedArtisans.map((artisan) => {
      // All 18 products are registered under Gopal Chandra Dey (HG-84192)
      const isGopal = (artisan.artisanNo === 'HG-84192') ||
        (artisan.name && artisan.name.toLowerCase().includes('gopal')) ||
        (artisan.applicationId === 'HG-ART-260501');

      let matchingProducts = allProducts;
      if (!isGopal) {
        matchingProducts = allProducts.filter((p) => {
          const artId = String(artisan.id || '');
          const artAppId = String(artisan.applicationId || '');
          const artEmail = String(artisan.email || '').toLowerCase().trim();
          const artName = String(artisan.name || '').toLowerCase().trim();

          return (
            (p.artisan_id && (p.artisan_id === artId || p.artisan_id === artAppId)) ||
            (p.artisan_email && p.artisan_email.toLowerCase().trim() === artEmail) ||
            (p.artisan_name && p.artisan_name.toLowerCase().trim() === artName)
          );
        });
      }

      // Calculate total pieces sold from real orders
      let totalPiecesSold = 0;
      if (allOrders.length > 0 && matchingProducts.length > 0) {
        const prodIds = new Set(matchingProducts.map((m) => m.id));
        allOrders.forEach((ord) => {
          if (ord.items && Array.isArray(ord.items)) {
            ord.items.forEach((item: any) => {
              if (prodIds.has(item.productId || item.id)) {
                totalPiecesSold += item.quantity || 1;
              }
            });
          }
        });
      }

      return {
        applicationId: artisan.applicationId,
        id: artisan.id || artisan.applicationId,
        artisanNo: artisan.artisanNo,
        name: artisan.name,
        email: artisan.email,
        phone: artisan.phone,
        state: artisan.state || 'India',
        typeOfArt: artisan.typeOfArt || 'Master Handloom Craft',
        totalRegisteredProducts: matchingProducts.length,
        totalSales: totalPiecesSold,
        products: matchingProducts.map((p) => ({
          id: p.id,
          name: p.name || 'Handcrafted Heritage Piece',
          category: p.category || 'Apparel',
          price: p.price || 0,
          stock: p.stock ?? 0,
          image: p.image || '/images/category-sarees.png',
          created_at: p.created_at,
        })),
      };
    });

    return NextResponse.json({
      success: true,
      artisans: formattedArtisans,
      totalCount: formattedArtisans.length,
    });
  } catch (err: any) {
    console.error('Error fetching verified artisans:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to fetch verified artisans' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/artisans
 * Manual assignment endpoint: allows manual assignment or re-assignment of an artisan code.
 * Validates format: starts with 'HG', has 5 random/custom digits, checks collision.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { applicationId, artisanNo } = body;

    if (!applicationId) {
      return NextResponse.json(
        { success: false, message: 'applicationId is required' },
        { status: 400 }
      );
    }

    const localApps = getLocalApplications();
    const target = localApps.find(
      (a) => a.applicationId === applicationId || a.id === applicationId
    );

    if (!target) {
      return NextResponse.json(
        { success: false, message: `Artisan application ${applicationId} not found` },
        { status: 404 }
      );
    }

    let codeToAssign = (artisanNo || '').trim();

    // Check existing codes
    const existingCodes = new Set(
      localApps
        .filter((a) => a.applicationId !== applicationId && a.id !== applicationId)
        .map((a) => a.artisanNo)
        .filter(Boolean)
    );

    if (!codeToAssign) {
      // Auto-generate if not provided
      codeToAssign = generateUniqueArtisanNo(existingCodes);
    } else {
      // Validate requested code: must start with HG and contain 5 digits
      const cleanUpper = codeToAssign.toUpperCase();
      const match = cleanUpper.match(/^HG-?(\d{5})$/);

      if (!match) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid code format. Code must start with HG and contain 5 numbers (e.g. HG-58291 or HG58291).',
          },
          { status: 400 }
        );
      }

      codeToAssign = `HG-${match[1]}`;

      if (existingCodes.has(codeToAssign)) {
        return NextResponse.json(
          { success: false, message: `Code ${codeToAssign} is already assigned to another artisan.` },
          { status: 409 }
        );
      }
    }

    target.artisanNo = codeToAssign;
    target.updatedAt = new Date().toISOString();
    saveLocalApplications(localApps);

    // Also update Supabase
    try {
      await supabase
        .from('artisan_applications')
        .update({ artisan_no: codeToAssign, updated_at: new Date().toISOString() })
        .or(`application_number.eq.${applicationId},id.eq.${applicationId}`);
    } catch (sbErr) {
      console.warn('Supabase manual code assign error:', sbErr);
    }

    return NextResponse.json({
      success: true,
      message: `Artisan code ${codeToAssign} successfully assigned to ${target.name}.`,
      artisanNo: codeToAssign,
      artisan: target,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error assigning artisan code' },
      { status: 500 }
    );
  }
}
