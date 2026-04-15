"use client";

import * as React from "react";
import { Badge as BaseBadge, type BadgeProps as BaseBadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface CoreBadgeProps extends BaseBadgeProps {
  interactive?: boolean;
  children?: React.ReactNode;
}

/**
 * Design System Wrapper for Badge.
 * Features:
 * - Subtle scale on hover/tap (interactive mode)
 */
export const Badge = ({ className, interactive = false, ...props }: CoreBadgeProps) => {
  const motionProps = interactive
    ? {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        transition: { type: "spring", stiffness: 500, damping: 30 } as const,
      }
    : {};

  return (
    <motion.span {...motionProps} className="inline-block">
      <BaseBadge
        className={cn(
          "transition-all duration-200",
          interactive && "cursor-pointer",
          className
        )}
        {...props}
      />
    </motion.span>
  );
};

Badge.displayName = "CoreBadge";
