'use client';

import { PortalLoadingScreen } from '@/components/common/PortalLoadingScreen';
import { UnauthorizedSessionScreen } from '@/components/common/UnauthorizedSessionScreen';
import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { SellerShell } from '@/components/seller/SellerShell';
import '@/seller.css';

export default function SellerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [artisanName, setArtisanName] = useState<string>('Gopal Chandra Dey');
  const [artisanNo, setArtisanNo] = useState<string>('HG-84192');
  const [currentEmail, setCurrentEmail] = useState<string>('');

  useEffect(() => {
    // Never gate login or apply pages
    if (pathname === '/seller/login' || pathname === '/seller/apply') {
      setAuthorized(true);
      setChecking(false);
      return;
    }

    let isMounted = true;

    const checkAuth = async () => {
      try {
        const sessionStr = typeof window !== 'undefined'
          ? (localStorage.getItem('artisan_session') || localStorage.getItem('auth_session'))
          : null;

        let emailToQuery = '';
        if (sessionStr) {
          try {
            const parsed = JSON.parse(sessionStr);
            if (parsed.name) setArtisanName(parsed.name);
            if (parsed.email) {
              emailToQuery = parsed.email;
              if (isMounted) setCurrentEmail(parsed.email);
            }
          } catch {}
        }

        // Fetch live artisan identity from /api/artisan/me
        try {
          const res = await fetch(`/api/artisan/me${emailToQuery ? `?email=${encodeURIComponent(emailToQuery)}` : ''}`);
          const data = await res.json();
          if (isMounted && data.success && data.artisan) {
            setArtisanName(data.artisan.name || 'Gopal Chandra Dey');
            setArtisanNo(data.artisan.artisanNo || 'HG-84192');
          }
        } catch (err) {
          console.warn('Could not fetch dynamic artisan profile:', err);
        }

        if (sessionStr) {
          if (isMounted) {
            setAuthorized(true);
            setChecking(false);
          }
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          if (isMounted) {
            setCurrentEmail(session.user.email);
            setAuthorized(true);
            setChecking(false);
          }
        } else {
          if (isMounted) {
            setAuthorized(false);
            setChecking(false);
          }
        }
      } catch {
        if (isMounted) {
          setAuthorized(false);
          setChecking(false);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (pathname === '/seller/login' || pathname === '/seller/apply') return;

      const sessionStr = typeof window !== 'undefined'
        ? (localStorage.getItem('artisan_session') || localStorage.getItem('auth_session'))
        : null;

      if (!session && !sessionStr) {
        if (isMounted) {
          setAuthorized(false);
          setChecking(false);
        }
      } else {
        if (isMounted) {
          setAuthorized(true);
          setChecking(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (pathname === '/seller/login' || pathname === '/seller/apply') {
    return <>{children}</>;
  }

  if (checking) {
    return <PortalLoadingScreen portalName="Artisan Atelier" theme="light" message="Authorizing Artisan Atelier session..." />;
  }

  if (!authorized) {
    return (
      <UnauthorizedSessionScreen
        portalTitle="Artisan Atelier Portal"
        loginPath="/seller/login"
        currentEmail={currentEmail || undefined}
      />
    );
  }

  return (
    <SellerShell sellerPhone={artisanNo} sellerName={artisanName}>
      {children}
    </SellerShell>
  );
}
