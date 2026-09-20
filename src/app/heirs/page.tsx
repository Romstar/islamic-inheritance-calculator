import Link from "next/link";
import ArticlePage from "@/components/ArticlePage";
import JsonLd from "@/components/JsonLd";
import { guidePage } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

const page = guidePage("/heirs");

export const metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: page.href,
  keywords: page.keywords,
});

export default function HeirsPage() {
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
        <h2 className="text-lg font-semibold text-zinc-900">Two kinds of heirs</h2>
        <p className="text-sm text-zinc-600">
          Quranic heirs (ashab al-furud) take a fixed fraction named in the Quran or the Sunnah.
          Residuary heirs (asaba) take what remains. Some people, such as the father or a
          daughter with a brother, can take both a fixed share and residue.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">Heirs in this calculator</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600">
          <li>Husband, or up to four wives</li>
          <li>Father, mother, paternal grandfather, paternal grandmother, maternal grandmother</li>
          <li>Sons, daughters, and grandchildren in the son&apos;s line (one generation)</li>
          <li>Full siblings, paternal half-siblings, and maternal (uterine) siblings</li>
          <li>Full and paternal brothers&apos; sons</li>
          <li>Full and paternal uncles, and their sons</li>
        </ul>
        <p className="text-sm text-zinc-600">
          Count only people who outlive the deceased. A living closer heir often blocks a farther
          one.{" "}
          <Link
            href="/hajb"
            className="font-medium text-emerald-800 underline-offset-2 hover:underline"
          >
            See blocking rules
          </Link>
          .
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">Who does not inherit here</h2>
        <p className="text-sm text-zinc-600">
          Version 1.0 does not cover children of daughters, great-grandparents, great-grandchildren,
          or other distant kindred. It also does not cover an unborn child, a missing person, a
          killer of the deceased, or a difference of religion.
        </p>
        <p className="text-sm text-zinc-600">
          <Link
            href="/scope"
            className="font-medium text-emerald-800 underline-offset-2 hover:underline"
          >
            Read the full scope list
          </Link>
          .
        </p>
      </section>
    </ArticlePage>
  );
}
