import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Zap, Shield, Headphones } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { getProducts } from '../services/productService';
import './Home.css';

const FEATURES = [
  { icon: <Zap size={24} />, title: 'Instant Delivery', desc: 'All digital products delivered immediately after purchase.' },
  { icon: <Shield size={24} />, title: 'Secure & Safe', desc: 'Bank-grade security protects every transaction.' },
  { icon: <Headphones size={24} />, title: '24/7 Support', desc: 'Our team is always here to help you succeed.' },
];

const CATEGORIES = [
  { label: 'Templates', emoji: '🖥️', desc: 'Ready-to-use project starters', filter: 'Templates' },
  { label: 'Tools', emoji: '🔧', desc: 'Developer tools & utilities', filter: 'Tools' },
  { label: 'Assets', emoji: '🎨', desc: 'Icons, animations & design assets', filter: 'Assets' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ featured: true, limit: 6 })
      .then(setFeatured)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* ===== HERO ===== */}
      <section className="hero">
        {/* Glow orbs */}
        <div className="hero__glow hero__glow--1" />
        <div className="hero__glow hero__glow--2" />

        <div className="container hero__content">
          <div className="hero__badge animate-fade-up">
            <Zap size={13} />
            <span>The #1 Digital Goods Store</span>
          </div>

          <h1 className="hero__title animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Premium Digital<br />
            <span className="gradient-text">Products & Assets</span>
          </h1>

          <p className="hero__subtitle animate-fade-up" style={{ animationDelay: '0.2s' }}>
            From UI kits to SaaS boilerplates — everything modern creators<br className="br-desktop" /> need to
            build fast and ship with confidence.
          </p>

          <div className="hero__actions animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/products" className="btn btn-primary btn-lg">
              <ShoppingBag size={20} />
              Browse Products
            </Link>
            <a href="#featured" className="btn btn-secondary btn-lg">
              See What's Hot <ArrowRight size={18} />
            </a>
          </div>

          {/* Stats */}
          <div className="hero__stats animate-fade-up" style={{ animationDelay: '0.4s' }}>
            {[
              { value: '500+', label: 'Digital Products' },
              { value: '12K+', label: 'Happy Customers' },
              { value: '4.9★', label: 'Average Rating' },
            ].map((s) => (
              <div key={s.label} className="hero__stat">
                <span className="hero__stat-value">{s.value}</span>
                <span className="hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="section-sm">
        <div className="container">
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card glass-panel">
                <div className="feature-card__icon">{f.icon}</div>
                <div>
                  <h3 className="feature-card__title">{f.title}</h3>
                  <p className="feature-card__desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="section-sm">
        <div className="container">
          <div style={{ marginBottom: '2rem' }}>
            <h2 className="section-title">Browse <span className="gradient-text-blue">Categories</span></h2>
            <p className="section-subtitle" style={{ marginTop: '0.5rem' }}>
              Curated collections for every kind of builder.
            </p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((c) => (
              <Link key={c.label} to={`/products?category=${c.filter}`} className="category-card glass-panel">
                <span className="category-card__emoji">{c.emoji}</span>
                <h3 className="category-card__label">{c.label}</h3>
                <p className="category-card__desc">{c.desc}</p>
                <span className="category-card__arrow">
                  <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED ===== */}
      <section className="section" id="featured">
        <div className="container">
          <div className="home__section-head">
            <div>
              <h2 className="section-title">Featured <span className="gradient-text-blue">Products</span></h2>
              <p className="section-subtitle" style={{ marginTop: '0.5rem' }}>
                Hand-picked premium products loved by our community.
              </p>
            </div>
            <Link to="/products" className="btn btn-secondary">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="page-loader">
              <div className="spinner" />
            </div>
          ) : featured.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              No featured products yet. Check back soon!
            </div>
          ) : (
            <div className="grid-products">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="section-sm">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-banner__glow" />
            <div className="cta-banner__content">
              <h2 className="cta-banner__title">Ready to level up your projects?</h2>
              <p className="cta-banner__sub">Join 12,000+ creators who trust NK STORE for premium digital goods.</p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started Free
                </Link>
                <Link to="/products" className="btn btn-secondary btn-lg">
                  Explore Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
