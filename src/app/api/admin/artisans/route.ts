import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';

export async function GET(req: Request) {
  try {
    const res = await proxyToBackend(req, '/api/v1/admin/artisans');
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      return NextResponse.json(data);
    }
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error fetching artisans' },
      { status: 500 }
    );
  }
}
