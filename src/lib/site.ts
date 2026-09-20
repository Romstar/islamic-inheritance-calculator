/** Canonical site URL for sitemap, Open Graph, and JSON-LD. */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.URL ||
    "https://islamic-inheritance-calculator.netlify.app";
  return raw.replace(/\/$/, "");
}

export const SITE_NAME = "Islamic Inheritance Calculator";
