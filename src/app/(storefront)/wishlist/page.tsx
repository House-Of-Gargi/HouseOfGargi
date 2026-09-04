'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import ProductCard from '@/components/ProductCard';
import { Crown, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { getProduct } from '@/data/products';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isLoggedIn, openLoginModal } = useCustomerAuth();
  const router = useRouter();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleMoveToBag = (product: Product) => {
    const fresh = getProduct(product.id) || product;
    if (fresh.sizes && fresh.sizes.length === 1) {
      addToCart(fresh, 1, fresh.sizes[0]);
      setAddedId(fresh.id);
      setTimeout(() => setAddedId(null), 2400);
    } else {
      router.push(`/product/${fresh.id}`);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="section section--ivory" style={{ minHeight: '68vh', paddingTop: 'calc(var(--navbar-height) + 64px)', paddingBottom: '80px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '560px' }}>
          <Heart size={46} strokeWidth={1.3} style={{ color: 'var(--maharani-maroon)', marginBottom: '18px' }} />
          <div style={{ fontFamily: 'var(--font-nav)', fontSize: '11px', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--gargi-gold)', marginBottom: '12px', fontWeight: 600 }}>
            Private Atelier Curation
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-brown)', fontSize: 'clamp(28px, 3.5vw, 38px)', fontWeight: 600, letterSpacing: '-0.01em', marginBottom: '14px' }}>
            Private Atelier Wishlist
          </h1>
          <p style={{ color: 'var(--stone-taupe)', fontSize: '16px', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 34px' }}>
            Sign in with your mobile number to access, save, and review your personal heirloom collection across all your devices.
          </p>
          <button 
            type="button" 
            onClick={() => openLoginModal('/wishlist')}
            className="btn btn--primary" 
            style={{ padding: '16px 38px', fontSize: '14px', letterSpacing: '0.14em', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            Sign In to Access Wishlist <ArrowRight size={16} />
          </button>

          {/* Minimal Luxury Quick Links */}
          <div style={{ marginTop: '44px', paddingTop: '28px', borderTop: '1px solid rgba(228, 211, 174, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '22px', flexWrap: 'wrap', fontSize: '13px', fontFamily: 'var(--font-nav)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            <span style={{ color: 'var(--stone-taupe)', opacity: 0.7 }}>Curated Lines:</span>
            <Link href="/category/sarees" style={{ color: 'var(--ink-brown)', textDecoration: 'none', borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '2px' }}>Sarees</Link>
            <Link href="/category/lehengas" style={{ color: 'var(--ink-brown)', textDecoration: 'none', borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '2px' }}>Lehengas</Link>
            <Link href="/category/kurta-sets" style={{ color: 'var(--ink-brown)', textDecoration: 'none', borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '2px' }}>Kurta Sets</Link>
            <Link href="/bespoke" style={{ color: 'var(--ink-brown)', textDecoration: 'none', borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '2px' }}>Bespoke</Link>
          </div>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="section section--ivory" style={{ minHeight: '68vh', paddingTop: 'calc(var(--navbar-height) + 64px)', paddingBottom: '80px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '560px' }}>
          <Heart size={46} strokeWidth={1.3} style={{ color: 'var(--maharani-maroon)', marginBottom: '18px' }} />
          <div style={{ fontFamily: 'var(--font-nav)', fontSize: '11px', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--gargi-gold)', marginBottom: '12px', fontWeight: 600 }}>
            Curated Heirloom Registry
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-brown)', fontSize: 'clamp(28px, 3.5vw, 38px)', fontWeight: 600, letterSpacing: '-0.01em', marginBottom: '14px' }}>
            Your Wishlist is Empty
          </h1>
          <p style={{ color: 'var(--stone-taupe)', fontSize: '16px', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 34px' }}>
            Save your cherished pure silk sarees, bridal ensembles, and handwoven jewellery to review them in your private curation.
          </p>
          <Link href="/shop" className="btn btn--primary" style={{ padding: '16px 38px', fontSize: '14px', letterSpacing: '0.14em', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Discover Collections <ArrowRight size={16} />
          </Link>

          {/* Minimal Luxury Quick Links */}
          <div style={{ marginTop: '44px', paddingTop: '28px', borderTop: '1px solid rgba(228, 211, 174, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '22px', flexWrap: 'wrap', fontSize: '13px', fontFamily: 'var(--font-nav)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            <span style={{ color: 'var(--stone-taupe)', opacity: 0.7 }}>Curated Lines:</span>
            <Link href="/category/sarees" style={{ color: 'var(--ink-brown)', textDecoration: 'none', borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '2px' }}>Sarees</Link>
            <Link href="/category/lehengas" style={{ color: 'var(--ink-brown)', textDecoration: 'none', borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '2px' }}>Lehengas</Link>
            <Link href="/category/kurta-sets" style={{ color: 'var(--ink-brown)', textDecoration: 'none', borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '2px' }}>Kurta Sets</Link>
            <Link href="/bespoke" style={{ color: 'var(--ink-brown)', textDecoration: 'none', borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '2px' }}>Bespoke</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section section--ivory" style={{ minHeight: '85vh', paddingTop: 'calc(var(--navbar-height) + 32px)', paddingBottom: '100px' }}>
      <div className="container" style={{ maxWidth: '1240px', padding: '0 24px' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '24px' }}>
          <button 
            type="button" 
            onClick={() => router.back()} 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              color: 'var(--stone-taupe)', 
              fontFamily: 'var(--font-nav)',
              fontSize: '13.5px', 
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              transition: 'color 200ms ease',
            }}
          >
            <span style={{ fontSize: '16px' }}>&larr;</span> Back to Browsing
          </button>
        </div>

        {/* Spacious Header with Count and Shop Link */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end', 
          flexWrap: 'wrap', 
          gap: '20px', 
          marginBottom: '48px', 
          borderBottom: '1px solid var(--soft-gold-line)', 
          paddingBottom: '24px' 
        }}>
          <div>
            <h1 style={{ 
              fontFamily: 'var(--font-display)', 
              color: 'var(--ink-brown)', 
              margin: 0, 
              fontSize: 'clamp(32px, 4vw, 42px)', 
              fontWeight: 600, 
              letterSpacing: '-0.01em' 
            }}>
              Your Wishlist
            </h1>
            <p style={{ color: 'var(--stone-taupe)', fontSize: '16.5px', marginTop: '8px', fontWeight: 500 }}>
              {wishlist.length} {wishlist.length === 1 ? 'handcrafted piece' : 'handcrafted pieces'} saved in your private curation
            </p>
          </div>

          <Link 
            href="/shop" 
            className="btn btn--outline"
            style={{ 
              padding: '11px 24px', 
              fontSize: '13.5px', 
              letterSpacing: '0.12em' 
            }}
          >
            Explore More Collections &rarr;
          </Link>
        </div>

        {/* Spacious 3-Column Product Grid (Each card ~360px wide with generous 36px / 48px gaps) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
          gap: '48px 36px',
          alignItems: 'stretch',
        }}>
          {wishlist.map(product => {
            const currentProduct = getProduct(product.id) || product;
            return (
              <div 
                key={currentProduct.id} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%',
                  position: 'relative',
                }}
              >
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <ProductCard product={currentProduct} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }} />
                </div>
                <button 
                  type="button"
                  className={`btn ${addedId === currentProduct.id ? 'btn--primary' : 'btn--outline'}`} 
                  style={{ 
                    width: '100%', 
                    marginTop: '18px', 
                    padding: '14px 20px', 
                    fontSize: '14px', 
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    transition: 'all 250ms ease',
                  }}
                  onClick={() => handleMoveToBag(currentProduct)}
                >
                  {addedId === currentProduct.id ? '✓ Added to Shopping Bag' : 'Move to Shopping Bag'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
