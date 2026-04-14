"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useGoogleLogin } from "@/features/auth/hooks/useGoogleLogin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, Loader2 } from "lucide-react";

export function UserProfileWidget() {
  const { user } = useAuth();
  const { signOut, isLoggingOut } = useGoogleLogin();

  const name =
    user?.user_metadata?.full_name ??
    user?.email?.split("@")[0] ??
    "Student";
  const avatar = user?.user_metadata?.avatar_url;
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="bg-card border-border card-hover">
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border border-primary/20">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold leading-tight">{name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-primary/70 mt-0.5">Class 12 · Mathematics</p>
            </div>
          </div>

          <Button
            id="logout-btn"
            variant="ghost"
            size="sm"
            onClick={signOut}
            disabled={isLoggingOut}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
