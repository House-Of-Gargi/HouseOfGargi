'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import ProductCard from '@/components/ProductCard';
import { Crown, Sparkles, Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { getProduct } from '@/data/products';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, addMultipleToCart } = useCart();
  const { isLoggedIn, openLoginModal } = useCustomerAuth();
  const router = useRouter();
  const [movingAll, setMovingAll] = useState(false);
  const [justMovedAll, setJustMovedAll] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleMoveToBag = (product: Product) => {
    if (!isLoggedIn) {
      openLoginModal('/wishlist');
      return;
    }
    const fresh = getProduct(product.id) || product;
    const size = fresh.sizes && fresh.sizes.length > 0 ? fresh.sizes[0] : null;
    addToCart(fresh, 1, size);
    removeFromWishlist(fresh.id);
    setToastMessage(`"${fresh.name}" moved to your Shopping Bag.`);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleMoveAllToBag = () => {
    if (!isLoggedIn) {
      openLoginModal('/wishlist');
      return;
    }
    if (wishlist.length === 0) return;

    setMovingAll(true);
    const count = wishlist.length;
    const itemsToAdd = wishlist.map(p => {
      const fresh = getProduct(p.id) || p;
      const size = fresh.sizes && fresh.sizes.length > 0 ? fresh.sizes[0] : null;
      return { product: fresh, quantity: 1, size };
    });

    addMultipleToCart(itemsToAdd);
    clearWishlist();
    setJustMovedAll(true);
    setMovingAll(false);
    setToastMessage(`All ${count} pieces moved to your Shopping Bag.`);
    setTimeout(() => setToastMessage(null), 4000);
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
            {justMovedAll ? 'Curated Selection Transferred' : 'Curated Heirloom Registry'}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-brown)', fontSize: 'clamp(28px, 3.5vw, 38px)', fontWeight: 600, letterSpacing: '-0.01em', marginBottom: '14px' }}>
            {justMovedAll ? 'All Pieces Moved to Shopping Bag' : 'Your Wishlist is Empty'}
          </h1>
          <p style={{ color: 'var(--stone-taupe)', fontSize: '16px', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 34px' }}>
            {justMovedAll 
              ? 'Your cherished items are now reserved in your private shopping bag and ready for checkout.'
              : 'Save your cherished pure silk sarees, bridal ensembles, and handwoven jewellery to review them in your private curation.'}
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {justMovedAll ? (
              <>
                <Link href="/cart" className="btn btn--primary" style={{ padding: '16px 36px', fontSize: '14px', letterSpacing: '0.14em', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingBag size={16} /> View Shopping Bag
                </Link>
                <Link href="/shop" className="btn btn--outline" style={{ padding: '16px 32px', fontSize: '14px', letterSpacing: '0.14em' }}>
                  Continue Browsing
                </Link>
              </>
            ) : (
              <Link href="/shop" className="btn btn--primary" style={{ padding: '16px 38px', fontSize: '14px', letterSpacing: '0.14em', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Discover Collections <ArrowRight size={16} />
              </Link>
            )}
          </div>

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

        {/* Spacious Header with Count and Actions */}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleMoveAllToBag}
              disabled={movingAll}
              className="btn btn--primary"
              style={{ 
                padding: '12px 26px', 
                fontSize: '13.5px', 
                letterSpacing: '0.12em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: movingAll ? 'not-allowed' : 'pointer',
              }}
            >
              <ShoppingBag size={16} />
              {movingAll ? 'Moving All to Bag...' : 'Move All to Shopping Bag'}
            </button>

            <Link 
              href="/shop" 
              className="btn btn--outline"
              style={{ 
                padding: '12px 24px', 
                fontSize: '13.5px', 
                letterSpacing: '0.12em' 
              }}
            >
              Explore More Collections &rarr;
            </Link>
          </div>
        </div>

        {/* Spacious 3-Column Product Grid */}
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
                  className="btn btn--outline" 
                  style={{ 
                    width: '100%', 
                    marginTop: '18px', 
                    padding: '14px 20px', 
                    fontSize: '13.5px', 
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 200ms ease',
                  }}
                  onClick={() => handleMoveToBag(currentProduct)}
                >
                  <ShoppingBag size={15} /> Move to Shopping Bag
                </button>
              </div>
            );
          })}
        </div>

        {/* Floating Minimal Luxury Toast */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: '36px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--ink-brown)',
            color: 'var(--pure-white)',
            padding: '14px 26px',
            borderRadius: '4px',
            boxShadow: '0 14px 36px rgba(28, 25, 23, 0.28)',
            border: '1px solid var(--gargi-gold)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            zIndex: 9999,
            fontSize: '14px',
            fontFamily: 'var(--font-nav)',
            letterSpacing: '0.04em',
            maxWidth: '90vw',
          }}>
            <span>✦ {toastMessage}</span>
            <Link 
              href="/cart" 
              style={{ 
                color: 'var(--gargi-gold)', 
                textDecoration: 'underline', 
                fontWeight: 600, 
                whiteSpace: 'nowrap',
                fontSize: '13px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              View Bag &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
