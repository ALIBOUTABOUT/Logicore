import { supabase } from '../supabase';
import type { JoinRequest, JoinFormValues, RequestStatus, RequestCounts, ApiResult } from '../../types';
import { formatDate } from '../../utils/format';

const TABLE = 'join_requests';

// ── Public ───────────────────────────────────────────────────────────────────

export async function submitJoinRequest(values: JoinFormValues): Promise<ApiResult<null>> {
  // Remove honeypot and normalize optional phone before inserting
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { honeypot: _h, phone, ...rest } = values;
  const payload = {
    ...rest,
    phone: phone?.trim() || null,
  };
  const { error } = await supabase.from(TABLE).insert([payload]);
  return { data: null, error: error?.message ?? null };
}

// ── Admin ────────────────────────────────────────────────────────────────────

export async function getJoinRequests(status?: RequestStatus): Promise<ApiResult<JoinRequest[]>> {
  let query = supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  return { data: data as JoinRequest[] | null, error: error?.message ?? null };
}

export async function updateRequestStatus(id: string, status: RequestStatus): Promise<ApiResult<JoinRequest>> {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  return { data: data as JoinRequest | null, error: error?.message ?? null };
}

export async function deleteJoinRequest(id: string): Promise<ApiResult<null>> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  return { data: null, error: error?.message ?? null };
}

export async function getRequestCounts(): Promise<ApiResult<RequestCounts>> {
  const { data, error } = await supabase.from(TABLE).select('status');
  if (error) {
    return {
      data: { total: 0, new: 0, accepted: 0, rejected: 0 },
      error: error.message,
    };
  }
  const rows = (data ?? []) as { status: RequestStatus }[];
  return {
    data: {
      total:    rows.length,
      new:      rows.filter(r => r.status === 'new').length,
      accepted: rows.filter(r => r.status === 'accepted').length,
      rejected: rows.filter(r => r.status === 'rejected').length,
    },
    error: null,
  };
}

// ── Utils ────────────────────────────────────────────────────────────────────

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function exportRequestsToCSV(requests: JoinRequest[]): void {
  const headers = ['Name', 'Email', 'Phone', 'Major', 'Year', 'Interests', 'Message', 'Status', 'Date'];
  const rows = requests.map(r => [
    r.full_name,
    r.email,
    r.phone ?? '',
    r.major,
    r.academic_year,
    r.interests.join('; '),
    r.message,
    r.status,
    formatDate(r.created_at),
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(csvCell).join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `logicore-join-requests-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
