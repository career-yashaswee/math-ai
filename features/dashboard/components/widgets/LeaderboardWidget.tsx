"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy } from "lucide-react";
import { useLeaderboard } from "@/features/dashboard/hooks/useLeaderboard";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";
import { getInitials } from "@/shared/utils/profile";

const RANK_STYLES: Record<number, string> = {
  1: "text-yellow-400 font-bold",
  2: "text-slate-300 font-bold",
  3: "text-orange-400 font-bold",
};

const RANK_ICONS: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

export function LeaderboardWidget() {
  const { data, isLoading } = useLeaderboard();
  const { user } = useAuth();

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Trophy className="w-4 h-4 text-yellow-400" />
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </>
        ) : !data || data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No leaders yet — be the first!
          </p>
        ) : (
          data.map((entry) => {
            const isCurrentUser = entry.id === user?.id;
            const initials = getInitials(entry.full_name ?? "Anonymous");

            return (
              <div
                key={entry.id}
                className={cn(
                  "flex items-center gap-3 p-2.5 rounded-lg transition-colors",
                  isCurrentUser
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-secondary/50"
                )}
              >
                {/* Rank */}
                <span
                  className={cn(
                    "w-6 text-center text-sm",
                    RANK_STYLES[entry.rank as number] ?? "text-muted-foreground"
                  )}
                >
                  {RANK_ICONS[entry.rank as number] ?? `#${entry.rank}`}
                </span>

                {/* Avatar */}
                <Avatar className="w-7 h-7">
                  <AvatarImage src={entry.avatar_url ?? undefined} />
                  <AvatarFallback className="text-xs bg-secondary">{initials}</AvatarFallback>
                </Avatar>

                {/* Name */}
                <span className="flex-1 text-sm font-medium truncate">
                  {isCurrentUser ? "You" : (entry.full_name ?? "Anonymous")}
                </span>

                {/* Points */}
                <span className="text-sm font-bold tabular-nums text-primary">
                  {entry.points}
                  <span className="text-xs font-normal text-muted-foreground ml-1">pts</span>
                </span>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
