import { Link } from 'react-router-dom';
import footerTexture from '../assets/footer-texture.png';

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
            <a href="#">Our Artisans</a>
            <a href="#">Sustainability</a>
            <a href="#">Press</a>
          </div>
          <div>
            <h4 className="footer__heading">Customer Care</h4>
            <a href="#">Shipping & Delivery</a>
            <a href="#">Returns & Exchanges</a>
            <a href="#">Size Guide</a>
            <a href="#">FAQ</a>
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
          <span className="divider__icon">🪔</span>
        </div>

        <div className="footer__bottom">
          © {new Date().getFullYear()} House of Gargi. All rights reserved. Handcrafted with love in India.
        </div>
      </div>
    </footer>
  );
}
