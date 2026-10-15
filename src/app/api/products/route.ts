import { proxyToBackend } from '@/lib/apiProxy';

export async function GET(req: Request) {
  const { search } = new URL(req.url);
  return proxyToBackend(req, `/api/v1/products${search}`);
}
