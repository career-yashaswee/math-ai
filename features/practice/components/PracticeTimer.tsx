"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { formatDuration } from "@/shared/utils/date";

interface PracticeTimerProps {
  startedAt?: Date;
  className?: string;
}

/**
 * Displays elapsed time since the practice started.
 * Self-ticking — updates every second.
 */
export function PracticeTimer({ startedAt, className }: PracticeTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = startedAt ?? new Date();
    const update = () => {
      setElapsed(Math.floor((Date.now() - start.getTime()) / 1000));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return (
    <div className={`flex items-center gap-1.5 text-muted-foreground text-sm tabular-nums ${className ?? ""}`}>
      <Clock className="w-3.5 h-3.5" />
      <span>{formatDuration(elapsed)}</span>
    </div>
  );
}

/**
 * Returns elapsed seconds from a start Date.
 * Use this value when submitting the attempt.
 */
export function getElapsedSeconds(startedAt: Date): number {
  return Math.floor((Date.now() - startedAt.getTime()) / 1000);
}
