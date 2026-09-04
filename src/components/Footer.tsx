import Link from 'next/link';
import { DiyaIcon } from './Icons';

export default function Footer() {
  return (
    <footer className="footer" style={{ backgroundImage: 'url(/assets/footer-texture.png)' }}>
      <div className="container">
        <div className="footer__grid">
          <div>
            <h4 className="footer__heading">Shop</h4>
            <Link href="/category/sarees">Sarees</Link>
            <Link href="/category/lehengas">Lehengas</Link>
            <Link href="/category/kurta-sets">Kurta Sets</Link>
            <Link href="/category/accessories">Accessories</Link>
            <Link href="/shop">Complete Catalog</Link>
          </div>
          <div>
            <h4 className="footer__heading">About</h4>
            <Link href="/our-story">Our Story</Link>
            <Link href="/our-artisans">Our Artisans</Link>
            <Link href="/sustainability">Sustainability</Link>
            <Link href="/press">Press</Link>
          </div>
          <div>
            <h4 className="footer__heading">Customer Care</h4>
            <Link href="/shipping">Shipping & Delivery</Link>
            <Link href="/returns">Returns & Exchanges</Link>
            <Link href="/size-guide">Size Guide</Link>
            <Link href="/faq">FAQ</Link>
          </div>
          <div>
            <h4 className="footer__heading">Connect</h4>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">Pinterest</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="mailto:hello@houseofgargi.com">hello@houseofgargi.com</a>
            <Link href="/seller/login" style={{ opacity: 0.6, fontSize: '12px', marginTop: '8px' }}>Seller Portal</Link>
          </div>
        </div>

        <div className="divider" style={{ maxWidth: '200px', margin: '40px auto' }}>
          <span className="divider__icon"><DiyaIcon size={16} /></span>
        </div>

        <div className="footer__bottom">
          © {new Date().getFullYear()} House of Gargi. All rights reserved. Handcrafted with love in India.
        </div>
      </div>
    </footer>
  );
}
