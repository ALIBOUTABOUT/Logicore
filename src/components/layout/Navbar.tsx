import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '../../constants';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-paper/95 backdrop-blur-sm border-b border-rule">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" aria-label="LogiCore Club home">
            <img
              src="/logo.png"
              alt="LogiCore Club emblem"
              className="w-10 h-10 object-contain mix-blend-multiply"
            />
            <div className="flex items-baseline gap-2.5">
              <span className="font-heading font-bold text-ink text-lg tracking-tight">
                LogiCore
              </span>
              <span className="hidden lg:inline font-mono text-[11px] uppercase tracking-widest text-ink-subtle border-l border-rule pl-2.5">
                FSE · UDL
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === '/'}
                className={({ isActive }) =>
                  [
                    'px-3.5 py-2 text-sm font-medium transition-colors duration-150 border-b-2',
                    isActive
                      ? 'text-navy-900 border-navy-900 font-semibold'
                      : 'text-ink-muted border-transparent hover:text-ink',
                  ].join(' ')
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <Link to="/join" className="hidden md:inline-flex btn-primary text-xs px-4 py-2.5">
              Join the Club <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(v => !v)}
              className="md:hidden p-2 rounded-sm text-ink-muted hover:text-ink hover:bg-paper-tint transition-colors"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="md:hidden bg-paper-stock border-b border-rule overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col divide-y divide-rule">
              {NAV_LINKS.map(link => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  end={link.href === '/'}
                  className={({ isActive }) =>
                    [
                      'py-3 text-sm font-medium transition-colors duration-150',
                      isActive ? 'text-navy-900 font-semibold' : 'text-ink-muted hover:text-ink',
                    ].join(' ')
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="pt-4">
                <Link to="/join" className="btn-primary w-full text-center py-3">
                  Join the Club <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
