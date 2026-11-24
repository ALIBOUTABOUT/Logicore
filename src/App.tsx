import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppToaster } from './components/ui';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/admin/AdminLayout';

// Public pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import AboutPage from './pages/AboutPage';
import JoinPage from './pages/JoinPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin pages (lazy loaded so public bundle stays lean)
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminEventsPage = lazy(() => import('./pages/admin/AdminEventsPage'));
const AdminRequestsPage = lazy(() => import('./pages/admin/AdminRequestsPage'));

// Setup check
import { SetupPage } from './components/layout/SetupPage';
import { isMissingEnv } from './lib/supabase';

function RouteLoader() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  // If Supabase env vars are missing, show a friendly setup screen
  if (isMissingEnv) {
    return <SetupPage />;
  }

  return (
    <BrowserRouter>
      <AppToaster />

      <Suspense fallback={<RouteLoader />}>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/"           element={<HomePage />} />
            <Route path="/events"     element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/about"      element={<AboutPage />} />
            <Route path="/join"       element={<JoinPage />} />
            <Route path="/contact"    element={<ContactPage />} />
            <Route path="*"           element={<NotFoundPage />} />
          </Route>

          {/* Admin login (no layout) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminEventsPage />} />
            <Route path="events"   element={<AdminEventsPage />} />
            <Route path="requests" element={<AdminRequestsPage />} />
            <Route path="*"        element={<Navigate to="/admin/events" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
