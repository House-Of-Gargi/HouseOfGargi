import { supabase } from '@/lib/supabaseClient';

export type AppRole = 'patron' | 'artisan' | 'admin' | 'super_admin';

export async function getUserRole(email: string | null | undefined): Promise<AppRole> {
  if (!email) return 'patron';
  const cleanEmail = email.toLowerCase().trim();

  // 1. Authoritative seed overrides
  if (
    cleanEmail === 'tanmaysaaagr@gmail.com' ||
    cleanEmail === 'tanmaysaagr@gmail.com' ||
    cleanEmail === 'tanmaysaagar@gmail.com' ||
    cleanEmail === 'shawsumit6286@gmail.com' ||
    cleanEmail === 'gargisaha1508@gmail.com'
  ) {
    return 'super_admin';
  }
  if (
    cleanEmail === 'sumigreat2705@gmail.com' ||
    cleanEmail === 'sumitgreat2705@gmail.com' ||
    cleanEmail === 'admin@gargisaha.com' ||
    cleanEmail === 'curator@gargisaha.com'
  ) {
    return 'admin';
  }

  // 2. In browser environment, check active verified session tokens in localStorage
  if (typeof window !== 'undefined') {
    try {
      const superAdminStored = localStorage.getItem('super_admin_session');
      if (superAdminStored) {
        const parsed = JSON.parse(superAdminStored);
        if (parsed.email?.toLowerCase().trim() === cleanEmail && parsed.role === 'super_admin') {
          return 'super_admin';
        }
      }

      const adminStored = localStorage.getItem('admin_session');
      if (adminStored) {
        const parsed = JSON.parse(adminStored);
        if (parsed.email?.toLowerCase().trim() === cleanEmail && (parsed.role === 'admin' || parsed.role === 'super_admin')) {
          return parsed.role as AppRole;
        }
      }

      const artisanStored = localStorage.getItem('artisan_session');
      if (artisanStored) {
        const parsed = JSON.parse(artisanStored);
        if (parsed.email?.toLowerCase().trim() === cleanEmail && parsed.role === 'artisan') {
          return 'artisan';
        }
      }
    } catch {}

    // 3. Query authoritative backend /api/auth/role (bypasses client-side RLS)
    try {
      const res = await fetch(`/api/auth/role?email=${encodeURIComponent(cleanEmail)}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.success && data?.role) {
          return data.role as AppRole;
        }
      }
    } catch (err) {
      console.warn('API role lookup error:', err);
    }
  }

  // 4. Query Supabase user_roles
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_email', cleanEmail)
      .maybeSingle();

    if (!error && data?.role) {
      return data.role as AppRole;
    }
  } catch (err) {
    console.warn('Supabase user_roles lookup error:', err);
  }

  // 5. Check artisan_profiles
  try {
    const { data: artisanData } = await supabase
      .from('artisan_profiles')
      .select('id')
      .eq('user_email', cleanEmail)
      .maybeSingle();

    if (artisanData) return 'artisan';
  } catch {}

  return 'patron';
}

export function canAccessSuperAdmin(role: AppRole): boolean {
  return role === 'super_admin';
}

export function canAccessAdmin(role: AppRole): boolean {
  return role === 'admin' || role === 'super_admin';
}

export function canAccessSeller(role: AppRole): boolean {
  return role === 'artisan' || role === 'admin' || role === 'super_admin';
}

export function canAccessCustomer(_role: AppRole): boolean {
  // Everyone (including super_admin, admin, artisan) can log in as a customer!
  return true;
}
