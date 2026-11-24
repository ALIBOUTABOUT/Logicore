import { supabase } from '../supabase';
import type { Event, EventFormValues, ApiResult, UploadResult } from '../../types';

const TABLE = 'events';
const BUCKET = 'event-images';

function sanitizeEventPayload(values: Partial<EventFormValues>) {
  return {
    ...values,
    short_description: values.short_description !== undefined ? (values.short_description?.trim() || null) : undefined,
    description:       values.description !== undefined ? (values.description?.trim() || null) : undefined,
    start_time:        values.start_time !== undefined ? (values.start_time?.trim() || null) : undefined,
    end_time:          values.end_time !== undefined ? (values.end_time?.trim() || null) : undefined,
    location:          values.location !== undefined ? (values.location?.trim() || null) : undefined,
    cover_image_url:   values.cover_image_url !== undefined ? (values.cover_image_url?.trim() || null) : undefined,
  };
}

// ── Queries ──────────────────────────────────────────────────────────────────

export async function getEvents(status?: 'upcoming' | 'archived'): Promise<ApiResult<Event[]>> {
  const ascending = status === 'upcoming';
  let query = supabase.from(TABLE).select('*').order('event_date', { ascending });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  return { data: data as Event[] | null, error: error?.message ?? null };
}

export async function getEventById(id: string): Promise<ApiResult<Event> & { notFound?: boolean }> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message, notFound: false };
  }
  if (!data) {
    return { data: null, error: null, notFound: true };
  }
  return { data: data as Event, error: null, notFound: false };
}

export async function getNextUpcomingEvent(): Promise<ApiResult<Event>> {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('status', 'upcoming')
    .gte('event_date', today)
    .order('event_date', { ascending: true })
    .limit(1)
    .maybeSingle();
  return { data: data as Event | null, error: error?.message ?? null };
}

export async function getLatestArchivedEvents(limit = 3): Promise<ApiResult<Event[]>> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('status', 'archived')
    .order('event_date', { ascending: false })
    .limit(limit);
  return { data: data as Event[] | null, error: error?.message ?? null };
}

export async function getArchivedEventCount(): Promise<ApiResult<number>> {
  const { count, error } = await supabase
    .from(TABLE)
    .select('id', { count: 'exact', head: true })
    .eq('status', 'archived');
  return { data: count ?? 0, error: error?.message ?? null };
}

// ── Mutations (admin only) ───────────────────────────────────────────────────

export async function createEvent(values: EventFormValues): Promise<ApiResult<Event>> {
  const payload = sanitizeEventPayload({
    ...values,
    gallery_urls: values.gallery_urls ?? [],
  });
  const { data, error } = await supabase
    .from(TABLE)
    .insert([payload])
    .select()
    .single();
  return { data: data as Event | null, error: error?.message ?? null };
}

export async function updateEvent(id: string, values: Partial<EventFormValues>): Promise<ApiResult<Event>> {
  const payload = sanitizeEventPayload(values);
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return { data: data as Event | null, error: error?.message ?? null };
}

export async function deleteEvent(id: string): Promise<ApiResult<null>> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  return { data: null, error: error?.message ?? null };
}

export async function archiveEvent(
  id: string,
  extra?: { description?: string; gallery_urls?: string[] }
): Promise<ApiResult<Event>> {
  return updateEvent(id, { status: 'archived', ...extra });
}

// ── Storage ──────────────────────────────────────────────────────────────────

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 5;

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return 'Only JPG, PNG, or WebP images are allowed.';
  if (file.size > MAX_SIZE_MB * 1024 * 1024) return `Image must be smaller than ${MAX_SIZE_MB} MB.`;
  return null;
}

export async function uploadEventImage(file: File, folder = 'covers'): Promise<ApiResult<UploadResult>> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) return { data: null, error: uploadError.message };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { data: { url: data.publicUrl, path }, error: null };
}

export async function deleteEventImage(path: string): Promise<ApiResult<null>> {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  return { data: null, error: error?.message ?? null };
}
