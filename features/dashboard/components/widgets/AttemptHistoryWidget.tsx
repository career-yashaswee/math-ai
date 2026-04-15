"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Skeleton,
} from "@/components/core";
import { History, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useAttemptHistory } from "@/features/practice/hooks/useAttempt";
import { friendlyDate, formatDuration } from "@/shared/utils/date";
import { useRouter } from "next/navigation";
import type { AttemptHistoryItem } from "@/shared/types/domain.types";

const STATUS_LABELS = {
  in_progress: { label: "In Progress", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  submitted: { label: "Submitted", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  analysed: { label: "Analysed", color: "bg-green-500/10 text-green-400 border-green-500/20" },
};

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-xs text-muted-foreground">—</span>;
  const color =
    score >= 8
      ? "text-green-400"
      : score >= 5
      ? "text-yellow-400"
      : "text-red-400";
  return (
    <span className={`text-sm font-bold tabular-nums ${color}`}>
      {score.toFixed(1)}
      <span className="text-xs font-normal text-muted-foreground">/10</span>
    </span>
  );
}

export function AttemptHistoryWidget() {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { data, isLoading } = useAttemptHistory(page, 5);

  const items: AttemptHistoryItem[] = data?.data ?? [];
  const total: number = data?.total ?? 0;
  const hasMore: boolean = data?.hasMore ?? false;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-semibold">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            Attempt History
          </div>
          <span className="text-xs font-normal text-muted-foreground">
            {total} total
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No attempts yet — start practising!
          </p>
        ) : (
          items.map((item) => {
            const status = STATUS_LABELS[item.status];
            return (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.question_title}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {item.chapter_name} › {item.topic_name}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="outline" className={`text-xs ${status.color}`}>
                      {status.label}
                    </Badge>
                    {item.submitted_at && (
                      <span className="text-xs text-muted-foreground">
                        {friendlyDate(item.submitted_at)}
                      </span>
                    )}
                    {item.time_taken_s && (
                      <span className="text-xs text-muted-foreground">
                        {formatDuration(item.time_taken_s)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <ScoreBadge score={item.final_score} />
                  {item.status === "analysed" && (
                    <button
                      onClick={() => router.push(`/practice/${item.id}/analysis`)}
                      className="text-xs text-primary/70 hover:text-primary flex items-center gap-1 transition-colors"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Pagination */}
        {total > 5 && (
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-xs gap-1"
            >
              <ChevronLeft className="w-3 h-3" />
              Prev
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {page}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore}
              className="text-xs gap-1"
            >
              Next
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
