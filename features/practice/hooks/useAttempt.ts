"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { assertOk } from "@/shared/utils/error-handler";
import type { CreateAttemptResponse, SubmitAttemptRequest, SubmitAttemptResponse } from "@/shared/types/api.types";
import { API_ROUTES } from "@/shared/constants/api-routes";

/**
 * Creates a new attempt for a question (start practice).
 * On success, redirects to the attempt page.
 */
export function useCreateAttempt() {
  const router = useRouter();

  return useMutation<CreateAttemptResponse, Error, { question_id: string }>({
    mutationFn: async ({ question_id }) => {
      const res = await fetch(API_ROUTES.ATTEMPTS.BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question_id }),
      });
      await assertOk(res);
      const json = await res.json() as { data: CreateAttemptResponse };
      return json.data;
    },
    onSuccess: (attempt) => {
      router.push(`/practice/${attempt.question_id}/attempt?attemptId=${attempt.id}`);
    },
    onError: (error) => {
      toast.error("Could not start practice", { description: error.message });
    },
  });
}

/**
 * Submits the student's answer for an attempt.
 * On success, triggers analysis and redirects.
 */
export function useSubmitAttempt(attemptId: string) {
  const router = useRouter();

  return useMutation<SubmitAttemptResponse, Error, SubmitAttemptRequest>({
    mutationFn: async (body) => {
      const res = await fetch(API_ROUTES.ATTEMPTS.BY_ID(attemptId), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await assertOk(res);
      const json = await res.json() as { data: SubmitAttemptResponse };
      return json.data;
    },
    onSuccess: async () => {
      // Trigger analysis generation
      try {
        const analysisRes = await fetch(API_ROUTES.ANALYSIS.BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attempt_id: attemptId }),
        });
        await assertOk(analysisRes);
        router.push(`/practice/${attemptId}/analysis`);
      } catch {
        toast.error("Analysis failed. Please try submitting again.");
      }
    },
    onError: (error) => {
      toast.error("Failed to submit answer", { description: error.message });
    },
  });
}

/**
 * Fetches a full attempt with question and analysis.
 */
export function useAttempt(attemptId: string | null) {
  return useQuery({
    queryKey: ["attempt", attemptId],
    enabled: !!attemptId,
    queryFn: async () => {
      const res = await fetch(API_ROUTES.ATTEMPTS.BY_ID(attemptId!));
      await assertOk(res);
      const json = await res.json();
      return json.data;
    },
  });
}

/**
 * Fetches paginated attempt history.
 */
export function useAttemptHistory(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["attempts", "history", page, limit],
    queryFn: async () => {
      const res = await fetch(API_ROUTES.ATTEMPTS.HISTORY(page, limit));
      await assertOk(res);
      const json = await res.json();
      return json.data;
    },
  });
}
