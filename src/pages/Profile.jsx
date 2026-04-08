import { useAuth } from '../context/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Package, LogOut, ShoppingBag } from 'lucide-react';
import './Profile.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <p>Please <Link to="/login" style={{ color: 'var(--accent-primary)' }}>sign in</Link> to view your profile.</p>
      </div>
    );
  }

  const joinDate = user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })
    : '—';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: '2.5rem' }}>My Profile</h1>

        <div className="profile-layout">
          {/* Avatar Card */}
          <div className="profile-avatar-card glass-panel">
            <div className="profile-avatar">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="profile-avatar__img" />
              ) : (
                <div className="profile-avatar__fallback">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
            </div>
            <h2 className="profile-name">{user.displayName || '—'}</h2>
            <p className="profile-email">{user.email}</p>
            <div className="profile-badge">{user.profile?.role === 'admin' ? '👑 Admin' : '🎉 Member'}</div>

            <div className="divider" />

            <div className="profile-quick-links">
              <Link to="/orders" className="profile-quick-link">
                <Package size={18} /> My Orders
              </Link>
              <Link to="/products" className="profile-quick-link">
                <ShoppingBag size={18} /> Browse Products
              </Link>
              <button className="profile-quick-link profile-quick-link--danger" onClick={handleLogout}>
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="profile-info">
            <div className="profile-section glass-panel">
              <h3 className="profile-section-title">Account Details</h3>
              <div className="profile-fields">
                <div className="profile-field">
                  <User size={16} />
                  <div>
                    <span className="profile-field-label">Display Name</span>
                    <span className="profile-field-val">{user.displayName || 'Not set'}</span>
                  </div>
                </div>
                <div className="profile-field">
                  <Mail size={16} />
                  <div>
                    <span className="profile-field-label">Email</span>
                    <span className="profile-field-val">{user.email}</span>
                  </div>
                </div>
                <div className="profile-field">
                  <Calendar size={16} />
                  <div>
                    <span className="profile-field-label">Member Since</span>
                    <span className="profile-field-val">{joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
