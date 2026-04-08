import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, User, Phone, CheckCircle, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/orderService';
import './Checkout.css';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: user?.displayName || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
  });

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    try {
      await placeOrder(user.uid, items, total, form);
      clearCart();
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="checkout-success">
        <div className="checkout-success__card glass-panel">
          <div className="checkout-success__icon">
            <CheckCircle size={52} style={{ color: 'var(--color-success)' }} />
          </div>
          <h1 className="checkout-success__title">Order Placed! 🎉</h1>
          <p className="checkout-success__sub">
            Thank you for your purchase. Your digital products will be available shortly.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/orders" className="btn btn-primary">
              <ShoppingBag size={18} /> View My Orders
            </Link>
            <Link to="/products" className="btn btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <ShoppingBag size={56} strokeWidth={1} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h2>Your cart is empty</h2>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Browse Products</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <Link to="/cart" className="checkout-back">
          <ArrowLeft size={16} /> Back to Cart
        </Link>
        <h1 className="section-title" style={{ marginBottom: '2rem' }}>
          Checkout
        </h1>

        <div className="checkout-layout">
          {/* Form */}
          <form onSubmit={handleSubmit} id="checkout-form" className="checkout-form">
            <div className="checkout-section">
              <h2 className="checkout-section-title">
                <User size={18} /> Contact Information
              </h2>
              <div className="checkout-fields">
                <div className="form-group">
                  <label className="form-label" htmlFor="co-name">Full Name</label>
                  <input id="co-name" className="form-input" placeholder="Your name" value={form.name} onChange={set('name')} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="co-phone">Phone</label>
                  <input id="co-phone" className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={set('phone')} required />
                </div>
              </div>
            </div>

            <div className="checkout-section">
              <h2 className="checkout-section-title">
                <MapPin size={18} /> Shipping Address
              </h2>
              <div className="checkout-fields">
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label" htmlFor="co-addr">Street Address</label>
                  <input id="co-addr" className="form-input" placeholder="Flat, Street, Area" value={form.address} onChange={set('address')} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="co-city">City</label>
                  <input id="co-city" className="form-input" placeholder="Mumbai" value={form.city} onChange={set('city')} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="co-pin">Pincode</label>
                  <input id="co-pin" className="form-input" placeholder="400001" value={form.pincode} onChange={set('pincode')} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="co-state">State</label>
                  <input id="co-state" className="form-input" placeholder="Maharashtra" value={form.state} onChange={set('state')} required />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }} id="place-order-btn">
              {loading ? 'Placing Order…' : `Place Order • ₹${total.toLocaleString()}`}
            </button>
          </form>

          {/* Summary */}
          <div className="checkout-summary glass-panel">
            <h2 className="checkout-summary-title">Order Summary</h2>
            <div className="checkout-summary-items">
              {items.map((item) => (
                <div key={item.id} className="checkout-summary-item">
                  <div className="checkout-summary-item__img">
                    <img
                      src={item.imageUrl || `https://picsum.photos/seed/${item.id}/80/60`}
                      alt={item.name}
                    />
                    <span className="checkout-summary-item__qty">{item.quantity}</span>
                  </div>
                  <span className="checkout-summary-item__name" title={item.name}>{item.name}</span>
                  <span className="checkout-summary-item__price">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="divider" />
            <div className="checkout-summary-row">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className="checkout-summary-row">
              <span>Delivery</span>
              <span style={{ color: 'var(--color-success)' }}>Free</span>
            </div>
            <div className="divider" />
            <div className="checkout-summary-row checkout-summary-row--total">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
