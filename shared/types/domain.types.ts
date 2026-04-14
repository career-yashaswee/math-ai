// ─────────────────────────────────────────────────────────────
// Domain Types — Business-level types used across features
// ─────────────────────────────────────────────────────────────
import type { Tables, Views } from "./database.types";

// ─── Re-exported DB Row Types ────────────────────────────────
export type User = Tables<"users">;
export type Chapter = Tables<"chapters">;
export type Topic = Tables<"topics">;
export type Question = Tables<"questions">;
export type Attempt = Tables<"attempts">;
export type Analysis = Tables<"analysis">;

// ─── Safe (client-facing) types ──────────────────────────────
export type QuestionSafe = Views<"questions_safe">;
export type LeaderboardEntry = Views<"leaderboard">;

// ─── Enriched Types ──────────────────────────────────────────
export type TopicWithChapter = Topic & {
  chapters: Pick<Chapter, "id" | "name">;
};

export type QuestionSafeWithTopic = QuestionSafe & {
  topics: Pick<Topic, "id" | "name"> & {
    chapters: Pick<Chapter, "id" | "name">;
  };
};

export type AttemptWithQuestion = Attempt & {
  questions: QuestionSafe;
};

export type AttemptWithAnalysis = Attempt & {
  analysis: Analysis | null;
};

export type FullAttempt = Attempt & {
  questions: QuestionSafe;
  analysis: Analysis | null;
};

// ─── Difficulty ───────────────────────────────────────────────
export type Difficulty = "easy" | "medium" | "hard";

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: "text-green-400",
  medium: "text-yellow-400",
  hard: "text-red-400",
};

// ─── Attempt Status ──────────────────────────────────────────
export type AttemptStatus = "in_progress" | "submitted" | "analysed";

// ─── Dashboard Stats ─────────────────────────────────────────
export interface DashboardStats {
  streak: number;
  coins: number;
  xp: number;
  points: number;
  total_attempts: number;
  avg_score: number;
  accuracy_percent: number;
  last_attempt_date: string | null;
}

export interface HeatmapData {
  date: string; // ISO date string "YYYY-MM-DD"
  count: number;
}

export interface AccuracyDataPoint {
  week: string;
  accuracy: number;
  avg_time_s: number;
  attempts: number;
}

export interface ChapterBreakdownItem {
  chapter_name: string;
  attempt_count: number;
  fill?: string;
}

export interface TopicBubbleItem {
  topic_name: string;
  attempts: number;
  accuracy: number;
  avg_score: number;
}

export interface AttemptHistoryItem {
  id: string;
  question_title: string;
  chapter_name: string;
  topic_name: string;
  final_score: number | null;
  status: AttemptStatus;
  submitted_at: string | null;
  time_taken_s: number | null;
}

// ─── Grading ─────────────────────────────────────────────────
export interface GradingResult {
  exact_match_score: number;  // 0-10
  gemini_score: number;       // 0-10
  final_score: number;        // 0-10 weighted
  approach_breakdown: string;
  feedback: string;
  correct_answer_hint: string;
  xp_awarded: number;
  coins_awarded: number;
  gemini_raw_response: unknown;
}

// ─── Practice Session ─────────────────────────────────────────
export interface PracticeSession {
  chapter_id: string | null;
  topic_id: string | null;
  question_id: string | null;
}
