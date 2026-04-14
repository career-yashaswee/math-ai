import { createServerSupabaseClient, createAdminClient } from "@/shared/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError, Errors } from "@/shared/utils/error-handler";
import { writeAuditLog, AuditEvents, extractRequestMeta } from "@/shared/utils/audit-logger";
import { getGeminiFlashModel, buildAnalysisPrompt } from "@/shared/lib/gemini/client";
import {
  computeExactMatchScore,
  computeFinalScore,
  computeRewards,
  computeStreak,
  getISTDate,
} from "@/shared/utils/grading";
import { z } from "zod";
import type { ApiSuccess, CreateAnalysisResponse } from "@/shared/types/api.types";

const analysisSchema = z.object({
  attempt_id: z.string().uuid("Invalid attempt ID"),
});

// POST /api/analysis — Generate Gemini analysis for a submitted attempt
export async function POST(request: NextRequest) {
  const admin = createAdminClient();
  const meta = extractRequestMeta(request);
  let userId: string | null = null;

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw Errors.unauthorized();
    userId = user.id;

    const body = await request.json();
    const parsed = analysisSchema.safeParse(body);
    if (!parsed.success) throw Errors.validation("Invalid request", parsed.error.flatten());

    const { attempt_id } = parsed.data;

    // Verify attempt
    const { data: attempt } = await admin
      .from("attempts")
      .select("id, user_id, question_id, student_answer, status")
      .eq("id", attempt_id)
      .eq("user_id", user.id)
      .single();

    if (!attempt) throw Errors.notFound("Attempt");
    if (attempt.status !== "submitted") {
      throw Errors.validation("Attempt must be submitted before analysis");
    }

    // Check if analysis already exists
    const { data: existing } = await admin
      .from("analysis")
      .select("id")
      .eq("attempt_id", attempt_id)
      .single();

    if (existing) {
      throw Errors.validation("Analysis already exists for this attempt");
    }

    // Get question with correct_answer (admin bypasses RLS)
    const { data: question } = await admin
      .from("questions")
      .select("id, body, correct_answer, marks")
      .eq("id", attempt.question_id)
      .single();

    if (!question) throw Errors.notFound("Question");

    // Get user profile for streak/rewards calculation
    const { data: userProfile } = await admin
      .from("users")
      .select("xp, coins, points, streak, last_attempt_date")
      .eq("id", user.id)
      .single();

    if (!userProfile) throw Errors.notFound("User profile");

    // === GRADING PIPELINE ===

    // 1. Exact match score (keyword overlap)
    const exactMatchScore = computeExactMatchScore(
      attempt.student_answer ?? "",
      question.correct_answer
    );

    // 2. Gemini analysis (with retry)
    let geminiScore = 0;
    let approachBreakdown = "";
    let feedback = "";
    let correctAnswerHint = "";
    let geminiRawResponse: unknown = null;

    for (let attempt_count = 0; attempt_count < 2; attempt_count++) {
      try {
        const model = getGeminiFlashModel();
        const prompt = buildAnalysisPrompt(
          question.body,
          attempt.student_answer ?? "",
          question.correct_answer
        );

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const parsed = JSON.parse(text) as {
          gemini_score: number;
          approach_breakdown: string;
          feedback: string;
          correct_answer_hint: string;
        };

        geminiScore = Math.max(0, Math.min(10, Number(parsed.gemini_score) || 0));
        approachBreakdown = parsed.approach_breakdown ?? "";
        feedback = parsed.feedback ?? "";
        correctAnswerHint = parsed.correct_answer_hint ?? "";
        geminiRawResponse = parsed;
        break;
      } catch (geminiError) {
        console.error(`[Analysis] Gemini attempt ${attempt_count + 1} failed:`, geminiError);
        if (attempt_count === 1) {
          // Both attempts failed — use fallback values
          geminiScore = exactMatchScore * 0.6;
          approachBreakdown = "Analysis could not be generated at this time.";
          feedback = "Please try submitting again for a detailed analysis.";
          correctAnswerHint = "Refer to your textbook for the correct solution.";
        }
      }
    }

    // 3. Final score
    const finalScore = computeFinalScore(exactMatchScore, geminiScore);

    // 4. Compute rewards
    const { newStreak, shouldUpdate } = computeStreak(
      userProfile.streak,
      userProfile.last_attempt_date
    );
    const { xp, coins } = computeRewards(finalScore, newStreak);

    // === SAVE ===

    // Save analysis
    const { data: analysis, error: analysisError } = await admin
      .from("analysis")
      .insert({
        attempt_id,
        user_id: user.id,
        exact_match_score: exactMatchScore,
        gemini_score: geminiScore,
        final_score: finalScore,
        approach_breakdown: approachBreakdown,
        feedback,
        correct_answer_hint: correctAnswerHint,
        gemini_raw_response: geminiRawResponse as import("@/shared/types/database.types").Json | null,
        xp_awarded: xp,
        coins_awarded: coins,
      })
      .select()
      .single();

    if (analysisError || !analysis) throw Errors.internal("Failed to save analysis");

    // Update attempt status
    await admin
      .from("attempts")
      .update({ status: "analysed" })
      .eq("id", attempt_id);

    // Update user stats
    const baseUpdate = {
      xp: (userProfile.xp ?? 0) + xp,
      coins: (userProfile.coins ?? 0) + coins,
      points: (userProfile.points ?? 0) + Math.round(finalScore),
      ...(shouldUpdate ? { streak: newStreak, last_attempt_date: getISTDate() } : {}),
    };

    await admin.from("users").update(baseUpdate).eq("id", user.id);

    await writeAuditLog({
      userId: user.id,
      event: AuditEvents.ANALYSIS_GENERATED,
      entityType: "analysis",
      entityId: analysis.id,
      metadata: { attempt_id, finalScore, xp, coins },
      ...meta,
    });

    return NextResponse.json<ApiSuccess<CreateAnalysisResponse>>({
      data: {
        id: analysis.id,
        final_score: finalScore,
        exact_match_score: exactMatchScore,
        gemini_score: geminiScore,
        approach_breakdown: approachBreakdown,
        feedback,
        correct_answer_hint: correctAnswerHint,
        xp_awarded: xp,
        coins_awarded: coins,
      },
    }, { status: 201 });
  } catch (error) {
    await writeAuditLog({
      userId: userId ?? undefined,
      event: AuditEvents.ANALYSIS_FAILED,
      metadata: { error: String(error) },
      ...meta,
    });
    return handleApiError(error);
  }
}

// GET /api/analysis?attempt_id=xxx — Get analysis for an attempt
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw Errors.unauthorized();

    const { searchParams } = new URL(request.url);
    const attemptId = searchParams.get("attempt_id");
    if (!attemptId) throw Errors.validation("attempt_id is required");

    const { data, error } = await supabase
      .from("analysis")
      .select("*")
      .eq("attempt_id", attemptId)
      .eq("user_id", user.id)
      .single();

    if (error || !data) throw Errors.notFound("Analysis");

    return NextResponse.json<ApiSuccess<typeof data>>({ data });
  } catch (error) {
    return handleApiError(error);
  }
}
