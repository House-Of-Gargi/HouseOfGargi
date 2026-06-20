import { Link } from 'react-router-dom';
import { formatPrice } from '../data/products';
import { WishlistIcon } from './Icons';

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="product-card" style={{ textDecoration: 'none' }}>
      <button className="product-card__wishlist" onClick={(e) => { e.preventDefault(); }}>
        <WishlistIcon size={20} />
      </button>
      <div className="product-card__image-wrap">
        <img src={product.images[0]} alt={product.name} loading="lazy" />
      </div>
      <div className="product-card__body">
        <div className="product-card__name">{product.name}</div>
        <div className="product-card__artisan">{product.artisanNote}</div>
        <div className="product-card__price">{formatPrice(product.price)}</div>
      </div>
    </Link>
  );
}
