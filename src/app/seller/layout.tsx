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
  const [sellerPhone, setSellerPhone] = useState<string>('+91 98765 43210');

  useEffect(() => {
    // If on login page, do not gate
    if (pathname === '/seller/login') {
      setAuthorized(true);
      return;
    }

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/seller/login');
        } else {
          if (session.user?.phone) {
            setSellerPhone(session.user.phone.startsWith('+91') ? session.user.phone : `+91 ${session.user.phone}`);
          } else if (session.user?.email) {
            setSellerPhone(session.user.email);
          }
          setAuthorized(true);
        }
      } catch {
        router.push('/seller/login');
      }
    };

    checkAuth();

    // Listen for auth state changes (e.g. sign in or sign out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (pathname === '/seller/login') return;
      if (!session) {
        router.push('/seller/login');
      } else {
        if (session.user?.phone) {
          setSellerPhone(session.user.phone.startsWith('+91') ? session.user.phone : `+91 ${session.user.phone}`);
        }
        setAuthorized(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (pathname === '/seller/login') {
    return <>{children}</>;
  }

  if (!authorized) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FAFAF8',
        color: '#3A3564',
        gap: '1rem',
        fontFamily: 'sans-serif'
      }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: '#3A3564',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '1rem',
          boxShadow: '0 4px 12px rgba(58,53,100,0.2)'
        }}>
          HG
        </div>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748B' }}>
          Verifying artisan atelier session...
        </p>
      </div>
    );
  }

  return (
    <SellerShell sellerPhone={sellerPhone} sellerName="House of Gargi">
      {children}
    </SellerShell>
  );
}
