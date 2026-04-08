import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { getProducts } from '../services/productService';
import './Products.css';

const CATEGORIES = ['All', 'Templates', 'Tools', 'Assets'];
const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('newest');
  const [sortOpen, setSortOpen] = useState(false);

  // Fetch all products once
  useEffect(() => {
    getProducts()
      .then((data) => {
        setAllProducts(data);
        setLoading(false);
      });
  }, []);

  // Filter + sort whenever deps change
  const applyFilters = useCallback(() => {
    let result = [...allProducts];

    // Category
    if (category && category !== 'All') {
      result = result.filter((p) => p.category === category);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

    setFiltered(result);
  }, [allProducts, category, search, sort]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Sync URL params
  useEffect(() => {
    const params = {};
    if (search) params.q = search;
    if (category && category !== 'All') params.category = category;
    setSearchParams(params, { replace: true });
  }, [search, category, setSearchParams]);

  const clearSearch = () => setSearch('');
  const resetFilters = () => { setSearch(''); setCategory('All'); setSort('newest'); };

  return (
    <div className="products-page">
      <div className="container">
        {/* Header */}
        <div className="products-page__header">
          <div>
            <h1 className="section-title">
              {category !== 'All' ? category : 'All'}{' '}
              <span className="gradient-text-blue">Products</span>
            </h1>
            <p className="section-subtitle" style={{ marginTop: '0.4rem' }}>
              {loading ? 'Loading…' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="products-page__toolbar">
          {/* Search */}
          <div className="products-page__search">
            <Search size={17} className="products-page__search-icon" />
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="products-page__search-input"
              id="product-search"
            />
            {search && (
              <button className="btn btn-icon btn-ghost" style={{ padding: '0.3rem' }} onClick={clearSearch}>
                <X size={15} />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="products-page__cats">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`products-page__cat-btn ${category === c ? 'products-page__cat-btn--active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="products-page__sort" onClick={() => setSortOpen((v) => !v)}>
            <SlidersHorizontal size={15} />
            <span>{SORT_OPTIONS.find((s) => s.value === sort)?.label}</span>
            <ChevronDown size={14} />
            {sortOpen && (
              <div className="products-page__sort-dropdown">
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    className={`products-page__sort-item ${sort === o.value ? 'products-page__sort-item--active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setSort(o.value); setSortOpen(false); }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {(search || category !== 'All') && (
          <div className="products-page__active-filters">
            {search && (
              <span className="badge badge-blue">
                Search: "{search}" <button onClick={clearSearch} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', display: 'inline-flex' }}><X size={11} /></button>
              </span>
            )}
            {category !== 'All' && (
              <span className="badge badge-blue">
                {category} <button onClick={() => setCategory('All')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', display: 'inline-flex' }}><X size={11} /></button>
              </span>
            )}
            <button className="btn btn-ghost btn-sm" onClick={resetFilters}>Clear All</button>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="products-page__empty">
            <Search size={48} strokeWidth={1} />
            <h3>No products found</h3>
            <p>Try adjusting your search or filter.</p>
            <button className="btn btn-secondary btn-sm" onClick={resetFilters}>Reset Filters</button>
          </div>
        ) : (
          <div className="grid-products">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
