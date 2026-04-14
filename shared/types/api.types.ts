// ─────────────────────────────────────────────────────────────
// API Types — Request/Response shapes for all API routes
// ─────────────────────────────────────────────────────────────

// ─── Generic API Response ────────────────────────────────────
export interface ApiSuccess<T = unknown> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ─── Attempts ────────────────────────────────────────────────
export interface CreateAttemptRequest {
  question_id: string;
}

export interface CreateAttemptResponse {
  id: string;
  question_id: string;
  started_at: string;
  status: "in_progress";
}

export interface SubmitAttemptRequest {
  student_answer: string;
  time_taken_s: number;
}

export interface SubmitAttemptResponse {
  id: string;
  status: "submitted";
  submitted_at: string;
}

// ─── Analysis ─────────────────────────────────────────────────
export interface CreateAnalysisRequest {
  attempt_id: string;
}

export interface CreateAnalysisResponse {
  id: string;
  final_score: number;
  exact_match_score: number;
  gemini_score: number;
  approach_breakdown: string;
  feedback: string;
  correct_answer_hint: string;
  xp_awarded: number;
  coins_awarded: number;
}

// ─── Users ─────────────────────────────────────────────────
export interface UpdateUserRequest {
  full_name?: string;
  avatar_url?: string;
}

export interface UserStatsResponse {
  streak: number;
  coins: number;
  xp: number;
  points: number;
  total_attempts: number;
  avg_score: number;
  accuracy_percent: number;
  last_attempt_date: string | null;
}

// ─── Questions (paginated) ────────────────────────────────────
export interface GetQuestionsParams {
  topic_id?: string;
  difficulty?: "easy" | "medium" | "hard";
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
