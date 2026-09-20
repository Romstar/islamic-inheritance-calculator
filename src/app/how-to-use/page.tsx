import Link from "next/link";
import ArticlePage from "@/components/ArticlePage";
import JsonLd from "@/components/JsonLd";
import { Cited } from "@/components/SourceLinks";
import { guidePage } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

const page = guidePage("/how-to-use");

export const metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: page.href,
  keywords: page.keywords,
});

export default function HowToUsePage() {
  return (
    <ArticlePage title={page.title} lead={page.description} href={page.href}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: page.title,
          description: page.description,
          url: `${getSiteUrl()}${page.href}`,
          step: [
            {
              "@type": "HowToStep",
              name: "Choose a school",
              text: "Pick Hanafi, Maliki, Shafi'i, or Hanbali.",
            },
            {
              "@type": "HowToStep",
              name: "Name surviving relatives",
              text: "Answer the questions about spouse, children, parents, siblings, and extended relatives.",
            },
            {
              "@type": "HowToStep",
              name: "Enter estate amounts",
              text: "Optionally enter the estate, debts, funeral costs, and a will.",
            },
            {
              "@type": "HowToStep",
              name: "Read the shares",
              text: "Review each heir's fraction, percentage, and amount. Print or copy the link if you need a record.",
            },
          ],
        }}
      />
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">Steps</h2>
        <ol className="list-decimal space-y-3 pl-5">
          <Cited as="li" sources={["islamqa-140167", "islamqa-160948"]}>
            Open the calculator and choose a school of thought. IslamQA notes that scholars agree
            on most shares and differ on a few issues.
          </Cited>
          <Cited as="li" sources={["quran-4-12", "islamqa-127945"]}>
            Say whether a husband or wife survives. Count only people who outlive the deceased.
          </Cited>
          <Cited as="li" sources={["quran-4-11", "islamqa-131473"]}>
            Enter sons and daughters. Add grandchildren only in the son&apos;s line.
          </Cited>
          <Cited as="li" sources={["quran-4-11", "islamqa-175366"]}>
            Mark which parents and grandparents are alive.
          </Cited>
          <Cited as="li" sources={["quran-4-12", "quran-4-176", "islamqa-135906"]}>
            Enter siblings and, if asked, nephews, uncles, or cousins.
          </Cited>
          <Cited as="li" sources={["quran-4-11", "islamqa-200127", "bukhari-2742"]}>
            Optionally enter the estate, debts, funeral costs, and a will. Debts and funeral costs
            come out first. A will is capped at one-third.
          </Cited>
          <li className="text-sm text-zinc-600">
            Read the results. Copy the link or print the page if you need a record.
          </li>
        </ol>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">Tips</h2>
        <ul className="list-disc space-y-3 pl-5">
          <li className="text-sm text-zinc-600">Skip money fields if you only need fractions.</li>
          <li className="text-sm text-zinc-600">Use one currency for every amount.</li>
          <Cited as="li" sources={["islamqa-140167", "islamqa-106599"]}>
            The form hides relatives who cannot inherit after your earlier answers.
          </Cited>
          <Cited as="li" sources={["quran-4-13", "islamqa-10447"]}>
            The result is for education.{" "}
            <Link
              href="/scope"
              className="font-medium text-emerald-800 underline-offset-2 hover:underline"
            >
              Check the scope
            </Link>{" "}
            before you rely on it.
          </Cited>
        </ul>
      </section>
    </ArticlePage>
  );
}
