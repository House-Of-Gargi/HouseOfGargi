import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: Request) {
  // 1. Try proxy to backend
  try {
    const res = await proxyToBackend(req, '/api/v1/super-admin/catalog');
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      const rawList = Array.isArray(data.items) ? data.items : Array.isArray(data.products) ? data.products : null;
      if (rawList && rawList.length > 0) {
        const items = rawList.map((p: any, idx: number) => ({
          id: p.id,
          productNo: p.product_number || p.productNo || `HG-CREATION-${1000 + idx}`,
          title: p.name || p.title,
          category: p.category,
          artisan: p.artisan_name || p.artisan || 'Master Handloom Guild',
          price: Number(p.price_in_rupees || p.price) || 0,
          stock: p.stock ?? 10,
          isVisible: p.isVisible !== undefined ? Boolean(p.isVisible) : !p.is_hidden,
          isHidden: p.isHidden !== undefined ? Boolean(p.isHidden) : Boolean(p.is_hidden),
          isHero: Boolean(p.is_featured || p.isHero),
          imageUrl: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : (p.image_url || '/images/category-sarees.png'),
        }));
        return NextResponse.json({ success: true, items, count: items.length });
      }
    }
  } catch {}

  // 2. Direct Supabase query via privileged service role client (bypasses RLS so hidden items are included)
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      const items = data.map((p, idx) => ({
        id: p.id,
        productNo: p.product_number || `HG-CREATION-${1000 + idx}`,
        title: p.name,
        category: p.category,
        artisan: p.artisan_name || 'Master Handloom Guild',
        price: Number(p.price_in_rupees || p.price) || 0,
        stock: p.stock ?? 10,
        isVisible: !p.is_hidden,
        isHidden: Boolean(p.is_hidden),
        isHero: Boolean(p.is_featured),
        imageUrl: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : (p.image_url || '/images/category-sarees.png'),
      }));

      return NextResponse.json({
        success: true,
        items,
        count: items.length,
      });
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error fetching master catalog' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, items: [], count: 0 });
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, isVisible, isHero } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Product ID required' }, { status: 400 });
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (isVisible !== undefined) {
      updates.is_hidden = !isVisible;
    }
    if (isHero !== undefined) {
      updates.is_featured = Boolean(isHero);
    }

    // Direct database update using service role client
    const { error: dbError } = await supabaseAdmin
      .from('products')
      .update(updates)
      .eq('id', id);

    if (dbError) {
      console.error('Supabase catalog update error:', dbError);
    }

    // Also forward to backend if available
    try {
      if (isVisible !== undefined) {
        await proxyToBackend(req, `/api/v1/admin/products/${id}/visibility`, {
          method: 'PATCH',
          body: { isHidden: !isVisible },
        });
      }
      if (isHero !== undefined) {
        await proxyToBackend(req, `/api/v1/super-admin/bestsellers/${id}`, {
          method: 'PATCH',
          body: { isFeatured: Boolean(isHero) },
        });
      }
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Product ${id} storefront display settings updated`,
      id,
      isVisible,
      isHero,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message }, { status: 500 });
  }
}
