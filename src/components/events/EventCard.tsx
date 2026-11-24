import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { formatDate, formatTime } from '../../utils/format';
import type { Event } from '../../types';

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='220' viewBox='0 0 400 220'%3E%3Crect fill='%23EFECE4' width='400' height='220'/%3E%3Cpath d='M0 110 H400 M200 0 V220' stroke='%230A2463' stroke-width='0.75' opacity='0.12'/%3E%3Ccircle cx='200' cy='100' r='32' fill='none' stroke='%230A2463' stroke-width='1.5' opacity='0.35'/%3E%3Cellipse cx='200' cy='100' rx='52' ry='16' transform='rotate(-22 200 100)' fill='none' stroke='%230A2463' stroke-width='1.2' opacity='0.28'/%3E%3Ctext x='200' y='165' fill='%230A2463' opacity='0.45' text-anchor='middle' font-size='11' font-family='monospace'%3ELOGICORE EVENT%3C/text%3E%3C/svg%3E";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const timeStr = formatTime(event.start_time);
  const endTimeStr = formatTime(event.end_time);

  return (
    <Link
      to={`/events/${event.id}`}
      className="mono-card group overflow-hidden flex flex-col h-full transition-colors duration-150 hover:border-navy-900 focus-visible:outline-cobalt-500"
      aria-label={`View event: ${event.title}`}
    >
      {/* Cover image */}
      <div className="relative h-48 overflow-hidden bg-paper-tint border-b border-rule">
        <img
          src={event.cover_image_url || PLACEHOLDER}
          alt={`Cover image for ${event.title}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <Badge variant={event.status} dot>
            {event.status === 'upcoming' ? 'Coming Soon' : 'Past Event'}
          </Badge>
        </div>

        <h3 className="font-heading font-semibold text-ink text-lg leading-snug group-hover:text-cobalt-500 transition-colors line-clamp-2">
          {event.title}
        </h3>

        <div className="flex flex-col gap-1.5 text-xs text-ink-muted">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-navy-900 shrink-0" />
            {formatDate(event.event_date)}
          </div>
          {timeStr && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-navy-900 shrink-0" />
              {timeStr}{endTimeStr ? ` – ${endTimeStr}` : ''}
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-navy-900 shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
        </div>

        {event.short_description && (
          <p className="text-ink-muted text-sm leading-relaxed line-clamp-2 mt-auto">
            {event.short_description}
          </p>
        )}

        <div className="flex items-center gap-1.5 text-navy-900 group-hover:text-cobalt-500 font-mono text-xs uppercase tracking-wider font-medium mt-auto pt-3 border-t border-rule">
          View Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
