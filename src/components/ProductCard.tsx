'use client';

import Link from 'next/link';
import { CSSProperties, MouseEvent } from 'react';
import { Product } from '@/types';
import { formatPrice } from '@/data/products';
import { WishlistIcon, HeartFilledIcon } from './Icons';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
  style?: CSSProperties;
}

export default function ProductCard({ product, style }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const saved = isInWishlist(product.id);

  const handleWishlistClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Link href={`/product/${product.id}`} className="product-card" style={{ textDecoration: 'none', ...style }}>
      <button 
        type="button"
        className="product-card__wishlist" 
        onClick={handleWishlistClick}
        aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {saved ? <HeartFilledIcon size={20} color="var(--maharani-maroon)" /> : <WishlistIcon size={20} />}
      </button>
      <div className="product-card__image-wrap">
        <img src={product.images[0]} alt={product.name} loading="lazy" />
      </div>
      <div className="product-card__body" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="product-card__name">{product.name}</div>
        <div className="product-card__artisan">{product.artisanNote}</div>
        <div className="product-card__price" style={{ marginTop: 'auto' }}>{formatPrice(product.price)}</div>
      </div>
    </Link>
  );
}
