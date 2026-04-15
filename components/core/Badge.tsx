"use client";

import * as React from "react";
import { Badge as BaseBadge, type BadgeProps as BaseBadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface CoreBadgeProps extends BaseBadgeProps {
  interactive?: boolean;
  children?: React.ReactNode;
}

/**
 * Design System Wrapper for Badge.
 */
export const Badge = ({ className, interactive = false, ...props }: CoreBadgeProps) => {
  return (
    <BaseBadge
      className={cn(
        "transition-all duration-200",
        interactive && "cursor-pointer active:scale-95",
        className
      )}
      {...props}
    />
  );
};

Badge.displayName = "CoreBadge";
