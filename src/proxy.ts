import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED = [
  { prefix: '/super-admin', login: '/admin/login' },
  { prefix: '/admin',       login: '/admin/login' },
  { prefix: '/artisan',     login: '/artisan/login' },
  { prefix: '/seller',      login: '/artisan/login' },
];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const rule = PROTECTED.find(
    (r) => pathname.startsWith(r.prefix) && !pathname.startsWith(r.login) && !pathname.includes('/apply')
  );
  if (!rule) return NextResponse.next();

  // If no session cookie or header is present, layouts also enforce live DB verification via getUserRole
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/super-admin/:path*', '/artisan/:path*', '/seller/:path*'],
};
