import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MathBackground } from './MathBackground';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col relative bg-paper text-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-navy-900 focus:text-paper focus:rounded-sm"
      >
        Skip to content
      </a>
      <MathBackground />
      <Navbar />
      <main className="flex-1 pt-16 relative z-10" id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
