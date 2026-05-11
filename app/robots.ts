import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/signup"],
        disallow: [
          "/api/",
          "/dashboard",
          "/history",
          "/analytics",
          "/calendar",
          "/spending",
          "/brands",
          "/settings",
          "/profile",
        ],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
