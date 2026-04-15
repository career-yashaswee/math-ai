"use client";

import * as React from "react";
import { Input as BaseInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface CoreInputProps extends React.ComponentProps<"input"> {
  interactive?: boolean;
}

/**
 * Design System Wrapper for Input.
 */
export const Input = React.forwardRef<HTMLInputElement, CoreInputProps>(
  ({ className, interactive = true, ...props }, ref) => {
    return (
      <BaseInput
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

Input.displayName = "CoreInput";
