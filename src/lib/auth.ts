import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

console.log("[auth init] AUTH_SECRET set:", !!process.env.AUTH_SECRET, "len:", process.env.AUTH_SECRET?.length);

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  debug: true,
  ...authConfig,
});
