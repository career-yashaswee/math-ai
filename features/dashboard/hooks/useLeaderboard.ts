"use client";

import { useQuery } from "@tanstack/react-query";
import { assertOk } from "@/shared/utils/error-handler";
import { useAttemptHistory } from "@/features/practice/hooks/useAttempt";
import type { LeaderboardEntry } from "@/shared/types/domain.types";
import { API_ROUTES } from "@/shared/constants/api-routes";

export function useLeaderboard() {
  return useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await fetch(API_ROUTES.USERS.LEADERBOARD);
      await assertOk(res);
      const json = await res.json();
      return json.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

// Re-export for convenience
export { useAttemptHistory };
