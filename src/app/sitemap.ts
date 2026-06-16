import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://comms.carephrase.com";

// Bump this when the public pages' content meaningfully changes, so the
// sitemap reflects real updates instead of a fresh timestamp on every crawl.
const lastModified = "2026-06-15";

export default function sitemap(): MetadataRoute.Sitemap {
  // Public, indexable pages only (auth-gated dashboard/modules excluded).
  const paths = ["", "/privacy", "/accessibility", "/contact", "/install"];
  return paths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.6,
  }));
}
