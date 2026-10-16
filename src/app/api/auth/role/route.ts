import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';
import { getUserRole, canAccessSuperAdmin, canAccessAdmin, canAccessSeller, canAccessCustomer } from '@/lib/rbac';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ success: false, message: 'Email query parameter required' }, { status: 400 });
  }

  const cleanEmail = email.toLowerCase().trim();

  // 1. Try querying authoritative backend gateway (uses service role key to bypass RLS)
  try {
    const backendRes = await proxyToBackend(req, `/api/v1/auth/role?email=${encodeURIComponent(cleanEmail)}`);
    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data.success && data.role) {
        return NextResponse.json({
          success: true,
          email: cleanEmail,
          role: data.role,
          permissions: {
            canAccessSuperAdmin: canAccessSuperAdmin(data.role),
            canAccessAdmin: canAccessAdmin(data.role),
            canAccessSeller: canAccessSeller(data.role),
            canAccessCustomer: canAccessCustomer(data.role),
          },
        });
      }
    }
  } catch (err) {
    console.warn('Backend role proxy error, falling back to local rbac check:', err);
  }

  // 2. Fallback to local rbac logic
  const role = await getUserRole(cleanEmail);

  return NextResponse.json({
    success: true,
    email: cleanEmail,
    role,
    permissions: {
      canAccessSuperAdmin: canAccessSuperAdmin(role),
      canAccessAdmin: canAccessAdmin(role),
      canAccessSeller: canAccessSeller(role),
      canAccessCustomer: canAccessCustomer(role),
    },
  });
}
