import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { items, total, removeFromCart, updateQty, clearCart, itemCount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1 className="section-title" style={{ marginBottom: '3rem' }}>Your Cart</h1>
          <div className="cart-empty">
            <ShoppingBag size={64} strokeWidth={1} style={{ color: 'var(--text-muted)' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '1.5rem' }}>Your cart is empty</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Browse our products and add something you love.
            </p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '2rem' }}>
              <ShoppingBag size={18} /> Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-page__header">
          <h1 className="section-title">Your Cart <span className="gradient-text-blue">({itemCount})</span></h1>
          <button className="btn btn-ghost btn-sm" onClick={clearCart} style={{ color: 'var(--color-error)' }}>
            <X size={15} /> Clear All
          </button>
        </div>

        <div className="cart-page__layout">
          {/* Items */}
          <div className="cart-page__items">
            {items.map((item) => (
              <div key={item.id} className="cart-page-item">
                <Link to={`/products/${item.id}`} className="cart-page-item__img-wrap">
                  <img
                    src={item.imageUrl || `https://picsum.photos/seed/${item.id}/150/120`}
                    alt={item.name}
                    className="cart-page-item__img"
                  />
                </Link>
                <div className="cart-page-item__info">
                  <Link to={`/products/${item.id}`} className="cart-page-item__name">{item.name}</Link>
                  {item.category && <span className="cart-page-item__cat">{item.category}</span>}
                  <div className="cart-page-item__qty">
                    <button
                      className="btn btn-icon btn-ghost cart-qty-btn"
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="cart-qty-display">{item.quantity}</span>
                    <button
                      className="btn btn-icon btn-ghost cart-qty-btn"
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="cart-page-item__right">
                  <span className="cart-page-item__price">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                  <button
                    className="btn btn-icon btn-ghost"
                    onClick={() => removeFromCart(item.id)}
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-page__summary glass-panel">
            <h2 className="cart-summary__title">Order Summary</h2>
            <div className="cart-summary__row">
              <span>Subtotal ({itemCount} items)</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className="cart-summary__row">
              <span>Delivery</span>
              <span style={{ color: 'var(--color-success)' }}>Free</span>
            </div>
            <div className="divider" />
            <div className="cart-summary__row cart-summary__row--total">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem' }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
            <Link to="/products" className="btn btn-secondary" style={{ width: '100%', marginTop: '0.6rem' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
