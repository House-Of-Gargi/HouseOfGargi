import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: Request) {
  try {
    const { search } = new URL(req.url);
    const res = await proxyToBackend(req, `/api/v1/admin/products${search}`);
    const data = await res.json().catch(() => ({}));

    if (res.ok && Array.isArray(data.products) && data.products.length > 0) {
      return NextResponse.json(data);
    }
  } catch {}

  // Authoritative Supabase query using privileged service role client (bypasses RLS)
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      const formatted = data.map((p) => ({
        id: p.id,
        productNo: p.product_number || `ART-${p.id.slice(0, 5)}`,
        name: p.name,
        category: p.category,
        price: p.price_in_rupees || p.price || 0,
        stock: p.stock ?? 10,
        totalSales: p.total_units_sold || 0,
        images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image_url || '/images/category-sarees.png'],
        description: p.description || '',
        artisanName: p.artisan_name || 'Master Handloom Guild',
        artType: p.craft_technique || p.technique || 'Handloom Heritage',
        fabric: p.fabric || 'Pure Silk',
        occasion: p.occasion || 'Festive',
        region: p.region || 'India',
        care: p.care || 'Dry clean recommended.',
        sizes: p.sizes || ['Free Size'],
        curationStatus: p.curation_status || 'approved',
        createdAt: p.created_at,
        isHidden: Boolean(p.is_hidden),
        isDeleted: false,
      }));

      return NextResponse.json({
        success: true,
        products: formatted,
        totalCount: formatted.length,
      });
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error fetching products' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, products: [], totalCount: 0 });
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Product ID required' }, { status: 400 });
    }

    if (body.isHidden !== undefined) {
      await supabaseAdmin
        .from('products')
        .update({
          is_hidden: Boolean(body.isHidden),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      try {
        await proxyToBackend(req, `/api/v1/admin/products/${id}/visibility`, {
          method: 'PATCH',
          body: { isHidden: Boolean(body.isHidden) },
        });
      } catch {}

      return NextResponse.json({
        success: true,
        message: `Product ${id} visibility updated`,
        id,
        isHidden: Boolean(body.isHidden),
      });
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (body.name) updates.name = body.name;
    if (body.price !== undefined) updates.price_in_rupees = Number(body.price);
    if (body.stock !== undefined) updates.stock = Number(body.stock);
    if (body.category) updates.category = body.category;
    if (body.description) updates.description = body.description;
    if (body.images) updates.images = body.images;
    if (body.fabric) updates.fabric = body.fabric;
    if (body.artType) updates.craft_technique = body.artType;
    if (body.occasion) updates.occasion = body.occasion;
    if (body.region) updates.region = body.region;
    if (body.care) updates.care = body.care;
    if (body.curationStatus) updates.curation_status = body.curationStatus;
    if (body.curation_status) updates.curation_status = body.curation_status;
    if (body.status) updates.curation_status = body.status;

    await supabaseAdmin
      .from('products')
      .update(updates)
      .eq('id', id);

    try {
      await proxyToBackend(req, `/api/v1/admin/products/${id}`, {
        method: 'PATCH',
        body,
      });
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Product ${id} updated`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error updating product' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ success: false, message: 'Product ID required' }, { status: 400 });
    }

    await supabaseAdmin
      .from('products')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    try {
      await proxyToBackend(req, `/api/v1/admin/products/${id}`, {
        method: 'DELETE',
      });
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Product ${id} removed`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error deleting product' },
      { status: 400 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      productNo,
      name,
      category,
      price,
      stock = 5,
      description = '',
      images = ['/images/category-sarees.png'],
      fabric = 'Pure Silk',
      artType,
      technique,
      occasion = 'Festive & Ceremonial',
      region = 'India',
      care = 'Dry clean recommended.',
      curationStatus = 'approved',
      artisanEmail = 'team.anga9@gmail.com',
      artisanName = 'Gopal Chandra Dey',
    } = body;

    if (!name || !price) {
      return NextResponse.json({ success: false, message: 'Name and price are required' }, { status: 400 });
    }

    const pNo = productNo || `ART-${Math.floor(10000 + Math.random() * 90000)}`;
    const numericPrice = Number(price) || 0;

    const newProduct = {
      id: id || `art-piece-${Date.now()}`,
      product_number: pNo,
      name: name.trim(),
      category: (category || 'sarees').toLowerCase().trim(),
      price_in_rupees: numericPrice,
      price: numericPrice,
      stock: Number(stock) || 5,
      description: description.trim(),
      images: Array.isArray(images) && images.length > 0 ? images : ['/images/category-sarees.png'],
      fabric: fabric.trim() || 'Pure Silk',
      craft_technique: (artType || technique || 'Handloom Heritage').trim(),
      occasion: occasion.trim() || 'Festive & Ceremonial',
      region: region.trim() || 'India',
      care: care.trim() || 'Dry clean recommended.',
      curation_status: curationStatus,
      artisan_email: artisanEmail,
      artisan_name: artisanName,
      is_hidden: false,
      total_units_sold: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Authoritative direct Supabase insertion using service role
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([newProduct])
      .select()
      .maybeSingle();

    if (error) {
      console.warn('Supabase product direct insert warning:', error.message);
    }

    // Also attempt backend proxy in background without failing if offline
    try {
      await proxyToBackend(req, '/api/v1/artisan/products', {
        method: 'POST',
        body: newProduct,
      });
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Product registered successfully.',
      product: data || newProduct,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error creating product' },
      { status: 500 }
    );
  }
}
