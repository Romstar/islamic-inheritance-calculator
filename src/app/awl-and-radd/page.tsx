import Link from "next/link";
import ArticlePage from "@/components/ArticlePage";
import JsonLd from "@/components/JsonLd";
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
        <p className="text-sm text-zinc-600">
          &apos;Awl applies when Quranic fractions add up to more than one. Every share is reduced
          in the same proportion. A common example is a husband with two sisters: one-half plus
          two-thirds is more than the whole estate, so the base rises and each share shrinks.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">When a remainder is left</h2>
        <p className="text-sm text-zinc-600">
          Radd returns the leftover estate to blood relatives who already took a fixed share.
          The spouse does not take radd in the common Sunni positions, except in some Hanafi cases
          when no other heir remains.
        </p>
        <p className="text-sm text-zinc-600">
          Classical Maliki practice sends leftover estate to the public treasury instead of radd.
          This version of the calculator still uses one share engine for every school.{" "}
          <Link
            href="/schools"
            className="font-medium text-emerald-800 underline-offset-2 hover:underline"
          >
            Read the school notes
          </Link>
          .
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">How the results page labels this</h2>
        <p className="text-sm text-zinc-600">
          The calculator marks the method as standard shares, &apos;awl, or radd. It also shows the
          problem base (asl al-mas&apos;ala) after that adjustment.
        </p>
      </section>
    </ArticlePage>
  );
}
