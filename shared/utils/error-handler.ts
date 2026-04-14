// ─────────────────────────────────────────────────────────────
// Global Error Handler — Standardized error handling utility
// ─────────────────────────────────────────────────────────────
import type { ApiError } from "@/shared/types/api.types";
import { NextResponse } from "next/server";

// ─── Known Error Codes ────────────────────────────────────────
export const ErrorCodes = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  DUPLICATE: "DUPLICATE",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  EXTERNAL_API_ERROR: "EXTERNAL_API_ERROR",
  RATE_LIMITED: "RATE_LIMITED",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

// ─── App Error Class ──────────────────────────────────────────
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(
    message: string,
    code: ErrorCode = ErrorCodes.INTERNAL_ERROR,
    statusCode = 500,
    details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

// ─── HTTP Status Shortcuts ────────────────────────────────────
export const Errors = {
  unauthorized: (msg = "You must be logged in") =>
    new AppError(msg, ErrorCodes.UNAUTHORIZED, 401),

  forbidden: (msg = "You do not have permission to perform this action") =>
    new AppError(msg, ErrorCodes.FORBIDDEN, 403),

  notFound: (resource = "Resource") =>
    new AppError(`${resource} not found`, ErrorCodes.NOT_FOUND, 404),

  validation: (msg: string, details?: unknown) =>
    new AppError(msg, ErrorCodes.VALIDATION_ERROR, 400, details),

  internal: (msg = "Something went wrong. Please try again.") =>
    new AppError(msg, ErrorCodes.INTERNAL_ERROR, 500),

  externalApi: (service: string, details?: unknown) =>
    new AppError(
      `External service error: ${service}`,
      ErrorCodes.EXTERNAL_API_ERROR,
       502,
      details
    ),
};

// ─── API Route Error Handler ──────────────────────────────────
/**
 * Use inside API routes to normalize errors into JSON responses.
 * Logs the error and returns a consistent ApiError shape.
 */
export function handleApiError(error: unknown): NextResponse<ApiError> {
  if (error instanceof AppError) {
    return NextResponse.json<ApiError>(
      { error: error.message, code: error.code, details: error.details },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    console.error("[API Error]", error.message, error.stack);
    return NextResponse.json<ApiError>(
      { error: "An unexpected error occurred", code: ErrorCodes.INTERNAL_ERROR },
      { status: 500 }
    );
  }

  console.error("[API Error] Unknown error:", error);
  return NextResponse.json<ApiError>(
    { error: "An unexpected error occurred", code: ErrorCodes.INTERNAL_ERROR },
    { status: 500 }
  );
}

// ─── Client-side Error Parser ─────────────────────────────────
/**
 * Parse fetch responses into typed errors on the client.
 */
export async function parseApiError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as ApiError;
    return body.error || "Something went wrong";
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

/**
 * Throws if the API response is not OK. Use after fetch calls.
 */
export async function assertOk(response: Response): Promise<void> {
  if (!response.ok) {
    const message = await parseApiError(response);
    throw new Error(message);
  }
}
