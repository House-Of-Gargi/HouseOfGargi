import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer" style={{ backgroundImage: 'url(/assets/footer-texture.png)' }}>
      <div className="container">
        <div className="footer__grid">
          {/* ── 1. Left Brand Column ── */}
          <div className="footer__brand-col">
            <Link href="/" className="footer__logo-wrap" aria-label="House of Gargi">
              <img
                src="/logo-images/new-white-logo.png"
                alt="House of Gargi"
                className="footer__logo-img"
              />
            </Link>
            <p className="footer__brand-desc">
              Handcrafted luxury Indian fashion preserving ancestral weaves, courtly karigari, and timeless heritage couture.
            </p>
            <div className="footer__social-row">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-btn"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-btn"
                aria-label="Pinterest"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-btn"
                aria-label="X (Twitter)"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-btn"
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── 2 & 3. Navigation Columns (Platform + Access & Support) ── */}
          <div className="footer__nav-cols">
            {/* PLATFORM */}
            <div className="footer__nav-col">
              <h4 className="footer__heading">Platform</h4>
              <div className="footer__links-list">
                <Link href="/category/sarees">Sarees</Link>
                <Link href="/category/lehengas">Lehengas</Link>
                <Link href="/category/kurta-sets">Kurta Sets</Link>
                <Link href="/category/accessories">Accessories</Link>
                <Link href="/shop">Complete Catalog</Link>
              </div>
            </div>

            {/* ACCESS & SUPPORT */}
            <div className="footer__nav-col">
              <h4 className="footer__heading">Access &amp; Support</h4>
              <div className="footer__links-list">
                <Link href="/seller/login" className="footer__portal-link">
                  <span className="footer__portal-text">Artisan Portal</span> <span className="footer__portal-arrow">→</span>
                </Link>
                <a
                  href="https://wa.me/919876543210?text=Hello%20House%20of%20Gargi%2C%20I%20would%20like%20a%20couture%20consultation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__whatsapp-link"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  WhatsApp Consultation
                </a>
                <Link href="/size-guide">Size Guide</Link>
                <Link href="/returns">Returns Policy</Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. Bottom Footer Bar (3 Symmetrical Sections: Left | Center | Right) ── */}
        <div className="footer__bottom">
          {/* Left: Proudly Made in India with Guaranteed Crisp SVG Flag */}
          <div className="footer__bottom-left">
            <span className="footer__made-in-india">
              Proudly Made in India
              <svg width="22" height="15" viewBox="0 0 30 20" className="footer__flag-svg" role="img" aria-label="Indian Flag">
                <clipPath id="india-flag-clip">
                  <rect width="30" height="20" rx="2" />
                </clipPath>
                <g clipPath="url(#india-flag-clip)">
                  <rect width="30" height="20" fill="#FFFFFF" />
                  <rect width="30" height="6.67" fill="#FF9933" />
                  <rect y="13.33" width="30" height="6.67" fill="#138808" />
                  <circle cx="15" cy="10" r="2.4" fill="none" stroke="#000080" strokeWidth="0.6" />
                  <circle cx="15" cy="10" r="0.5" fill="#000080" />
                  <path d="M15 7.6v4.8M12.6 10h4.8M13.3 8.3l3.4 3.4M13.3 11.7l3.4-3.4M14.1 7.8l1.8 4.4M14.1 12.2l1.8-4.4M12.8 9.1l4.4 1.8M12.8 10.9l4.4-1.8" stroke="#000080" strokeWidth="0.32" />
                </g>
              </svg>
            </span>
          </div>

          {/* Middle: 2026 House of Gargi line in the middle */}
          <div className="footer__bottom-middle">
            <span className="footer__copyright">
              © {new Date().getFullYear()} House of Gargi. All rights reserved.
            </span>
          </div>

          {/* Right: 3 buttons */}
          <div className="footer__bottom-right">
            <Link href="/privacy">Privacy Policy</Link>
            <span className="footer__dot">·</span>
            <Link href="/terms">Terms of Service</Link>
            <span className="footer__dot">·</span>
            <Link href="/faq">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
