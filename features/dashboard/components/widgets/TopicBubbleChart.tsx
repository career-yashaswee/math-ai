"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTopicBubbleData } from "@/features/dashboard/hooks/useDashboardStats";

export function TopicBubbleChart() {
  const { data, isLoading } = useTopicBubbleData();

  const chartData = (data ?? []).map((d) => ({
    x: d.attempts,
    y: d.accuracy,
    z: Math.max(d.attempts * 40, 100),
    name: d.topic_name,
    avg_score: d.avg_score,
  }));

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <span className="text-primary text-base">◉</span>
          Topic Attempts
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          X = Attempts · Y = Accuracy % · Size = Volume
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-48 w-full rounded-lg" />
        ) : !chartData.length ? (
          <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
            No data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="oklch(1 0 0 / 6%)" strokeDasharray="4 4" />
              <XAxis
                type="number"
                dataKey="x"
                name="Attempts"
                tick={{ fontSize: 10, fill: "oklch(0.60 0 0)" }}
                tickLine={false}
                axisLine={false}
                label={{ value: "Attempts", position: "insideBottom", offset: -2, fontSize: 10, fill: "oklch(0.50 0 0)" }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Accuracy"
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "oklch(0.60 0 0)" }}
                tickLine={false}
                axisLine={false}
              />
              <ZAxis type="number" dataKey="z" range={[60, 400]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  background: "oklch(0.12 0 0)",
                  border: "1px solid oklch(1 0 0 / 10%)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any, name: any) => {
                  if (name === "Attempts") return [value, "Attempts"];
                  if (name === "Accuracy") return [`${value}%`, "Accuracy"];
                  return [value, name];
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                labelFormatter={(_: any, payload: readonly any[]) => payload?.[0]?.payload?.name ?? ""}
              />
              <Scatter
                name="Topics"
                data={chartData}
                fill="oklch(0.696 0.191 142.495)"
                fillOpacity={0.7}
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
