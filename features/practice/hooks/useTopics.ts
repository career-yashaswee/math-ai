"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/shared/lib/supabase/client";
import type { Topic } from "@/shared/types/domain.types";

/**
 * Fetches topics for a given chapter ID.
 * Only runs when chapterId is provided.
 */
export function useTopics(chapterId: string | null) {
  const supabase = createClient();

  return useQuery<Topic[]>({
    queryKey: ["topics", chapterId],
    enabled: !!chapterId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("topics")
        .select("*")
        .eq("chapter_id", chapterId!)
        .eq("is_active", true)
        .order("order_index", { ascending: true });

      if (error) throw new Error(error.message);
      return data ?? [];
    },
    staleTime: 10 * 60 * 1000,
  });
}
