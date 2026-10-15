import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';

export async function GET(req: Request) {
  return proxyToBackend(req, '/api/v1/super-admin/revenue');
}
