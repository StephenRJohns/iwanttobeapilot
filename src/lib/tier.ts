import type { Session } from "next-auth";

export type UserTier = "free" | "pro" | "beta";
export type ProFeature =
  | "progress_timeline"
  | "dpe_finder"
  | "ratings"
  | "stories_post"
  | "discussions";

export function isPro(session: Session | null): boolean {
  if (!session?.user) return false;
  const tier = (session.user as { tier?: string }).tier;
  return tier === "pro" || tier === "beta";
}

export function hasProAccess(session: Session | null, feature: ProFeature): boolean {
  return isPro(session);
}

export function getUserTier(session: Session | null): UserTier {
  if (!session?.user) return "free";
  const tier = (session.user as { tier?: string }).tier;
  return (tier as UserTier) ?? "free";
}

export function isAdmin(session: Session | null): boolean {
  if (!session?.user) return false;
  const role = (session.user as { role?: string }).role;
  return role === "admin";
}
