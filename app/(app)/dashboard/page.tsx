"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserProfileWidget } from "@/features/dashboard/components/widgets/UserProfileWidget";
import { StatsWidget } from "@/features/dashboard/components/widgets/StatsWidget";
import { HeatmapWidget } from "@/features/dashboard/components/widgets/HeatmapWidget";
import { AccuracyTimeChart } from "@/features/dashboard/components/widgets/AccuracyTimeChart";
import { AttemptBreakdownPie } from "@/features/dashboard/components/widgets/AttemptBreakdownPie";
import { LeaderboardWidget } from "@/features/dashboard/components/widgets/LeaderboardWidget";
import { TopicBubbleChart } from "@/features/dashboard/components/widgets/TopicBubbleChart";
import { AttemptHistoryWidget } from "@/features/dashboard/components/widgets/AttemptHistoryWidget";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";
import { ChevronRight, Zap } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: stats } = useDashboardStats();
  const hasAttempts = (stats?.total_attempts ?? 0) > 0;

  return (
    <div className="px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your Class 12 Mathematics practice overview
          </p>
        </div>

        {/* Main CTA */}
        <Button
          id="practice-cta-btn"
          onClick={() => router.push("/practice")}
          className="gap-2 green-glow-sm font-semibold"
          size="lg"
        >
          <Zap className="w-4 h-4" fill="currentColor" />
          Practice Now
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* User Profile */}
      <div className="mb-4">
        <UserProfileWidget />
      </div>

      {/* Stats Bar */}
      <div className="mb-4">
        <StatsWidget />
      </div>

      {!hasAttempts ? (
        /* ─── Empty State ─── */
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border/50 rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-primary" strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-semibold mb-2">Start Your Practice Journey</h2>
          <p className="text-muted-foreground text-sm max-w-xs mb-6">
            Your dashboard will come alive after your first practice attempt. Charts, heatmaps, and insights appear here.
          </p>
          <Button
            id="first-practice-btn"
            onClick={() => router.push("/practice")}
            className="gap-2 green-glow-sm"
          >
            Start First Practice
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        /* ─── Populated Dashboard ─── */
        <div className="space-y-4">
          {/* Heatmap — full width */}
          <HeatmapWidget />

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AccuracyTimeChart />
            <AttemptBreakdownPie />
          </div>

          {/* Leaderboard + Bubble Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <LeaderboardWidget />
            <TopicBubbleChart />
          </div>

          {/* Attempt History — full width */}
          <AttemptHistoryWidget />
        </div>
      )}
    </div>
  );
}
