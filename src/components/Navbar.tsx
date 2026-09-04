'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import CustomerLoginModal from './CustomerLoginModal';
import { SearchIcon, UserIcon, WishlistIcon, CartIcon, MenuIcon, CloseIcon } from './Icons';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleUserClick = () => {
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('customer_auth_demo') === 'true';
    if (session || isDemo) {
      router.push('/account');
    } else {
      setLoginModalOpen(true);
    }
  };

  const isDarkNavPage = Boolean(
    pathname && (
      pathname.startsWith('/product') ||
      pathname === '/cart' ||
      pathname === '/wishlist' ||
      pathname === '/terms' ||
      pathname === '/privacy' ||
      pathname === '/account' ||
      pathname === '/our-artisans' ||
      pathname === '/sustainability' ||
      pathname === '/press' ||
      pathname === '/shipping' ||
      pathname === '/returns' ||
      pathname === '/size-guide' ||
      pathname === '/faq' ||
      pathname === '/shop'
    )
  );

  const cls = `navbar ${(scrolled || isDarkNavPage) ? 'navbar--scrolled' : 'navbar--hero'}`;

  return (
    <>
      <nav className={cls}>
        <div className="navbar__inner">
          <div className="navbar__left">
            <button
              type="button"
              className="navbar__mobile-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
            >
              <MenuIcon size={24} />
            </button>
            <Link href="/" className="navbar__logo">House of Gargi</Link>
          </div>

          <div className="navbar__links">
            <Link href="/category/sarees">Sarees</Link>
            <Link href="/category/lehengas">Lehengas</Link>
            <Link href="/category/kurta-sets">Kurta Sets</Link>
            <Link href="/category/accessories">Accessories</Link>
            <Link href="/bespoke">Bespoke</Link>
          </div>

          <div className="navbar__icons">
            <button 
              type="button" 
              aria-label="Search" 
              title="Search"
              onClick={() => router.push('/shop')}
            >
              <SearchIcon size={20} />
            </button>
            <button 
              type="button" 
              aria-label="Account" 
              title="Account" 
              onClick={handleUserClick}
            >
              <UserIcon size={20} />
            </button>
            <button 
              type="button" 
              aria-label="Wishlist" 
              title="Wishlist" 
              onClick={() => router.push('/wishlist')}
              style={{ position: 'relative' }}
            >
              <WishlistIcon size={20} />
              {mounted && wishlistCount > 0 && (
                <span className="navbar__badge">{wishlistCount}</span>
              )}
            </button>
            <button 
              type="button"
              aria-label="Cart" 
              title="Cart" 
              onClick={() => router.push('/cart')}
              style={{ position: 'relative' }}
            >
              <CartIcon size={20} />
              {mounted && itemCount > 0 && (
                <span className="navbar__badge">{itemCount}</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <CustomerLoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />

      {/* Mobile drawer overlay */}
      <div 
        className={`mobile-drawer-overlay ${mobileOpen ? 'mobile-drawer-overlay--open' : ''}`} 
        onClick={() => setMobileOpen(false)} 
      />

      {/* Mobile drawer */}
      <div className={`mobile-drawer ${mobileOpen ? 'mobile-drawer--open' : ''}`}>
        <div className="mobile-drawer__header">
          <Link href="/" className="navbar__logo" style={{ color: 'var(--ink-brown)' }} onClick={() => setMobileOpen(false)}>House of Gargi</Link>
          <button type="button" className="mobile-drawer__close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <CloseIcon size={28} />
          </button>
        </div>
        <div className="mobile-drawer__links">
          <Link href="/category/sarees" className="nav-label" onClick={() => setMobileOpen(false)}>Sarees</Link>
          <Link href="/category/lehengas" className="nav-label" onClick={() => setMobileOpen(false)}>Lehengas</Link>
          <Link href="/category/kurta-sets" className="nav-label" onClick={() => setMobileOpen(false)}>Kurta Sets</Link>
          <Link href="/category/accessories" className="nav-label" onClick={() => setMobileOpen(false)}>Accessories</Link>
          <Link href="/bespoke" className="nav-label" onClick={() => setMobileOpen(false)}>Bespoke</Link>
          <Link href="/shop" className="nav-label" onClick={() => setMobileOpen(false)}>All Collections</Link>
        </div>
      </div>
    </>
  );
}
