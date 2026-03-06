import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/par-practice/:path*",
        destination: "/study/par/:path*",
        permanent: true,
      },
      {
        source: "/par-practice",
        destination: "/study/par",
        permanent: true,
      },
      {
        source: "/par-test/:path*",
        destination: "/test-prep/par/:path*",
        permanent: true,
      },
      {
        source: "/par-test",
        destination: "/test-prep/par",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
