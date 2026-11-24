import { useState, useEffect, useCallback } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getRequestCounts } from '../../lib/api/requests';
import {
  Calendar, Users, ExternalLink, LogOut, ChevronLeft,
  Menu, X,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  showNewBadge?: boolean;
}

const NAV: NavItem[] = [
  { href: '/admin/events',   label: 'Events',        icon: Calendar },
  { href: '/admin/requests', label: 'Join Requests',  icon: Users, showNewBadge: true },
];

export interface AdminOutletContext {
  refreshNewCount: () => Promise<void>;
}

export function AdminLayout() {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newRequestsCount, setNewRequestsCount] = useState(0);

  const refreshNewCount = useCallback(async () => {
    const res = await getRequestCounts();
    if (res.data) {
      setNewRequestsCount(res.data.new);
    }
  }, []);

  useEffect(() => {
    if (user) {
      refreshNewCount();
    }
  }, [user, location.pathname, refreshNewCount]);

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-rule h-16">
        {!collapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <img src="/logo.png" alt="LogiCore" className="w-8 h-8 object-contain mix-blend-multiply shrink-0" />
            <div className="min-w-0">
              <span className="font-heading font-bold text-ink text-sm block truncate">LogiCore</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle block">Admin</span>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(v => !v)}
          className="p-1.5 rounded-sm text-ink-muted hover:text-ink hover:bg-paper-tint transition-colors hidden lg:flex"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1" aria-label="Admin navigation">
        {NAV.map(({ href, label, icon: Icon, showNewBadge }) => {
          const isActive = location.pathname === href || (href === '/admin/events' && location.pathname === '/admin');
          return (
            <Link
              key={href}
              to={href}
              onClick={() => setMobileOpen(false)}
              className={[
                'flex items-center justify-between px-3 py-2.5 rounded-sm transition-colors duration-150',
                isActive
                  ? 'bg-navy-900 text-paper font-medium'
                  : 'text-ink-muted hover:text-ink hover:bg-paper-tint',
              ].join(' ')}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="flex items-center gap-3 min-w-0">
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="text-sm truncate">{label}</span>}
              </span>
              {showNewBadge && newRequestsCount > 0 && (
                <span
                  className={[
                    'font-mono text-[11px] font-semibold rounded-sm',
                    isActive
                      ? 'bg-white/15 text-paper px-1.5 py-0.5'
                      : 'bg-[#FEF6E6] text-[#9A5B00] border border-[#F3D99B] px-1.5 py-0.5',
                  ].join(' ')}
                  aria-label={`${newRequestsCount} new join requests`}
                >
                  {newRequestsCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="p-3 border-t border-rule space-y-1">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-ink-muted hover:text-ink hover:bg-paper-tint transition-colors text-sm"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          {!collapsed && 'View public site'}
        </Link>
        <button
          type="button"
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-ink-muted hover:text-[#B42318] hover:bg-[#FEF0EE] transition-colors text-sm"
          aria-label="Sign out"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper text-ink flex">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-paper-stock border-r border-rule transition-all duration-200 shrink-0 ${collapsed ? 'w-16' : 'w-60'}`}
        aria-label="Sidebar"
      >
        {renderSidebarContent()}
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-paper-stock border-b border-rule h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="LogiCore" className="w-7 h-7 object-contain mix-blend-multiply" />
          <span className="font-heading font-bold text-ink text-sm">Admin Panel</span>
          {newRequestsCount > 0 && (
            <Link
              to="/admin/requests"
              className="font-mono text-[11px] px-2 py-0.5 rounded-sm bg-[#FEF6E6] text-[#9A5B00] border border-[#F3D99B]"
            >
              {newRequestsCount} new
            </Link>
          )}
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(v => !v)}
          className="p-2 rounded-sm text-ink-muted hover:text-ink hover:bg-paper-tint transition-colors"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-20 bg-ink/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="lg:hidden fixed top-14 left-0 bottom-0 z-20 w-60 bg-paper-stock border-r border-rule overflow-y-auto">
            {renderSidebarContent()}
          </div>
        </>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto lg:pt-0 pt-14" id="admin-main">
        <Outlet context={{ refreshNewCount } satisfies AdminOutletContext} />
      </main>
    </div>
  );
}
