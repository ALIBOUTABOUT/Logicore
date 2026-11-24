import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Pencil, Trash2, Archive, Search, RefreshCw } from 'lucide-react';
import {
  Button, Modal, EmptyState, Skeleton, toast,
} from '../../components/ui';
import { EventFormModal } from '../../components/admin/EventFormModal';
import { ArchiveEventModal } from '../../components/admin/ArchiveEventModal';
import { getEvents, deleteEvent, updateEvent } from '../../lib/api/events';
import { formatDate } from '../../utils/format';
import type { Event, EventStatus } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<EventStatus | ''>('');
  const debouncedSearch = useDebounce(search, 250);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Event | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<Event | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getEvents(statusFilter || undefined);
    if (result.error) {
      setError(result.error);
      toast.error(result.error);
    } else {
      setEvents(result.data ?? []);
    }
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const filtered = events.filter(e =>
    debouncedSearch
      ? e.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      : true
  );

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    const result = await deleteEvent(deleteConfirm.id);
    setDeleting(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Event deleted');
      setDeleteConfirm(null);
      fetchEvents();
    }
  };

  const handleStatusChange = async (event: Event, newStatus: EventStatus) => {
    if (newStatus === event.status) return;
    const result = await updateEvent(event.id, { status: newStatus });
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Event marked as ${newStatus}`);
      fetchEvents();
    }
  };

  return (
    <>
      <Helmet><title>Events — Admin · LogiCore Club</title></Helmet>

      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-rule">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-cobalt-500">
              Admin · Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink mt-1">Events</h1>
            <p className="text-ink-muted text-sm mt-0.5">Manage club events, status, and photo galleries</p>
          </div>
          <Button onClick={() => { setEditingEvent(null); setModalOpen(true); }} size="sm">
            <Plus className="w-4 h-4" /> New Event
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-subtle absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search events by title…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10 py-2.5 text-sm"
              aria-label="Search events"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as EventStatus | '')}
            className="input-field py-2.5 text-sm sm:w-44"
            aria-label="Filter by status"
          >
            <option value="" className="bg-paper-stock text-ink">All statuses</option>
            <option value="upcoming" className="bg-paper-stock text-ink">Upcoming</option>
            <option value="archived" className="bg-paper-stock text-ink">Archived</option>
          </select>
        </div>

        {/* Table */}
        <div className="mono-card overflow-hidden p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : error ? (
            <EmptyState
              icon="error"
              title="Failed to load events"
              description={error}
              action={
                <Button size="sm" variant="secondary" onClick={fetchEvents}>
                  <RefreshCw className="w-4 h-4" /> Retry
                </Button>
              }
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="calendar"
              title="No events found"
              description={search || statusFilter ? 'Try adjusting your search or filter.' : 'Create your first event to get started.'}
              action={
                !search && !statusFilter ? (
                  <Button size="sm" onClick={() => { setEditingEvent(null); setModalOpen(true); }}>
                    <Plus className="w-4 h-4" /> New Event
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Events table">
                <thead>
                  <tr className="border-b border-rule bg-paper text-left">
                    <th className="px-5 py-3.5 font-mono text-[11px] font-medium text-ink-subtle uppercase tracking-wider">Title</th>
                    <th className="px-5 py-3.5 font-mono text-[11px] font-medium text-ink-subtle uppercase tracking-wider hidden sm:table-cell">Date</th>
                    <th className="px-5 py-3.5 font-mono text-[11px] font-medium text-ink-subtle uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3.5 font-mono text-[11px] font-medium text-ink-subtle uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule">
                  {filtered.map(event => (
                    <tr key={event.id} className="hover:bg-paper transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-ink leading-snug line-clamp-1">{event.title}</div>
                        <div className="text-ink-subtle text-xs sm:hidden mt-0.5">{formatDate(event.event_date)}</div>
                      </td>
                      <td className="px-5 py-3.5 text-ink-muted font-mono text-xs hidden sm:table-cell whitespace-nowrap">
                        {formatDate(event.event_date)}
                      </td>
                      <td className="px-5 py-3.5">
                        <select
                          value={event.status}
                          onChange={e => handleStatusChange(event, e.target.value as EventStatus)}
                          className={[
                            'font-mono text-xs font-medium px-2.5 py-1 rounded-sm border cursor-pointer',
                            event.status === 'upcoming'
                              ? 'text-cobalt-500 border-cobalt-200 bg-cobalt-50'
                              : 'text-ink-muted border-rule bg-paper-tint',
                          ].join(' ')}
                          aria-label={`Change status for ${event.title}`}
                        >
                          <option value="upcoming" className="bg-paper-stock text-ink">Upcoming</option>
                          <option value="archived" className="bg-paper-stock text-ink">Archived</option>
                        </select>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          {event.status === 'upcoming' && (
                            <button
                              type="button"
                              onClick={() => setArchiveTarget(event)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm font-mono text-xs font-medium text-[#9A5B00] bg-[#FEF6E6] hover:bg-[#FCEACA] border border-[#F3D99B] transition-colors"
                              title="Move to archive with final description and photos"
                              aria-label={`Move ${event.title} to archive`}
                            >
                              <Archive className="w-3.5 h-3.5" />
                              <span className="hidden md:inline">Archive</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => { setEditingEvent(event); setModalOpen(true); }}
                            className="p-1.5 rounded-sm text-ink-subtle hover:text-navy-900 hover:bg-paper-tint transition-colors"
                            title="Edit event"
                            aria-label={`Edit ${event.title}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(event)}
                            className="p-1.5 rounded-sm text-ink-subtle hover:text-[#B42318] hover:bg-[#FEF0EE] transition-colors"
                            title="Delete event"
                            aria-label={`Delete ${event.title}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-3 font-mono text-ink-subtle text-xs">
          {filtered.length} event{filtered.length !== 1 ? 's' : ''}
          {(search || statusFilter) ? ' matching filter' : ' total'}
        </div>
      </div>

      {/* Create / Edit Modal */}
      <EventFormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingEvent(null); }}
        onSuccess={fetchEvents}
        event={editingEvent}
      />

      {/* Move to Archive Modal (with final description & photos) */}
      <ArchiveEventModal
        event={archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onSuccess={fetchEvents}
      />

      {/* Delete confirmation */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Event?" size="sm">
        <p className="text-ink-muted mb-6 text-sm leading-relaxed">
          Are you sure you want to delete <strong className="text-ink">{deleteConfirm?.title}</strong>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="danger" loading={deleting} onClick={handleDelete} className="flex-1">
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
        </div>
      </Modal>
    </>
  );
}
