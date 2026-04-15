"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@/components/core";
import { PieChart as PieIcon } from "lucide-react";
import { useChapterBreakdown } from "@/features/dashboard/hooks/useDashboardStats";

const COLORS = [
  "oklch(0.70 0.19 142)",
  "oklch(0.60 0 0)",
  "oklch(0.45 0 0)",
  "oklch(0.35 0 0)",
  "oklch(0.25 0 0)",
  "oklch(0.55 0.10 142)",
  "oklch(0.65 0.15 142)",
];

export function AttemptBreakdownPie() {
  const { data, isLoading } = useChapterBreakdown();

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <PieIcon className="w-4 h-4 text-primary" />
          Attempts by Chapter
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-48 w-full rounded-lg" />
        ) : !data || data.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
            No data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="attempt_count"
                nameKey="chapter_name"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "oklch(0.12 0 0)",
                  border: "1px solid oklch(1 0 0 / 10%)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [value, "Attempts"]}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 10, color: "oklch(0.60 0 0)" }}
                formatter={(value: string) =>
                  value.length > 16 ? `${value.slice(0, 16)}…` : value
                }
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
