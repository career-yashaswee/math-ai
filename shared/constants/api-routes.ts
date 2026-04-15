/**
 * Centralized API Route definitions.
 * Use these constants instead of raw strings to ensure type safety and easy refactoring.
 */
export const API_ROUTES = {
  AUTH: {
    CALLBACK: "/api/auth/callback",
  },
  USERS: {
    STATS: "/api/users/stats",
    LEADERBOARD: "/api/users/leaderboard",
  },
  ATTEMPTS: {
    /** POST: Create a new attempt */
    BASE: "/api/attempts",
    /** GET / PATCH: Fetch or update a specific attempt */
    BY_ID: (id: string) => `/api/attempts/${id}`,
    /** GET: Fetch attempt history with pagination */
    HISTORY: (page: number, limit: number) => `/api/attempts?page=${page}&limit=${limit}`,
  },
  ANALYSIS: {
    /** POST: Trigger analysis generation */
    BASE: "/api/analysis",
    /** GET: Fetch analysis for a specific attempt */
    BY_ATTEMPT_ID: (attemptId: string) => `/api/analysis?attempt_id=${attemptId}`,
  },
} as const;
