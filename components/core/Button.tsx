"use client";

import * as React from "react";
import { Button as BaseButton, type ButtonProps as BaseButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePlaySound } from "@/shared/hooks/usePlaySound";
import { type AudioKey } from "@/shared/constants/audio";
import { motion } from "framer-motion";

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
 * Features:
 * - Subtle scale on hover/tap
 * - Audio feedback (useSound)
 * - Minimalist transition
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

    const motionProps = interactive
      ? {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          transition: { type: "spring", stiffness: 500, damping: 30 } as const,
        }
      : {};

    const MotionBaseButton = motion.create(BaseButton);

    return (
      <MotionBaseButton
        ref={ref}
        className={cn("transition-colors duration-200", className)}
        onClick={handleClick}
        {...motionProps}
        {...props}
      />
    );
  }
);

Button.displayName = "CoreButton";
