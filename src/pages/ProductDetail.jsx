import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import ProductCard from '../components/ProductCard';
import { getProduct, getRelatedProducts, formatPrice, categories } from '../data/products';
import { DiyaIcon, WishlistIcon, HeartFilledIcon, PlusIcon, MinusIcon } from '../components/Icons';
import useSEO from '../hooks/useSEO';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [careOpen, setCareOpen] = useState(false);
  const [error, setError] = useState('');

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const product = getProduct(id);
  
  useSEO({
    title: product ? product.name : 'Product',
    description: product ? product.description : ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImage(0);
    setSelectedSize('');
    setCareOpen(false);
    setError('');
  }, [id]);

  if (!product) return <div className="section container"><h2>Product not found.</h2></div>;

  const related = getRelatedProducts(id, 4);
  const categoryName = categories.find(c => c.id === product.category)?.name || 'Collection';
  const saved = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (product.sizes.length > 1 && !selectedSize) {
      setError('Please select a size first.');
      return;
    }
    setError('');
    addToCart(product, 1, selectedSize || product.sizes[0]);
    navigate('/cart');
  };

  return (
    <div className="section section--ivory" style={{ paddingTop: 'calc(var(--navbar-height) + 12px)' }}>
      <div className="container">
        <Link to={`/category/${product.category}`} className="nav-label" style={{ display: 'inline-block', marginBottom: '32px', color: 'var(--stone-taupe)' }}>
          ← Back to {categoryName}
        </Link>
        {/* ═══════ PDP MAIN ═══════ */}
        <div className="pdp">
          {/* Left: Gallery */}
          <div className="pdp__gallery">
            <div className="pdp__main-image">
              <img src={product.images[selectedImage]} alt={product.name} />
            </div>
            {product.images.length > 1 && (
              <div className="pdp__thumbs">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`pdp__thumb ${i === selectedImage ? 'pdp__thumb--active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img} alt={`${product.name} view ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="pdp__info">
            <p className="caption" style={{ marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              {product.category.replace('-', ' ')}
            </p>
            <h1>{product.name}</h1>
            <div className="pdp__price">{formatPrice(product.price)}</div>

            <p className="pdp__description">{product.description}</p>

            {/* Artisan Note */}
            <div className="pdp__artisan-note">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DiyaIcon size={16} /> {product.artisanNote}
              </span>
              <br />
              <span style={{ fontSize: '13px', color: 'var(--stone-taupe)' }}>
                {product.technique} · {product.region}
              </span>
            </div>

            {/* Fabric */}
            <p style={{ marginBottom: '16px', fontSize: '14px' }}>
              <strong style={{ color: 'var(--ink-brown)' }}>Fabric:</strong>{' '}
              <span style={{ color: 'var(--stone-taupe)' }}>{product.fabric}</span>
            </p>

            {/* Size Selector */}
            {product.sizes.length > 1 && (
              <>
                <p style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '700' }}>
                  Select Size {error && <span style={{ color: 'var(--maharani-maroon)', fontWeight: 'normal', marginLeft: '8px' }}>{error}</span>}
                </p>
                <div className="pdp__size-selector">
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      className={`pdp__size-btn ${selectedSize === s ? 'pdp__size-btn--active' : ''}`}
                      onClick={() => { setSelectedSize(s); setError(''); }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Add to Cart */}
            <button className="btn btn--primary" style={{ width: '100%', marginBottom: '16px', padding: '16px' }} onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="btn btn--outline" style={{ width: '100%' }} onClick={() => toggleWishlist(product)}>
              {saved ? <HeartFilledIcon size={16} color="var(--maharani-maroon)" /> : <WishlistIcon size={16} />}
              &ensp;{saved ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>

            {/* Care Accordion */}
            <div className="pdp__accordion">
              <button className="pdp__accordion-header" onClick={() => setCareOpen(!careOpen)}>
                <span>Care Instructions</span>
                <span>{careOpen ? <MinusIcon size={16} /> : <PlusIcon size={16} />}</span>
              </button>
              {careOpen && (
                <div className="pdp__accordion-body">{product.care}</div>
              )}
            </div>
          </div>
        </div>

        {/* ═══════ YOU MAY ALSO LIKE ═══════ */}
        <div className="divider" style={{ marginTop: '80px' }}><span className="divider__icon"><DiyaIcon size={16} /></span></div>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2>You May Also Like</h2>
          </div>
          <div className="related-grid">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
