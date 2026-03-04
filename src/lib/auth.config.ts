import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const authConfig: NextAuthConfig = {
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
    async signIn({ user, account }) {
      // For OAuth providers (Google), find or create the user in the DB
      if (account?.provider === "google") {
        try {
          const { db } = await import("@/lib/db");
          const email = user.email;
          if (!email) return false;

          let dbUser = await db.user.findUnique({ where: { email } });

          if (!dbUser) {
            // Create new user for first-time Google sign-in
            dbUser = await db.user.create({
              data: {
                email,
                name: user.name,
                image: user.image,
                emailVerified: new Date(),
                tier: "free",
                role: "user",
                status: "active",
              },
            });
          }

          // Upsert the Account link
          const existing = await db.account.findFirst({
            where: { provider: "google", providerAccountId: account.providerAccountId },
          });
          if (!existing) {
            await db.account.create({
              data: {
                userId: dbUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token as string | undefined,
                refresh_token: account.refresh_token as string | undefined,
                expires_at: account.expires_at as number | undefined,
                token_type: account.token_type as string | undefined,
                scope: account.scope as string | undefined,
                id_token: account.id_token as string | undefined,
              },
            });
          }

          // Stash the DB id on the user object so the jwt callback gets it
          user.id = dbUser.id;
        } catch (err) {
          console.error("[auth] Google signIn callback error:", err);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
      }

      if (token.id) {
        try {
          const { db } = await import("@/lib/db");
          const dbUser = await db.user.findUnique({
            where: { id: token.id as string },
            select: {
              id: true,
              email: true,
              name: true,
              tier: true,
              role: true,
              status: true,
              sessionVersion: true,
              betaExpiresAt: true,
              pilotGoal: true,
            },
          });

          if (!dbUser || dbUser.status !== "active") {
            token.error = "account_disabled";
            return token;
          }

          // Check beta expiry
          let tier = dbUser.tier;
          if (tier === "beta" && dbUser.betaExpiresAt && dbUser.betaExpiresAt < new Date()) {
            await db.user.update({ where: { id: dbUser.id }, data: { tier: "free" } });
            tier = "free";
          }

          // Check session displacement
          if (
            trigger !== "signIn" &&
            typeof token.sessionVersion === "number" &&
            dbUser.sessionVersion !== token.sessionVersion
          ) {
            token.sessionDisplaced = true;
            return token;
          }

          token.email = dbUser.email;
          token.name = dbUser.name;
          token.tier = tier;
          token.role = dbUser.role;
          token.sessionVersion = dbUser.sessionVersion;
          token.pilotGoal = dbUser.pilotGoal;
        } catch {
          // DB unavailable - keep existing token data
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token.error === "account_disabled") {
        return { ...session, user: { ...session.user, disabled: true } };
      }
      if (token.sessionDisplaced) {
        return { ...session, user: { ...session.user, sessionDisplaced: true } };
      }
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          tier: token.tier as string,
          role: token.role as string,
          pilotGoal: token.pilotGoal as string | undefined,
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
