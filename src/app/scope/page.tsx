import Link from "next/link";
import { SCOPE_PAGE } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Scope",
  description: SCOPE_PAGE.description,
  path: SCOPE_PAGE.href,
  keywords: SCOPE_PAGE.keywords,
});

export default function ScopePage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <main className="w-full flex-1 px-5 py-8 sm:px-10 lg:px-16">
        <div className="max-w-3xl space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Scope of version 1.0
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              This tool is for education. It is not a fatwa and not a court ruling.
              Ask a qualified scholar or lawyer for a binding result.
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-zinc-900">What it calculates</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600">
              <li>Fixed Quranic shares (furud)</li>
              <li>Residue for agnates (asaba), including 2:1 male-to-female splits</li>
              <li>Blocking of farther relatives (hajb)</li>
              <li>&apos;Awl, when fixed shares exceed the estate</li>
              <li>Radd, when remainder returns to fixed-share heirs</li>
              <li>Debts and funeral costs before heirs</li>
              <li>An optional will, capped at one-third of the net estate</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-zinc-900">Heirs in this version</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600">
              <li>Husband, or up to four wives</li>
              <li>Father, mother, paternal grandfather, paternal grandmother, maternal grandmother</li>
              <li>Sons, daughters, and grandchildren in the son&apos;s line (one generation)</li>
              <li>Full, paternal half, and maternal siblings</li>
              <li>Brothers&apos; sons, paternal uncles, and their sons</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-zinc-900">School of law</h2>
            <p className="text-sm text-zinc-600">
              The first question asks which school you want to follow: Hanafi, Maliki,
              Shafi&apos;i, or Hanbali. Each choice opens that school&apos;s calculator.
            </p>
            <p className="text-sm text-zinc-600">
              Share numbers in this version still follow one engine. The paternal
              grandfather blocks all siblings, as in the Hanafi position. School-specific
              rules for the other three schools will come in a later version.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-zinc-900">What it does not cover</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600">
              <li>Children of daughters and other distant kindred</li>
              <li>Great-grandparents and great-grandchildren</li>
              <li>An heir who dies before the estate is split</li>
              <li>Unborn child, missing person, killer of the deceased</li>
              <li>Difference of religion, apostasy, or disputed parentage</li>
              <li>Adoption, foster relations, or intersex cases</li>
            </ul>
          </section>

          <p className="text-sm text-zinc-600">
            <Link href="/" className="font-medium text-emerald-800 underline-offset-2 hover:underline">
              Return to the calculator
            </Link>
            {" · "}
            <Link
              href="/guides"
              className="font-medium text-emerald-800 underline-offset-2 hover:underline"
            >
              Read the inheritance guides
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
