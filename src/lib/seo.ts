import type { Metadata } from "next";
import {
  getSiteUrl,
  LOGO_HEIGHT,
  LOGO_PATH,
  LOGO_WIDTH,
  OG_IMAGE_PATH,
  SITE_NAME,
} from "./site";

export function pageMetadata({
  title,
  description,
  path,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = `${getSiteUrl()}${path}`;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: path === "/" ? "website" : "article",
      images: [
        {
          url: OG_IMAGE_PATH,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE_PATH],
    },
  };
}

export function siteGraphJsonLd(): Record<string, unknown> {
  const origin = getSiteUrl();
  const logoUrl = `${origin}${LOGO_PATH}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${origin}/#organization`,
        name: SITE_NAME,
        url: origin,
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
          contentUrl: logoUrl,
          width: LOGO_WIDTH,
          height: LOGO_HEIGHT,
          caption: SITE_NAME,
        },
        image: logoUrl,
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: origin,
        name: SITE_NAME,
        publisher: { "@id": `${origin}/#organization` },
        inLanguage: "en",
      },
    ],
  };
}
