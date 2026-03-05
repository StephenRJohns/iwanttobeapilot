import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dpe-finder/:path*",
    "/community/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/par-practice/:path*",
    "/par-test/:path*",
  ],
};
