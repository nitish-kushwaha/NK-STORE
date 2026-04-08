import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages (lazy loaded for performance)
const Home         = lazy(() => import('./pages/Home'));
const Products     = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart         = lazy(() => import('./pages/Cart'));
const Checkout     = lazy(() => import('./pages/Checkout'));
const Login        = lazy(() => import('./pages/Login'));
const Register     = lazy(() => import('./pages/Register'));
const Profile      = lazy(() => import('./pages/Profile'));
const Orders       = lazy(() => import('./pages/Orders'));
const NotFound     = lazy(() => import('./pages/NotFound'));
const SeedPage     = lazy(() => import('./pages/SeedPage'));

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

// Full page loader fallback
function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="spinner" />
    </div>
  );
}

function AppRoutes() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"            element={<Home />} />
            <Route path="/products"    element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart"        element={<Cart />} />
            <Route path="/login"       element={<Login />} />
            <Route path="/register"    element={<Register />} />

            {/* Protected routes */}
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/profile"  element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/orders"   element={<ProtectedRoute><Orders /></ProtectedRoute>} />

            <Route path="/seed"     element={<SeedPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
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
