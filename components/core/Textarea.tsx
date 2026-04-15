"use client";

import * as React from "react";
import { Textarea as BaseTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface CoreTextareaProps extends React.ComponentProps<"textarea"> {
  interactive?: boolean;
}

/**
 * Design System Wrapper for Textarea.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, CoreTextareaProps>(
  ({ className, interactive = true, ...props }, ref) => {
    return (
      <BaseTextarea
        ref={ref}
        className={cn(
          "transition-all duration-200 focus-visible:ring-primary/50",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "CoreTextarea";
