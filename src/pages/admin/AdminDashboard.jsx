import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, ShoppingCart, TrendingUp, Users,
  ArrowUpRight, Clock, CheckCircle
} from 'lucide-react';
import { getProducts } from '../../services/productService';
import { getAllOrders } from '../../services/orderService';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [products, orders] = await Promise.all([
        getProducts({}),
        getAllOrders(),
      ]);
      const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
      const pending = orders.filter((o) => o.status === 'pending').length;
      setStats({ products: products.length, orders: orders.length, revenue, pending });
      setRecentOrders(orders.slice(0, 5));
      setLoading(false);
    }
    load();
  }, []);

  const STAT_CARDS = [
    {
      label: 'Total Products',
      value: stats.products,
      icon: <Package size={22} />,
      color: 'blue',
      link: '/admin/products',
    },
    {
      label: 'Total Orders',
      value: stats.orders,
      icon: <ShoppingCart size={22} />,
      color: 'purple',
      link: '/admin/orders',
    },
    {
      label: 'Total Revenue',
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: <TrendingUp size={22} />,
      color: 'green',
      link: '/admin/orders',
    },
    {
      label: 'Pending Orders',
      value: stats.pending,
      icon: <Clock size={22} />,
      color: 'orange',
      link: '/admin/orders',
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-sub">Welcome back, boss. Here's your store at a glance.</p>
      </div>

      {/* Stat Cards */}
      <div className="admin-stats-grid">
        {STAT_CARDS.map((s) => (
          <Link key={s.label} to={s.link} className={`admin-stat-card admin-stat-card--${s.color}`}>
            <div className="admin-stat-card__icon">{s.icon}</div>
            <div>
              <p className="admin-stat-card__label">{s.label}</p>
              <p className="admin-stat-card__value">{s.value}</p>
            </div>
            <ArrowUpRight size={16} className="admin-stat-card__arrow" />
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="admin-quick">
        <h2 className="admin-section-title">Quick Actions</h2>
        <div className="admin-quick-grid">
          <Link to="/admin/products/new" className="btn btn-primary">
            <Package size={16} /> Add Product
          </Link>
          <Link to="/admin/orders" className="btn btn-secondary">
            <ShoppingCart size={16} /> View Orders
          </Link>
          <Link to="/admin/users" className="btn btn-secondary">
            <Users size={16} /> View Users
          </Link>
          <a href="/seed" className="btn btn-ghost" style={{ color: 'var(--text-muted)' }}>
            🌱 Seed Data
          </a>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="admin-recent">
        <div className="admin-section-header">
          <h2 className="admin-section-title">Recent Orders</h2>
          <Link to="/admin/orders" className="btn btn-ghost btn-sm">View All →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="admin-empty">No orders yet.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td><span className="mono">#{o.id.slice(0, 8).toUpperCase()}</span></td>
                    <td>{o.address?.name || o.userId?.slice(0, 8) || '—'}</td>
                    <td>{o.items?.length || 0} items</td>
                    <td><strong>₹{o.total?.toLocaleString()}</strong></td>
                    <td>
                      <span className={`badge badge-${o.status === 'completed' ? 'green' : o.status === 'cancelled' ? 'red' : 'orange'}`}>
                        {o.status || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
