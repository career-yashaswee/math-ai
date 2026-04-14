// ─────────────────────────────────────────────────────────────
// Date Utilities — IST-aware helpers for the application
// ─────────────────────────────────────────────────────────────
import { formatDistance, format, parseISO, isToday, isYesterday } from "date-fns";

const IST_TIMEZONE = "Asia/Kolkata";

/**
 * Get today's date in IST as a YYYY-MM-DD string.
 */
export function getTodayIST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: IST_TIMEZONE });
}

/**
 * Format a date string into a human-readable relative time.
 * e.g. "2 hours ago", "3 days ago"
 */
export function timeAgo(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return formatDistance(date, new Date(), { addSuffix: true });
  } catch {
    return "recently";
  }
}

/**
 * Format a date string for display.
 * e.g. "14 Apr 2026"
 */
export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), "d MMM yyyy");
  } catch {
    return dateString;
  }
}

/**
 * Format a date with time.
 * e.g. "14 Apr 2026, 11:30 PM"
 */
export function formatDateTime(dateString: string): string {
  try {
    return format(parseISO(dateString), "d MMM yyyy, h:mm a");
  } catch {
    return dateString;
  }
}

/**
 * Get a friendly date label.
 * e.g. "Today", "Yesterday", "14 Apr 2026"
 */
export function friendlyDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

/**
 * Format seconds into a readable duration.
 * e.g. 125 → "2m 5s"
 */
export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}

/**
 * Get the ISO week string (e.g. "2026-W15") for a date.
 */
export function getWeekKey(dateString: string): string {
  try {
    return format(parseISO(dateString), "yyyy-'W'ww");
  } catch {
    return "";
  }
}

/**
 * Generate an array of dates for the past N days (YYYY-MM-DD).
 */
export function getPastNDays(n: number): string[] {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toLocaleDateString("en-CA", { timeZone: IST_TIMEZONE }));
  }
  return dates;
}
