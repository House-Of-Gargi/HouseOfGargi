'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { SellerShell } from '@/components/seller/SellerShell';
import '@/seller.css';

export default function ArtisanLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [sellerPhone, setSellerPhone] = useState<string>('Artisan Atelier');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authSessionStr = typeof window !== 'undefined'
          ? (localStorage.getItem('auth_session') || localStorage.getItem('artisan_session'))
          : null;

        if (authSessionStr) {
          try {
            const parsed = JSON.parse(authSessionStr);
            if (parsed.email) {
              setSellerPhone(parsed.email);
              setAuthorized(true);
              return;
            }
          } catch {}
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          if (session.user?.email) setSellerPhone(session.user.email);
          else if (session.user?.phone) setSellerPhone(session.user.phone);
          setAuthorized(true);
        } else if (!authSessionStr) {
          router.push('/seller/login');
        }
      } catch {
        router.push('/seller/login');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const authSessionStr = typeof window !== 'undefined'
        ? (localStorage.getItem('auth_session') || localStorage.getItem('artisan_session'))
        : null;

      if (!session && !authSessionStr) {
        router.push('/seller/login');
      } else {
        setAuthorized(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (!authorized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAF8', color: '#7A2331' }}>
        <div style={{ width: 44, height: 44, borderRadius: 2, background: '#7A2331', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
          HG
        </div>
      </div>
    );
  }

  return (
    <SellerShell sellerPhone={sellerPhone} sellerName="Artisan Atelier">
      {children}
    </SellerShell>
  );
}
