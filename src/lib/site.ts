/** Canonical site URL for sitemap, Open Graph, and JSON-LD. */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.URL ||
    "https://islamic-inheritance-calculator.netlify.app";
  return raw.replace(/\/$/, "");
}

export const SITE_NAME = "Islamic Inheritance Calculator";

/** Stable public logo used in Google Search Console / JSON-LD. */
export const LOGO_PATH = "/logo.png";
export const LOGO_SVG_PATH = "/logo.svg";
export const LOGO_WIDTH = 512;
export const LOGO_HEIGHT = 512;
export const OG_IMAGE_PATH = "/og-image.png";
