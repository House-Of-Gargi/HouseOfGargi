import { proxyToBackend } from '@/lib/apiProxy';

export async function POST(req: Request) {
  return proxyToBackend(req, '/api/v1/bespoke');
}

export async function GET(req: Request) {
  return proxyToBackend(req, '/api/v1/bespoke');
}
