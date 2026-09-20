import Link from "next/link";
import ArticlePage from "@/components/ArticlePage";
import JsonLd from "@/components/JsonLd";
import { guidePage } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

const page = guidePage("/hajb");

export const metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: page.href,
  keywords: page.keywords,
});

export default function HajbPage() {
  return (
    <ArticlePage title={page.title} lead={page.description} href={page.href}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: page.title,
          description: page.description,
          url: `${getSiteUrl()}${page.href}`,
        }}
      />
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">Two kinds of blocking</h2>
        <p className="text-sm text-zinc-600">
          Hajb hirman is full blocking. The farther relative takes nothing. Hajb nuqsan is partial
          blocking. The farther relative still inherits, but with a smaller fraction.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">Common full blocks</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600">
          <li>A son blocks grandchildren in the son&apos;s line.</li>
          <li>A son or father blocks full and paternal siblings from residue.</li>
          <li>A living father blocks the paternal grandfather.</li>
          <li>The mother blocks the maternal grandmother.</li>
          <li>A closer male agnate blocks a farther uncle, nephew, or cousin.</li>
        </ul>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">Common reduced shares</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600">
          <li>A child reduces the husband from one-half to one-quarter.</li>
          <li>A child reduces a wife from one-quarter to one-eighth.</li>
          <li>A child, or two or more siblings, reduces the mother from one-third to one-sixth.</li>
        </ul>
        <p className="text-sm text-zinc-600">
          The calculator hides questions for relatives who cannot inherit in your case. The results
          page still lists blocked people and the reason.{" "}
          <Link
            href="/heirs"
            className="font-medium text-emerald-800 underline-offset-2 hover:underline"
          >
            See who can inherit
          </Link>
          .
        </p>
      </section>
    </ArticlePage>
  );
}
