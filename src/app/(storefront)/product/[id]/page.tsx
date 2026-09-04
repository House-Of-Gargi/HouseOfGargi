'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ScrollReveal from '@/components/ScrollReveal';
import ProductCard from '@/components/ProductCard';
import { getProduct, getRelatedProducts, formatPrice, categories } from '@/data/products';
import { DiyaIcon, WishlistIcon, HeartFilledIcon, PlusIcon, MinusIcon } from '@/components/Icons';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const product = getProduct(id);
  if (!product) {
    notFound();
  }

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [careOpen, setCareOpen] = useState(false);
  const [error, setError] = useState('');

  const { addToCart, cart, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const related = getRelatedProducts(id, 4);
  const categoryName = categories.find(c => c.id === product.category)?.name || 'Collection';
  const saved = isInWishlist(product.id);
  
  const sizeToCart = product.sizes.length > 1 ? selectedSize : product.sizes[0];
  const cartItem = cart.find(item => item.id === product.id && item.size === sizeToCart);

  const handleAddToCart = () => {
    if (product.sizes.length > 1 && !selectedSize) {
      setError('Please select a size before adding to your bag.');
      return;
    }
    setError('');
    addToCart(product, 1, sizeToCart);
  };

  return (
    <div className="section section--ivory" style={{ minHeight: '80vh', paddingTop: 'calc(var(--navbar-height) + 24px)' }}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href={`/category/${product.category}`}>{categoryName}</Link>
          <span>/</span>
          <span style={{ color: 'var(--ink-brown)' }}>{product.name}</span>
        </nav>

        {/* Product Layout */}
        <div className="pdp-layout">
          {/* Gallery */}
          <div className="pdp-gallery">
            <div className="pdp-gallery__main">
              <img src={product.images[selectedImage] || product.images[0]} alt={product.name} />
            </div>
            {product.images.length > 1 && (
              <div className="pdp-gallery__thumbs">
                {product.images.map((img, i) => (
                  <button
                    type="button"
                    key={i}
                    className={`pdp-gallery__thumb ${selectedImage === i ? 'is-active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img} alt={`${product.name} view ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="pdp-info">
            <div className="caption" style={{ textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gargi-gold)' }}>
              {categoryName} • {product.region}
            </div>
            <h1>{product.name}</h1>
            <div className="pdp-price">{formatPrice(product.price)}</div>
            <div className="caption" style={{ fontStyle: 'italic', marginBottom: '24px' }}>
              ✦ {product.artisanNote}
            </div>

            <p className="pdp-desc">{product.description}</p>

            {/* Specs */}
            <div className="pdp-specs">
              <div className="pdp-spec">
                <span className="pdp-spec__label">Fabric:</span>
                <span>{product.fabric}</span>
              </div>
              <div className="pdp-spec">
                <span className="pdp-spec__label">Technique:</span>
                <span>{product.technique}</span>
              </div>
              <div className="pdp-spec">
                <span className="pdp-spec__label">Occasion:</span>
                <span>{product.occasion}</span>
              </div>
            </div>

            {/* Size Selector */}
            {product.sizes.length > 1 && (
              <div className="pdp-sizes">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="pdp-sizes__label">Select Size:</label>
                  <Link href="/size-guide" className="caption" style={{ textDecoration: 'underline', color: 'var(--gargi-gold)' }}>
                    Size Guide
                  </Link>
                </div>
                <div className="pdp-sizes__options">
                  {product.sizes.map(size => (
                    <button
                      type="button"
                      key={size}
                      className={`pdp-size-btn ${selectedSize === size ? 'is-active' : ''}`}
                      onClick={() => { setSelectedSize(size); setError(''); }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div style={{ color: 'var(--maharani-maroon)', fontSize: '13px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="pdp-actions">
              {cartItem ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--soft-gold-line)', borderRadius: '2px' }}>
                    <button 
                      type="button"
                      onClick={() => updateQuantity(product.id, sizeToCart, cartItem.quantity - 1)}
                      style={{ padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-brown)' }}
                      aria-label="Decrease quantity"
                    >
                      <MinusIcon size={16} />
                    </button>
                    <span style={{ padding: '0 16px', fontWeight: 600 }}>{cartItem.quantity}</span>
                    <button 
                      type="button"
                      onClick={() => updateQuantity(product.id, sizeToCart, cartItem.quantity + 1)}
                      style={{ padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-brown)' }}
                      aria-label="Increase quantity"
                    >
                      <PlusIcon size={16} />
                    </button>
                  </div>
                  <Link href="/cart" className="btn btn--primary" style={{ flex: 1 }}>
                    View in Bag
                  </Link>
                </div>
              ) : (
                <button 
                  type="button"
                  className="btn btn--primary" 
                  style={{ width: '100%' }}
                  onClick={handleAddToCart}
                >
                  Add to Shopping Bag
                </button>
              )}

              <button
                type="button"
                className="btn btn--outline"
                onClick={() => toggleWishlist(product)}
                style={{ minWidth: '52px', padding: '14px 16px' }}
                aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                {saved ? <HeartFilledIcon size={20} color="var(--maharani-maroon)" /> : <WishlistIcon size={20} />}
              </button>
            </div>

            {/* Accordion */}
            <div className="pdp-accordion" style={{ marginTop: '32px' }}>
              <div 
                className="pdp-accordion__header" 
                onClick={() => setCareOpen(!careOpen)}
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid var(--soft-gold-line)', borderBottom: '1px solid var(--soft-gold-line)' }}
              >
                <span style={{ fontFamily: 'var(--font-nav)', letterSpacing: '0.1em' }}>Fabric Care & Craftsmanship</span>
                <span>{careOpen ? '−' : '+'}</span>
              </div>
              {careOpen && (
                <div style={{ padding: '16px 0', fontSize: '14px', lineHeight: '1.7', color: 'var(--stone-taupe)' }}>
                  <p><strong>Care Instructions:</strong> {product.care}</p>
                  <p style={{ marginTop: '8px' }}><strong>Artisan Heritage:</strong> Handwoven using authentic {product.technique} traditions in {product.region}. Small variations in weave, texture, and color are natural signatures of the handmade process.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ marginTop: '100px' }}>
            <div className="divider"><span className="divider__icon"><DiyaIcon size={16} /></span></div>
            <h2 style={{ textAlign: 'center', margin: '40px 0 32px', color: 'var(--ink-brown)' }}>You May Also Cherish</h2>
            <div className="product-grid">
              {related.map(p => (
                <ScrollReveal key={p.id}>
                  <ProductCard product={p} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
