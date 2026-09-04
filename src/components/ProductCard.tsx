'use client';

import Link from 'next/link';
import { CSSProperties, MouseEvent, useState, useEffect } from 'react';
import { Product } from '@/types';
import { getProduct } from '@/data/products';
import { WishlistIcon, HeartFilledIcon } from './Icons';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';

interface ProductCardProps {
  product: Product;
  style?: CSSProperties;
}

export default function ProductCard({ product, style }: ProductCardProps) {
  const currentProduct = getProduct(product.id) || product;
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSaved = mounted && isInWishlist(currentProduct.id);

  const handleWishlistClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(currentProduct);
  };

  return (
    <div 
      className="product-card" 
      style={{ 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column', 
        isolation: 'isolate',
        zIndex: 1,
        ...style 
      }}
    >
      <button 
        type="button"
        className="product-card__wishlist" 
        onClick={handleWishlistClick}
        aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
        style={{ zIndex: 2 }}
      >
        {isSaved ? <HeartFilledIcon size={20} color="var(--maharani-maroon)" /> : <WishlistIcon size={20} />}
      </button>
      <Link href={`/product/${currentProduct.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="product-card__image-wrap">
          <img src={currentProduct.images[0]} alt={currentProduct.name} loading="lazy" />
        </div>
        <div className="product-card__body" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="product-card__name">{currentProduct.name}</div>
          <div className="product-card__artisan">{currentProduct.artisanNote}</div>
          <div className="product-card__price" style={{ marginTop: 'auto' }}>{formatPrice(currentProduct.price)}</div>
        </div>
      </Link>
    </div>
  );
}
