import { createServerSupabaseClient, createAdminClient } from "@/shared/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError, Errors } from "@/shared/utils/error-handler";
import type { ApiSuccess, UserStatsResponse } from "@/shared/types/api.types";

// GET /api/users/stats
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw Errors.unauthorized();

    const admin = createAdminClient();

    // User base stats
    const { data: profile } = await admin
      .from("users")
      .select("xp, coins, points, streak")
      .eq("id", user.id)
      .single();

    if (!profile) throw Errors.notFound("User profile");

    // Aggregate attempt stats
    const { data: attemptStats } = await admin
      .from("attempts")
      .select("id, status")
      .eq("user_id", user.id)
      .neq("status", "in_progress");

    const totalAttempts = attemptStats?.length ?? 0;

    // Avg score from analysis
    const { data: analysisStats } = await admin
      .from("analysis")
      .select("final_score")
      .eq("user_id", user.id);

    const avgScore =
      analysisStats && analysisStats.length > 0
        ? analysisStats.reduce((sum, a) => sum + (a.final_score ?? 0), 0) /
          analysisStats.length
        : 0;

    // Accuracy: percentage of attempts with score >= 5
    const passedAttempts =
      analysisStats?.filter((a) => (a.final_score ?? 0) >= 5).length ?? 0;
    const accuracyPercent =
      analysisStats && analysisStats.length > 0
        ? Math.round((passedAttempts / analysisStats.length) * 100)
        : 0;

    // Last attempt date
    const { data: lastAttempt } = await admin
      .from("attempts")
      .select("submitted_at")
      .eq("user_id", user.id)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .single();

    const stats: UserStatsResponse = {
      streak: profile.streak,
      coins: profile.coins,
      xp: profile.xp,
      points: profile.points,
      total_attempts: totalAttempts,
      avg_score: Math.round(avgScore * 10) / 10,
      accuracy_percent: accuracyPercent,
      last_attempt_date: lastAttempt?.submitted_at ?? null,
    };

    return NextResponse.json<ApiSuccess<UserStatsResponse>>({ data: stats });
  } catch (error) {
    return handleApiError(error);
  }
}
