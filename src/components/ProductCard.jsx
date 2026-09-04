import { Link } from 'react-router-dom';
import { formatPrice, getProduct } from '../data/products';
import { WishlistIcon, HeartFilledIcon } from './Icons';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product, style }) {
  const currentProduct = getProduct(product.id) || product;
  const { isInWishlist, toggleWishlist } = useWishlist();
  const saved = isInWishlist(currentProduct.id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    toggleWishlist(currentProduct);
  };

  return (
    <Link to={`/product/${currentProduct.id}`} className="product-card" style={{ textDecoration: 'none', ...style }}>
      <button className="product-card__wishlist" onClick={handleWishlistClick}>
        {saved ? <HeartFilledIcon size={20} color="var(--maharani-maroon)" /> : <WishlistIcon size={20} />}
      </button>
      <div className="product-card__image-wrap">
        <img src={currentProduct.images[0]} alt={currentProduct.name} loading="lazy" />
      </div>
      <div className="product-card__body" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="product-card__name">{currentProduct.name}</div>
        <div className="product-card__artisan">{currentProduct.artisanNote}</div>
        <div className="product-card__price" style={{ marginTop: 'auto' }}>{formatPrice(currentProduct.price)}</div>
      </div>
    </Link>
  );
}
