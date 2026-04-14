import { createServerSupabaseClient } from "@/shared/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError, Errors } from "@/shared/utils/error-handler";
import type { ApiSuccess } from "@/shared/types/api.types";
import type { LeaderboardEntry } from "@/shared/types/domain.types";

// GET /api/users/leaderboard — Top 10 performers by points
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw Errors.unauthorized();

    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .limit(10);

    if (error) throw Errors.internal("Failed to fetch leaderboard");

    return NextResponse.json<ApiSuccess<LeaderboardEntry[]>>({
      data: data as LeaderboardEntry[],
    });
  } catch (error) {
    return handleApiError(error);
  }
}
