'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import CustomerLoginModal from './CustomerLoginModal';
import { SearchIcon, MicIcon, UserIcon, WishlistIcon, CartIcon, MenuIcon, CloseIcon, ChevronRightIcon } from './Icons';
import SearchDropdown, { saveSearchHistory } from './SearchDropdown';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { LogOut } from 'lucide-react';

const CATEGORY_STRIP_ITEMS = [
  { name: 'Explore All', mobileName: 'All Collections', href: '/explore' },
  { name: 'Sarees', mobileName: 'Sarees', href: '/category/sarees' },
  { name: 'Lehengas', mobileName: 'Lehengas', href: '/category/lehengas' },
  { name: 'Kurta Sets', mobileName: 'Kurta Sets', href: '/category/kurta-sets' },
  { name: 'Accessories', mobileName: 'Accessories', href: '/category/accessories' },
  { name: 'Bespoke', mobileName: 'Bespoke Atelier', href: '/bespoke' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const subRowRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { isLoggedIn, role, openLoginModal, logout } = useCustomerAuth();

  // Reset loading category on route change
  useEffect(() => {
    setLoadingCategory(null);
  }, [pathname]);

  // Fallback safety timeout if navigation is interrupted
  useEffect(() => {
    if (loadingCategory) {
      const timer = setTimeout(() => setLoadingCategory(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [loadingCategory]);

  const handleCategoryClick = (href: string) => {
    if (pathname !== href) {
      setLoadingCategory(href);
    }
  };

  const checkSubRowScroll = () => {
    if (subRowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = subRowRef.current;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 15;
      setIsAtEnd(atEnd);
      setCanScrollRight(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    const el = subRowRef.current;
    if (!el) return;
    checkSubRowScroll();
    el.addEventListener('scroll', checkSubRowScroll, { passive: true });
    window.addEventListener('resize', checkSubRowScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', checkSubRowScroll);
      window.removeEventListener('resize', checkSubRowScroll);
    };
  }, [pathname]);

  const handleSubRowArrowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (subRowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = subRowRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 15) {
        subRowRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        subRowRef.current.scrollBy({ left: 140, behavior: 'smooth' });
      }
    }
  };

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
      if (role === 'artisan') {
        router.push('/artisan/dashboard');
      } else if (role === 'super_admin') {
        router.push('/super-admin/dashboard');
      } else if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/account');
      }
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

            {/* Right: Auth Action Pills */}
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
                    href="/artisan/login" 
                    className="navbar__join-pill-btn navbar__join-pill-btn--desktop-only"
                    aria-label="Join Us - Artisan Portal"
                  >
                    Join Us
                  </Link>
                </>
              ) : role === 'artisan' ? (
                <>
                  <Link 
                    href="/artisan/dashboard" 
                    className="navbar__login-pill-btn navbar__login-pill-btn--desktop-only"
                    aria-label="Artisan Portal"
                  >
                    Artisan Portal
                  </Link>
                  <button 
                    type="button" 
                    className="navbar__signout-icon-btn navbar__signout-icon-btn--desktop-only"
                    onClick={logout}
                    aria-label="Sign Out"
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : role === 'super_admin' ? (
                <>
                  <Link 
                    href="/super-admin/dashboard" 
                    className="navbar__login-pill-btn navbar__login-pill-btn--desktop-only"
                    aria-label="SA Portal"
                  >
                    SA Portal
                  </Link>
                  <button 
                    type="button" 
                    className="navbar__signout-icon-btn navbar__signout-icon-btn--desktop-only"
                    onClick={logout}
                    aria-label="Sign Out"
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : role === 'admin' ? (
                <>
                  <Link 
                    href="/admin/dashboard" 
                    className="navbar__login-pill-btn navbar__login-pill-btn--desktop-only"
                    aria-label="Admin Portal"
                  >
                    Admin Portal
                  </Link>
                  <button 
                    type="button" 
                    className="navbar__signout-icon-btn navbar__signout-icon-btn--desktop-only"
                    onClick={logout}
                    aria-label="Sign Out"
                    title="Sign Out"
                  >
                    <LogOut size={18} />
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
                  <button 
                    type="button" 
                    className="navbar__signout-icon-btn navbar__signout-icon-btn--desktop-only"
                    onClick={logout}
                    aria-label="Sign Out"
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              )}

              {/* Mobile Search Toggle Icon Button (Opens Search bar & modal on mobile) */}
              <button
                type="button"
                className="navbar__mobile-search-btn"
                onClick={() => {
                  setMobileSearchOpen(!mobileSearchOpen);
                  setSearchDropdownOpen(!mobileSearchOpen);
                }}
                aria-label="Search"
                title="Search"
              >
                <SearchIcon size={23} />
              </button>

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

          {/* Mobile Search Dedicated Fullscreen Modal (Never overflows or balloons fixed nav) */}
          {mobileSearchOpen && (
            <div className="navbar__mobile-search-overlay" ref={mobileSearchContainerRef}>
              <div className="navbar__mobile-search-header">
                <form onSubmit={handleSearchSubmit} className="navbar__mobile-search-form">
                  <SearchIcon size={19} className="navbar__mobile-search-icon" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (!searchDropdownOpen) setSearchDropdownOpen(true);
                    }}
                    onFocus={() => setSearchDropdownOpen(true)}
                    placeholder="What are you looking for..."
                    className="navbar__mobile-search-input"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="navbar__mobile-search-clear"
                      aria-label="Clear search"
                    >
                      <CloseIcon size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleVoiceSearch}
                    className={`navbar__mic-btn ${isListening ? 'navbar__mic-btn--active' : ''}`}
                    aria-label="Voice search"
                  >
                    <MicIcon size={19} />
                  </button>
                </form>
                <button
                  type="button"
                  onClick={() => {
                    setMobileSearchOpen(false);
                    setSearchDropdownOpen(false);
                  }}
                  className="navbar__mobile-search-cancel"
                  aria-label="Cancel search"
                >
                  Cancel
                </button>
              </div>

              <div className="navbar__mobile-search-results">
                <SearchDropdown
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  isOpen={true}
                  onClose={() => {
                    setSearchDropdownOpen(false);
                    setMobileSearchOpen(false);
                  }}
                  onSelectProduct={handleSelectProduct}
                  isMobileModal
                />
              </div>
            </div>
          )}

          {/* Second Line: Sub-bar with Categories (Hidden on product description page) */}
          {!isProductPage && (
            <div className="navbar__sub-row-wrapper">
              <div className="navbar__sub-row" ref={subRowRef}>
                <div className="navbar__links">
                  {CATEGORY_STRIP_ITEMS.map((cat) => {
                    const isLoading = loadingCategory === cat.href;
                    const isActive = pathname === cat.href;
                    return (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        className={`${isActive ? 'is-active' : ''} ${isLoading ? 'is-loading' : ''}`}
                        onClick={() => handleCategoryClick(cat.href)}
                      >
                        <span className="navbar__category-item">
                          {isLoading && (
                            <span className="navbar__category-spinner-wrap" aria-hidden="true">
                              <svg className="navbar__category-spinner" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
                                <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                              </svg>
                            </span>
                          )}
                          <span className={isLoading ? 'navbar__category-text--hidden' : ''}>{cat.name}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
              {/* Mobile Right Arrow Indicator & Click-to-scroll */}
              {canScrollRight && (
                <button
                  type="button"
                  className={`navbar__sub-row-arrow ${isAtEnd ? 'is-flipped' : ''}`}
                  onClick={handleSubRowArrowClick}
                  aria-label={isAtEnd ? "Scroll back to first categories" : "Show next categories"}
                  title={isAtEnd ? "Scroll back to beginning" : "Show next categories"}
                >
                  <ChevronRightIcon size={16} strokeWidth={2.6} />
                </button>
              )}
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
          <Link href="/" className="mobile-drawer__logo" onClick={() => setMobileOpen(false)} aria-label="House of Gargi">
            <img
              src="/logo-images/new-logo.png"
              alt="House of Gargi"
              className="navbar__logo-img--dark"
              style={{ display: 'block', height: '62px', width: 'auto', objectFit: 'contain' }}
            />
          </Link>
          <button type="button" className="mobile-drawer__close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <CloseIcon size={26} />
          </button>
        </div>

        {/* Auth Action Buttons in Mobile Drawer */}
        <div className="mobile-drawer__auth-actions">
          {!isLoggedIn ? (
            <>
              <button 
                type="button" 
                className="mobile-drawer__auth-btn" 
                onClick={() => { setMobileOpen(false); openLoginModal(); }}
              >
                Sign In
              </button>
              <Link 
                href="/artisan/login" 
                className="mobile-drawer__auth-btn" 
                onClick={() => setMobileOpen(false)}
              >
                Join Us
              </Link>
            </>
          ) : role === 'artisan' ? (
            <>
              <Link 
                href="/artisan/dashboard" 
                className="mobile-drawer__auth-btn" 
                onClick={() => setMobileOpen(false)}
              >
                Artisan Portal
              </Link>
              <button 
                type="button" 
                className="mobile-drawer__auth-btn mobile-drawer__auth-btn--signout" 
                onClick={async () => { setMobileOpen(false); await logout(); }}
              >
                <LogOut size={15} style={{ marginRight: 6, display: 'inline-block', verticalAlign: 'middle' }} />
                Sign Out
              </button>
            </>
          ) : role === 'super_admin' ? (
            <>
              <Link 
                href="/super-admin/dashboard" 
                className="mobile-drawer__auth-btn" 
                onClick={() => setMobileOpen(false)}
              >
                SA Portal
              </Link>
              <button 
                type="button" 
                className="mobile-drawer__auth-btn mobile-drawer__auth-btn--signout" 
                onClick={async () => { setMobileOpen(false); await logout(); }}
              >
                <LogOut size={15} style={{ marginRight: 6, display: 'inline-block', verticalAlign: 'middle' }} />
                Sign Out
              </button>
            </>
          ) : role === 'admin' ? (
            <>
              <Link 
                href="/admin/dashboard" 
                className="mobile-drawer__auth-btn" 
                onClick={() => setMobileOpen(false)}
              >
                Admin Portal
              </Link>
              <button 
                type="button" 
                className="mobile-drawer__auth-btn mobile-drawer__auth-btn--signout" 
                onClick={async () => { setMobileOpen(false); await logout(); }}
              >
                <LogOut size={15} style={{ marginRight: 6, display: 'inline-block', verticalAlign: 'middle' }} />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button 
                type="button" 
                className="mobile-drawer__auth-btn" 
                onClick={() => { setMobileOpen(false); handleUserClick(); }}
              >
                My Account
              </button>
              <button 
                type="button" 
                className="mobile-drawer__auth-btn mobile-drawer__auth-btn--signout" 
                onClick={async () => { setMobileOpen(false); await logout(); }}
              >
                <LogOut size={15} style={{ marginRight: 6, display: 'inline-block', verticalAlign: 'middle' }} />
                Sign Out
              </button>
            </>
          )}
        </div>

        {/* Navigation Categories: Clean text with click loading indicator */}
        <div className="mobile-drawer__links">
          {CATEGORY_STRIP_ITEMS.map((cat) => {
            const isLoading = loadingCategory === cat.href;
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className={`mobile-drawer__link ${isLoading ? 'is-loading' : ''}`}
                onClick={() => {
                  handleCategoryClick(cat.href);
                  setMobileOpen(false);
                }}
              >
                <span className="navbar__category-item">
                  {isLoading && (
                    <span className="navbar__category-spinner-wrap" aria-hidden="true">
                      <svg className="navbar__category-spinner" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
                        <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  )}
                  <span className={isLoading ? 'navbar__category-text--hidden' : ''}>{cat.mobileName || cat.name}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
