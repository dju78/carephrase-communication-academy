import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://comms.carephrase.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  // Public, indexable pages only (auth-gated dashboard/modules excluded).
  const paths = ["", "/privacy", "/accessibility", "/contact", "/install"];
  return paths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.6,
  }));
}
