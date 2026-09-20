import Link from "next/link";
import ArticlePage from "@/components/ArticlePage";
import JsonLd from "@/components/JsonLd";
import { Cited, SourceLinks } from "@/components/SourceLinks";
import { SCHOOL_LIST } from "@/lib/faraid/schools";
import { guidePage } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

const page = guidePage("/schools");

export const metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: page.href,
  keywords: page.keywords,
});

export default function SchoolsPage() {
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
        <h2 className="text-lg font-semibold text-zinc-900">The four Sunni schools</h2>
        <Cited sources={["quran-4-11", "quran-4-12", "islamqa-140167", "islamqa-225165"]}>
          Most Faraid shares are shared across the four schools, because the Quran names them. A few
          cases differ, such as radd and leftover estate.
        </Cited>
        <ul className="divide-y divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 bg-white">
          {SCHOOL_LIST.map((school) => (
            <li key={school.id} className="px-4 py-3">
              <p className="text-sm font-semibold text-zinc-900">{school.label}</p>
              <p className="mt-1 text-sm text-zinc-600">
                Founder: {school.founder}. {school.summary}
              </p>
            </li>
          ))}
        </ul>
        <SourceLinks ids={["islamqa-140167", "islamqa-160948"]} />
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">What this version does</h2>
        <Cited sources={["islamqa-160948"]}>
          IslamQA records that Abu Hanifa and Ahmad return leftover shares to blood relatives
          (radd). Malik and al-Shafi&apos;i sent leftover shares to the public treasury. This
          calculator follows Maliki on the treasury. It still applies radd for Hanafi, Shafi&apos;i,
          and Hanbali.
        </Cited>
        <Cited sources={["islamqa-175366", "islamqa-140167"]}>
          Hanafi treats the grandfather like the father when the father has died. The other schools
          also let the grandfather stand in for the father in many cases, but they may share with
          siblings.{" "}
          <Link
            href="/scope"
            className="font-medium text-emerald-800 underline-offset-2 hover:underline"
          >
            Read the scope page
          </Link>
          .
        </Cited>
        <Cited sources={["islamqa-135906", "islamqa-160948"]}>
          Distant kindred inherit in this tool for Hanafi, Shafi&apos;i, and Hanbali when no agnate
          remains. Maliki does not give them a share here.
        </Cited>
      </section>
    </ArticlePage>
  );
}
