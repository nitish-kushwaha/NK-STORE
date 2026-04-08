import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Plus, Edit2, Trash2, Search, X, ArrowLeft,
  Package, Star, Tag, Save, Image
} from 'lucide-react';
import {
  getProducts, createProduct, updateProduct, deleteProduct
} from '../../services/productService';
import './AdminProducts.css';

/* ────────── Products List ────────── */
export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    const data = await getProducts({});
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-products">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-sub">{products.length} products in your store</p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary">
          <Plus size={18} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="admin-search-bar">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
        />
        {search && (
          <button className="btn btn-icon btn-ghost" onClick={() => setSearch('')}>
            <X size={14} />
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">No products found. <Link to="/admin/products/new">Add one →</Link></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Featured</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="admin-product-cell">
                      <img
                        src={p.imageUrl || `https://picsum.photos/seed/${p.id}/48/36`}
                        alt={p.name}
                        className="admin-product-img"
                      />
                      <span className="admin-product-name">{p.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-blue">{p.category}</span>
                  </td>
                  <td>
                    <strong>₹{p.price?.toLocaleString()}</strong>
                    {p.originalPrice && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                        was ₹{p.originalPrice?.toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Star size={13} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                      {p.rating || '—'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${p.featured ? 'badge-green' : 'badge-gray'}`}>
                      {p.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button
                        className="btn btn-icon btn-ghost btn-sm"
                        onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                        title="Edit"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="btn btn-icon btn-ghost btn-sm admin-delete-btn"
                        onClick={() => handleDelete(p.id, p.name)}
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ────────── Product Form (Add / Edit) ────────── */
const EMPTY = {
  name: '', category: 'Templates', price: '', originalPrice: '',
  description: '', imageUrl: '', tags: '', featured: false,
  rating: '', reviewCount: '', stock: 99,
};

export function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    import('../../services/productService').then(({ getProductById }) => {
      getProductById(id).then((p) => {
        if (p) {
          setForm({
            ...EMPTY,
            ...p,
            tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
          });
        }
        setLoading(false);
      });
    });
  }, [id, isEdit]);

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.price) { setError('Name and Price are required.'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        rating: form.rating ? Number(form.rating) : null,
        reviewCount: form.reviewCount ? Number(form.reviewCount) : 0,
        stock: Number(form.stock) || 99,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      if (isEdit && !id.startsWith('demo-')) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}><div className="spinner" /></div>;

  return (
    <div className="admin-product-form">
      <div className="admin-page-header">
        <div>
          <Link to="/admin/products" className="admin-back-link">
            <ArrowLeft size={15} /> Back to Products
          </Link>
          <h1 className="admin-page-title">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form-grid">
        {/* Left Column */}
        <div className="admin-form-col">
          <div className="admin-form-section">
            <h3 className="admin-form-section-title"><Package size={16} /> Basic Info</h3>
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input className="form-input" placeholder="e.g. React Dashboard UI Kit" value={form.name} onChange={set('name')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={4} placeholder="Describe your product..." value={form.description} onChange={set('description')} />
            </div>
            <div className="admin-form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" value={form.category} onChange={set('category')}>
                  <option>Templates</option>
                  <option>Tools</option>
                  <option>Assets</option>
                  <option>Courses</option>
                  <option>Plugins</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma-separated)</label>
                <input className="form-input" placeholder="react, ui, dark-mode" value={form.tags} onChange={set('tags')} />
              </div>
            </div>
          </div>

          <div className="admin-form-section">
            <h3 className="admin-form-section-title"><Tag size={16} /> Pricing</h3>
            <div className="admin-form-row">
              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input className="form-input" type="number" placeholder="1299" value={form.price} onChange={set('price')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Original Price (₹)</label>
                <input className="form-input" type="number" placeholder="2499" value={form.originalPrice} onChange={set('originalPrice')} />
              </div>
            </div>
            <div className="admin-form-row">
              <div className="form-group">
                <label className="form-label">Stock</label>
                <input className="form-input" type="number" placeholder="99" value={form.stock} onChange={set('stock')} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="admin-form-col">
          <div className="admin-form-section">
            <h3 className="admin-form-section-title"><Image size={16} /> Media</h3>
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input className="form-input" placeholder="https://..." value={form.imageUrl} onChange={set('imageUrl')} />
            </div>
            {form.imageUrl && (
              <div className="admin-img-preview">
                <img src={form.imageUrl} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </div>

          <div className="admin-form-section">
            <h3 className="admin-form-section-title"><Star size={16} /> Reviews</h3>
            <div className="admin-form-row">
              <div className="form-group">
                <label className="form-label">Rating (0–5)</label>
                <input className="form-input" type="number" step="0.1" min="0" max="5" placeholder="4.8" value={form.rating} onChange={set('rating')} />
              </div>
              <div className="form-group">
                <label className="form-label">Review Count</label>
                <input className="form-input" type="number" placeholder="124" value={form.reviewCount} onChange={set('reviewCount')} />
              </div>
            </div>
          </div>

          <div className="admin-form-section">
            <label className="admin-checkbox-label">
              <input type="checkbox" checked={form.featured} onChange={set('featured')} className="admin-checkbox" />
              <span>Feature this product on the home page</span>
            </label>
          </div>

          {error && <p className="admin-error">{error}</p>}

          <button type="submit" className="btn btn-primary btn-lg" disabled={saving} style={{ width: '100%' }}>
            <Save size={18} />
            {saving ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
