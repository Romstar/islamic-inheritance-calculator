import type { Metadata } from "next";
import { getSiteUrl, SITE_NAME } from "./site";

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
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
