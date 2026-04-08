import { useEffect, useState } from 'react';
import { CheckCircle, Clock, XCircle, Search, X, Eye } from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import './AdminOrders.css';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    cls: 'badge-orange', icon: <Clock size={12} /> },
  processing: { label: 'Processing', cls: 'badge-blue',   icon: <Clock size={12} /> },
  completed:  { label: 'Completed',  cls: 'badge-green',  icon: <CheckCircle size={12} /> },
  cancelled:  { label: 'Cancelled',  cls: 'badge-red',    icon: <XCircle size={12} /> },
};

const ALL_STATUSES = ['pending', 'processing', 'completed', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o)
      );
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id?.toLowerCase().includes(search.toLowerCase()) ||
      o.address?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.userId?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '4rem' }}><div className="spinner" /></div>
  );

  return (
    <div className="admin-orders">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p className="admin-page-sub">{orders.length} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-orders-filters">
        <div className="admin-search-bar" style={{ flex: 1, marginBottom: 0 }}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by order ID, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-input"
          />
          {search && <button className="btn btn-icon btn-ghost" onClick={() => setSearch('')}><X size={14} /></button>}
        </div>
        <div className="admin-status-filter">
          {['all', ...ALL_STATUSES].map((s) => (
            <button
              key={s}
              className={`admin-filter-btn ${statusFilter === s ? 'admin-filter-btn--active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty">No orders found.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                const date = order.createdAt?.toDate?.() ?? new Date();
                const isExpanded = expandedId === order.id;
                return (
                  <>
                    <tr key={order.id} className={isExpanded ? 'admin-table-row--expanded' : ''}>
                      <td><span className="mono">#{order.id.slice(0, 8).toUpperCase()}</span></td>
                      <td>
                        <div>
                          <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                            {order.address?.name || 'Guest'}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {order.address?.city}, {order.address?.state}
                          </p>
                        </div>
                      </td>
                      <td>{order.items?.length || 0} items</td>
                      <td><strong>₹{order.total?.toLocaleString()}</strong></td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td>
                        <select
                          className="admin-status-select"
                          value={order.status || 'pending'}
                          onChange={(e) => handleStatus(order.id, e.target.value)}
                          disabled={updating === order.id}
                          style={{ borderColor: 'transparent' }}
                        >
                          {ALL_STATUSES.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button
                            className="btn btn-icon btn-ghost btn-sm"
                            onClick={() => setExpandedId(isExpanded ? null : order.id)}
                            title="View details"
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${order.id}-expanded`} className="admin-order-detail-row">
                        <td colSpan={7}>
                          <div className="admin-order-detail">
                            <div className="admin-order-detail__section">
                              <p className="admin-order-detail__label">Shipping Address</p>
                              <p>{order.address?.address}, {order.address?.city},<br />
                                {order.address?.state} – {order.address?.pincode}</p>
                              <p>📞 {order.address?.phone}</p>
                            </div>
                            <div className="admin-order-detail__section">
                              <p className="admin-order-detail__label">Items Ordered</p>
                              {order.items?.map((item, i) => (
                                <div key={i} className="admin-order-item">
                                  <img
                                    src={item.imageUrl || `https://picsum.photos/seed/${item.id}/40/30`}
                                    alt={item.name}
                                    className="admin-order-item-img"
                                  />
                                  <span>{item.name}</span>
                                  <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>
                                    ×{item.quantity} = ₹{(item.price * item.quantity).toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
