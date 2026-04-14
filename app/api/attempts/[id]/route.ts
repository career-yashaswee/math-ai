import { createServerSupabaseClient } from "@/shared/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError, Errors } from "@/shared/utils/error-handler";
import { writeAuditLog, AuditEvents, extractRequestMeta } from "@/shared/utils/audit-logger";
import type { SubmitAttemptRequest, SubmitAttemptResponse, ApiSuccess } from "@/shared/types/api.types";
import { z } from "zod";

const submitSchema = z.object({
  student_answer: z.string().min(1, "Answer cannot be empty").max(50000),
  time_taken_s: z.number().int().min(0).max(7200), // max 2 hours
});

// GET /api/attempts/[id] — Get single attempt
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw Errors.unauthorized();

    const { data, error } = await supabase
      .from("attempts")
      .select(`
        *,
        questions:question_id (
          id, title, body, difficulty, marks, hint, topic_id,
          topics:topic_id (
            id, name,
            chapters:chapter_id (id, name)
          )
        ),
        analysis (*)
      `)
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !data) throw Errors.notFound("Attempt");

    return NextResponse.json<ApiSuccess<typeof data>>({ data });
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/attempts/[id] — Submit answer
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw Errors.unauthorized();

    // Verify ownership and status
    const { data: existing } = await supabase
      .from("attempts")
      .select("id, status, user_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!existing) throw Errors.notFound("Attempt");
    if (existing.status !== "in_progress") {
      throw Errors.validation("This attempt has already been submitted");
    }

    const body = await request.json() as SubmitAttemptRequest;
    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      throw Errors.validation("Invalid request", parsed.error.flatten());
    }

    const { student_answer, time_taken_s } = parsed.data;
    const submittedAt = new Date().toISOString();

    const { data: updated, error } = await supabase
      .from("attempts")
      .update({
        student_answer,
        time_taken_s,
        submitted_at: submittedAt,
        status: "submitted",
      })
      .eq("id", id)
      .select("id, status, submitted_at")
      .single();

    if (error || !updated) throw Errors.internal("Failed to submit attempt");

    const meta = extractRequestMeta(request);
    await writeAuditLog({
      userId: user.id,
      event: AuditEvents.ATTEMPT_SUBMITTED,
      entityType: "attempt",
      entityId: id,
      metadata: { time_taken_s },
      ...meta,
    });

    return NextResponse.json<ApiSuccess<SubmitAttemptResponse>>({
      data: updated as SubmitAttemptResponse,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
