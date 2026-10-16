import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';

export async function POST(req: Request) {
  try {
    const res = await proxyToBackend(req, '/api/v1/auth/logout', { method: 'POST' });
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    // Also clear cookie on frontend domain
    response.cookies.delete('hog_session');
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
    return response;
  } catch {
    const response = NextResponse.json({ success: true, message: 'Logged out locally' });
    response.cookies.delete('hog_session');
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
    return response;
  }
}
