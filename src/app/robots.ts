import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://iwanttobeapilot.online";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard",
          "/settings",
          "/auth/",
          "/community/stories/new",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
