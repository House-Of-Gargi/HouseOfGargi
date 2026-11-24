import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { products } from '@/data/products';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ success: false, message: 'Product ID required' }, { status: 400 });
  }

  // 1. Try static seed catalogue match first
  const staticProduct = products.find(
    (p) =>
      p.id.toLowerCase() === id.toLowerCase() ||
      (p as any).slug?.toLowerCase() === id.toLowerCase()
  );
  if (staticProduct) {
    return NextResponse.json({ success: true, product: staticProduct });
  }

  // 2. Try proxy to backend
  try {
    const res = await proxyToBackend(req, `/api/v1/products/${encodeURIComponent(id)}`);
    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.product) {
      return NextResponse.json({ success: true, product: data.product });
    }
  } catch {}

  // 3. Query live Supabase table directly
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .or(`id.eq.${id},slug.eq.${id},product_number.eq.${id}`)
      .is('deleted_at', null)
      .maybeSingle();

    if (!error && data) {
      const mapped = {
        id: data.id,
        slug: data.slug || data.id,
        productNo: data.product_number,
        name: data.name,
        category: data.category,
        price: Number(data.price_in_rupees || data.price || 0),
        stock: data.stock ?? 10,
        description: data.description || '',
        images: Array.isArray(data.images) && data.images.length > 0 
          ? data.images 
          : (data.image_url ? [data.image_url] : ['/images/category-sarees.png']),
        fabric: data.fabric || 'Pure Silk',
        technique: data.craft_technique || data.technique || 'Handloom Heritage',
        occasion: data.occasion || 'Festive & Ceremonial',
        region: data.region || 'India',
        care: data.care || 'Dry clean only.',
        sizes: data.sizes || ['Free Size'],
        artisanName: data.artisan_name || 'Master Handloom Guild',
        artisanId: data.artisan_email || 'gopal-chandra-dey',
        artisanNote: `Handcrafted by Master Artisan ${data.artisan_name || 'Gopal Chandra Dey'}`,
        curationStatus: data.curation_status || 'approved',
      };

      return NextResponse.json({ success: true, product: mapped });
    }
  } catch (err: any) {
    console.warn('[ProductsAPI] Supabase fetch error:', err.message);
  }

  return NextResponse.json(
    { success: false, message: `Product '${id}' not found in atelier collection.` },
    { status: 404 }
  );
}
