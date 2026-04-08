import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Star, Zap } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart, isInCart } = useCart();
  const [adding, setAdding] = useState(false);

  const inCart = isInCart(product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) return;
    setAdding(true);
    addToCart(product);
    setTimeout(() => setAdding(false), 800);
  };

  const discountedPrice = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      {/* Image */}
      <div className="product-card__img-wrap">
        <img
          src={product.imageUrl || `https://picsum.photos/seed/${product.id}/400/300`}
          alt={product.name}
          className="product-card__img"
          loading="lazy"
        />
        {/* Badges */}
        <div className="product-card__badges">
          {product.featured && (
            <span className="badge badge-blue">
              <Zap size={11} /> Featured
            </span>
          )}
          {discountedPrice && (
            <span className="badge badge-green">-{discountedPrice}%</span>
          )}
        </div>
        {/* Hover Overlay */}
        <div className="product-card__overlay">
          <button
            className="btn btn-secondary btn-sm product-card__view-btn"
            tabIndex={-1}
          >
            <Eye size={15} /> Quick View
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="product-card__body">
        {product.category && (
          <span className="product-card__category">{product.category}</span>
        )}
        <h3 className="product-card__name">{product.name}</h3>

        {product.rating != null && (
          <div className="product-card__rating">
            <Star size={13} fill="currentColor" />
            <span>{product.rating.toFixed(1)}</span>
            {product.reviewCount != null && (
              <span className="product-card__review-count">({product.reviewCount})</span>
            )}
          </div>
        )}

        <div className="product-card__footer">
          <div className="product-card__price-wrap">
            <span className="product-card__price">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="product-card__original-price">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            className={`btn btn-sm product-card__add-btn ${inCart ? 'product-card__add-btn--added' : 'btn-primary'}`}
            onClick={handleAddToCart}
            disabled={adding}
            tabIndex={-1}
          >
            <ShoppingCart size={15} />
            {adding ? 'Added!' : inCart ? 'In Cart' : 'Add'}
          </button>
        </div>
      </div>
    </Link>
  );
}
