import { supabase } from '@/lib/supabaseClient';

export type AppRole = 'patron' | 'artisan' | 'admin' | 'super_admin';

export async function getUserRole(email: string | null | undefined): Promise<AppRole> {
  if (!email) return 'patron';
  const cleanEmail = email.toLowerCase().trim();

  // 1. Query Supabase user_roles (ground truth in database)
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

  // 3. Check artisan_profiles
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
