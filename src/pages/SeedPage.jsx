import { useState } from 'react';
import { seedDemoProducts } from '../services/productService';
import { Database, CheckCircle, Loader } from 'lucide-react';

export default function SeedPage() {
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [msg, setMsg] = useState('');

  const handleSeed = async () => {
    setStatus('loading');
    try {
      await seedDemoProducts();
      setStatus('done');
      setMsg('6 demo products seeded successfully! Visit /products to see them.');
    } catch (err) {
      setStatus('error');
      setMsg(err.message);
    }
  };

  return (
    <div style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '2rem'
    }}>
      <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        <Database size={48} style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Seed Demo Products
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem', lineHeight: 1.7 }}>
          This will add 6 demo products to your Firestore database.
          Only run this once!
        </p>

        {status === 'idle' && (
          <button className="btn btn-primary btn-lg" onClick={handleSeed} style={{ width: '100%' }}>
            <Database size={18} /> Seed Database
          </button>
        )}

        {status === 'loading' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <div className="spinner" />
            <span>Seeding products…</span>
          </div>
        )}

        {status === 'done' && (
          <div>
            <CheckCircle size={40} style={{ color: 'var(--color-success)', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--color-success)', fontWeight: 600 }}>{msg}</p>
            <a href="/products" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
              View Products →
            </a>
          </div>
        )}

        {status === 'error' && (
          <div>
            <p style={{ color: 'var(--color-error)' }}>Error: {msg}</p>
            <button className="btn btn-secondary" onClick={() => setStatus('idle')} style={{ marginTop: '1rem' }}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
