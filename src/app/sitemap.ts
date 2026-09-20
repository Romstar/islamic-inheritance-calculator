import type { MetadataRoute } from "next";
import { GUIDE_PAGES, HOME_PAGE, HUB_PAGE, SCOPE_PAGE } from "@/lib/guides";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteUrl();
  const lastModified = new Date();
  const pages = [HOME_PAGE, HUB_PAGE, SCOPE_PAGE, ...GUIDE_PAGES];

  return pages.map((page) => ({
    url: `${origin}${page.href === "/" ? "" : page.href}`,
    lastModified,
    changeFrequency: page.href === "/" ? "weekly" : "monthly",
    priority: page.href === "/" ? 1 : page.href === "/guides" ? 0.8 : 0.7,
  }));
}
