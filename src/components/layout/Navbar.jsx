import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, LogOut, Package, ChevronDown, Shield } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/useAuth';
import CartDrawer from './CartDrawer';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const { itemCount } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const userRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQ.trim())}`);
      setSearchQ('');
      setSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home', exact: true },
    { to: '/products', label: 'Products' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="container navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            NK<span className="navbar__logo-accent">STORE</span>
            <span className="navbar__logo-dot">.</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="navbar__links desktop-only">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.exact}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="navbar__actions desktop-only">
            {/* Search */}
            <div className={`navbar__search ${searchOpen ? 'navbar__search--open' : ''}`}>
              {searchOpen ? (
                <form onSubmit={handleSearch} className="navbar__search-form">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search products…"
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    className="navbar__search-input"
                  />
                  <button type="button" onClick={() => setSearchOpen(false)} className="btn btn-icon btn-ghost">
                    <X size={18} />
                  </button>
                </form>
              ) : (
                <button className="btn btn-icon btn-ghost" onClick={() => setSearchOpen(true)} aria-label="Search">
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Cart */}
            <button
              id="cart-btn"
              className="btn btn-icon btn-ghost navbar__cart-btn"
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="navbar__cart-badge">{itemCount > 99 ? '99+' : itemCount}</span>
              )}
            </button>

            {/* User */}
            {user ? (
              <div className="navbar__user" ref={userRef}>
                <button
                  className="navbar__user-btn"
                  onClick={() => setUserOpen((v) => !v)}
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="navbar__avatar" />
                  ) : (
                    <div className="navbar__avatar navbar__avatar--fallback">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="navbar__user-name">
                    {user.displayName?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown size={14} className={userOpen ? 'rotate-180' : ''} />
                </button>

                {userOpen && (
                  <div className="navbar__dropdown">
                    <Link to="/profile" className="navbar__dropdown-item" onClick={() => setUserOpen(false)}>
                      <User size={15} /> Profile
                    </Link>
                    <Link to="/orders" className="navbar__dropdown-item" onClick={() => setUserOpen(false)}>
                      <Package size={15} /> My Orders
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="navbar__dropdown-item navbar__dropdown-item--admin" onClick={() => setUserOpen(false)}>
                        <Shield size={15} /> Admin Panel
                      </Link>
                    )}
                    <div className="navbar__dropdown-divider" />
                    <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleLogout}>
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="navbar__mobile-actions mobile-only" style={{ gap: '0.5rem', alignItems: 'center' }}>
            <button
              className="btn btn-icon btn-ghost navbar__cart-btn"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && <span className="navbar__cart-badge">{itemCount}</span>}
            </button>
            <button
              className="btn btn-icon btn-ghost"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="navbar__mobile-menu">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="navbar__mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="navbar__dropdown-divider" />
            {user ? (
              <>
                <Link to="/profile" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>
                  <User size={16} /> Profile
                </Link>
                <Link to="/orders" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>
                  <Package size={16} /> My Orders
                </Link>
                <button className="navbar__mobile-link" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
            )}
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
