import Link from "next/link";
import ArticlePage from "@/components/ArticlePage";
import JsonLd from "@/components/JsonLd";
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
        <p className="text-sm text-zinc-600">
          Faraid is the Islamic law of inheritance. The Quran names fixed shares for close
          relatives. The remaining estate goes to residuary heirs (asaba). Closer relatives can
          block farther relatives.
        </p>
        <p className="text-sm text-zinc-600">
          This calculator follows that order. It is for education. Ask a qualified scholar or
          lawyer for a binding result.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">The order of distribution</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-600">
          <li>
            Pay funeral costs and debts of the deceased. These come out before any heir or will.
          </li>
          <li>
            Pay an optional will (wasiyyah). The cap is one-third of the net estate.{" "}
            <Link
              href="/wasiyyah"
              className="font-medium text-emerald-800 underline-offset-2 hover:underline"
            >
              Read the will rules
            </Link>
            .
          </li>
          <li>
            Give Quranic fixed shares (furud) to the heirs who qualify.{" "}
            <Link
              href="/quranic-shares"
              className="font-medium text-emerald-800 underline-offset-2 hover:underline"
            >
              See the share table
            </Link>
            .
          </li>
          <li>
            Give any residue to agnates, such as sons, the father, brothers, or paternal uncles.
            Sons and daughters share residue in a 2:1 ratio.
          </li>
          <li>
            Apply blocking (hajb) so a closer heir keeps a farther heir out, or reduces that
            share.{" "}
            <Link
              href="/hajb"
              className="font-medium text-emerald-800 underline-offset-2 hover:underline"
            >
              Read how blocking works
            </Link>
            .
          </li>
          <li>
            If fixed shares exceed the estate, reduce every share in proportion. That is &apos;awl.
            If a remainder is left, return it to blood relatives. That is radd.{" "}
            <Link
              href="/awl-and-radd"
              className="font-medium text-emerald-800 underline-offset-2 hover:underline"
            >
              Read &apos;awl and radd
            </Link>
            .
          </li>
        </ol>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">What the calculator shows</h2>
        <p className="text-sm text-zinc-600">
          After you name the surviving relatives, the tool lists each heir&apos;s fraction,
          percentage, and amount. It also lists blocked relatives and the method used: standard
          shares, &apos;awl, or radd.
        </p>
        <p className="text-sm text-zinc-600">
          First choose a school of thought. Then answer only the questions that still matter. The
          form hides relatives who cannot inherit in that case.
        </p>
      </section>
    </ArticlePage>
  );
}
