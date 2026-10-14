import { supabase } from '@/lib/supabaseClient';

export type AppRole = 'patron' | 'artisan' | 'admin' | 'super_admin';

// Static executive registry as ground truth
export const VERIFIED_ROLES: Record<string, AppRole> = {
  'tanmaysaaagr@gmail.com': 'super_admin',
  'tanmaysaagar@gmail.com': 'super_admin',
  'gargisaha1508@gmail.com': 'super_admin',
  'shawsumit6286@gmail.com': 'super_admin',
  'sumitgreat2705@gmail.com': 'admin',
  'admin@gargisaha.com': 'admin',
  'curator@gargisaha.com': 'admin',
  'artisan@gargisaha.com': 'artisan',
  'team.anga9@gmail.com': 'artisan',
};

export async function getUserRole(email: string | null | undefined): Promise<AppRole> {
  if (!email) return 'patron';
  const cleanEmail = email.toLowerCase().trim();

  // 1. Check known ground-truth registry first
  if (VERIFIED_ROLES[cleanEmail]) {
    return VERIFIED_ROLES[cleanEmail];
  }

  // 2. Query Supabase user_roles
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

  // 4. Server-side check in artisan_applications.json
  if (typeof window === 'undefined') {
    try {
      const fsNode = await import('fs');
      const pathNode = await import('path');
      const appFile = pathNode.join(process.cwd(), 'src', 'data', 'artisan_applications.json');
      if (fsNode.existsSync(appFile)) {
        const apps = JSON.parse(fsNode.readFileSync(appFile, 'utf8'));
        if (Array.isArray(apps) && apps.some((a: any) => a.email?.toLowerCase().trim() === cleanEmail)) {
          return 'artisan';
        }
      }
    } catch {}
  }

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
