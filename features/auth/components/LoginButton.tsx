"use client";

import { useGoogleLogin } from "@/features/auth/hooks/useGoogleLogin";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoginButtonProps {
  variant?: "default" | "outline" | "ghost";
  className?: string;
}

/**
 * Renders the "Continue with Google" button.
 * Triggers Supabase OAuth on click.
 */
export function LoginButton({
  variant = "default",
  className,
}: LoginButtonProps) {
  const { signInWithGoogle, isLoading } = useGoogleLogin();

  return (
    <Button
      id="google-login-btn"
      variant={variant}
      onClick={signInWithGoogle}
      disabled={isLoading}
      className={`relative h-12 px-8 text-base font-semibold gap-3 ${className ?? ""}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <GoogleIcon />
          <span>Continue with Google</span>
        </>
      )}
    </Button>
  );
}

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="20"
      height="20"
      aria-hidden="true"
    >
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.5 7 29.5 4.9 24 4.9 13.5 4.9 5 13.4 5 24s8.5 19.1 19 19.1c10.5 0 19-8.6 19-19.1 0-1.3-.1-2.6-.4-3.9z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.5 15.8 18.9 12 24 12c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.5 7 29.5 4.9 24 4.9c-7.8 0-14.5 4.4-18.2 10.9l.5-.1z"
      />
      <path
        fill="#4CAF50"
        d="M24 43.1c5.2 0 10.1-2 13.7-5.3l-6.3-5.3c-2 1.5-4.5 2.4-7.4 2.4-5.2 0-9.6-3.1-11.3-7.5l-6.5 5c3.6 6.7 10.6 10.7 18.3 10.7h.5z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-.8 2.4-2.4 4.4-4.5 5.8l6.3 5.3C36.9 39.5 43 33.9 43 24c0-1.3-.1-2.6-.4-3.9z"
      />
    </svg>
  );
}
