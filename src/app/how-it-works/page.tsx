import Link from "next/link";
import ArticlePage from "@/components/ArticlePage";
import JsonLd from "@/components/JsonLd";
import { Cited } from "@/components/SourceLinks";
import { guidePage } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

const page = guidePage("/how-it-works");

export const metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: page.href,
  keywords: page.keywords,
});

export default function HowItWorksPage() {
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
        <h2 className="text-lg font-semibold text-zinc-900">What Faraid is</h2>
        <Cited sources={["quran-4-7", "quran-4-11", "quran-4-12", "islamqa-225165"]}>
          Faraid is the Islamic law of inheritance. The Quran names fixed shares for close
          relatives. Men and women both take a share of what parents and close relatives leave.
        </Cited>
        <Cited sources={["bukhari-6732", "muslim-1615a", "islamqa-225165"]}>
          After those fixed shares, the remaining estate goes to residuary heirs (asaba). The
          Prophet ﷺ said to give the shares to those who are entitled, then give what remains to
          the closest male relative.
        </Cited>
        <Cited sources={["islamqa-140167", "islamqa-106599"]}>
          A closer relative can block a farther relative. This calculator follows that order. It is
          for education. Ask a qualified scholar or lawyer for a binding result.
        </Cited>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">The order of distribution</h2>
        <ol className="list-decimal space-y-3 pl-5">
          <Cited as="li" sources={["islamqa-44039", "islamqa-200127", "quran-4-11"]}>
            Pay funeral costs and debts of the deceased. These come out before any heir or will.
            The Quran names shares after debts and bequests.
          </Cited>
          <Cited as="li" sources={["bukhari-2742", "muslim-1628a", "islamqa-174421"]}>
            Pay an optional will (wasiyyah). The cap is one-third of the net estate.{" "}
            <Link
              href="/wasiyyah"
              className="font-medium text-emerald-800 underline-offset-2 hover:underline"
            >
              Read the will rules
            </Link>
            .
          </Cited>
          <Cited as="li" sources={["quran-4-11", "quran-4-12", "islamqa-225165"]}>
            Give Quranic fixed shares (furud) to the heirs who qualify. The Quran names six
            fractions: one-half, one-quarter, one-eighth, two-thirds, one-third, and one-sixth.{" "}
            <Link
              href="/quranic-shares"
              className="font-medium text-emerald-800 underline-offset-2 hover:underline"
            >
              See the share table
            </Link>
            .
          </Cited>
          <Cited as="li" sources={["bukhari-6732", "muslim-1615a", "quran-4-11", "islamqa-76418"]}>
            Give any residue to agnates, such as sons, the father, brothers, or paternal uncles.
            Sons and daughters share residue in a 2:1 ratio.
          </Cited>
          <Cited as="li" sources={["islamqa-140167", "islamqa-131473", "islamqa-130287"]}>
            Apply blocking (hajb) so a closer heir keeps a farther heir out, or reduces that share.{" "}
            <Link
              href="/hajb"
              className="font-medium text-emerald-800 underline-offset-2 hover:underline"
            >
              Read how blocking works
            </Link>
            .
          </Cited>
          <Cited as="li" sources={["islamqa-131556", "islamqa-126233", "islamqa-160948"]}>
            If fixed shares exceed the estate, reduce every share in proportion. That is &apos;awl.
            If a remainder is left, return it to blood relatives, or send it to the public treasury,
            by school.{" "}
            <Link
              href="/awl-and-radd"
              className="font-medium text-emerald-800 underline-offset-2 hover:underline"
            >
              Read &apos;awl and radd
            </Link>
            .
          </Cited>
        </ol>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">What the calculator shows</h2>
        <Cited sources={["quran-4-13", "islamqa-10447"]}>
          After you name the surviving relatives, the tool lists each heir&apos;s fraction,
          percentage, and amount. The Quran treats these shares as set limits. The result is for
          study, not a fatwa.
        </Cited>
        <Cited sources={["islamqa-140167", "islamqa-160948"]}>
          First choose a school of thought. Then answer only the questions that still matter. The
          form hides relatives who cannot inherit in that case.
        </Cited>
      </section>
    </ArticlePage>
  );
}
