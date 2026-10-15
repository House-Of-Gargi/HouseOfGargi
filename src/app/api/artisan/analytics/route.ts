import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';

export async function GET(req: Request) {
  try {
    const res = await proxyToBackend(req, '/api/v1/artisan/analytics');
    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.analytics) {
      return NextResponse.json({
        success: true,
        ...data.analytics,
      });
    }
  } catch {}

  return NextResponse.json({
    success: true,
    sales7Days: [],
    sales30Days: [],
    top5Products: [],
    ordersCount: 0,
  });
}
