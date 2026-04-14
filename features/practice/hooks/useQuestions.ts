"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/shared/lib/supabase/client";
import type { QuestionSafe } from "@/shared/types/domain.types";

/**
 * Fetches questions for a given topic from the safe view (no correct_answer).
 */
export function useQuestions(topicId: string | null) {
  const supabase = createClient();

  return useQuery<QuestionSafe[]>({
    queryKey: ["questions", topicId],
    enabled: !!topicId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions_safe")
        .select("*")
        .eq("topic_id", topicId!)
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (error) throw new Error(error.message);
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetches a single question by ID from the safe view.
 */
export function useQuestion(questionId: string | null) {
  const supabase = createClient();

  return useQuery<QuestionSafe | null>({
    queryKey: ["question", questionId],
    enabled: !!questionId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions_safe")
        .select("*")
        .eq("id", questionId!)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
}
