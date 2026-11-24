import { Link } from 'react-router-dom';
import { Mail, Instagram, MapPin, ArrowUpRight } from 'lucide-react';
import { CLUB, NAV_LINKS } from '../../constants';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-paper-stock border-t border-rule mt-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-3 mb-4" aria-label="LogiCore Club home">
              <img
                src="/logo.png"
                alt="LogiCore Club logo"
                className="w-11 h-11 object-contain mix-blend-multiply"
              />
              <div>
                <span className="font-heading font-bold text-ink text-xl block leading-none">
                  LogiCore Club
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink-subtle">
                  UDL · Sidi Bel Abbès
                </span>
              </div>
            </Link>
            <p className="text-ink-muted text-sm leading-relaxed max-w-sm mb-5">
              "{CLUB.tagline}" — A student scientific community at the Faculty of Exact Sciences
              bridging mathematics and programming.
            </p>
            <a
              href={CLUB.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-navy-900 hover:text-cobalt-500 transition-colors"
              aria-label="LogiCore Club on Instagram"
            >
              <Instagram className="w-4 h-4" />
              {CLUB.instagramHandle}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3">
            <h3 className="font-mono font-medium text-ink-subtle text-xs uppercase tracking-widest mb-4">
              Index
            </h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-ink-muted hover:text-navy-900 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h3 className="font-mono font-medium text-ink-subtle text-xs uppercase tracking-widest mb-4">
              Contact & Location
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${CLUB.email}`}
                  className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-navy-900 transition-colors"
                >
                  <Mail className="w-4 h-4 text-navy-900 shrink-0" />
                  {CLUB.email}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-sm text-ink-muted">
                  <MapPin className="w-4 h-4 text-navy-900 shrink-0 mt-0.5" />
                  <span>
                    {CLUB.faculty}<br />
                    {CLUB.university}<br />
                    {CLUB.streetAddress}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-xs text-ink-subtle">
          <span>© {year} LogiCore Club. All rights reserved.</span>
          <span>Faculty of Exact Sciences · UDL · Sidi Bel Abbès, Algeria</span>
        </div>
      </div>
    </footer>
  );
}
