import Link from "next/link";
import ArticlePage from "@/components/ArticlePage";
import JsonLd from "@/components/JsonLd";
import { guidePage } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

const page = guidePage("/wasiyyah");

export const metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: page.href,
  keywords: page.keywords,
});

export default function WasiyyahPage() {
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
        <h2 className="text-lg font-semibold text-zinc-900">The one-third cap</h2>
        <p className="text-sm text-zinc-600">
          A wasiyyah is an optional bequest. In Faraid it comes after funeral costs and debts, and
          before Quranic shares. The cap is one-third of the net estate. If the will asks for more,
          this calculator cuts it to one-third.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">Order of payment</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-zinc-600">
          <li>Funeral and burial costs</li>
          <li>Debts of the deceased</li>
          <li>The will, up to one-third of what remains</li>
          <li>Quranic and residuary shares on the rest</li>
        </ol>
        <p className="text-sm text-zinc-600">
          Amounts are optional. You can leave money blank and still see fractions and percentages.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">What this tool does not decide</h2>
        <p className="text-sm text-zinc-600">
          A bequest to an heir often needs the other heirs to agree. Local law can also limit a
          will. This tool only applies the one-third cap. It does not check the beneficiary.{" "}
          <Link
            href="/how-it-works"
            className="font-medium text-emerald-800 underline-offset-2 hover:underline"
          >
            See the full order of Faraid
          </Link>
          .
        </p>
      </section>
    </ArticlePage>
  );
}
