'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function SellerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // If on login page, don't gate
    if (pathname === '/seller/login') {
      setAuthorized(true);
      return;
    }

    const checkAuth = async () => {
      const isBypass = typeof window !== 'undefined' && localStorage.getItem('seller_auth_bypass') === 'true';
      if (isBypass) {
        setAuthorized(true);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/seller/login');
      } else {
        setAuthorized(true);
      }
    };
    checkAuth();
  }, [pathname, router]);

  if (pathname === '/seller/login') {
    return <>{children}</>;
  }

  if (!authorized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ivory-silk)' }}>
        <p style={{ color: 'var(--stone-taupe)' }}>Verifying atelier credentials...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    localStorage.removeItem('seller_auth_bypass');
    await supabase.auth.signOut();
    router.push('/seller/login');
  };

  return (
    <div className="seller-dashboard-container">
      <aside className="seller-sidebar">
        <div className="seller-sidebar__logo">
          <h2>House of Gargi</h2>
          <span className="seller-badge">Seller Atelier</span>
        </div>

        <nav className="seller-nav">
          <Link href="/seller" className={`seller-nav__link ${pathname === '/seller' ? 'active' : ''}`}>
            Overview
          </Link>
          <Link href="/seller/products" className={`seller-nav__link ${pathname === '/seller/products' ? 'active' : ''}`}>
            Products
          </Link>
          <Link href="/seller/orders" className={`seller-nav__link ${pathname === '/seller/orders' ? 'active' : ''}`}>
            Orders
          </Link>
          <Link href="/" target="_blank" className="seller-nav__link" style={{ marginTop: '20px', borderTop: '1px solid var(--soft-gold-line)', paddingTop: '16px' }}>
            Preview Boutique ↗
          </Link>
        </nav>

        <div className="seller-sidebar__footer">
          <button type="button" onClick={handleLogout} className="btn btn--outline" style={{ width: '100%', borderColor: 'var(--maharani-maroon)', color: 'var(--maharani-maroon)' }}>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="seller-main-content">
        {children}
      </main>
    </div>
  );
}
