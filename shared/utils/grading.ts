// ─────────────────────────────────────────────────────────────
// Grading Utility — Multi-signal rubric for subjective answers
// All computation is server-side only.
// ─────────────────────────────────────────────────────────────

/**
 * Computes a keyword-based overlap score (0–10) between the
 * student's answer and the correct answer.
 * Uses a simple F1-style precision/recall metric.
 */
export function computeExactMatchScore(
  studentAnswer: string,
  correctAnswer: string
): number {
  const STOP_WORDS = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "shall", "can", "to", "of", "in", "on",
    "at", "by", "for", "with", "from", "that", "this", "it", "and", "or",
    "not", "no", "if", "then", "so", "but", "as", "into", "its", "we",
    "our", "he", "she", "they", "their", "here", "there",
  ]);

  const normalize = (text: string): string[] =>
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  const studentTokens = normalize(studentAnswer);
  const correctTokens = normalize(correctAnswer);

  if (correctTokens.length === 0) return 0;
  if (studentTokens.length === 0) return 0;

  const studentSet = new Set(studentTokens);
  const correctSet = new Set(correctTokens);

  let overlap = 0;
  for (const word of correctSet) {
    if (studentSet.has(word)) overlap++;
  }

  const precision = overlap / (studentSet.size || 1);
  const recall = overlap / correctSet.size;

  const f1 =
    precision + recall > 0
      ? (2 * precision * recall) / (precision + recall)
      : 0;

  return Math.round(f1 * 10 * 10) / 10; // 0–10, one decimal
}

/**
 * Compute the weighted final score from multiple grading signals.
 *
 * Weights:
 * - Exact Match: 25% (keyword overlap heuristic)
 * - Gemini LLM:  75% (semantic + mathematical understanding)
 */
export function computeFinalScore(
  exactMatchScore: number,
  geminiScore: number
): number {
  const weighted = 0.25 * exactMatchScore + 0.75 * geminiScore;
  return Math.round(weighted * 10) / 10; // one decimal
}

/**
 * Compute XP and coins from a final score.
 * Streak bonus adds 20% to XP if streak > 1.
 */
export function computeRewards(
  finalScore: number,
  streak: number
): { xp: number; coins: number } {
  const baseXp = Math.round(finalScore * 10); // max 100
  const streakBonus = streak > 1 ? 1.2 : 1.0;
  const xp = Math.round(baseXp * streakBonus);
  const coins = Math.round(finalScore); // max 10

  return { xp, coins };
}

/**
 * Compute streak based on last attempt date.
 * Returns { streak, shouldUpdate } for a given user.
 */
export function computeStreak(
  currentStreak: number,
  lastAttemptDate: string | null
): { newStreak: number; shouldUpdate: boolean } {
  const today = getISTDate();

  if (!lastAttemptDate) {
    return { newStreak: 1, shouldUpdate: true };
  }

  const last = new Date(lastAttemptDate);
  const lastDateIST = getISTDateFromDate(last);

  if (lastDateIST === today) {
    // Already attempted today — streak unchanged
    return { newStreak: currentStreak, shouldUpdate: false };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayIST = getISTDateFromDate(yesterday);

  if (lastDateIST === yesterdayIST) {
    // Consecutive day — increment streak
    return { newStreak: currentStreak + 1, shouldUpdate: true };
  }

  // Streak broken
  return { newStreak: 1, shouldUpdate: true };
}

// ─── IST Date Helpers ─────────────────────────────────────────
function getISTDate(): string {
  return new Date()
    .toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // YYYY-MM-DD
}

function getISTDateFromDate(date: Date): string {
  return date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export { getISTDate };
