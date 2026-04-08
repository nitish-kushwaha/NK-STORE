import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound__glow" />
      <div className="notfound__content">
        <div className="notfound__code">404</div>
        <h1 className="notfound__title">Page Not Found</h1>
        <p className="notfound__sub">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="notfound__actions">
          <Link to="/" className="btn btn-primary btn-lg">
            <Home size={20} /> Go Home
          </Link>
          <button className="btn btn-secondary btn-lg" onClick={() => window.history.back()}>
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
