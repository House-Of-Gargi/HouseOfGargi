import { PortalLoadingScreen } from '@/components/common/PortalLoadingScreen';
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { SellerShell } from '@/components/seller/SellerShell';
import '@/seller.css';

export default function SellerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [sellerPhone, setSellerPhone] = useState<string>('Artisan Atelier');

  useEffect(() => {
    // Never gate login or apply pages
    if (pathname === '/seller/login' || pathname === '/seller/apply') {
      setAuthorized(true);
      return;
    }

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

    // Prevent blind redirect on onAuthStateChange if auth_session exists in localStorage
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (pathname === '/seller/login' || pathname === '/seller/apply') return;

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

  if (pathname === '/seller/login' || pathname === '/seller/apply') {
    return <>{children}</>;
  }

  if (!authorized) {
    return <PortalLoadingScreen portalName="Artisan Atelier" theme="light" message="Authorizing Artisan Atelier session..." />;
  }

  return (
    <SellerShell sellerPhone={sellerPhone} sellerName="House of Gargi">
      {children}
    </SellerShell>
  );
}
