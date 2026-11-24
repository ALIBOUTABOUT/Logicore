import { useEffect, useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useOutletContext } from 'react-router-dom';
import { Download, Search, Trash2, Eye, RefreshCw } from 'lucide-react';
import {
  Button, Badge, Modal, EmptyState, Skeleton, toast,
} from '../../components/ui';
import {
  getJoinRequests, updateRequestStatus, deleteJoinRequest,
  getRequestCounts, exportRequestsToCSV,
} from '../../lib/api/requests';
import type { AdminOutletContext } from '../../components/admin/AdminLayout';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDate, truncate } from '../../utils/format';
import type { JoinRequest, RequestStatus } from '../../types';

const STATUS_OPTIONS: { value: RequestStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'new', label: 'New' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
];

export default function AdminRequestsPage() {
  const outletCtx = useOutletContext<AdminOutletContext | undefined>();
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState({ total: 0, new: 0, accepted: 0, rejected: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | ''>('');
  const debouncedSearch = useDebounce(search, 250);

  const [viewModal, setViewModal] = useState<JoinRequest | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<JoinRequest | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [reqResult, countsResult] = await Promise.all([
      getJoinRequests(),
      getRequestCounts(),
    ]);
    if (reqResult.error) {
      setError(reqResult.error);
      toast.error(reqResult.error);
    } else {
      setRequests(reqResult.data ?? []);
    }
    if (countsResult.data) {
      setCounts(countsResult.data);
    }
    setLoading(false);
    outletCtx?.refreshNewCount();
  }, [outletCtx]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = useMemo(() => {
    return requests.filter(r => {
      const matchesStatus = statusFilter ? r.status === statusFilter : true;
      const matchesSearch = debouncedSearch
        ? r.full_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          r.email.toLowerCase().includes(debouncedSearch.toLowerCase())
        : true;
      return matchesStatus && matchesSearch;
    });
  }, [requests, statusFilter, debouncedSearch]);

  const handleStatusChange = async (request: JoinRequest, newStatus: RequestStatus) => {
    if (request.status === newStatus) return;
    const result = await updateRequestStatus(request.id, newStatus);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Marked as ${newStatus}`);
      fetchData();
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    const result = await deleteJoinRequest(deleteConfirm.id);
    setDeleting(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Request deleted');
      setDeleteConfirm(null);
      fetchData();
    }
  };

  const handleExport = () => {
    if (filtered.length === 0) {
      toast.error('No visible requests to export');
      return;
    }
    exportRequestsToCSV(filtered);
    toast.success(`Exported ${filtered.length} request${filtered.length > 1 ? 's' : ''}`);
  };

  return (
    <>
      <Helmet><title>Join Requests — Admin · LogiCore Club</title></Helmet>

      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-rule">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-cobalt-500">
              Admin · Applications
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink mt-1 flex items-center gap-3">
              Join Requests
              {counts.new > 0 && (
                <Badge variant="new" dot>
                  {counts.new} new
                </Badge>
              )}
            </h1>
            <p className="text-ink-muted text-sm mt-0.5">Review and export student applications</p>
          </div>
          <Button variant="secondary" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>

        {/* Stats bar (single bordered ledger, no nested boxes) */}
        <div className="grid grid-cols-2 md:grid-cols-4 border border-rule bg-paper-stock divide-y md:divide-y-0 md:divide-x divide-rule mb-6">
          {[
            { label: 'Total',    value: counts.total,    color: 'text-ink' },
            { label: 'New',      value: counts.new,      color: 'text-[#9A5B00]' },
            { label: 'Accepted', value: counts.accepted, color: 'text-[#0E6F4E]' },
            { label: 'Rejected', value: counts.rejected, color: 'text-[#B42318]' },
          ].map(stat => (
            <div key={stat.label} className="p-4">
              <div className="font-mono text-[11px] uppercase tracking-widest text-ink-subtle">
                {stat.label}
              </div>
              <div className={`text-2xl font-heading font-bold mt-1 tabular-nums ${stat.color}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-subtle absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10 py-2.5 text-sm"
              aria-label="Search requests"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as RequestStatus | '')}
            className="input-field py-2.5 text-sm sm:w-44"
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-paper-stock text-ink">{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="mono-card overflow-hidden p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : error ? (
            <EmptyState
              icon="error"
              title="Failed to load join requests"
              description={error}
              action={
                <Button size="sm" variant="secondary" onClick={fetchData}>
                  <RefreshCw className="w-4 h-4" /> Retry
                </Button>
              }
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="inbox"
              title="No requests found"
              description={search || statusFilter ? 'Try adjusting your search or filter.' : 'No join requests yet.'}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Join requests table">
                <thead>
                  <tr className="border-b border-rule bg-paper text-left">
                    <th className="px-4 py-3.5 font-mono text-[11px] font-medium text-ink-subtle uppercase tracking-wider">Applicant</th>
                    <th className="px-4 py-3.5 font-mono text-[11px] font-medium text-ink-subtle uppercase tracking-wider hidden md:table-cell">Phone</th>
                    <th className="px-4 py-3.5 font-mono text-[11px] font-medium text-ink-subtle uppercase tracking-wider hidden lg:table-cell">Major / Year</th>
                    <th className="px-4 py-3.5 font-mono text-[11px] font-medium text-ink-subtle uppercase tracking-wider hidden xl:table-cell">Interests & Message</th>
                    <th className="px-4 py-3.5 font-mono text-[11px] font-medium text-ink-subtle uppercase tracking-wider hidden sm:table-cell">Date</th>
                    <th className="px-4 py-3.5 font-mono text-[11px] font-medium text-ink-subtle uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3.5 font-mono text-[11px] font-medium text-ink-subtle uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule">
                  {filtered.map(req => (
                    <tr key={req.id} className="hover:bg-paper transition-colors align-top">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-ink">{req.full_name}</span>
                          {req.status === 'new' && <Badge variant="new" dot>New</Badge>}
                        </div>
                        <div className="text-ink-muted text-xs mt-0.5">{req.email}</div>
                        <div className="text-ink-subtle text-xs lg:hidden mt-1">
                          {req.major} · {req.academic_year}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-ink-muted font-mono text-xs hidden md:table-cell whitespace-nowrap">
                        {req.phone || <span className="text-ink-subtle">—</span>}
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <div className="text-ink">{req.major}</div>
                        <div className="font-mono text-ink-subtle text-xs mt-0.5">{req.academic_year}</div>
                      </td>
                      <td className="px-4 py-3.5 hidden xl:table-cell max-w-xs">
                        <div className="flex flex-wrap gap-1 mb-1">
                          {req.interests.slice(0, 2).map(interest => (
                            <span
                              key={interest}
                              className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-cobalt-50 text-cobalt-500 border border-cobalt-200"
                            >
                              {interest}
                            </span>
                          ))}
                          {req.interests.length > 2 && (
                            <span className="font-mono text-[10px] text-ink-subtle">+{req.interests.length - 2}</span>
                          )}
                        </div>
                        <p className="text-ink-muted text-xs line-clamp-1">{truncate(req.message, 80)}</p>
                      </td>
                      <td className="px-4 py-3.5 text-ink-muted font-mono text-xs hidden sm:table-cell whitespace-nowrap">
                        {formatDate(req.created_at)}
                      </td>
                      <td className="px-4 py-3.5">
                        <select
                          value={req.status}
                          onChange={e => handleStatusChange(req, e.target.value as RequestStatus)}
                          className={[
                            'font-mono text-xs font-medium px-2.5 py-1 rounded-sm border cursor-pointer',
                            req.status === 'new' ? 'text-[#9A5B00] border-[#F3D99B] bg-[#FEF6E6]' :
                            req.status === 'accepted' ? 'text-[#0E6F4E] border-[#B5E4D0] bg-[#EAF7F1]' :
                            'text-[#B42318] border-[#F7C2BC] bg-[#FEF0EE]',
                          ].join(' ')}
                          aria-label={`Status for ${req.full_name}`}
                        >
                          <option value="new" className="bg-paper-stock text-ink">New</option>
                          <option value="accepted" className="bg-paper-stock text-ink">Accepted</option>
                          <option value="rejected" className="bg-paper-stock text-ink">Rejected</option>
                        </select>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewModal(req)}
                            className="p-1.5 rounded-sm text-ink-subtle hover:text-navy-900 hover:bg-paper-tint transition-colors"
                            title="View full details"
                            aria-label={`View details for ${req.full_name}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(req)}
                            className="p-1.5 rounded-sm text-ink-subtle hover:text-[#B42318] hover:bg-[#FEF0EE] transition-colors"
                            title="Delete request"
                            aria-label={`Delete request from ${req.full_name}`}
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
          {filtered.length} request{filtered.length !== 1 ? 's' : ''}
          {(search || statusFilter) ? ' matching filter' : ' total'}
        </div>
      </div>

      {/* View modal */}
      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Application Details" size="lg">
        {viewModal && (
          <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow label="Full Name" value={viewModal.full_name} />
              <InfoRow label="Email" value={viewModal.email} />
              <InfoRow label="Phone" value={viewModal.phone || 'Not provided'} />
              <InfoRow label="Major" value={viewModal.major} />
              <InfoRow label="Academic Year" value={viewModal.academic_year} />
              <InfoRow label="Submitted" value={formatDate(viewModal.created_at)} />
            </div>

            <div className="pt-4 border-t border-rule">
              <span className="font-mono text-[11px] font-medium text-ink-subtle uppercase tracking-wider block mb-2">
                Interests
              </span>
              <div className="flex flex-wrap gap-2">
                {viewModal.interests.map(interest => (
                  <span key={interest} className="font-mono text-xs px-3 py-1 rounded-sm bg-cobalt-50 border border-cobalt-200 text-cobalt-500">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-rule">
              <span className="font-mono text-[11px] font-medium text-ink-subtle uppercase tracking-wider block mb-2">
                Motivation
              </span>
              <div className="text-ink text-sm leading-relaxed bg-paper p-4 rounded-sm whitespace-pre-line">
                {viewModal.message}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-rule">
              <Button
                size="sm"
                variant="outline"
                onClick={() => { handleStatusChange(viewModal, 'accepted'); setViewModal(null); }}
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => { handleStatusChange(viewModal, 'rejected'); setViewModal(null); }}
              >
                Reject
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setViewModal(null)}
                className="ml-auto"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Request?" size="sm">
        <p className="text-ink-muted mb-6 text-sm leading-relaxed">
          Are you sure you want to delete the application from{' '}
          <strong className="text-ink">{deleteConfirm?.full_name}</strong>? This cannot be undone.
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-mono text-[11px] font-medium text-ink-subtle uppercase tracking-wider block mb-0.5">{label}</span>
      <span className="text-ink text-sm break-all">{value}</span>
    </div>
  );
}
