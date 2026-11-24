import { useEffect, useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { Search, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { EventCard } from '../components/events/EventCard';
import { EventCardSkeleton, EmptyState, Tabs, Button } from '../components/ui';
import { getEvents } from '../lib/api/events';
import { useDebounce } from '../hooks/useDebounce';
import type { Event } from '../types';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.35 } }),
};

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'archive'>(
    tabParam === 'archive' ? 'archive' : 'upcoming'
  );

  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [archived, setArchived] = useState<Event[]>([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [loadingArchived, setLoadingArchived] = useState(true);
  const [errorUpcoming, setErrorUpcoming] = useState<string | null>(null);
  const [errorArchived, setErrorArchived] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  const loadEvents = useCallback(() => {
    setLoadingUpcoming(true);
    setLoadingArchived(true);
    setErrorUpcoming(null);
    setErrorArchived(null);

    getEvents('upcoming').then(res => {
      setUpcoming(res.data ?? []);
      setErrorUpcoming(res.error);
      setLoadingUpcoming(false);
    });
    getEvents('archived').then(res => {
      setArchived(res.data ?? []);
      setErrorArchived(res.error);
      setLoadingArchived(false);
    });
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    setActiveTab(tabParam === 'archive' ? 'archive' : 'upcoming');
  }, [tabParam]);

  const handleTabChange = (key: string) => {
    setActiveTab(key as 'upcoming' | 'archive');
    setSearchParams(key === 'archive' ? { tab: 'archive' } : {});
    setSearch('');
    setYearFilter('');
  };

  const archiveYears = useMemo(() => {
    const years = new Set(archived.map(e => e.event_date.slice(0, 4)));
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [archived]);

  const filteredArchived = useMemo(() => {
    return archived.filter(e => {
      const matchesSearch = debouncedSearch
        ? e.title.toLowerCase().includes(debouncedSearch.toLowerCase())
        : true;
      const matchesYear = yearFilter
        ? e.event_date.slice(0, 4) === yearFilter
        : true;
      return matchesSearch && matchesYear;
    });
  }, [archived, debouncedSearch, yearFilter]);

  return (
    <>
      <Helmet>
        <title>Events — LogiCore Club</title>
        <meta name="description" content="Browse upcoming and past events from LogiCore Club at FSE, UDL." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        {/* Header */}
        <div className="border-b border-rule pb-8 mb-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-7">
            <span className="font-mono text-xs uppercase tracking-widest text-cobalt-500">
              Schedule & Archive
            </span>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-ink mt-2">Events</h1>
          </div>
          <p className="lg:col-span-5 text-ink-muted text-sm sm:text-base leading-relaxed">
            Explore upcoming club sessions and browse our documented archive of open days,
            selection interviews, lectures, and competitions.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <Tabs
            tabs={[
              { key: 'upcoming', label: 'Upcoming', badge: upcoming.length },
              { key: 'archive',  label: 'Archive',  badge: archived.length },
            ]}
            activeTab={activeTab}
            onChange={handleTabChange}
          />

          {activeTab === 'archive' && (
            <div className="flex flex-col sm:flex-row gap-3 md:w-[460px]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-ink-subtle absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by title…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="input-field pl-10 py-2.5 text-sm"
                  aria-label="Search archived events"
                />
              </div>
              <select
                value={yearFilter}
                onChange={e => setYearFilter(e.target.value)}
                className="input-field py-2.5 text-sm sm:w-36"
                aria-label="Filter by year"
              >
                <option value="" className="bg-paper-stock text-ink">All years</option>
                {archiveYears.map(year => (
                  <option key={year} value={year} className="bg-paper-stock text-ink">{year}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Content */}
        {activeTab === 'upcoming' ? (
          <>
            {loadingUpcoming ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <EventCardSkeleton key={i} />)}
              </div>
            ) : errorUpcoming ? (
              <div className="mono-card">
                <EmptyState
                  icon="error"
                  title="Couldn't load upcoming events"
                  description={errorUpcoming}
                  action={
                    <Button size="sm" variant="secondary" onClick={loadEvents}>
                      <RefreshCw className="w-4 h-4" /> Retry
                    </Button>
                  }
                />
              </div>
            ) : upcoming.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcoming.map((event, i) => (
                  <motion.div
                    key={event.id}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="mono-card">
                <EmptyState
                  icon="calendar"
                  title="No upcoming events right now"
                  description="New events will be announced soon. Follow @logicore_club on Instagram for updates."
                />
              </div>
            )}
          </>
        ) : (
          <>
            {loadingArchived ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => <EventCardSkeleton key={i} />)}
              </div>
            ) : errorArchived ? (
              <div className="mono-card">
                <EmptyState
                  icon="error"
                  title="Couldn't load archived events"
                  description={errorArchived}
                  action={
                    <Button size="sm" variant="secondary" onClick={loadEvents}>
                      <RefreshCw className="w-4 h-4" /> Retry
                    </Button>
                  }
                />
              </div>
            ) : filteredArchived.length > 0 ? (
              <>
                {(debouncedSearch || yearFilter) && (
                  <p className="font-mono text-ink-subtle text-xs uppercase tracking-wider mb-5">
                    Showing {filteredArchived.length} result{filteredArchived.length !== 1 ? 's' : ''}
                    {debouncedSearch ? ` for "${debouncedSearch}"` : ''}
                    {yearFilter ? ` in ${yearFilter}` : ''}
                  </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArchived.map((event, i) => (
                    <motion.div
                      key={event.id}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUp}
                    >
                      <EventCard event={event} />
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="mono-card">
                <EmptyState
                  icon="inbox"
                  title={debouncedSearch || yearFilter ? 'No matching events' : 'No archived events yet'}
                  description={
                    debouncedSearch || yearFilter
                      ? 'Try adjusting your search or year filter.'
                      : 'Past events will appear here after they are archived.'
                  }
                  action={
                    (debouncedSearch || yearFilter) ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => { setSearch(''); setYearFilter(''); }}
                      >
                        Clear filters
                      </Button>
                    ) : undefined
                  }
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
