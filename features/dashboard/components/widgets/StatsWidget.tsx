"use client";

import { Card, CardContent, Skeleton } from "@/components/core";
import { Flame, Coins, Zap, Target, TrendingUp, Star } from "lucide-react";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  suffix?: string;
  iconClassName?: string;
}

function StatCard({ icon: Icon, label, value, suffix, iconClassName }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 border border-border/50">
      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", iconClassName)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground leading-none mb-1">{label}</p>
        <p className="text-lg font-bold tabular-nums leading-none">
          {value}
          {suffix && <span className="text-sm font-normal text-muted-foreground ml-1">{suffix}</span>}
        </p>
      </div>
    </div>
  );
}

export function StatsWidget() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const statItems: StatCardProps[] = [
    {
      icon: Flame,
      label: "Streak",
      value: stats?.streak ?? 0,
      suffix: "days",
      iconClassName: "bg-orange-500/10 text-orange-400",
    },
    {
      icon: Coins,
      label: "Coins",
      value: stats?.coins ?? 0,
      iconClassName: "bg-yellow-500/10 text-yellow-400",
    },
    {
      icon: Zap,
      label: "XP",
      value: stats?.xp ?? 0,
      iconClassName: "bg-primary/10 text-primary",
    },
    {
      icon: Star,
      label: "Points",
      value: stats?.points ?? 0,
      iconClassName: "bg-purple-500/10 text-purple-400",
    },
    {
      icon: Target,
      label: "Attempts",
      value: stats?.total_attempts ?? 0,
      iconClassName: "bg-blue-500/10 text-blue-400",
    },
    {
      icon: TrendingUp,
      label: "Avg Score",
      value: stats?.avg_score?.toFixed(1) ?? "—",
      suffix: "/10",
      iconClassName: "bg-green-500/10 text-green-400",
    },
  ];

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {statItems.map((item) => (
            <StatCard key={item.label} {...item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
