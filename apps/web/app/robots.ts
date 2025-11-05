import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "http://localhost:3000";

  return {
    rules: [
      {
        // applies this rule to all web crawlers
        userAgent: "*",
        // allows crawlers to access the root and all pages by default
        allow: "/",
        // block crawlers from accessing:
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/private/",
          "/account",
          "/orders",
          "/wishlist",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
