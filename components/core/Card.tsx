"use client";

import * as React from "react";
import * as BaseCard from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface CoreCardProps extends React.ComponentPropsWithoutRef<typeof BaseCard.Card> {
  interactive?: boolean;
}

/**
 * Design System Wrapper for Card components.
 */
export const Card = React.forwardRef<HTMLDivElement, CoreCardProps>(
  ({ className, interactive = true, ...props }, ref) => {
    return (
      <BaseCard.Card
        ref={ref}
        className={cn(
          "transition-all duration-200",
          interactive && "hover:border-primary/40",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "CoreCard";

export const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof BaseCard.CardHeader>>(
  ({ className, ...props }, ref) => (
    <BaseCard.CardHeader ref={ref} className={className} {...props} />
  )
);
CardHeader.displayName = "CoreCardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<typeof BaseCard.CardTitle>>(
  ({ className, ...props }, ref) => (
    <BaseCard.CardTitle ref={ref} className={className} {...props} />
  )
);
CardTitle.displayName = "CoreCardTitle";

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<typeof BaseCard.CardDescription>>(
  ({ className, ...props }, ref) => (
    <BaseCard.CardDescription ref={ref} className={className} {...props} />
  )
);
CardDescription.displayName = "CoreCardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof BaseCard.CardContent>>(
  ({ className, ...props }, ref) => (
    <BaseCard.CardContent ref={ref} className={className} {...props} />
  )
);
CardContent.displayName = "CoreCardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof BaseCard.CardFooter>>(
  ({ className, ...props }, ref) => (
    <BaseCard.CardFooter ref={ref} className={className} {...props} />
  )
);
CardFooter.displayName = "CoreCardFooter";
