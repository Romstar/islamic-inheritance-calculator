import Link from "next/link";
import ArticlePage from "@/components/ArticlePage";
import JsonLd from "@/components/JsonLd";
import { SourceLinks } from "@/components/SourceLinks";
import { GUIDE_PAGES, HUB_PAGE } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";
import { getSiteUrl, SITE_NAME } from "@/lib/site";

export const metadata = pageMetadata({
  title: HUB_PAGE.title,
  description: HUB_PAGE.description,
  path: HUB_PAGE.href,
  keywords: HUB_PAGE.keywords,
});

export default function GuidesPage() {
  const origin = getSiteUrl();
  return (
    <ArticlePage title={HUB_PAGE.title} lead={HUB_PAGE.description} href={HUB_PAGE.href}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: HUB_PAGE.title,
          description: HUB_PAGE.description,
          url: `${origin}${HUB_PAGE.href}`,
          isPartOf: { "@type": "WebSite", name: SITE_NAME, url: origin },
        }}
      />
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-900">All guides</h2>
        <ul className="divide-y divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 bg-white">
          {GUIDE_PAGES.map((page) => (
            <li key={page.href}>
              <Link href={page.href} className="block px-4 py-4 hover:bg-zinc-50">
                <span className="block text-sm font-semibold text-zinc-900">{page.title}</span>
                <span className="mt-1 block text-sm text-zinc-600">{page.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <p className="text-sm text-zinc-600">
        These pages are for education. They are not a fatwa and not a court ruling.{" "}
        <Link href="/scope" className="font-medium text-emerald-800 underline-offset-2 hover:underline">
          Read what this version covers
        </Link>
        .
      </p>
      <SourceLinks ids={["quran-4-13", "islamqa-10447", "islamqa-225165"]} />
    </ArticlePage>
  );
}
