import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Skeleton, EmptyState, Button } from '../components/ui';
import { getEventById } from '../lib/api/events';
import { formatDate, formatTime } from '../utils/format';
import type { Event } from '../types';

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect fill='%23EFECE4' width='800' height='400'/%3E%3Cpath d='M0 200 H800 M400 0 V400' stroke='%230A2463' stroke-width='0.75' opacity='0.12'/%3E%3Ccircle cx='400' cy='180' r='52' fill='none' stroke='%230A2463' stroke-width='1.5' opacity='0.35'/%3E%3Cellipse cx='400' cy='180' rx='84' ry='26' transform='rotate(-22 400 180)' fill='none' stroke='%230A2463' stroke-width='1.2' opacity='0.28'/%3E%3Ctext x='400' y='275' fill='%230A2463' opacity='0.45' text-anchor='middle' font-size='13' font-family='monospace'%3ELOGICORE EVENT RECORD%3C/text%3E%3C/svg%3E";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const loadEvent = useCallback(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setNotFound(false);

    getEventById(id).then(res => {
      if (res.data) {
        setEvent(res.data);
      } else if (res.notFound) {
        setNotFound(true);
      } else {
        setError(res.error ?? 'Failed to load event');
      }
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  const openLightbox = (src: string, idx: number) => {
    setLightboxSrc(src);
    setLightboxIdx(idx);
  };

  const closeLightbox = useCallback(() => setLightboxSrc(null), []);

  const navigateLightbox = useCallback((dir: 1 | -1) => {
    if (!event) return;
    const imgs = event.gallery_urls;
    const newIdx = (lightboxIdx + dir + imgs.length) % imgs.length;
    setLightboxIdx(newIdx);
    setLightboxSrc(imgs[newIdx]);
  }, [event, lightboxIdx]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightboxSrc) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateLightbox(1);
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxSrc, closeLightbox, navigateLightbox]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Skeleton className="h-6 w-32 mb-8" />
        <Skeleton className="h-72 w-full mb-8" />
        <Skeleton className="h-10 w-2/3 mb-4" />
        <Skeleton className="h-4 w-1/3 mb-6" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Helmet><title>Error Loading Event — LogiCore Club</title></Helmet>
        <Link to="/events" className="btn-ghost mb-8 inline-flex -ml-2">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>
        <div className="mono-card">
          <EmptyState
            icon="error"
            title="Could not load event"
            description={error}
            action={
              <Button size="sm" variant="secondary" onClick={loadEvent}>
                <RefreshCw className="w-4 h-4" /> Retry
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <Helmet><title>Event Not Found — LogiCore Club</title></Helmet>
        <div className="font-mono text-xs uppercase tracking-widest text-cobalt-500 mb-3">
          RECORD 404
        </div>
        <h1 className="text-3xl font-heading font-bold text-ink mb-3">Event not found</h1>
        <p className="text-ink-muted mb-8 max-w-md">
          This event record does not exist or may have been removed.
        </p>
        <Link to="/events" className="btn-primary">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>
      </div>
    );
  }

  const timeStr = formatTime(event.start_time);
  const endTimeStr = formatTime(event.end_time);

  return (
    <>
      <Helmet>
        <title>{event.title} — LogiCore Club</title>
        <meta name="description" content={event.short_description ?? `LogiCore Club event: ${event.title}`} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        {/* Back link */}
        <Link
          to={event.status === 'archived' ? '/events?tab=archive' : '/events'}
          className="btn-ghost font-mono text-xs uppercase tracking-wider mb-8 inline-flex -ml-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>

        {/* Header meta */}
        <div className="border-b border-rule pb-8 mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant={event.status} dot>
              {event.status === 'upcoming' ? 'Upcoming' : 'Past Event'}
            </Badge>
            <span className="font-mono text-xs text-ink-subtle">
              RECORD / {event.event_date}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-ink mb-6 leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-5 text-sm text-ink-muted">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-navy-900" />
              {formatDate(event.event_date)}
            </div>
            {timeStr && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-navy-900" />
                {timeStr}{endTimeStr ? ` – ${endTimeStr}` : ''}
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-navy-900" />
                {event.location}
              </div>
            )}
          </div>
        </div>

        {/* Cover image */}
        <div className="border border-rule bg-paper-tint h-64 sm:h-80 md:h-96 overflow-hidden mb-8">
          <img
            src={event.cover_image_url || PLACEHOLDER}
            alt={`Cover image for ${event.title}`}
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
          />
        </div>

        {/* Description */}
        {(event.description || event.short_description) && (
          <div className="mono-card p-7 sm:p-8 mb-10">
            <h2 className="font-mono text-xs uppercase tracking-widest text-cobalt-500 mb-4">
              Event Summary
            </h2>
            <div className="text-ink-muted leading-relaxed whitespace-pre-line text-base">
              {event.description || event.short_description}
            </div>
          </div>
        )}

        {/* Photo gallery (archived events) */}
        {event.status === 'archived' && event.gallery_urls.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-ink text-xl">Photo Documentation</h2>
              <span className="font-mono text-xs text-ink-subtle">
                {event.gallery_urls.length} PHOTO{event.gallery_urls.length !== 1 ? 'S' : ''}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {event.gallery_urls.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => openLightbox(url, i)}
                  className="relative aspect-square border border-rule bg-paper-tint overflow-hidden group hover:border-navy-900 transition-colors focus-visible:outline-cobalt-500"
                  aria-label={`Open photo ${i + 1} in lightbox`}
                >
                  <img
                    src={url}
                    alt={`Gallery photo ${i + 1} from ${event.title}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Photo lightbox"
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 rounded-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {event.gallery_urls.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); navigateLightbox(-1); }}
                  className="absolute left-4 px-3.5 py-2 rounded-sm bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Previous photo"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); navigateLightbox(1); }}
                  className="absolute right-4 px-3.5 py-2 rounded-sm bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Next photo"
                >
                  ›
                </button>
              </>
            )}

            <motion.img
              key={lightboxSrc}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              src={lightboxSrc}
              alt={`Gallery photo ${lightboxIdx + 1}`}
              className="max-w-full max-h-[85vh] object-contain border border-white/20"
              onClick={e => e.stopPropagation()}
            />

            <div className="absolute bottom-4 font-mono text-white/70 text-xs">
              {lightboxIdx + 1} / {event.gallery_urls.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
