import Link from "next/link";
import ArticlePage from "@/components/ArticlePage";
import JsonLd from "@/components/JsonLd";
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
        <p className="text-sm text-zinc-600">
          Most Faraid shares are shared across the four schools. A few cases differ, such as the
          grandfather with siblings, radd, and shared uterine residue (mushtarakah).
        </p>
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
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">What this version does</h2>
        <p className="text-sm text-zinc-600">
          The first question opens a Hanafi, Maliki, Shafi&apos;i, or Hanbali calculator. Share
          numbers in version 1.0 still follow one engine. The paternal grandfather blocks all
          siblings, as in the Hanafi position.
        </p>
        <p className="text-sm text-zinc-600">
          School-specific rules for the other three schools will come in a later version.{" "}
          <Link
            href="/scope"
            className="font-medium text-emerald-800 underline-offset-2 hover:underline"
          >
            Read the scope page
          </Link>
          .
        </p>
      </section>
    </ArticlePage>
  );
}
