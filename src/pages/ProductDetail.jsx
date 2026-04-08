import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, ArrowLeft, Tag, Check, Zap } from 'lucide-react';
import { getProductById } from '../services/productService';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, isInCart } = useCart();
  const [added, setAdded] = useState(false);

  const inCart = product ? isInCart(product.id) : false;

  useEffect(() => {
    getProductById(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (inCart) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return <div className="page-loader"><div className="spinner" /></div>;
  }

  if (!product) {
    return (
      <div className="pd-not-found">
        <h2>Product not found</h2>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="pd-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="pd-breadcrumb">
          <Link to="/products" className="pd-back">
            <ArrowLeft size={16} /> Back to Products
          </Link>
          {product.category && (
            <>
              <span className="pd-bread-sep">/</span>
              <Link to={`/products?category=${product.category}`} className="pd-bread-link">
                {product.category}
              </Link>
            </>
          )}
        </div>

        <div className="pd-grid">
          {/* Image */}
          <div className="pd-image-wrap">
            <img
              src={product.imageUrl || `https://picsum.photos/seed/${product.id}/700/500`}
              alt={product.name}
              className="pd-image"
            />
            {discountPct && (
              <div className="pd-discount-badge">-{discountPct}% OFF</div>
            )}
          </div>

          {/* Info */}
          <div className="pd-info">
            {product.category && (
              <span className="pd-category">
                <Tag size={12} /> {product.category}
              </span>
            )}

            <h1 className="pd-title">{product.name}</h1>

            {product.rating != null && (
              <div className="pd-rating">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    fill={s <= Math.round(product.rating) ? '#fbbf24' : 'none'}
                    stroke={s <= Math.round(product.rating) ? '#fbbf24' : 'var(--text-muted)'}
                  />
                ))}
                <span className="pd-rating-num">{product.rating.toFixed(1)}</span>
                {product.reviewCount != null && (
                  <span className="pd-rating-count">({product.reviewCount} reviews)</span>
                )}
              </div>
            )}

            <p className="pd-description">{product.description}</p>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="pd-tags">
                {product.tags.map((t) => (
                  <span key={t} className="badge badge-blue" style={{ letterSpacing: 'normal', textTransform: 'none' }}>
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="pd-price-row">
              <span className="pd-price">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="pd-original">₹{product.originalPrice.toLocaleString()}</span>
              )}
              {discountPct && (
                <span className="badge badge-green" style={{ marginLeft: '0.5rem' }}>
                  Save {discountPct}%
                </span>
              )}
            </div>

            <div className="pd-actions">
              <button
                id="add-to-cart-btn"
                className={`btn btn-lg ${added || inCart ? 'pd-btn-added' : 'btn-primary'}`}
                onClick={handleAdd}
                style={{ flex: 1 }}
              >
                {added || inCart ? (
                  <><Check size={20} /> {inCart && !added ? 'In Cart' : 'Added to Cart!'}</>
                ) : (
                  <><ShoppingCart size={20} /> Add to Cart</>
                )}
              </button>
              <Link to="/checkout" className="btn btn-secondary btn-lg" style={{ flex: 1 }} onClick={() => { if (!inCart) addToCart(product); }}>
                <Zap size={18} /> Buy Now
              </Link>
            </div>

            {/* Trust badges */}
            <div className="pd-trust">
              {['Instant Delivery', 'Secure Payment', 'Lifetime Access'].map((t) => (
                <div key={t} className="pd-trust-item">
                  <Check size={13} style={{ color: 'var(--color-success)' }} />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
