import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
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
