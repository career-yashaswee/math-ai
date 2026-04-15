"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@/components/core";
import { TrendingUp } from "lucide-react";
import { useAccuracyOverTime } from "@/features/dashboard/hooks/useDashboardStats";

export function AccuracyTimeChart() {
  const { data, isLoading } = useAccuracyOverTime();

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <TrendingUp className="w-4 h-4 text-primary" />
          Accuracy Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-48 w-full rounded-lg" />
        ) : !data || data.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
            No data yet — start practising!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid stroke="oklch(1 0 0 / 6%)" strokeDasharray="4 4" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 10, fill: "oklch(0.60 0 0)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "oklch(0.60 0 0)" }}
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.12 0 0)",
                  border: "1px solid oklch(1 0 0 / 10%)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "oklch(0.97 0 0)" }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any, name: any) => [
                  name === "accuracy" ? `${value}%` : `${value}s`,
                  name === "accuracy" ? "Accuracy" : "Avg Time",
                ]}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="oklch(0.696 0.191 142.495)"
                strokeWidth={2}
                dot={{ fill: "oklch(0.696 0.191 142.495)", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
