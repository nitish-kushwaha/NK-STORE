import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './CartDrawer.css';

export default function CartDrawer({ open, onClose }) {
  const { items, total, removeFromCart, updateQty, itemCount } = useCart();
  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${open ? 'cart-overlay--visible' : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className={`cart-drawer ${open ? 'cart-drawer--open' : ''}`}>
        {/* Header */}
        <div className="cart-drawer__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} />
            <h2 className="cart-drawer__title">Your Cart</h2>
            {itemCount > 0 && <span className="badge badge-blue">{itemCount}</span>}
          </div>
          <button className="btn btn-icon btn-ghost" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <ShoppingBag size={52} strokeWidth={1} style={{ color: 'var(--text-muted)' }} />
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontWeight: 500 }}>
              Your cart is empty
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.4rem' }}>
              Explore our products and add something you love!
            </p>
            <Link to="/products" className="btn btn-primary btn-sm" style={{ marginTop: '1.5rem' }} onClick={onClose}>
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item__img-wrap">
                    <img
                      src={item.imageUrl || '/placeholder.png'}
                      alt={item.name}
                      className="cart-item__img"
                    />
                  </div>
                  <div className="cart-item__info">
                    <p className="cart-item__name">{item.name}</p>
                    <p className="cart-item__price">₹{(item.price * item.quantity).toLocaleString()}</p>
                    <div className="cart-item__qty">
                      <button
                        className="btn btn-icon btn-ghost cart-item__qty-btn"
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="cart-item__qty-display">{item.quantity}</span>
                      <button
                        className="btn btn-icon btn-ghost cart-item__qty-btn"
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button
                    className="btn btn-icon btn-ghost cart-item__remove"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="cart-drawer__footer">
              <div className="cart-drawer__summary">
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>
                  ₹{total.toLocaleString()}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Taxes and shipping calculated at checkout
              </p>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleCheckout}>
                Checkout <ArrowRight size={18} />
              </button>
              <Link
                to="/cart"
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: '0.6rem' }}
                onClick={onClose}
              >
                View Full Cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
