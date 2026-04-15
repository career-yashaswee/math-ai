"use client";

import { useQuery } from "@tanstack/react-query";
import { assertOk } from "@/shared/utils/error-handler";
import type { UserStatsResponse } from "@/shared/types/api.types";
import type { HeatmapData, AccuracyDataPoint, ChapterBreakdownItem, TopicBubbleItem } from "@/shared/types/domain.types";
import { createClient } from "@/shared/lib/supabase/client";
import { getPastNDays, getWeekKey } from "@/shared/utils/date";
import { API_ROUTES } from "@/shared/constants/api-routes";

/**
 * Dashboard stats: streak, XP, coins, accuracy, total attempts
 */
export function useDashboardStats() {
  return useQuery<UserStatsResponse>({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const res = await fetch(API_ROUTES.USERS.STATS);
      await assertOk(res);
      const json = await res.json();
      return json.data;
    },
    staleTime: 30 * 1000,
  });
}

/**
 * Submission heatmap data — last 365 days of attempt counts by date.
 * Groups data into weeks (for 52-week grid) and calculates total contributions.
 */
export function useHeatmapData() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["dashboard", "heatmap"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { weeks: [], totalContributions: 0 };

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

      let totalContributions = 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const a of (data ?? []) as any[]) {
        const day = new Date(a.created_at).toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata",
        });
        if (dayCountMap[day] !== undefined) {
          dayCountMap[day]++;
          totalContributions++;
        }
      }

      const heatmapData = Object.entries(dayCountMap).map(([date, count]) => ({ date, count }));
      
      // Group into weeks
      const weeks: { date: string; count: number }[][] = [];
      let week: { date: string; count: number }[] = [];

      for (let i = 0; i < heatmapData.length; i++) {
        const d = new Date(heatmapData[i].date);
        // Pad the first week if it doesn't start on Sunday
        if (week.length === 0 && d.getDay() !== 0) {
          for (let j = 0; j < d.getDay(); j++) {
            week.push({ date: "", count: 0 });
          }
        }
        week.push(heatmapData[i]);
        if (d.getDay() === 6 || i === heatmapData.length - 1) {
          weeks.push(week);
          week = [];
        }
      }

      return {
        weeks: weeks.slice(-52),
        totalContributions,
      };
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
 * Topic attempts bubble chart data.
 * Pre-formats data for Recharts ScatterChart (x, y, z mappings).
 */
export function useTopicBubbleData() {
  const supabase = createClient();

  return useQuery({
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

      return Object.entries(topicMap).map(([topic_name, { scores, count }]) => {
        const attempts = count;
        const accuracy = scores.length > 0
          ? Math.round((scores.filter((s) => s >= 5).length / scores.length) * 100)
          : 0;
        const avg_score = scores.length > 0
          ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
          : 0;

        return {
          x: attempts,
          y: accuracy,
          z: Math.max(attempts * 40, 100),
          name: topic_name,
          avg_score,
        };
      });
    },
    staleTime: 5 * 60 * 1000,
  });
}
