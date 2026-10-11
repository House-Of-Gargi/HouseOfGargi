'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import ScrollReveal from '@/components/ScrollReveal';
import ProductCard from '@/components/ProductCard';
import { getProduct, getRelatedProducts, categories, getArtisan, getArtisanByProductId } from '@/data/products';
import { WishlistIcon, HeartFilledIcon, PlusIcon, MinusIcon } from '@/components/Icons';
import { Crown, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();

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
  const { isLoggedIn, openLoginModal } = useCustomerAuth();

  const related = getRelatedProducts(id, 4);
  const categoryName = categories.find(c => c.id === product.category)?.name || 'Collection';
  const saved = isLoggedIn && isInWishlist(product.id);
  const artisan = product ? (product.artisanId ? getArtisan(product.artisanId) : getArtisanByProductId(product.id)) : undefined;
  
  const sizeToCart = product.sizes.length > 1 ? selectedSize : product.sizes[0];
  const cartItem = cart.find(item => item.id === product.id && item.size === sizeToCart);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    if (product.sizes.length > 1 && !selectedSize) {
      setError('Please select a size before adding to your bag.');
      return;
    }
    setError('');
    addToCart(product, 1, sizeToCart);
  };

  const handleToggleWishlist = () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    toggleWishlist(product);
  };

  return (
    <div className="section section--ivory section--pdp" style={{ minHeight: '80vh', paddingBottom: '70px' }}>
      <div className="container">
        {/* Top Nav: Back Link with Underline & Breadcrumb */}
        <div className="pdp-top-nav">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined' && window.history.length > 1) {
                window.history.back();
              } else {
                router.push(`/category/${product.category}`);
              }
            }}
            className="pdp-back-link"
            aria-label="Back to previous page"
          >
            <ArrowLeft size={17} strokeWidth={2.2} className="pdp-back-icon" />
            <span className="pdp-back-text">Back</span>
          </button>

          <nav className="breadcrumb pdp-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href={`/category/${product.category}`}>{categoryName}</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink-brown)' }}>{product.name}</span>
          </nav>
        </div>

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
            {/* Category and Region Eyebrow */}
            <div className="pdp-eyebrow">
              {categoryName} &bull; {product.region}
            </div>

            {/* Title */}
            <h1 className="pdp-title">{product.name}</h1>

            {/* Price & Minimalist Currency Toggle */}
            <div className="pdp-price-row">
              <span className="pdp-price__number">
                {formatPrice(product.price)}
              </span>
              <div className="pdp-currency-toggle">
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`pdp-currency-btn ${currency === 'USD' ? 'is-active' : ''}`}
                >
                  USD ($)
                </button>
                <span className="pdp-currency-sep">|</span>
                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  className={`pdp-currency-btn ${currency === 'INR' ? 'is-active' : ''}`}
                >
                  INR (₹)
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="pdp-desc">{product.description}</p>

            {/* Clean Royal Specs Card */}
            <div className="pdp-specs-card">
              <div className="pdp-specs-item">
                <span className="pdp-specs-label">Fabric</span>
                <span className="pdp-specs-val">{product.fabric}</span>
              </div>
              <div className="pdp-specs-item">
                <span className="pdp-specs-label">Technique</span>
                <span className="pdp-specs-val">{product.technique}</span>
              </div>
              <div className="pdp-specs-item">
                <span className="pdp-specs-label">Occasion</span>
                <span className="pdp-specs-val">{product.occasion}</span>
              </div>
            </div>

            {/* Artisan Attribution */}
            {artisan && (
              <div className="pdp-artisan-row">
                <span className="pdp-artisan-row__label">Artisan:</span>
                <Link 
                  href={`/artisan/${artisan.id}`} 
                  className="pdp-artisan-row__name"
                >
                  {artisan.name} <ArrowRight size={13} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '3px' }} />
                </Link>
              </div>
            )}

            {/* Size Selector (if applicable) */}
            {product.sizes.length > 1 && (
              <div className="pdp-sizes" style={{ marginBottom: '22px' }}>
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
            <div className="pdp-actions">
              {cartItem ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--soft-gold-line)', borderRadius: '4px', background: '#FFFFFF' }}>
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
                    <span className="pdp-btn-label--desktop">View in Bag</span>
                    <span className="pdp-btn-label--mobile">View Cart</span>
                  </Link>
                </div>
              ) : (
                <button 
                  type="button" 
                  className="btn btn--primary pdp-btn-add" 
                  onClick={handleAddToCart}
                >
                  <span className="pdp-btn-label--desktop">Add to Shopping Bag</span>
                  <span className="pdp-btn-label--mobile">Add to Cart</span>
                </button>
              )}

              <button
                type="button"
                className="btn btn--outline pdp-btn-wish"
                onClick={handleToggleWishlist}
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
                  <p style={{ marginTop: '8px' }}>
                    <strong>Master Craftsman:</strong>{' '}
                    {artisan ? (
                      <Link href={`/artisan/${artisan.id}`} style={{ color: 'var(--maharani-maroon)', fontWeight: 600, textDecoration: 'underline' }}>
                        {artisan.name} ({artisan.region}) &rarr;
                      </Link>
                    ) : (
                      `Handwoven in ${product.region}.`
                    )}
                  </p>
                  <p style={{ marginTop: '8px' }}>Each piece is naturally unique with authentic handloom textures and Silk Mark India certification.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ marginTop: '80px' }}>
            <div className="divider" role="separator" aria-label="Section Divider">
              <span className="divider__icon">
                <Crown size={24} strokeWidth={2.2} />
              </span>
            </div>
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
