import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 — Page Not Found · LogiCore Club</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="border-b border-rule pb-8 mb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-cobalt-500 block mb-3">
            ERROR 404 · UNDEFINED ROUTE
          </span>
          <div className="text-7xl sm:text-9xl font-heading font-bold text-ink leading-none">
            404
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink mb-3">
          Page not found
        </h1>
        <p className="text-ink-muted mb-8 max-w-md leading-relaxed">
          This route does not exist — or it got misplaced between a proof and a pull request.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/" className="btn-primary px-7 py-3">
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <button type="button" onClick={() => window.history.back()} className="btn-secondary px-7 py-3">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    </>
  );
}
