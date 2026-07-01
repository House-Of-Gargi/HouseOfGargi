import { Link } from 'react-router-dom';
import { formatPrice } from '../data/products';
import { WishlistIcon, HeartFilledIcon } from './Icons';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product, style }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const saved = isInWishlist(product.id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card" style={{ textDecoration: 'none', ...style }}>
      <button className="product-card__wishlist" onClick={handleWishlistClick}>
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
