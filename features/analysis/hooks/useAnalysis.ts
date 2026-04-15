"use client";

import { useQuery } from "@tanstack/react-query";
import { assertOk } from "@/shared/utils/error-handler";
import type { Analysis } from "@/shared/types/domain.types";
import { API_ROUTES } from "@/shared/constants/api-routes";

/**
 * Fetches the analysis for a given attempt ID.
 */
export function useAnalysis(attemptId: string | null) {
  return useQuery<Analysis>({
    queryKey: ["analysis", attemptId],
    enabled: !!attemptId,
    retry: 3,
    retryDelay: 1000,
    queryFn: async () => {
      const res = await fetch(API_ROUTES.ANALYSIS.BY_ATTEMPT_ID(attemptId!));
      await assertOk(res);
      const json = await res.json();
      return json.data;
    },
  });
}
