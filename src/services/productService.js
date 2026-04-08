import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION = 'products';

// Seed demo products (call once from admin or dev mode)
export const DEMO_PRODUCTS = [
  {
    name: 'React Dashboard UI Kit',
    description: 'A comprehensive React UI kit with 50+ components, dark/light themes, and full Figma source included.',
    price: 1299,
    originalPrice: 2499,
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    category: 'Templates',
    stock: 999,
    featured: true,
    rating: 4.8,
    reviewCount: 124,
    tags: ['react', 'ui', 'dashboard'],
  },
  {
    name: 'Next.js SaaS Boilerplate',
    description: 'Production-ready Next.js boilerplate with Auth, Stripe, Prisma, and Tailwind pre-configured.',
    price: 2999,
    originalPrice: 4999,
    imageUrl: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&q=80',
    category: 'Templates',
    stock: 999,
    featured: true,
    rating: 4.9,
    reviewCount: 87,
    tags: ['nextjs', 'saas', 'boilerplate'],
  },
  {
    name: 'Premium Icon Pack (500+)',
    description: '500+ handcrafted SVG icons in 4 styles. Compatible with React, Vue, and plain HTML.',
    price: 499,
    originalPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
    category: 'Assets',
    stock: 999,
    featured: false,
    rating: 4.6,
    reviewCount: 213,
    tags: ['icons', 'svg', 'assets'],
  },
  {
    name: 'E-commerce Figma Template',
    description: 'Full e-commerce design system in Figma with 80+ screens, dark mode, and auto-layout.',
    price: 899,
    originalPrice: 1499,
    imageUrl: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=600&q=80',
    category: 'Templates',
    stock: 999,
    featured: false,
    rating: 4.7,
    reviewCount: 56,
    tags: ['figma', 'ecommerce', 'design'],
  },
  {
    name: 'Node.js REST API Starter',
    description: 'Express + TypeScript REST API template with JWT auth, rate limiting, and Swagger docs.',
    price: 799,
    originalPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
    category: 'Tools',
    stock: 999,
    featured: false,
    rating: 4.5,
    reviewCount: 39,
    tags: ['nodejs', 'api', 'express'],
  },
  {
    name: 'CSS Animations Library',
    description: '200+ ready-to-use CSS animations. Copy-paste into any project. No dependencies.',
    price: 299,
    originalPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600&q=80',
    category: 'Assets',
    stock: 999,
    featured: true,
    rating: 4.4,
    reviewCount: 178,
    tags: ['css', 'animations', 'frontend'],
  },
];

// ---- Queries ----

// Helper: add a timeout to any promise
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);
}

export async function getProducts(filters = {}) {
  try {
    let q = collection(db, COLLECTION);
    const constraints = [];

    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }
    if (filters.featured) {
      constraints.push(where('featured', '==', true));
    }
    // ⚠️ No orderBy here — Firestore requires a composite index when
    // combining where() + orderBy(). Sort in-memory instead.

    q = query(q, ...constraints);
    const snap = await withTimeout(getDocs(q), 6000);
    let results = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Sort newest-first in memory (no index needed)
    results.sort((a, b) => {
      const aTime = a.createdAt?.seconds ?? 0;
      const bTime = b.createdAt?.seconds ?? 0;
      return bTime - aTime;
    });

    if (filters.limit) results = results.slice(0, filters.limit);

    // If Firestore is empty, fall back to demo data
    if (results.length === 0) {
      return buildDemoFallback(filters);
    }

    return results;
  } catch (err) {
    // On any failure (permissions, timeout, missing index) — use demo data
    console.warn('Firestore unavailable, using demo data:', err.message);
    return buildDemoFallback(filters);
  }
}

function buildDemoFallback(filters) {
  let data = DEMO_PRODUCTS.map((p, i) => ({
    ...p,
    id: `demo-${i}`,
    createdAt: { seconds: Date.now() / 1000 - i * 1000 },
  }));
  if (filters.featured) data = data.filter((p) => p.featured);
  if (filters.category) data = data.filter((p) => p.category === filters.category);
  if (filters.limit)    data = data.slice(0, filters.limit);
  return data;
}


export async function getProductById(id) {
  // Handle demo product IDs
  if (id.startsWith('demo-')) {
    const idx = parseInt(id.replace('demo-', ''), 10);
    const p = DEMO_PRODUCTS[idx];
    return p ? { ...p, id } : null;
  }
  try {
    const snap = await withTimeout(getDoc(doc(db, COLLECTION, id)), 5000);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch (err) {
    console.warn('getProductById error:', err.message);
    return null;
  }
}

// ---- Admin CRUD ----

export async function createProduct(data) {
  return addDoc(collection(db, COLLECTION), { ...data, createdAt: serverTimestamp() });
}

export async function updateProduct(id, data) {
  return updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id) {
  return deleteDoc(doc(db, COLLECTION, id));
}

// ---- Seed ----
export async function seedDemoProducts() {
  for (const p of DEMO_PRODUCTS) {
    await addDoc(collection(db, COLLECTION), { ...p, createdAt: serverTimestamp() });
  }
}
