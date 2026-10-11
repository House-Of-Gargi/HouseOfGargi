'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import CustomerLoginModal from './CustomerLoginModal';
import { SearchIcon, MicIcon, UserIcon, WishlistIcon, CartIcon, MenuIcon, CloseIcon } from './Icons';
import SearchDropdown, { saveSearchHistory } from './SearchDropdown';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);

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

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideDesktop = searchContainerRef.current?.contains(target);
      const insideMobile = mobileSearchContainerRef.current?.contains(target);

      if (!insideDesktop && !insideMobile) {
        setSearchDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setSearchDropdownOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  const handleVoiceSearch = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice search is not supported on this browser. Please try Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          const trimmed = transcript.trim();
          setSearchQuery(trimmed);
          setIsListening(false);
          saveSearchHistory(trimmed);
          setSearchDropdownOpen(false);
          setMobileSearchOpen(false);
          router.push(`/explore?q=${encodeURIComponent(trimmed)}`);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      saveSearchHistory(q);
      setSearchDropdownOpen(false);
      setMobileSearchOpen(false);
      router.push(`/explore?q=${encodeURIComponent(q)}`);
    } else {
      setSearchDropdownOpen(false);
      setMobileSearchOpen(false);
      router.push('/explore');
    }
  };

  const handleSelectProduct = (term: string, productId?: string) => {
    saveSearchHistory(term);
    setSearchQuery(term);
    setSearchDropdownOpen(false);
    setMobileSearchOpen(false);
    const targetUrl = productId 
      ? `/explore?q=${encodeURIComponent(term)}&id=${encodeURIComponent(productId)}`
      : `/explore?q=${encodeURIComponent(term)}`;
    router.push(targetUrl);
  };

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
      pathname.startsWith('/explore') ||
      pathname.startsWith('/category') ||
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

  const isHome = pathname === '/';
  const isHero = isHome && !scrolled;
  const isProductPage = pathname?.startsWith('/product/');
  const cls = `navbar ${isHero ? 'navbar--hero' : 'navbar--scrolled'} ${scrolled || isProductPage ? 'navbar--sub-hidden' : ''} ${isProductPage ? 'navbar--single-row' : ''}`;

  return (
    <>
      <nav className={cls}>
        <div className="navbar__inner">
          {/* Top Line: Brand Logo on Left, Search Box in Middle, Actions on Right */}
          <div className="navbar__top-row">
            {/* Left: Brand Logo */}
            <div className="navbar__left">
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

            {/* Center: Search Box Container with Elastic Search Dropdown (Desktop) */}
            <div className="navbar__search-wrapper" ref={searchContainerRef}>
              <form 
                onSubmit={handleSearchSubmit} 
                className={`navbar__search-box ${isListening ? 'navbar__search-box--listening' : ''} ${searchDropdownOpen ? 'navbar__search-box--focused' : ''}`} 
                role="search"
              >
                <SearchIcon size={22} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchDropdownOpen(true)}
                  onClick={() => setSearchDropdownOpen(true)}
                  placeholder={isListening ? "Listening... Speak now" : "What are you looking for..."}
                  className="navbar__search-input"
                  aria-label="What are you looking for..."
                />
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`navbar__mic-btn ${isListening ? 'navbar__mic-btn--active' : ''}`}
                  aria-label={isListening ? "Stop voice search" : "Voice search"}
                  title={isListening ? "Listening... Speak now" : "Search by voice"}
                >
                  <MicIcon size={21} />
                </button>
              </form>

              {/* Elastic Search Dropdown */}
              <SearchDropdown
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isOpen={searchDropdownOpen}
                onClose={() => setSearchDropdownOpen(false)}
                onSelectProduct={handleSelectProduct}
              />
            </div>

            {/* Right: Auth Action Pills (Bag is only shown after login) */}
            <div className="navbar__icons">
              {!isLoggedIn ? (
                <>
                  <button 
                    type="button" 
                    className="navbar__login-pill-btn"
                    onClick={() => openLoginModal()}
                    aria-label="Login"
                  >
                    Login
                  </button>
                  <Link 
                    href="/seller/login" 
                    className="navbar__join-pill-btn navbar__join-pill-btn--desktop-only"
                    aria-label="Join Us - Artisan Portal"
                  >
                    Join Us
                  </Link>
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

              {/* Hamburger Menu Toggle — Right-most of screen on mobile */}
              <button
                type="button"
                className="navbar__mobile-toggle"
                onClick={() => setMobileOpen(true)}
                aria-label="Menu"
              >
                <MenuIcon size={26} />
              </button>
            </div>
          </div>

          {/* Mobile Search Expandable Bar */}
          {mobileSearchOpen && (
            <div className="navbar__mobile-search-bar" ref={mobileSearchContainerRef}>
              <form onSubmit={handleSearchSubmit} className="navbar__mobile-search-form">
                <SearchIcon size={19} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchDropdownOpen(true)}
                  placeholder="What are you looking for..."
                  className="navbar__mobile-search-input"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`navbar__mic-btn ${isListening ? 'navbar__mic-btn--active' : ''}`}
                  aria-label="Voice search"
                >
                  <MicIcon size={19} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileSearchOpen(false);
                    setSearchDropdownOpen(false);
                  }}
                  className="navbar__mobile-search-close"
                  aria-label="Close search"
                >
                  <CloseIcon size={18} />
                </button>
              </form>

              <SearchDropdown
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isOpen={searchDropdownOpen}
                onClose={() => {
                  setSearchDropdownOpen(false);
                  setMobileSearchOpen(false);
                }}
                onSelectProduct={handleSelectProduct}
                isMobileModal
              />
            </div>
          )}

          {/* Second Line: Sub-bar with Categories (Hidden on product description page) */}
          {!isProductPage && (
            <div className="navbar__sub-row">
            <div className="navbar__links">
              <Link href="/explore" className={pathname === '/explore' ? 'is-active' : ''}>Explore All</Link>
              <Link href="/category/sarees" className={pathname === '/category/sarees' ? 'is-active' : ''}>Sarees</Link>
              <Link href="/category/lehengas" className={pathname === '/category/lehengas' ? 'is-active' : ''}>Lehengas</Link>
              <Link href="/category/kurta-sets" className={pathname === '/category/kurta-sets' ? 'is-active' : ''}>Kurta Sets</Link>
              <Link href="/category/accessories" className={pathname === '/category/accessories' ? 'is-active' : ''}>Accessories</Link>
              <Link href="/bespoke" className={pathname === '/bespoke' ? 'is-active' : ''}>Bespoke</Link>
            </div>
          </div>
          )}
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
          <Link href="/explore" className="mobile-drawer__link" onClick={() => setMobileOpen(false)}>
            <SearchIcon size={18} /> Explore Atelier Collections
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
