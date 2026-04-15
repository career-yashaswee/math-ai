"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/core";
import { useHeatmapData } from "@/features/dashboard/hooks/useDashboardStats";
import { Activity } from "lucide-react";
import { friendlyDate } from "@/shared/utils/date";

const CELL = 12;

function getColor(count: number): string {
  if (count === 0) return "oklch(0.15 0 0)";
  if (count === 1) return "oklch(0.40 0.10 142)";
  if (count === 2) return "oklch(0.55 0.14 142)";
  if (count <= 4) return "oklch(0.65 0.16 142)";
  return "oklch(0.72 0.19 142)";
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function HeatmapWidget() {
  const { data, isLoading } = useHeatmapData();
  const weeks = data?.weeks ?? [];
  const totalContributions = data?.totalContributions ?? 0;

  return (
    <Card className="bg-card border-border">

      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-semibold">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Submission Activity
          </div>
          <span className="text-xs font-normal text-muted-foreground">
            {totalContributions} attempts in the past year
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {isLoading ? (
          <Skeleton className="h-28 w-full rounded-lg" />
        ) : (
          <div className="inline-flex gap-0.5 min-w-max">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mt-5 mr-1">
              {DAY_LABELS.map((d, i) =>
                i % 2 === 1 ? (
                  <div
                    key={d}
                    style={{ height: CELL, fontSize: 9, lineHeight: `${CELL}px` }}
                    className="text-muted-foreground/60"
                  >
                    {d}
                  </div>
                ) : (
                  <div key={d} style={{ height: CELL }} />
                )
              )}
            </div>

            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((day, di) => (
                  <Tooltip key={di}>
                    <TooltipTrigger>
                      <div
                        style={{
                          width: CELL,
                          height: CELL,
                          borderRadius: 2,
                          background: day.date ? getColor(day.count) : "transparent",
                        }}
                      />
                    </TooltipTrigger>
                    {day.date && (
                      <TooltipContent side="top" className="text-xs">
                        <span className="font-medium">
                          {day.count} {day.count === 1 ? "attempt" : "attempts"}
                        </span>
                        <br />
                        {friendlyDate(day.date)}
                      </TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
          <span>Less</span>
          {[0, 1, 2, 3, 5].map((c) => (
            <div
              key={c}
              className="w-3 h-3 rounded-sm"
              style={{ background: getColor(c) }}
            />
          ))}
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
