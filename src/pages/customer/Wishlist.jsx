import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/ProductCard';
import { DiyaIcon } from '../../components/Icons';
import useSEO from '../../hooks/useSEO';

export default function Wishlist() {
  const { wishlist } = useWishlist();
  const { addToCart } = useCart();

  useSEO({ title: 'Wishlist', description: 'View your saved House of Gargi items.' });

  if (wishlist.length === 0) {
    return (
      <div className="section section--ivory" style={{ minHeight: '60vh', paddingTop: 'calc(var(--navbar-height) + 40px)', textAlign: 'center' }}>
        <div className="container">
          <DiyaIcon size={48} style={{ color: 'var(--gargi-gold)', marginBottom: '24px' }} />
          <h1 style={{ fontFamily: 'var(--font-nav)', color: 'var(--ink-brown)', marginBottom: '16px' }}>Your Wishlist is Empty</h1>
          <p style={{ color: 'var(--stone-taupe)', marginBottom: '32px' }}>Save your favorite items here to review them later.</p>
          <Link to="/" className="btn btn--primary">Discover Collections</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section section--ivory" style={{ minHeight: '80vh', paddingTop: 'calc(var(--navbar-height) + 40px)' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-brown)', fontSize: '16px' }}>
            <span>&larr;</span> Back
          </button>
        </div>
        <div style={{ textAlign: 'left', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'var(--font-nav)', color: 'var(--ink-brown)', marginBottom: '8px', fontSize: '28px' }}>Your Wishlist</h1>
          <p style={{ color: 'var(--stone-taupe)', fontSize: '14px' }}>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later</p>
        </div>

        <div className="category-grid">
          {wishlist.map(product => (
            <div key={product.id} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <ProductCard product={product} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }} />
              </div>
              <button 
                className="btn btn--outline" 
                style={{ width: '100%', marginTop: 'auto' }}
                onClick={() => {
                  if (product.sizes && product.sizes.length === 1) {
                    addToCart(product, 1, product.sizes[0]);
                    alert('Added to cart!');
                  } else {
                    // Navigate to product detail to select size
                    window.location.href = `/product/${product.id}`;
                  }
                }}
              >
                Move to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
