import Link from "next/link";
import ArticlePage from "@/components/ArticlePage";
import JsonLd from "@/components/JsonLd";
import { Cited, SourceLinks } from "@/components/SourceLinks";
import { guidePage } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import type { SourceId } from "@/lib/sources";

const page = guidePage("/quranic-shares");

const ROWS: Array<[string, string, string, readonly SourceId[]]> = [
  [
    "Husband",
    "1/2",
    "1/4 when a child or son's child inherits",
    ["quran-4-12", "islamqa-85136"],
  ],
  [
    "Wife (wives share it)",
    "1/4",
    "1/8 when a child or son's child inherits",
    ["quran-4-12", "islamqa-307", "islamqa-140167"],
  ],
  [
    "Daughter",
    "1/2 if one",
    "2/3 if two or more; residue with a son (2:1)",
    ["quran-4-11", "islamqa-12911"],
  ],
  [
    "Son's daughter",
    "1/2 if no daughter",
    "2/3 if two or more; 1/6 with one daughter",
    ["bukhari-6736", "islamqa-90925"],
  ],
  [
    "Father",
    "Residue if no child",
    "1/6 with a child, plus residue if no son",
    ["quran-4-11", "islamqa-171811"],
  ],
  [
    "Mother",
    "1/3",
    "1/6 with a child or two or more siblings",
    ["quran-4-11", "islamqa-130287"],
  ],
  [
    "Paternal grandfather",
    "Stands in for the father",
    "Blocked by a living father",
    ["islamqa-175366", "islamqa-225165"],
  ],
  [
    "Grandmother",
    "1/6",
    "Blocked by a closer mother on that line",
    ["abudawud-2894", "abudawud-2895", "islamqa-175366"],
  ],
  [
    "Full sister",
    "1/2 if one",
    "2/3 if two or more; residue with a full brother",
    ["quran-4-176", "bukhari-6742", "islamqa-166553"],
  ],
  [
    "Paternal sister",
    "Like a full sister if none",
    "1/6 with one full sister",
    ["quran-4-176", "islamqa-166553"],
  ],
  [
    "Maternal sibling",
    "1/6 if one",
    "1/3 if two or more; males and females share equally",
    ["quran-4-12", "islamqa-83283", "islamqa-166553"],
  ],
];

export const metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: page.href,
  keywords: page.keywords,
});

export default function QuranicSharesPage() {
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
        <h2 className="text-lg font-semibold text-zinc-900">Classic fixed shares</h2>
        <Cited sources={["quran-4-11", "quran-4-12", "islamqa-225165"]}>
          The Quran names shares of one-half, one-quarter, one-eighth, two-thirds, one-third, and
          one-sixth. The exact fraction depends on who else survives. This table is a study aid, not
          a ruling.
        </Cited>
        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <caption className="sr-only">Classic Quranic inheritance shares</caption>
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-3 py-2 font-medium">Heir</th>
                <th className="px-3 py-2 font-medium">Common share</th>
                <th className="px-3 py-2 font-medium">When it changes</th>
                <th className="px-3 py-2 font-medium">Sources</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {ROWS.map((row) => (
                <tr key={row[0]}>
                  <th className="px-3 py-2 font-medium text-zinc-900">{row[0]}</th>
                  <td className="px-3 py-2 text-zinc-700">{row[1]}</td>
                  <td className="px-3 py-2 text-zinc-600">{row[2]}</td>
                  <td className="px-3 py-2">
                    <SourceLinks ids={row[3]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">Residue after fixed shares</h2>
        <Cited sources={["bukhari-6732", "muslim-1615a", "quran-4-11", "islamqa-12911"]}>
          After Quranic heirs take their fractions, the residue goes to agnates. A son takes twice a
          daughter&apos;s share of that residue. If no son survives, a daughter often takes a fixed
          share instead.
        </Cited>
        <Cited sources={["islamqa-131556", "islamqa-160948"]}>
          If the fractions add up to more or less than the whole estate, the method changes.{" "}
          <Link
            href="/awl-and-radd"
            className="font-medium text-emerald-800 underline-offset-2 hover:underline"
          >
            Read &apos;awl and radd
          </Link>
          .
        </Cited>
      </section>
    </ArticlePage>
  );
}
