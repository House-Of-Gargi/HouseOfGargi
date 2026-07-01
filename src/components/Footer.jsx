import { Link } from 'react-router-dom';
import footerTexture from '../assets/footer-texture.png';
import { DiyaIcon } from './Icons';

export default function Footer() {
  return (
    <footer className="footer" style={{ backgroundImage: `url(${footerTexture})` }}>
      <div className="container">
        <div className="footer__grid">
          <div>
            <h4 className="footer__heading">Shop</h4>
            <Link to="/category/sarees">Sarees</Link>
            <Link to="/category/lehengas">Lehengas</Link>
            <Link to="/category/kurta-sets">Kurta Sets</Link>
            <Link to="/category/accessories">Accessories</Link>
          </div>
          <div>
            <h4 className="footer__heading">About</h4>
            <Link to="/our-story">Our Story</Link>
            <Link to="/our-artisans">Our Artisans</Link>
            <Link to="/sustainability">Sustainability</Link>
            <Link to="/press">Press</Link>
          </div>
          <div>
            <h4 className="footer__heading">Customer Care</h4>
            <Link to="/shipping">Shipping & Delivery</Link>
            <Link to="/returns">Returns & Exchanges</Link>
            <Link to="/size-guide">Size Guide</Link>
            <Link to="/faq">FAQ</Link>
          </div>
          <div>
            <h4 className="footer__heading">Connect</h4>
            <a href="#">Instagram</a>
            <a href="#">Pinterest</a>
            <a href="#">Facebook</a>
            <a href="#">hello@houseofgargi.com</a>
          </div>
        </div>

        <div className="divider" style={{ maxWidth: '200px' }}>
          <span className="divider__icon"><DiyaIcon size={16} /></span>
        </div>

        <div className="footer__bottom">
          © {new Date().getFullYear()} House of Gargi. All rights reserved. Handcrafted with love in India.
        </div>
      </div>
    </footer>
  );
}
