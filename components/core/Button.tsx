"use client";

import * as React from "react";
import { Button as BaseButton, type ButtonProps as BaseButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CoreButtonProps extends BaseButtonProps {
  /** Enables future micro-interactions and audio feedback */
  interactive?: boolean;
}

/**
 * Design System Wrapper for Button.
 * Future extension point for:
 * - Motion animations (Framer Motion)
 * - Audio feedback (useSound hooks)
 * - Micro-interactions
 */
export const Button = React.forwardRef<HTMLButtonElement, CoreButtonProps>(
  ({ className, interactive = true, ...props }, ref) => {
    // TODO: Future integration point for useInteractionFeedback() hook
    
    return (
      <BaseButton
        ref={ref}
        className={cn("transition-all duration-200", className)}
        {...props}
      />
    );
  }
);

Button.displayName = "CoreButton";
