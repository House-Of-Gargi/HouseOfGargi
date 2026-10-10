import { NextResponse } from 'next/server';
import { getUserRole, canAccessSuperAdmin, canAccessAdmin, canAccessSeller, canAccessCustomer } from '@/lib/rbac';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ success: false, message: 'Email query parameter required' }, { status: 400 });
  }

  const role = await getUserRole(email);

  return NextResponse.json({
    success: true,
    email: email.toLowerCase().trim(),
    role,
    permissions: {
      canAccessSuperAdmin: canAccessSuperAdmin(role),
      canAccessAdmin: canAccessAdmin(role),
      canAccessSeller: canAccessSeller(role),
      canAccessCustomer: canAccessCustomer(role),
    },
  });
}
