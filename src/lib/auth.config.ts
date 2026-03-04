import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

/**
 * Auth config shared with middleware (edge runtime).
 * IMPORTANT: No Prisma / DB imports allowed here — edge runtime cannot use Prisma.
 * DB-touching callbacks (signIn, jwt, session) live in auth.ts instead.
 */
export const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // authorize is only called from the route handler (Node.js), not middleware
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("[auth] authorize: missing credentials");
          return null;
        }

        const { db } = await import("@/lib/db");
        const bcrypt = await import("bcryptjs");

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.hashedPassword) {
          console.log("[auth] authorize: user not found or no password", credentials.email);
          return null;
        }
        if (!user.emailVerified) {
          console.log("[auth] authorize: email not verified", credentials.email);
          return null;
        }
        if (user.status !== "active") {
          console.log("[auth] authorize: status not active", user.status);
          return null;
        }

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        );
        if (!valid) {
          console.log("[auth] authorize: password mismatch");
          return null;
        }

        // Increment sessionVersion to displace prior sessions
        const updated = await db.user.update({
          where: { id: user.id },
          data: { sessionVersion: { increment: 1 } },
        });

        return {
          id: updated.id,
          email: updated.email,
          name: updated.name,
          image: updated.image,
        };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 3600 },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  callbacks: {
    // Edge-safe session callback — reads custom fields from token, no DB access.
    // Used by middleware to populate auth.user.role for the authorized() check.
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          tier: token.tier as string,
          role: token.role as string,
        },
      };
    },
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const path = request.nextUrl.pathname;

      const adminRoutes = path.startsWith("/admin");
      const proRoutes =
        path.startsWith("/dashboard") ||
        path.startsWith("/dpe-finder") ||
        path.startsWith("/community") ||
        path.startsWith("/settings");

      if (adminRoutes) {
        const role = (auth?.user as { role?: string })?.role;
        return role === "admin";
      }
      if (proRoutes) return isLoggedIn;
      return true;
    },
  },
};
