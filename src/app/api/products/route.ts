import { proxyToBackend } from '@/lib/apiProxy';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { search } = new URL(req.url);
  const response = await proxyToBackend(req, `/api/v1/products${search}`);
  try {
    const data = await response.json();
    if (data && Array.isArray(data.products)) {
      data.products = data.products.map((p: any) => ({
        ...p,
        price: Number(p.price ?? p.price_in_rupees ?? 0),
        images: (Array.isArray(p.images) && p.images.length > 0) ? p.images : (p.image_url ? [p.image_url] : ['/images/category-sarees.png']),
      }));
    }
    return NextResponse.json(data, { status: response.status });
  } catch {
    return response;
  }
}

