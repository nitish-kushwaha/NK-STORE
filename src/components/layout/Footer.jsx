import { Link } from 'react-router-dom';
import { Globe, ExternalLink, Link2, ShoppingBag } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              NK<span>STORE</span>.
            </Link>
            <p className="footer__tagline">
              Premium digital goods and scalable web solutions for modern creators.
            </p>
            <div className="footer__socials">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="footer__social-btn" aria-label="GitHub">
                <Globe size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer__social-btn" aria-label="Twitter">
                <ExternalLink size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer__social-btn" aria-label="Instagram">
                <Link2 size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="footer__links-group">
            <h4 className="footer__heading">Shop</h4>
            <ul className="footer__links">
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?category=Templates">Templates</Link></li>
              <li><Link to="/products?category=Tools">Tools</Link></li>
              <li><Link to="/products?category=Assets">Assets</Link></li>
            </ul>
          </div>

          <div className="footer__links-group">
            <h4 className="footer__heading">Account</h4>
            <ul className="footer__links">
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Create Account</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
            </ul>
          </div>

          <div className="footer__links-group">
            <h4 className="footer__heading">Support</h4>
            <ul className="footer__links">
              <li><a href="mailto:support@nkstore.in">Contact Us</a></li>
              <li><Link to="/">Privacy Policy</Link></li>
              <li><Link to="/">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} NK STORE. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <ShoppingBag size={13} />
            <span>Built with ❤ by Nitish Kushwaha</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
