import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cls = `navbar ${scrolled ? 'navbar--scrolled' : 'navbar--hero'}`;

  return (
    <nav className={cls}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">House of Gargi</Link>

        <div className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
          <Link to="/category/sarees" onClick={() => setMobileOpen(false)}>Sarees</Link>
          <Link to="/category/lehengas" onClick={() => setMobileOpen(false)}>Lehengas</Link>
          <Link to="/category/kurta-sets" onClick={() => setMobileOpen(false)}>Kurta Sets</Link>
          <Link to="/category/accessories" onClick={() => setMobileOpen(false)}>Accessories</Link>
          <Link to="/our-story" onClick={() => setMobileOpen(false)}>Our Story</Link>
        </div>

        <div className="navbar__icons">
          <button aria-label="Search" title="Search">⌕</button>
          <button aria-label="Wishlist" title="Wishlist">♡</button>
          <button aria-label="Cart" title="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </button>
          <button
            className="navbar__mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile slide-down */}
      {mobileOpen && (
        <div style={{
          background: 'rgba(251,246,238,0.98)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          borderTop: '1px solid var(--soft-gold-line)',
        }}>
          <Link to="/category/sarees" className="nav-label" onClick={() => setMobileOpen(false)} style={{color: 'var(--ink-brown)'}}>Sarees</Link>
          <Link to="/category/lehengas" className="nav-label" onClick={() => setMobileOpen(false)} style={{color: 'var(--ink-brown)'}}>Lehengas</Link>
          <Link to="/category/kurta-sets" className="nav-label" onClick={() => setMobileOpen(false)} style={{color: 'var(--ink-brown)'}}>Kurta Sets</Link>
          <Link to="/category/accessories" className="nav-label" onClick={() => setMobileOpen(false)} style={{color: 'var(--ink-brown)'}}>Accessories</Link>
          <Link to="/our-story" className="nav-label" onClick={() => setMobileOpen(false)} style={{color: 'var(--ink-brown)'}}>Our Story</Link>
        </div>
      )}
    </nav>
  );
}
