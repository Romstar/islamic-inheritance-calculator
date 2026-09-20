import Link from "next/link";
import { relatedGuides, type GuidePage } from "@/lib/guides";

export function CalculatorCta({ label = "Open the calculator" }: { label?: string }) {
  return (
    <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-zinc-700">
      Use the free calculator to work out each heir&apos;s fraction, percentage, and amount.{" "}
      <Link href="/" className="font-medium text-emerald-800 underline-offset-2 hover:underline">
        {label}
      </Link>
    </p>
  );
}

export function RelatedGuides({ href }: { href: string }) {
  const pages = relatedGuides(href);
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-zinc-900">Related guides</h2>
      <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600">
        {pages.map((page) => (
          <li key={page.href}>
            <Link
              href={page.href}
              className="font-medium text-emerald-800 underline-offset-2 hover:underline"
            >
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ArticlePage({
  title,
  lead,
  href,
  children,
}: {
  title: string;
  lead: string;
  href: GuidePage["href"] | "/scope" | "/guides";
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <main className="w-full flex-1 px-5 py-8 sm:px-10 lg:px-16">
        <article className="max-w-3xl space-y-8">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              <Link href="/guides" className="underline-offset-2 hover:underline">
                Guides
              </Link>
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-zinc-600">{lead}</p>
            <p className="mt-3 text-xs text-zinc-500">
              Each ruling below links to the Quran, a Hadith, or IslamQA. Links open on those sites.
            </p>
          </div>
          {children}
          <CalculatorCta />
          {href !== "/guides" && <RelatedGuides href={href} />}
        </article>
      </main>
    </div>
  );
}
