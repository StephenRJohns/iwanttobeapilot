import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      // For OAuth providers (Google), find or create the user in the DB
      if (account?.provider === "google") {
        try {
          const { db } = await import("@/lib/db");
          const email = user.email;
          if (!email) return false;

          let dbUser = await db.user.findUnique({ where: { email } });

          if (!dbUser) {
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
                refresh_token: account.refresh_token as string | undefined,
                access_token: account.access_token as string | undefined,
                expires_at: account.expires_at as number | undefined,
                token_type: account.token_type as string | undefined,
                scope: account.scope as string | undefined,
              },
            });
          }

          // Stash the DB id so the jwt callback gets it
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
  },
});
