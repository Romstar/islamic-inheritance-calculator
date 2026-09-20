import Link from "next/link";
import ArticlePage from "@/components/ArticlePage";
import JsonLd from "@/components/JsonLd";
import { Cited } from "@/components/SourceLinks";
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
        <Cited sources={["islamqa-140167"]}>
          Hajb hirman is full blocking. The farther relative takes nothing. Hajb nuqsan is partial
          blocking. The farther relative still inherits, but with a smaller fraction.
        </Cited>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">Common full blocks</h2>
        <ul className="list-disc space-y-3 pl-5">
          <Cited as="li" sources={["islamqa-131473", "islamqa-20782"]}>
            A son blocks grandchildren in the son&apos;s line.
          </Cited>
          <Cited as="li" sources={["islamqa-106599", "islamqa-130287", "quran-4-176"]}>
            A son or father blocks full and paternal siblings from residue.
          </Cited>
          <Cited as="li" sources={["islamqa-175366", "islamqa-225165"]}>
            A living father blocks the paternal grandfather.
          </Cited>
          <Cited as="li" sources={["abudawud-2895", "islamqa-175366"]}>
            The mother blocks the maternal grandmother.
          </Cited>
          <Cited as="li" sources={["bukhari-6732", "islamqa-135906", "islamqa-85136"]}>
            A closer male agnate blocks a farther uncle, nephew, or cousin.
          </Cited>
        </ul>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">Common reduced shares</h2>
        <ul className="list-disc space-y-3 pl-5">
          <Cited as="li" sources={["quran-4-12", "islamqa-85136"]}>
            A child reduces the husband from one-half to one-quarter.
          </Cited>
          <Cited as="li" sources={["quran-4-12", "islamqa-307"]}>
            A child reduces a wife from one-quarter to one-eighth.
          </Cited>
          <Cited as="li" sources={["quran-4-11", "islamqa-130287", "islamqa-185199"]}>
            A child, or two or more siblings, reduces the mother from one-third to one-sixth.
          </Cited>
        </ul>
        <Cited sources={["islamqa-140167", "islamqa-127945"]}>
          The calculator hides questions for relatives who cannot inherit in your case. The results
          page still lists blocked people and the reason.{" "}
          <Link
            href="/heirs"
            className="font-medium text-emerald-800 underline-offset-2 hover:underline"
          >
            See who can inherit
          </Link>
          .
        </Cited>
      </section>
    </ArticlePage>
  );
}
