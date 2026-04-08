import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/admin/AdminLayout';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Store Pages (lazy loaded)
const Home          = lazy(() => import('./pages/Home'));
const Products      = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart          = lazy(() => import('./pages/Cart'));
const Checkout      = lazy(() => import('./pages/Checkout'));
const Login         = lazy(() => import('./pages/Login'));
const Register      = lazy(() => import('./pages/Register'));
const Profile       = lazy(() => import('./pages/Profile'));
const Orders        = lazy(() => import('./pages/Orders'));
const NotFound      = lazy(() => import('./pages/NotFound'));
const SeedPage      = lazy(() => import('./pages/SeedPage'));

// Admin Pages (lazy loaded)
const AdminDashboard  = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts   = lazy(() => import('./pages/admin/AdminProducts').then(m => ({ default: m.default })));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProducts').then(m => ({ default: m.AdminProductForm })));
const AdminOrders     = lazy(() => import('./pages/admin/AdminOrders'));
const AdminUsers      = lazy(() => import('./pages/admin/AdminUsers'));

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

// Admin Route wrapper
function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

// Full page loader fallback
function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="spinner" />
    </div>
  );
}

function StoreLayout({ children }) {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Store Routes ── */}
        <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
        <Route path="/products" element={<StoreLayout><Products /></StoreLayout>} />
        <Route path="/products/:id" element={<StoreLayout><ProductDetail /></StoreLayout>} />
        <Route path="/cart" element={<StoreLayout><Cart /></StoreLayout>} />
        <Route path="/login" element={<StoreLayout><Login /></StoreLayout>} />
        <Route path="/register" element={<StoreLayout><Register /></StoreLayout>} />
        <Route path="/seed" element={<StoreLayout><SeedPage /></StoreLayout>} />

        {/* Protected store routes */}
        <Route path="/checkout" element={<StoreLayout><ProtectedRoute><Checkout /></ProtectedRoute></StoreLayout>} />
        <Route path="/profile"  element={<StoreLayout><ProtectedRoute><Profile /></ProtectedRoute></StoreLayout>} />
        <Route path="/orders"   element={<StoreLayout><ProtectedRoute><Orders /></ProtectedRoute></StoreLayout>} />

        {/* ── Admin Routes (no Navbar/Footer) ── */}
        <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminLayout><AdminProducts /></AdminLayout></AdminRoute>} />
        <Route path="/admin/products/new" element={<AdminRoute><AdminLayout><AdminProductForm /></AdminLayout></AdminRoute>} />
        <Route path="/admin/products/:id/edit" element={<AdminRoute><AdminLayout><AdminProductForm /></AdminLayout></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />

        <Route path="*" element={<StoreLayout><NotFound /></StoreLayout>} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
