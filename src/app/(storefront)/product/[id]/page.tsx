'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ScrollReveal from '@/components/ScrollReveal';
import ProductCard from '@/components/ProductCard';
import { getProduct, getRelatedProducts, categories } from '@/data/products';
import { DiyaIcon, WishlistIcon, HeartFilledIcon, PlusIcon, MinusIcon } from '@/components/Icons';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';

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
  const { currency, setCurrency, formatPrice } = useCurrency();

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
    <div className="section section--ivory" style={{ minHeight: '80vh', paddingTop: 'calc(var(--navbar-height) + 24px)', paddingBottom: '80px' }}>
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
          {/* Left Column: Pure Image (No overlay text) */}
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

          {/* Right Column: Clean Minimalist Details */}
          <div className="pdp-info">
            {/* Category & Region */}
            <div style={{
              fontFamily: 'var(--font-nav)',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--stone-taupe)',
              marginBottom: '8px'
            }}>
              {categoryName} &bull; {product.region}
            </div>

            {/* Title */}
            <h1 style={{ marginBottom: '14px' }}>{product.name}</h1>

            {/* Clean High-Legibility Price & Minimalist 2-way Currency Toggle */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '20px' }}>
              <span className="pdp-price__number">
                {formatPrice(product.price)}
              </span>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontFamily: 'var(--font-nav)', fontWeight: 600 }}>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: currency === 'USD' ? 'var(--maharani-maroon)' : 'var(--stone-taupe)',
                    fontWeight: currency === 'USD' ? 700 : 500,
                    textDecoration: currency === 'USD' ? 'underline' : 'none',
                    textUnderlineOffset: '4px',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                  }}
                >
                  USD ($)
                </button>
                <span style={{ opacity: 0.35, color: 'var(--stone-taupe)' }}>|</span>
                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: currency === 'INR' ? 'var(--maharani-maroon)' : 'var(--stone-taupe)',
                    fontWeight: currency === 'INR' ? 700 : 500,
                    textDecoration: currency === 'INR' ? 'underline' : 'none',
                    textUnderlineOffset: '4px',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                  }}
                >
                  INR (₹)
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="pdp-desc" style={{ marginBottom: '24px' }}>{product.description}</p>

            {/* Clean Minimalist Specs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              padding: '16px 0',
              borderTop: '1px solid var(--soft-gold-line)',
              borderBottom: '1px solid var(--soft-gold-line)',
              marginBottom: '26px'
            }}>
              <div>
                <span style={{ display: 'block', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--stone-taupe)', fontWeight: 700, marginBottom: '4px' }}>
                  Fabric
                </span>
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink-brown)' }}>
                  {product.fabric}
                </span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--stone-taupe)', fontWeight: 700, marginBottom: '4px' }}>
                  Technique
                </span>
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink-brown)' }}>
                  {product.technique}
                </span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--stone-taupe)', fontWeight: 700, marginBottom: '4px' }}>
                  Occasion
                </span>
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink-brown)' }}>
                  {product.occasion}
                </span>
              </div>
            </div>

            {/* Size Selector (if applicable) */}
            {product.sizes.length > 1 && (
              <div className="pdp-sizes" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label className="pdp-sizes__label" style={{ fontSize: '13px' }}>Select Size:</label>
                  <Link href="/size-guide" className="caption" style={{ textDecoration: 'underline', color: 'var(--gargi-gold)', fontWeight: 600 }}>
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
              <div style={{ color: 'var(--maharani-maroon)', fontSize: '14.5px', fontWeight: 600, marginBottom: '16px' }}>
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="pdp-actions" style={{ marginBottom: '24px' }}>
              {cartItem ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--soft-gold-line)', borderRadius: '2px', background: '#FFFFFF' }}>
                    <button 
                      type="button" 
                      onClick={() => updateQuantity(product.id, sizeToCart, cartItem.quantity - 1)}
                      style={{ padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-brown)' }}
                      aria-label="Decrease quantity"
                    >
                      <MinusIcon size={16} />
                    </button>
                    <span style={{ padding: '0 16px', fontWeight: 700, fontSize: '16px' }}>{cartItem.quantity}</span>
                    <button 
                      type="button" 
                      onClick={() => updateQuantity(product.id, sizeToCart, cartItem.quantity + 1)}
                      style={{ padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-brown)' }}
                      aria-label="Increase quantity"
                    >
                      <PlusIcon size={16} />
                    </button>
                  </div>
                  <Link href="/cart" className="btn btn--primary" style={{ flex: 1, padding: '15px 24px', fontSize: '15px' }}>
                    View in Bag
                  </Link>
                </div>
              ) : (
                <button 
                  type="button" 
                  className="btn btn--primary" 
                  style={{ width: '100%', padding: '15px 24px', fontSize: '15px' }}
                  onClick={handleAddToCart}
                >
                  Add to Shopping Bag
                </button>
              )}

              <button
                type="button"
                className="btn btn--outline"
                onClick={() => toggleWishlist(product)}
                style={{ minWidth: '52px', padding: '15px 16px' }}
                aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                {saved ? <HeartFilledIcon size={20} color="var(--maharani-maroon)" /> : <WishlistIcon size={20} />}
              </button>
            </div>

            {/* Clean Accordion: Fabric Care */}
            <div className="pdp-accordion" style={{ marginTop: '8px' }}>
              <div 
                className="pdp-accordion__header" 
                onClick={() => setCareOpen(!careOpen)}
                style={{ cursor: 'pointer', padding: '14px 0', borderTop: '1px solid var(--soft-gold-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span style={{ fontWeight: 600, fontSize: '14.5px' }}>Fabric Care &amp; Craft Details</span>
                <span style={{ fontSize: '18px', fontWeight: 600 }}>{careOpen ? '−' : '+'}</span>
              </div>
              {careOpen && (
                <div className="pdp-accordion__body" style={{ paddingBottom: '16px', fontSize: '14.5px', color: 'var(--stone-taupe)', lineHeight: 1.7 }}>
                  <p><strong>Care:</strong> {product.care}</p>
                  <p style={{ marginTop: '8px' }}><strong>Origin:</strong> Handwoven in {product.region}. Each piece is naturally unique with authentic handloom textures.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ marginTop: '80px' }}>
            <div className="divider"><span className="divider__icon"><DiyaIcon size={16} /></span></div>
            <h2 style={{ textAlign: 'center', margin: '36px 0 28px', color: 'var(--ink-brown)' }}>You May Also Cherish</h2>
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
