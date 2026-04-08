import { useEffect, useState } from 'react';
import { NavLink, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  ChevronRight, LogOut, X, Menu, Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const ADMIN_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, exact: true },
  { to: '/admin/products', label: 'Products', icon: <Package size={18} /> },
  { to: '/admin/orders', label: 'Orders', icon: <ShoppingCart size={18} /> },
  { to: '/admin/users', label: 'Users', icon: <Users size={18} /> },
];

export default function AdminLayout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (!isAdmin) { navigate('/'); }
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="admin-shell">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__brand">
            <Shield size={20} style={{ color: 'var(--accent-primary)' }} />
            <span>NK<span style={{ color: 'var(--accent-primary)' }}>ADMIN</span></span>
          </div>
          <button
            className="btn btn-icon btn-ghost admin-sidebar__close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="admin-nav">
          {ADMIN_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.exact}
              className={({ isActive }) =>
                `admin-nav__link ${isActive ? 'admin-nav__link--active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              {l.icon}
              <span>{l.label}</span>
              <ChevronRight size={14} className="admin-nav__arrow" />
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-user">
            <div className="admin-user__avatar">
              {user.photoURL
                ? <img src={user.photoURL} alt="" />
                : (user.displayName || 'A')[0].toUpperCase()
              }
            </div>
            <div className="admin-user__info">
              <span className="admin-user__name">{user.displayName || 'Admin'}</span>
              <span className="admin-user__role">Store Admin</span>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm admin-logout" onClick={handleLogout}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <button
            className="btn btn-icon btn-ghost admin-topbar__menu"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="admin-topbar__right">
            <span className="badge badge-blue">
              <Shield size={11} /> Admin Mode
            </span>
            <a href="/" target="_blank" className="btn btn-secondary btn-sm" rel="noreferrer">
              View Store ↗
            </a>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}
