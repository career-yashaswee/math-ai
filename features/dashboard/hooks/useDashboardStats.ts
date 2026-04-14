"use client";

import { useQuery } from "@tanstack/react-query";
import { assertOk } from "@/shared/utils/error-handler";
import type { UserStatsResponse } from "@/shared/types/api.types";
import type { HeatmapData, AccuracyDataPoint, ChapterBreakdownItem, TopicBubbleItem } from "@/shared/types/domain.types";
import { createClient } from "@/shared/lib/supabase/client";
import { getPastNDays, getWeekKey } from "@/shared/utils/date";

/**
 * Dashboard stats: streak, XP, coins, accuracy, total attempts
 */
export function useDashboardStats() {
  return useQuery<UserStatsResponse>({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/users/stats");
      await assertOk(res);
      const json = await res.json();
      return json.data;
    },
    staleTime: 30 * 1000,
  });
}

/**
 * Submission heatmap data — last 365 days of attempt counts by date
 */
export function useHeatmapData() {
  const supabase = createClient();

  return useQuery<HeatmapData[]>({
    queryKey: ["dashboard", "heatmap"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const { data } = await supabase
        .from("attempts")
        .select("created_at")
        .eq("user_id", user.id)
        .neq("status", "in_progress")
        .gte("created_at", oneYearAgo.toISOString());

      const dayCountMap: Record<string, number> = {};
      const allDays = getPastNDays(365);
      for (const d of allDays) dayCountMap[d] = 0;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const a of (data ?? []) as any[]) {
        const day = new Date(a.created_at).toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata",
        });
        if (dayCountMap[day] !== undefined) dayCountMap[day]++;
      }

      return Object.entries(dayCountMap).map(([date, count]) => ({ date, count }));
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Accuracy and average time per week for line chart
 */
export function useAccuracyOverTime() {
  const supabase = createClient();

  return useQuery<AccuracyDataPoint[]>({
    queryKey: ["dashboard", "accuracy-over-time"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const { data } = await supabase
        .from("attempts")
        .select(`
          created_at, time_taken_s,
          analysis (final_score)
        `)
        .eq("user_id", user.id)
        .eq("status", "analysed")
        .gte("created_at", threeMonthsAgo.toISOString())
        .order("created_at", { ascending: true });

      const weekMap: Record<string, { scores: number[]; times: number[] }> = {};

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const a of (data ?? []) as any[]) {
        const week = getWeekKey(a.created_at);
        if (!weekMap[week]) weekMap[week] = { scores: [], times: [] };
        const score = a.analysis?.[0]?.final_score;
        if (score != null) weekMap[week].scores.push(score);
        if (a.time_taken_s) weekMap[week].times.push(a.time_taken_s);
      }

      return Object.entries(weekMap).map(([week, { scores, times }]) => ({
        week,
        accuracy: scores.length > 0
          ? Math.round((scores.filter((s) => s >= 5).length / scores.length) * 100)
          : 0,
        avg_time_s: times.length > 0
          ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
          : 0,
        attempts: scores.length,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Chapter breakdown for pie chart
 */
export function useChapterBreakdown() {
  const supabase = createClient();

  return useQuery<ChapterBreakdownItem[]>({
    queryKey: ["dashboard", "chapter-breakdown"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data } = await supabase
        .from("attempts")
        .select(`
          questions:question_id (
            topics:topic_id (
              chapters:chapter_id (name)
            )
          )
        `)
        .eq("user_id", user.id)
        .neq("status", "in_progress");

      const chapterCount: Record<string, number> = {};
      for (const a of data ?? []) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const name = (a as any).questions?.topics?.chapters?.name ?? "Unknown";
        chapterCount[name] = (chapterCount[name] ?? 0) + 1;
      }

      return Object.entries(chapterCount).map(([chapter_name, attempt_count]) => ({
        chapter_name,
        attempt_count,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Topic attempts bubble chart data
 */
export function useTopicBubbleData() {
  const supabase = createClient();

  return useQuery<TopicBubbleItem[]>({
    queryKey: ["dashboard", "topic-bubbles"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data } = await supabase
        .from("attempts")
        .select(`
          questions:question_id (
            topics:topic_id (name)
          ),
          analysis (final_score)
        `)
        .eq("user_id", user.id)
        .eq("status", "analysed");

      const topicMap: Record<string, { scores: number[]; count: number }> = {};

      for (const a of data ?? []) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const name = (a as any).questions?.topics?.name ?? "Unknown";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const score = (a as any).analysis?.[0]?.final_score;
        if (!topicMap[name]) topicMap[name] = { scores: [], count: 0 };
        topicMap[name].count++;
        if (score != null) topicMap[name].scores.push(score);
      }

      return Object.entries(topicMap).map(([topic_name, { scores, count }]) => ({
        topic_name,
        attempts: count,
        accuracy: scores.length > 0
          ? Math.round((scores.filter((s) => s >= 5).length / scores.length) * 100)
          : 0,
        avg_score: scores.length > 0
          ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
          : 0,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}
