import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';

export async function GET(req: Request) {
  return proxyToBackend(req, '/api/v1/categories');
}

export async function POST(req: Request) {
  return proxyToBackend(req, '/api/v1/super-admin/categories', { method: 'POST' });
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const id = body.id;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Category ID required' }, { status: 400 });
    }
    return proxyToBackend(req, `/api/v1/super-admin/categories/${id}`, {
      method: 'PATCH',
      body,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || 'Error updating category' }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Category ID is required' }, { status: 400 });
    }
    return proxyToBackend(req, `/api/v1/super-admin/categories/${id}`, {
      method: 'DELETE',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || 'Error deleting category' }, { status: 400 });
  }
}
