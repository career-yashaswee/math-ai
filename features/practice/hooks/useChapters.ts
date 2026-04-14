"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/shared/lib/supabase/client";
import type { Chapter } from "@/shared/types/domain.types";

/**
 * Fetches all active chapters for Class 12.
 */
export function useChapters() {
  const supabase = createClient();

  return useQuery<Chapter[]>({
    queryKey: ["chapters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("class", 12)
        .eq("is_active", true)
        .order("order_index", { ascending: true });

      if (error) throw new Error(error.message);
      return data ?? [];
    },
    staleTime: 10 * 60 * 1000, // chapters rarely change
  });
}
