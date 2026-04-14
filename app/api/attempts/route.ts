import { createServerSupabaseClient } from "@/shared/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError, Errors } from "@/shared/utils/error-handler";
import { writeAuditLog, AuditEvents, extractRequestMeta } from "@/shared/utils/audit-logger";
import type { CreateAttemptRequest, CreateAttemptResponse, PaginatedResponse } from "@/shared/types/api.types";
import type { ApiSuccess } from "@/shared/types/api.types";
import type { AttemptHistoryItem } from "@/shared/types/domain.types";
import { z } from "zod";

const createAttemptSchema = z.object({
  question_id: z.string().uuid("Invalid question ID"),
});

// POST /api/attempts — Start a new attempt
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw Errors.unauthorized();

    const body = await request.json() as CreateAttemptRequest;
    const parsed = createAttemptSchema.safeParse(body);
    if (!parsed.success) {
      throw Errors.validation("Invalid request", parsed.error.flatten());
    }

    const { question_id } = parsed.data;

    // Verify question exists and is active
    const { data: question, error: qErr } = await supabase
      .from("questions")
      .select("id")
      .eq("id", question_id)
      .eq("is_active", true)
      .single();

    if (qErr || !question) throw Errors.notFound("Question");

    // Create attempt
    const { data: attempt, error } = await supabase
      .from("attempts")
      .insert({
        user_id: user.id,
        question_id,
        status: "in_progress",
      })
      .select("id, question_id, started_at, status")
      .single();

    if (error || !attempt) throw Errors.internal("Failed to create attempt");

    const meta = extractRequestMeta(request);
    await writeAuditLog({
      userId: user.id,
      event: AuditEvents.ATTEMPT_STARTED,
      entityType: "attempt",
      entityId: attempt.id,
      metadata: { question_id },
      ...meta,
    });

    return NextResponse.json<ApiSuccess<CreateAttemptResponse>>(
      { data: attempt as CreateAttemptResponse },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// GET /api/attempts — List user's attempts with history
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw Errors.unauthorized();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 10)));
    const from = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from("attempts")
      .select(
        `
        id, status, submitted_at, time_taken_s, created_at,
        questions:question_id (
          id, title,
          topics:topic_id (
            id, name,
            chapters:chapter_id (id, name)
          )
        ),
        analysis (final_score)
        `,
        { count: "exact" }
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(from, from + limit - 1);

    if (error) throw Errors.internal("Failed to fetch attempts");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatted: AttemptHistoryItem[] = (data ?? []).map((a: any) => ({
      id: a.id,
      question_title: a.questions?.title ?? "Unknown",
      chapter_name: a.questions?.topics?.chapters?.name ?? "—",
      topic_name: a.questions?.topics?.name ?? "—",
      final_score: a.analysis?.[0]?.final_score ?? null,
      status: a.status,
      submitted_at: a.submitted_at,
      time_taken_s: a.time_taken_s,
    }));

    return NextResponse.json<ApiSuccess<PaginatedResponse<AttemptHistoryItem>>>({
      data: {
        data: formatted,
        total: count ?? 0,
        page,
        limit,
        hasMore: (count ?? 0) > from + limit,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
