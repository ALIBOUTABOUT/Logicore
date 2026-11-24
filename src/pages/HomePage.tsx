import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, MapPin, ChevronRight, RefreshCw } from 'lucide-react';
import { EventCard } from '../components/events/EventCard';
import { HeroSpecimen } from '../components/home/HeroSpecimen';
import { Badge, EventCardSkeleton, EmptyState, Button } from '../components/ui';
import { getNextUpcomingEvent, getLatestArchivedEvents } from '../lib/api/events';
import { CLUB, FEATURES } from '../constants';
import { formatDate, formatTime } from '../utils/format';
import type { Event } from '../types';

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='360' viewBox='0 0 600 360'%3E%3Crect fill='%23EFECE4' width='600' height='360'/%3E%3Cpath d='M0 180 H600 M300 0 V360' stroke='%230A2463' stroke-width='0.75' opacity='0.12'/%3E%3Ccircle cx='300' cy='165' r='44' fill='none' stroke='%230A2463' stroke-width='1.5' opacity='0.35'/%3E%3Cellipse cx='300' cy='165' rx='72' ry='22' transform='rotate(-22 300 165)' fill='none' stroke='%230A2463' stroke-width='1.2' opacity='0.28'/%3E%3Ctext x='300' y='245' fill='%230A2463' opacity='0.45' text-anchor='middle' font-size='12' font-family='monospace'%3ELOGICORE EVENT%3C/text%3E%3C/svg%3E";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function HomePage() {
  const [nextEvent, setNextEvent] = useState<Event | null>(null);
  const [nextError, setNextError] = useState<string | null>(null);
  const [latestEvents, setLatestEvents] = useState<Event[]>([]);
  const [archiveError, setArchiveError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [nextLoading, setNextLoading] = useState(true);

  const loadData = useCallback(() => {
    setNextLoading(true);
    setLoading(true);
    setNextError(null);
    setArchiveError(null);

    getNextUpcomingEvent().then(res => {
      setNextEvent(res.data);
      setNextError(res.error);
      setNextLoading(false);
    });

    getLatestArchivedEvents(3).then(eventsRes => {
      setLatestEvents(eventsRes.data ?? []);
      setArchiveError(eventsRes.error);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      <Helmet>
        <title>LogiCore Club — {CLUB.tagline}</title>
        <meta name="description" content="LogiCore Club at FSE, UDL — a student community combining mathematics and programming." />
      </Helmet>

      {/* ── Asymmetric Hero + Interactive Mathematical Curve Plate ────────── */}
      <section className="relative z-10 border-b border-rule">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Left 7 columns */}
            <div className="lg:col-span-7 space-y-6">
              <p className="font-mono text-xs uppercase tracking-widest text-cobalt-500">
                {CLUB.faculty} · {CLUB.university}
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-ink leading-[1.06]">
                LogiCore Club
              </h1>

              <p className="text-xl sm:text-2xl font-heading font-medium text-navy-900">
                "{CLUB.tagline}"
              </p>

              <p className="text-ink-muted text-base sm:text-lg max-w-xl leading-relaxed">
                A student scientific club in Sidi Bel Abbès bringing mathematics and programming
                students together through weekly study sessions, coding workshops, and campus events.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link to="/join" className="btn-primary px-7 py-3.5">
                  Join the Club <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/events" className="btn-secondary px-7 py-3.5">
                  See Events <Calendar className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right 5 columns: Emblem + Interactive Curve Plotter */}
            <div className="lg:col-span-5">
              <HeroSpecimen />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── What We Do (Asymmetric 4/8 Ruled Editorial Index) ─────────────── */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 border-b border-rule">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-cobalt-500">
              What we do
            </span>
            <h2 className="text-3xl font-heading font-bold text-ink leading-tight">
              Math on paper. Code in practice.
            </h2>
            <p className="text-ink-muted text-sm sm:text-base leading-relaxed">
              Four ways students learn and collaborate inside LogiCore throughout the academic year.
            </p>
          </div>

          <div className="lg:col-span-8 border-t border-ink/20 divide-y divide-rule">
            {FEATURES.map((feature, idx) => (
              <div
                key={feature.title}
                className="py-7 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-baseline"
              >
                <div className="sm:col-span-1 font-mono text-xs text-cobalt-500 font-semibold">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className="sm:col-span-4">
                  <h3 className="font-heading font-semibold text-ink text-lg">
                    {feature.title}
                  </h3>
                  <span className="font-mono text-[11px] text-ink-subtle block mt-0.5">
                    {feature.tag}
                  </span>
                </div>
                <p className="sm:col-span-7 text-ink-muted text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Next Upcoming Event ────────────────────────────────────────────── */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 border-b border-rule">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-cobalt-500">
                Upcoming
              </span>
              <h2 className="text-3xl font-heading font-bold text-ink mt-1">Next Event</h2>
            </div>
            <Link to="/events" className="btn-ghost font-mono text-xs uppercase tracking-wider">
              All events <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {nextLoading ? (
            <div className="max-w-3xl">
              <EventCardSkeleton />
            </div>
          ) : nextError ? (
            <div className="mono-card">
              <EmptyState
                icon="error"
                title="Couldn't load upcoming event"
                description={nextError}
                action={
                  <Button size="sm" variant="secondary" onClick={loadData}>
                    <RefreshCw className="w-4 h-4" /> Retry
                  </Button>
                }
              />
            </div>
          ) : nextEvent ? (
            <Link
              to={`/events/${nextEvent.id}`}
              className="mono-card group grid grid-cols-1 lg:grid-cols-12 overflow-hidden hover:border-navy-900 transition-colors"
            >
              <div className="lg:col-span-5 h-60 lg:h-auto bg-paper-tint border-b lg:border-b-0 lg:border-r border-rule overflow-hidden">
                <img
                  src={nextEvent.cover_image_url || PLACEHOLDER}
                  alt={`Cover image for ${nextEvent.title}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                />
              </div>
              <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <Badge variant="upcoming" dot>Coming Soon</Badge>

                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-ink group-hover:text-cobalt-500 transition-colors">
                    {nextEvent.title}
                  </h3>

                  {nextEvent.short_description && (
                    <p className="text-ink-muted text-base leading-relaxed">
                      {nextEvent.short_description}
                    </p>
                  )}
                </div>

                <div className="pt-5 border-t border-rule flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-4 text-xs text-ink-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-navy-900" />
                      {formatDate(nextEvent.event_date)}
                    </span>
                    {formatTime(nextEvent.start_time) && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-navy-900" />
                        {formatTime(nextEvent.start_time)}
                        {formatTime(nextEvent.end_time) ? ` – ${formatTime(nextEvent.end_time)}` : ''}
                      </span>
                    )}
                    {nextEvent.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-navy-900" />
                        {nextEvent.location}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs uppercase tracking-wider text-navy-900 group-hover:text-cobalt-500 inline-flex items-center gap-1.5 shrink-0">
                    Event Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="mono-card p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h3 className="font-heading font-semibold text-ink text-xl">
                  New events coming soon
                </h3>
                <p className="text-ink-muted text-sm mt-1">
                  Follow {CLUB.instagramHandle} on Instagram for upcoming workshop and lecture announcements.
                </p>
              </div>
              <Link to="/events?tab=archive" className="btn-secondary shrink-0">
                Browse Archive
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Latest Archived Events ────────────────────────────────────────── */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-cobalt-500">
                Archive
              </span>
              <h2 className="text-3xl font-heading font-bold text-ink mt-1">Past Events</h2>
            </div>
            <Link to="/events?tab=archive" className="btn-ghost font-mono text-xs uppercase tracking-wider">
              Full archive <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <EventCardSkeleton key={i} />)}
            </div>
          ) : archiveError ? (
            <div className="mono-card">
              <EmptyState
                icon="error"
                title="Couldn't load past events"
                description={archiveError}
                action={
                  <Button size="sm" variant="secondary" onClick={loadData}>
                    <RefreshCw className="w-4 h-4" /> Retry
                  </Button>
                }
              />
            </div>
          ) : latestEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="mono-card">
              <EmptyState
                icon="calendar"
                title="No past events yet"
                description="Check back after our first events are archived."
              />
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Band ──────────────────────────────────────────────────────── */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-navy-900 text-paper border border-navy-900 p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest text-cobalt-200">
                Join LogiCore
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white">
                Interested in joining the club?
              </h2>
              <p className="text-white/80 max-w-2xl leading-relaxed">
                Fill out the online application form. Shortlisted students are invited to our next
                information day and selection interview at the Faculty of Exact Sciences.
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <Link
                to="/join"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-sm bg-paper-stock hover:bg-paper-tint text-navy-900 font-heading font-semibold text-sm tracking-wide transition-colors"
              >
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
