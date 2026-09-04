import { NextResponse } from 'next/server';
import { products, categories } from '@/data/products';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  let result = products;
  if (category) {
    result = products.filter(p => p.category === category);
  }

  return NextResponse.json(
    { success: true, count: result.length, categories, products: result },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
}
