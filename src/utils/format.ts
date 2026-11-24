/**
 * Format a date string (ISO date "YYYY-MM-DD" or ISO timestamp) to a human-readable format.
 * Example: "2025-12-02" → "December 2, 2025"
 */
export function formatDate(dateStr: string): string {
  const parsed = dateStr.includes('T')
    ? new Date(dateStr)
    : new Date(dateStr + 'T00:00:00');
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a time string (HH:MM:SS or HH:MM) to 12-hour format.
 * Example: "14:30:00" → "2:30 PM"
 */
export function formatTime(timeStr: string | null): string | null {
  if (!timeStr) return null;
  const parts = timeStr.split(':').map(Number);
  if (parts.length < 2 || Number.isNaN(parts[0]) || Number.isNaN(parts[1])) return null;
  const date = new Date();
  date.setHours(parts[0], parts[1], 0, 0);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/**
 * Returns "X days away", "Today", "Yesterday", or "X days ago"
 */
export function relativeDays(dateStr: string): string {
  const event = dateStr.includes('T')
    ? new Date(dateStr)
    : new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = event.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1) return `In ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}

/**
 * Truncate text to a max length, appending "…"
 */
export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + '…';
}

/**
 * Extract file path from a Supabase storage URL
 */
export function getStoragePath(url: string): string {
  const marker = '/object/public/event-images/';
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  return url.slice(idx + marker.length);
}
