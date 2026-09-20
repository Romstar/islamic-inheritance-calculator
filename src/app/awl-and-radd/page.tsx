import Link from "next/link";
import ArticlePage from "@/components/ArticlePage";
import JsonLd from "@/components/JsonLd";
import { Cited } from "@/components/SourceLinks";
import { guidePage } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

const page = guidePage("/awl-and-radd");

export const metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: page.href,
  keywords: page.keywords,
});

export default function AwlAndRaddPage() {
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
        <h2 className="text-lg font-semibold text-zinc-900">When shares exceed the estate</h2>
        <Cited sources={["islamqa-131556", "islamqa-126233", "quran-4-11", "quran-4-12"]}>
          &apos;Awl applies when Quranic fractions add up to more than one. Every share is reduced
          in the same proportion. A common example is a husband with two sisters: one-half plus
          two-thirds is more than the whole estate, so the base rises and each share shrinks.
        </Cited>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">When a remainder is left</h2>
        <Cited sources={["islamqa-160948"]}>
          Radd returns the leftover estate to blood relatives who already took a fixed share. The
          spouse does not take radd in the common Sunni positions, except in some Hanafi cases when
          no other heir remains.
        </Cited>
        <Cited sources={["islamqa-160948", "islamqa-140167"]}>
          Classical Maliki practice, and a Shafi&apos;i view, send leftover estate to the public
          treasury instead of radd. This calculator follows that school split.{" "}
          <Link
            href="/schools"
            className="font-medium text-emerald-800 underline-offset-2 hover:underline"
          >
            Read the school notes
          </Link>
          .
        </Cited>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">How the results page labels this</h2>
        <Cited sources={["islamqa-131556", "islamqa-160948"]}>
          The calculator marks the method as standard shares, &apos;awl, or radd. It also shows the
          problem base (asl al-mas&apos;ala) after that adjustment.
        </Cited>
      </section>
    </ArticlePage>
  );
}
