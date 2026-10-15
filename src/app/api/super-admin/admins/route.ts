import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';

export async function GET(req: Request) {
  return proxyToBackend(req, '/api/v1/super-admin/admins');
}

export async function POST(req: Request) {
  return proxyToBackend(req, '/api/v1/super-admin/admins', { method: 'POST' });
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email') || searchParams.get('id');
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email required' }, { status: 400 });
    }
    return proxyToBackend(req, `/api/v1/super-admin/admins/${encodeURIComponent(email)}`, {
      method: 'DELETE',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message }, { status: 500 });
  }
}
