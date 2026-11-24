// Database row types matching Supabase schema

export interface Event {
  id: string;
  title: string;
  short_description: string | null;
  description: string | null;
  event_date: string; // ISO date string (YYYY-MM-DD)
  start_time: string | null; // HH:MM:SS
  end_time: string | null;
  location: string | null;
  cover_image_url: string | null;
  gallery_urls: string[];
  status: 'upcoming' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface JoinRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  major: string;
  academic_year: AcademicYear;
  interests: Interest[];
  message: string;
  status: RequestStatus;
  created_at: string;
}

export type AcademicYear = 'L1' | 'L2' | 'L3' | 'M1' | 'M2' | 'PhD' | 'Other';
export type Interest = 'Mathematics' | 'Programming' | 'Web Development' | 'AI and Data' | 'Competitions' | 'Other';
export type RequestStatus = 'new' | 'accepted' | 'rejected';
export type EventStatus = 'upcoming' | 'archived';

// Form value types
export interface JoinFormValues {
  full_name: string;
  email: string;
  phone?: string;
  major: string;
  academic_year: AcademicYear;
  interests: Interest[];
  message: string;
  honeypot?: string; // spam protection - hidden field
}

export interface EventFormValues {
  title: string;
  short_description?: string | null;
  description?: string | null;
  event_date: string;
  start_time?: string | null;
  end_time?: string | null;
  location?: string | null;
  status: EventStatus;
  cover_image_url?: string | null;
  gallery_urls?: string[];
}

// API response types
export interface ApiResult<T> {
  data: T | null;
  error: string | null;
}

// Supabase storage
export interface UploadResult {
  url: string;
  path: string;
}

export interface RequestCounts {
  total: number;
  new: number;
  accepted: number;
  rejected: number;
}
