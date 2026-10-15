import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';

export async function GET(req: Request) {
  const { search } = new URL(req.url);
  return proxyToBackend(req, `/api/v1/admin/bespoke${search}`);
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const id = body.id || body.request_number;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Commission ID is required.' }, { status: 400 });
    }

    return proxyToBackend(req, `/api/v1/admin/bespoke/${id}`, {
      method: 'PATCH',
      body,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error updating bespoke commission' },
      { status: 400 }
    );
  }
}
