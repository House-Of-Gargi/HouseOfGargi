'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import CustomerLoginModal from './CustomerLoginModal';
import { SearchIcon, UserIcon, WishlistIcon, CartIcon, MenuIcon, CloseIcon } from './Icons';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/shop');
    }
  };

  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { isLoggedIn, openLoginModal } = useCustomerAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleUserClick = () => {
    if (isLoggedIn) {
      router.push('/account');
    } else {
      openLoginModal('/account');
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
          {/* Top Line: Brand Logo on Left, Search Box in Middle, Actions on Right */}
          <div className="navbar__top-row">
            <div className="navbar__left">
              <button
                type="button"
                className="navbar__mobile-toggle"
                onClick={() => setMobileOpen(true)}
                aria-label="Menu"
              >
                <MenuIcon size={26} />
              </button>
              <Link href="/" className="navbar__logo" aria-label="House of Gargi">
                <img
                  src="/logo-images/new-white-logo.png"
                  alt="House of Gargi"
                  className="navbar__logo-img navbar__logo-img--white"
                />
                <img
                  src="/logo-images/new-logo.png"
                  alt="House of Gargi"
                  className="navbar__logo-img navbar__logo-img--dark"
                />
              </Link>
            </div>

            {/* Center: Search Placeholder Box */}
            <form onSubmit={handleSearchSubmit} className="navbar__search-box" role="search">
              <SearchIcon size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you looking for..."
                className="navbar__search-input"
                aria-label="What are you looking for..."
              />
            </form>

            {/* Right: Auth Action Pills (Bag is only shown after login) */}
            <div className="navbar__icons">
              {!isLoggedIn ? (
                <>
                  <button 
                    type="button" 
                    className="navbar__login-pill-btn navbar__login-pill-btn--desktop-only"
                    onClick={() => openLoginModal()}
                    aria-label="Login"
                  >
                    Login
                  </button>
                  <button 
                    type="button" 
                    className="navbar__join-pill-btn navbar__join-pill-btn--desktop-only"
                    onClick={() => openLoginModal()}
                    aria-label="Join Us"
                  >
                    Join Us
                  </button>
                </>
              ) : (
                <>
                  <button 
                    type="button" 
                    className="navbar__wishlist-pill-btn navbar__wishlist-pill-btn--desktop-only"
                    onClick={() => router.push('/wishlist')}
                    aria-label="Wishlist"
                    title="Wishlist"
                  >
                    <WishlistIcon size={18} />
                    <span>Wishlist</span>
                    {mounted && wishlistCount > 0 && (
                      <span className="navbar__badge">{wishlistCount}</span>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="navbar__login-pill-btn navbar__login-pill-btn--desktop-only"
                    onClick={handleUserClick}
                    aria-label="Account"
                  >
                    Account
                  </button>
                  <button 
                    type="button" 
                    className="navbar__icon-btn"
                    aria-label="Cart" 
                    title="Cart" 
                    onClick={() => router.push('/cart')}
                    style={{ position: 'relative' }}
                  >
                    <CartIcon size={23} />
                    {mounted && itemCount > 0 && (
                      <span className="navbar__badge">{itemCount}</span>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Second Line: Sub-bar with Categories (Smooth fade away on scroll) */}
          <div className="navbar__sub-row">
            <div className="navbar__links">
              <Link href="/category/sarees">Sarees</Link>
              <Link href="/category/lehengas">Lehengas</Link>
              <Link href="/category/kurta-sets">Kurta Sets</Link>
              <Link href="/category/accessories">Accessories</Link>
              <Link href="/bespoke">Bespoke</Link>
            </div>
            </div>
        </div>
      </nav>

      <CustomerLoginModal />

      {/* Mobile drawer overlay */}
      <div 
        className={`mobile-drawer-overlay ${mobileOpen ? 'mobile-drawer-overlay--open' : ''}`} 
        onClick={() => setMobileOpen(false)} 
      />

      {/* Mobile drawer */}
      <div className={`mobile-drawer ${mobileOpen ? 'mobile-drawer--open' : ''}`}>
        <div className="mobile-drawer__header">
          <Link href="/" className="navbar__logo" onClick={() => setMobileOpen(false)} aria-label="House of Gargi">
            <img
              src="/logo-images/new-logo.png"
              alt="House of Gargi"
              className="navbar__logo-img navbar__logo-img--dark"
              style={{ display: 'block', height: '52px' }}
            />
          </Link>
          <button type="button" className="mobile-drawer__close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <CloseIcon size={28} />
          </button>
        </div>
        <div className="mobile-drawer__links">
          <Link href="/shop" className="mobile-drawer__link" onClick={() => setMobileOpen(false)}>
            <SearchIcon size={18} /> Search Collections
          </Link>
          <button 
            type="button" 
            className="mobile-drawer__link" 
            onClick={() => { setMobileOpen(false); handleUserClick(); }}
          >
            <UserIcon size={18} /> {isLoggedIn ? 'My Account' : 'Sign In / Register'}
          </button>
          <Link href="/category/sarees" className="mobile-drawer__link" onClick={() => setMobileOpen(false)}>Sarees</Link>
          <Link href="/category/lehengas" className="mobile-drawer__link" onClick={() => setMobileOpen(false)}>Lehengas</Link>
          <Link href="/category/kurta-sets" className="mobile-drawer__link" onClick={() => setMobileOpen(false)}>Kurta Sets</Link>
          <Link href="/category/accessories" className="mobile-drawer__link" onClick={() => setMobileOpen(false)}>Accessories</Link>
          <Link href="/bespoke" className="mobile-drawer__link" onClick={() => setMobileOpen(false)}>Bespoke Atelier</Link>
          <Link href="/shop" className="mobile-drawer__link" onClick={() => setMobileOpen(false)}>All Masterpieces</Link>
        </div>
      </div>
    </>
  );
}
