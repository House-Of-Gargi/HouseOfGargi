import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: Request) {
  try {
    const res = await proxyToBackend(req, '/api/v1/super-admin/catalog');
    const data = await res.json().catch(() => ({}));
    if (res.ok && Array.isArray(data.items)) {
      return NextResponse.json(data);
    }
  } catch {}

  // Live Supabase fallback
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const items = data.map((p, idx) => ({
        id: p.id,
        productNo: p.product_number || `HG-CREATION-${1000 + idx}`,
        title: p.name,
        category: p.category,
        artisan: p.artisan_name || 'Master Handloom Guild',
        price: p.price_in_rupees || p.price || 0,
        stock: p.stock ?? 10,
        isVisible: !p.is_hidden,
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
