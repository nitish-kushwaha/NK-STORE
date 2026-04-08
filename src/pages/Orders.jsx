import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { getUserOrders } from '../services/orderService';
import './Orders.css';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    icon: <Clock size={14} />,        cls: 'badge-orange' },
  processing: { label: 'Processing', icon: <Clock size={14} />,        cls: 'badge-blue' },
  completed:  { label: 'Completed',  icon: <CheckCircle size={14} />,  cls: 'badge-green' },
  cancelled:  { label: 'Cancelled',  icon: <XCircle size={14} />,      cls: 'badge-red' },
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getUserOrders(user.uid)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return <div className="page-loader" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>My Orders</h1>
        <p className="section-subtitle" style={{ marginBottom: '2.5rem' }}>
          Track and manage your purchases
        </p>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <Package size={60} strokeWidth={1} />
            <h2>No orders yet</h2>
            <p>You haven't placed any orders. Start shopping now!</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              <ShoppingBag size={18} /> Browse Products
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const date = order.createdAt?.toDate?.() ?? new Date();
              return (
                <div key={order.id} className="order-card">
                  <div className="order-card__header">
                    <div>
                      <p className="order-card__id">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="order-card__date">{date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <span className={`badge ${sc.cls}`}>
                      {sc.icon} {sc.label}
                    </span>
                  </div>

                  <div className="order-card__items">
                    {order.items?.slice(0, 3).map((item) => (
                      <div key={item.id} className="order-item-preview">
                        <img
                          src={item.imageUrl || `https://picsum.photos/seed/${item.id}/60/45`}
                          alt={item.name}
                          className="order-item-preview__img"
                        />
                        <span className="order-item-preview__name">{item.name}</span>
                        <span className="order-item-preview__qty">×{item.quantity}</span>
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <div className="order-item-more">+{order.items.length - 3} more</div>
                    )}
                  </div>

                  <div className="order-card__footer">
                    <span className="order-card__total">
                      Total: <strong>₹{order.total?.toLocaleString()}</strong>
                    </span>
                    <Link to="/orders" className="btn btn-ghost btn-sm">
                      View Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
