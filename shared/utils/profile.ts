import type { User } from "@supabase/supabase-js";

/**
 * Extracts initials from a full name (up to 2 characters).
 */
export function getInitials(name: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Normalizes a Supabase user object into a simpler profile format.
 */
export function getUserProfile(user: User | null | undefined) {
  if (!user) {
    return {
      name: "Student",
      avatar: undefined,
      initials: "S",
      email: undefined,
    };
  }

  const name =
    user.user_metadata?.full_name ??
    user.email?.split("@")[0] ??
    "Student";
  
  const avatar = user.user_metadata?.avatar_url as string | undefined;
  const initials = getInitials(name);

  return {
    name,
    avatar,
    initials,
    email: user.email,
  };
}
