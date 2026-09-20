import Link from "next/link";
import ArticlePage from "@/components/ArticlePage";
import JsonLd from "@/components/JsonLd";
import { guidePage } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

const page = guidePage("/quranic-shares");

const ROWS = [
  ["Husband", "1/2", "1/4 when a child or son's child inherits"],
  ["Wife (wives share it)", "1/4", "1/8 when a child or son's child inherits"],
  ["Daughter", "1/2 if one", "2/3 if two or more; residue with a son (2:1)"],
  ["Son's daughter", "1/2 if no daughter", "2/3 if two or more; 1/6 with one daughter"],
  ["Father", "Residue if no child", "1/6 with a child, plus residue if no son"],
  ["Mother", "1/3", "1/6 with a child or two or more siblings"],
  ["Paternal grandfather", "Stands in for the father", "Blocked by a living father"],
  ["Grandmother", "1/6", "Blocked by a closer mother on that line"],
  ["Full sister", "1/2 if one", "2/3 if two or more; residue with a full brother"],
  ["Paternal sister", "Like a full sister if none", "1/6 with one full sister"],
  ["Maternal sibling", "1/6 if one", "1/3 if two or more; males and females share equally"],
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
        <p className="text-sm text-zinc-600">
          The Quran names shares of one-half, one-quarter, one-eighth, two-thirds, one-third, and
          one-sixth. The exact fraction depends on who else survives. This table is a study aid,
          not a ruling.
        </p>
        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <caption className="sr-only">Classic Quranic inheritance shares</caption>
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-3 py-2 font-medium">Heir</th>
                <th className="px-3 py-2 font-medium">Common share</th>
                <th className="px-3 py-2 font-medium">When it changes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {ROWS.map((row) => (
                <tr key={row[0]}>
                  <th className="px-3 py-2 font-medium text-zinc-900">{row[0]}</th>
                  <td className="px-3 py-2 text-zinc-700">{row[1]}</td>
                  <td className="px-3 py-2 text-zinc-600">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">Residue after fixed shares</h2>
        <p className="text-sm text-zinc-600">
          After Quranic heirs take their fractions, the residue goes to agnates. A son takes
          twice a daughter&apos;s share of that residue. If no son survives, a daughter often takes
          a fixed share instead.
        </p>
        <p className="text-sm text-zinc-600">
          If the fractions add up to more or less than the whole estate, the method changes.{" "}
          <Link
            href="/awl-and-radd"
            className="font-medium text-emerald-800 underline-offset-2 hover:underline"
          >
            Read &apos;awl and radd
          </Link>
          .
        </p>
      </section>
    </ArticlePage>
  );
}
