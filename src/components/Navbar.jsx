import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SearchIcon, WishlistIcon, CartIcon, MenuIcon, CloseIcon } from './Icons';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const cls = `navbar ${scrolled ? 'navbar--scrolled' : 'navbar--hero'}`;

  return (
    <>
      <nav className={cls}>
        <div className="navbar__inner">
          <Link to="/" className="navbar__logo">House of Gargi</Link>

          <div className="navbar__links">
            <Link to="/category/sarees">Sarees</Link>
            <Link to="/category/lehengas">Lehengas</Link>
            <Link to="/category/kurta-sets">Kurta Sets</Link>
            <Link to="/category/accessories">Accessories</Link>
            <Link to="/our-story">Our Story</Link>
          </div>

          <div className="navbar__icons">
            <button aria-label="Search" title="Search"><SearchIcon size={20} /></button>
            <button aria-label="Wishlist" title="Wishlist"><WishlistIcon size={20} /></button>
            <button aria-label="Cart" title="Cart"><CartIcon size={20} /></button>
            <button
              className="navbar__mobile-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
            >
              <MenuIcon size={24} />
            </button>
          </div>
        </div>
      </nav>

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
          <Link to="/our-story" className="nav-label" onClick={() => setMobileOpen(false)}>Our Story</Link>
        </div>
      </div>
    </>
  );
}
