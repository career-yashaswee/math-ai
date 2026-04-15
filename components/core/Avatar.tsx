"use client";

import * as React from "react";
import * as BaseAvatar from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export const Avatar = React.forwardRef<
  React.ElementRef<typeof BaseAvatar.Avatar>,
  React.ComponentPropsWithoutRef<typeof BaseAvatar.Avatar>
>(({ className, ...props }, ref) => (
  <BaseAvatar.Avatar
    ref={ref}
    className={cn("transition-transform duration-200 hover:scale-105", className)}
    {...props}
  />
));
Avatar.displayName = "CoreAvatar";

export const AvatarImage = BaseAvatar.AvatarImage;
export const AvatarFallback = BaseAvatar.AvatarFallback;
