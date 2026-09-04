'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import { DiyaIcon } from '@/components/Icons';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();

  if (wishlist.length === 0) {
    return (
      <div className="section section--ivory" style={{ minHeight: '60vh', paddingTop: 'calc(var(--navbar-height) + 40px)', textAlign: 'center' }}>
        <div className="container">
          <DiyaIcon size={48} style={{ color: 'var(--gargi-gold)', marginBottom: '24px' }} />
          <h1 style={{ fontFamily: 'var(--font-nav)', color: 'var(--ink-brown)', marginBottom: '16px' }}>Your Wishlist is Empty</h1>
          <p style={{ color: 'var(--stone-taupe)', marginBottom: '32px' }}>Save your favorite handcrafted items here to review them later.</p>
          <Link href="/shop" className="btn btn--primary">Discover Collections</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section section--ivory" style={{ minHeight: '80vh', paddingTop: 'calc(var(--navbar-height) + 16px)' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <button 
            type="button" 
            onClick={() => router.back()} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-brown)', fontSize: '16px' }}
          >
            <span>&larr;</span> Back
          </button>
        </div>
        <div style={{ textAlign: 'left', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'var(--font-nav)', color: 'var(--ink-brown)', marginBottom: '8px', fontSize: '28px' }}>Your Wishlist</h1>
          <p style={{ color: 'var(--stone-taupe)', fontSize: '14px' }}>{wishlist.length} {wishlist.length === 1 ? 'piece' : 'pieces'} saved for later</p>
        </div>

        <div className="category-grid">
          {wishlist.map(product => (
            <div key={product.id} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <ProductCard product={product} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }} />
              </div>
              <button 
                type="button"
                className="btn btn--outline" 
                style={{ width: '100%', marginTop: 'auto' }}
                onClick={() => {
                  if (product.sizes && product.sizes.length === 1) {
                    addToCart(product, 1, product.sizes[0]);
                    alert('Added to your shopping bag!');
                  } else {
                    router.push(`/product/${product.id}`);
                  }
                }}
              >
                Move to Shopping Bag
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
