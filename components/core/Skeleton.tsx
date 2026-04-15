"use client";

import { Skeleton as BaseSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <BaseSkeleton
      className={cn("bg-muted/40", className)}
      {...props}
    />
  );
}
