import Link from "next/link";
import { Cited } from "@/components/SourceLinks";
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
            <Cited className="mt-2 text-sm text-zinc-600" sources={["quran-4-13", "islamqa-10447"]}>
              This tool is for education. It is not a fatwa and not a court ruling. Ask a qualified
              scholar or lawyer for a binding result.
            </Cited>
          </div>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-zinc-900">What it calculates</h2>
            <ul className="list-disc space-y-3 pl-5">
              <Cited as="li" sources={["quran-4-11", "quran-4-12", "islamqa-225165"]}>
                Fixed Quranic shares (furud)
              </Cited>
              <Cited as="li" sources={["bukhari-6732", "quran-4-11", "islamqa-76418"]}>
                Residue for agnates (asaba), including 2:1 male-to-female splits
              </Cited>
              <Cited as="li" sources={["islamqa-140167", "islamqa-106599"]}>
                Blocking of farther relatives (hajb)
              </Cited>
              <Cited as="li" sources={["islamqa-131556", "islamqa-126233"]}>
                &apos;Awl, when fixed shares exceed the estate
              </Cited>
              <Cited as="li" sources={["islamqa-160948"]}>
                Radd, or remainder to the public treasury, by school
              </Cited>
              <Cited as="li" sources={["islamqa-175366", "islamqa-140167"]}>
                Grandfather with siblings (Hanafi hajb, or Zayd&apos;s method)
              </Cited>
              <Cited as="li" sources={["islamqa-140167", "quran-4-12"]}>
                Mushtaraka for Maliki and Shafi&apos;i, as this calculator implements that school
                split
              </Cited>
              <Cited as="li" sources={["islamqa-127945"]}>
                Successive death (munasakha) after the first result
              </Cited>
              <Cited as="li" sources={["islamqa-44039", "islamqa-200127", "quran-4-11"]}>
                Debts and funeral costs before heirs
              </Cited>
              <Cited as="li" sources={["bukhari-2742", "islamqa-174421"]}>
                An optional will, capped at one-third of the net estate
              </Cited>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-zinc-900">Heirs in this version</h2>
            <ul className="list-disc space-y-3 pl-5">
              <Cited as="li" sources={["quran-4-12", "quran-4-3"]}>
                Husband, or up to four wives
              </Cited>
              <Cited as="li" sources={["quran-4-11", "islamqa-175366", "abudawud-2894"]}>
                Father, mother, paternal grandfather, great-grandfather, and both grandmothers
              </Cited>
              <Cited as="li" sources={["quran-4-11", "islamqa-131473", "bukhari-6736"]}>
                Sons, daughters, grandchildren and great-grandchildren in the son&apos;s line
              </Cited>
              <Cited as="li" sources={["islamqa-70575", "islamqa-135906"]}>
                Daughter&apos;s children as distant kindred (except Maliki)
              </Cited>
              <Cited as="li" sources={["quran-4-12", "quran-4-176", "islamqa-166553"]}>
                Full, paternal half, and maternal siblings
              </Cited>
              <Cited as="li" sources={["islamqa-135906", "bukhari-6732"]}>
                Brothers&apos; sons, paternal uncles, and their sons
              </Cited>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-zinc-900">School of law</h2>
            <Cited sources={["islamqa-140167", "islamqa-160948"]}>
              The first question asks which school you want to follow: Hanafi, Maliki,
              Shafi&apos;i, or Hanbali. Each choice opens that school&apos;s calculator.
            </Cited>
            <Cited sources={["islamqa-175366", "islamqa-160948"]}>
              Share numbers follow the school you pick. The Hanafi calculator treats the
              grandfather like the father. Maliki sends leftover shares to the public treasury. The
              other schools apply radd, with a Hanafi exception for a lone spouse.
            </Cited>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-zinc-900">What it does not cover</h2>
            <ul className="list-disc space-y-3 pl-5">
              <Cited as="li" sources={["tirmidhi-2109", "islamqa-13772", "islamqa-225165"]}>
                Unborn child, missing person, killer of the deceased
              </Cited>
              <Cited as="li" sources={["bukhari-6764", "muslim-1614", "islamqa-428"]}>
                Difference of religion, apostasy, or disputed parentage
              </Cited>
              <Cited as="li" sources={["islamqa-70575", "islamqa-135906"]}>
                Adoption, foster relations, or intersex cases
              </Cited>
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
