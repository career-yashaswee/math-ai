"use client";

import * as React from "react";
import { Button as BaseButton, type ButtonProps as BaseButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePlaySound } from "@/shared/hooks/usePlaySound";
import { type AudioKey } from "@/shared/constants/audio";

export interface CoreButtonProps extends BaseButtonProps {
  /** Enables future micro-interactions and audio feedback */
  interactive?: boolean;
  children?: React.ReactNode;
  /** Audio key to play on click. Defaults to 'CLICK'. */
  sound?: AudioKey;
  /** Disable sound for this specific button instance */
  disableSound?: boolean;
}

/**
 * Design System Wrapper for Button.
 * Future extension point for:
 * - Motion animations (Framer Motion)
 * - Audio feedback (useSound hooks)
 * - Micro-interactions
 */
export const Button = React.forwardRef<HTMLButtonElement, CoreButtonProps>(
  ({ className, interactive = true, sound = "CLICK", disableSound = false, onClick, ...props }, ref) => {
    const playSound = usePlaySound(sound);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (interactive && !disableSound) {
        playSound();
      }
      if (onClick) {
        onClick(e as any);
      }
    };

    return (
      <BaseButton
        ref={ref}
        className={cn("transition-all duration-200", className)}
        onClick={handleClick}
        {...props}
      />
    );
  }
);

Button.displayName = "CoreButton";
