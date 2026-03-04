import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { authConfig } from "@/lib/auth.config";

console.log("[auth init] AUTH_SECRET set:", !!process.env.AUTH_SECRET, "len:", process.env.AUTH_SECRET?.length);
console.log("[auth init] NEXTAUTH_SECRET set:", !!process.env.NEXTAUTH_SECRET, "len:", process.env.NEXTAUTH_SECRET?.length);
console.log("[auth init] DATABASE_URL starts with pg:", process.env.DATABASE_URL?.startsWith("postgresql://"));

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  trustHost: true,
  debug: true,
  ...authConfig,
});
