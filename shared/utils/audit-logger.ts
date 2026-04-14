// ─────────────────────────────────────────────────────────────
// Audit Logger — Writes structured events to Supabase audit_logs
// ─────────────────────────────────────────────────────────────
import { createAdminClient } from "@/shared/lib/supabase/server";

// ─── Event Types ──────────────────────────────────────────────
export const AuditEvents = {
  // Auth
  USER_LOGIN: "user.login",
  USER_LOGOUT: "user.logout",
  USER_CREATED: "user.created",

  // Practice
  ATTEMPT_STARTED: "attempt.started",
  ATTEMPT_SUBMITTED: "attempt.submitted",
  ANALYSIS_GENERATED: "analysis.generated",
  ANALYSIS_FAILED: "analysis.failed",

  // User
  PROFILE_UPDATED: "user.profile_updated",

  // System
  LEADERBOARD_VIEWED: "leaderboard.viewed",
  ERROR: "system.error",
} as const;

export type AuditEvent = (typeof AuditEvents)[keyof typeof AuditEvents];

interface AuditLogPayload {
  userId?: string | null;
  event: AuditEvent;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Write a structured audit log entry to Supabase.
 * Uses the admin client — only call from API routes.
 * Non-blocking: errors are swallowed to avoid disrupting main flow.
 */
export async function writeAuditLog(payload: AuditLogPayload): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.from("audit_logs").insert({
      user_id: payload.userId ?? null,
      event_type: payload.event,
      entity_type: payload.entityType ?? null,
      entity_id: payload.entityId ?? null,
      metadata: (payload.metadata ?? null) as import("@/shared/types/database.types").Json | null,
      ip_address: payload.ipAddress ?? null,
      user_agent: payload.userAgent ?? null,
    });
  } catch (error) {
    // Audit log failures must never crash the main request
    console.error("[AuditLog] Failed to write audit log:", error);
  }
}

/**
 * Helper to extract client metadata from a Next.js request.
 */
export function extractRequestMeta(request: Request): {
  ipAddress: string | undefined;
  userAgent: string | undefined;
} {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  return {
    ipAddress: (forwardedFor?.split(",")[0] || realIp || undefined) ?? undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
  };
}
