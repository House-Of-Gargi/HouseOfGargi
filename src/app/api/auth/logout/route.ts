import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';

function clearAllAuthCookies(response: NextResponse) {
  const cookieNames = [
    'hog_session',
    'sb-access-token',
    'sb-refresh-token',
    'supabase-auth-token',
  ];
  for (const name of cookieNames) {
    response.cookies.set(name, '', {
      path: '/',
      maxAge: 0,
      expires: new Date(0),
      httpOnly: true,
      sameSite: 'lax',
    });
    response.cookies.delete(name);
  }
}

export async function POST(req: Request) {
  try {
    await proxyToBackend(req, '/api/v1/auth/logout', { method: 'POST' }).catch(() => {});
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    clearAllAuthCookies(response);
    return response;
  } catch {
    const response = NextResponse.json({ success: true, message: 'Logged out locally' });
    clearAllAuthCookies(response);
    return response;
  }
}

