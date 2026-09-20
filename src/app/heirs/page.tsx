import Link from "next/link";
import ArticlePage from "@/components/ArticlePage";
import JsonLd from "@/components/JsonLd";
import { Cited } from "@/components/SourceLinks";
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
        <Cited sources={["quran-4-11", "quran-4-12", "islamqa-225165"]}>
          Quranic heirs (ashab al-furud) take a fixed fraction named in the Quran or the Sunnah.
        </Cited>
        <Cited sources={["bukhari-6732", "muslim-1615a", "islamqa-225165"]}>
          Residuary heirs (asaba) take what remains after those fixed shares.
        </Cited>
        <Cited sources={["quran-4-11", "islamqa-171811", "islamqa-12911"]}>
          Some people, such as the father or a daughter with a brother, can take both a fixed share
          and residue.
        </Cited>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">Heirs in this calculator</h2>
        <ul className="list-disc space-y-3 pl-5">
          <Cited as="li" sources={["quran-4-12", "quran-4-3", "islamqa-140167"]}>
            Husband, or up to four wives. Wives share one Quranic portion.
          </Cited>
          <Cited as="li" sources={["quran-4-11", "islamqa-175366", "abudawud-2894"]}>
            Father, mother, paternal grandfather, great-grandfather, and both grandmothers.
          </Cited>
          <Cited as="li" sources={["quran-4-11", "islamqa-131473", "bukhari-6736"]}>
            Sons, daughters, grandchildren and great-grandchildren in the son&apos;s line.
          </Cited>
          <Cited as="li" sources={["islamqa-70575", "islamqa-135906"]}>
            Daughter&apos;s children as distant kindred (except in the Maliki school).
          </Cited>
          <Cited as="li" sources={["quran-4-12", "quran-4-176", "islamqa-166553"]}>
            Full siblings, paternal half-siblings, and maternal (uterine) siblings.
          </Cited>
          <Cited as="li" sources={["bukhari-6732", "islamqa-85136"]}>
            Full and paternal brothers&apos; sons.
          </Cited>
          <Cited as="li" sources={["islamqa-135906", "bukhari-6732"]}>
            Full and paternal uncles, and their sons.
          </Cited>
        </ul>
        <Cited sources={["islamqa-127945", "islamqa-140167"]}>
          Count only people who outlive the deceased. A living closer heir often blocks a farther
          one.{" "}
          <Link
            href="/hajb"
            className="font-medium text-emerald-800 underline-offset-2 hover:underline"
          >
            See blocking rules
          </Link>
          .
        </Cited>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">Who does not inherit here</h2>
        <Cited sources={["islamqa-13772", "islamqa-428", "bukhari-6764", "tirmidhi-2109"]}>
          Version 1.0 does not cover every class of distant kindred, an unborn child, a missing
          person, a killer of the deceased, or a difference of religion. The Sunnah blocks a killer,
          and it blocks inheritance between a Muslim and a disbeliever.
        </Cited>
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
