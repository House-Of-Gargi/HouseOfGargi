import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SearchIcon, WishlistIcon, CartIcon, MenuIcon, CloseIcon, UserIcon } from './Icons';
import CustomerLoginModal from './CustomerLoginModal';
import { supabase } from '../lib/supabaseClient';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [session, setSession] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleUserClick = () => {
    if (session) {
      navigate('/account');
    } else {
      setLoginModalOpen(true);
    }
  };

  const isProductPage = location.pathname.startsWith('/product');
  const cls = `navbar ${(scrolled || isProductPage) ? 'navbar--scrolled' : 'navbar--hero'}`;

  return (
    <>
      <nav className={cls}>
        <div className="navbar__inner">
          <div className="navbar__left">
            <button
              className="navbar__mobile-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
            >
              <MenuIcon size={24} />
            </button>
            <Link to="/" className="navbar__logo">House of Gargi</Link>
          </div>

          <div className="navbar__links">
            <Link to="/category/sarees">Sarees</Link>
            <Link to="/category/lehengas">Lehengas</Link>
            <Link to="/category/kurta-sets">Kurta Sets</Link>
            <Link to="/category/accessories">Accessories</Link>
            <Link to="/bespoke">Bespoke</Link>
          </div>

          <div className="navbar__icons">
            <button aria-label="Search" title="Search"><SearchIcon size={20} /></button>
            <button aria-label="Account" title="Account" onClick={handleUserClick}><UserIcon size={20} /></button>
            <button aria-label="Wishlist" title="Wishlist"><WishlistIcon size={20} /></button>
            <button aria-label="Cart" title="Cart"><CartIcon size={20} /></button>
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
          <Link to="/" className="navbar__logo" style={{ color: 'var(--ink-brown)' }} onClick={() => setMobileOpen(false)}>House of Gargi</Link>
          <button className="mobile-drawer__close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <CloseIcon size={28} />
          </button>
        </div>
        <div className="mobile-drawer__links">
          <Link to="/category/sarees" className="nav-label" onClick={() => setMobileOpen(false)}>Sarees</Link>
          <Link to="/category/lehengas" className="nav-label" onClick={() => setMobileOpen(false)}>Lehengas</Link>
          <Link to="/category/kurta-sets" className="nav-label" onClick={() => setMobileOpen(false)}>Kurta Sets</Link>
          <Link to="/category/accessories" className="nav-label" onClick={() => setMobileOpen(false)}>Accessories</Link>
          <Link to="/bespoke" className="nav-label" onClick={() => setMobileOpen(false)}>Bespoke</Link>
        </div>
      </div>
    </>
  );
}
