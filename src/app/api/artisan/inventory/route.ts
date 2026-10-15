import { proxyToBackend } from '@/lib/apiProxy';

export async function GET(req: Request) {
  return proxyToBackend(req, '/api/v1/artisan/products');
}

export async function POST(req: Request) {
  return proxyToBackend(req, '/api/v1/artisan/products');
}
