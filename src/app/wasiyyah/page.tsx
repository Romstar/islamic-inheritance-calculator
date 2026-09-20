import Link from "next/link";
import ArticlePage from "@/components/ArticlePage";
import JsonLd from "@/components/JsonLd";
import { Cited } from "@/components/SourceLinks";
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
        <Cited sources={["bukhari-2742", "muslim-1628a", "islamqa-174421"]}>
          A wasiyyah is an optional bequest. Sa&apos;d ibn Abi Waqqas asked to give two-thirds, then
          half. The Prophet ﷺ allowed one-third and said one-third is a lot.
        </Cited>
        <Cited sources={["quran-4-11", "islamqa-200127", "islamqa-10447"]}>
          In Faraid it comes after funeral costs and debts, and before Quranic shares. If the will
          asks for more, this calculator cuts it to one-third.
        </Cited>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">Order of payment</h2>
        <ol className="list-decimal space-y-3 pl-5">
          <Cited as="li" sources={["islamqa-44039", "islamqa-200127"]}>
            Funeral and burial costs
          </Cited>
          <Cited as="li" sources={["quran-4-11", "islamqa-200127", "islamqa-47057"]}>
            Debts of the deceased
          </Cited>
          <Cited as="li" sources={["bukhari-2742", "islamqa-174421"]}>
            The will, up to one-third of what remains
          </Cited>
          <Cited as="li" sources={["quran-4-11", "quran-4-12", "bukhari-6732"]}>
            Quranic and residuary shares on the rest
          </Cited>
        </ol>
        <p className="text-sm text-zinc-600">
          Amounts are optional. You can leave money blank and still see fractions and percentages.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">What this tool does not decide</h2>
        <Cited sources={["abudawud-2870", "islamqa-174421", "islamqa-10447"]}>
          A bequest to an heir often needs the other heirs to agree. The Prophet ﷺ said there is no
          bequest for an heir. Local law can also limit a will. This tool only applies the
          one-third cap. It does not check the beneficiary.{" "}
          <Link
            href="/how-it-works"
            className="font-medium text-emerald-800 underline-offset-2 hover:underline"
          >
            See the full order of Faraid
          </Link>
          .
        </Cited>
      </section>
    </ArticlePage>
  );
}
