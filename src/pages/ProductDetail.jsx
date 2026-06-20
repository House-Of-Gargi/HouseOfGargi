import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import ProductCard from '../components/ProductCard';
import { getProduct, getRelatedProducts, formatPrice } from '../data/products';
import { DiyaIcon, WishlistIcon, PlusIcon, MinusIcon } from '../components/Icons';

export default function ProductDetail() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [careOpen, setCareOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImage(0);
    setSelectedSize('');
    setCareOpen(false);
  }, [id]);

  const product = getProduct(id);
  if (!product) return <div className="section container"><h2>Product not found.</h2></div>;

  const related = getRelatedProducts(id, 4);

  return (
    <div className="section section--ivory" style={{ paddingTop: 'calc(var(--navbar-height) + 40px)' }}>
      <div className="container">
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
                <p style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '700' }}>Select Size</p>
                <div className="pdp__size-selector">
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      className={`pdp__size-btn ${selectedSize === s ? 'pdp__size-btn--active' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Add to Cart */}
            <button className="btn btn--primary" style={{ width: '100%', marginBottom: '16px', padding: '16px' }}>
              Add to Cart
            </button>
            <button className="btn btn--outline" style={{ width: '100%' }}>
              <WishlistIcon size={16} />&ensp;Add to Wishlist
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
