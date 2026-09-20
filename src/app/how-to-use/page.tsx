import Link from "next/link";
import ArticlePage from "@/components/ArticlePage";
import JsonLd from "@/components/JsonLd";
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
        <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-600">
          <li>Open the calculator and choose a school of thought.</li>
          <li>Say whether a husband or wife survives.</li>
          <li>Enter sons and daughters. Add grandchildren only in the son&apos;s line.</li>
          <li>Mark which parents and grandparents are alive.</li>
          <li>Enter siblings and, if asked, nephews, uncles, or cousins.</li>
          <li>Optionally enter the estate, debts, funeral costs, and a will.</li>
          <li>Read the results. Copy the link or print the page if you need a record.</li>
        </ol>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">Tips</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600">
          <li>Skip money fields if you only need fractions.</li>
          <li>Use one currency for every amount.</li>
          <li>The form hides relatives who cannot inherit after your earlier answers.</li>
          <li>
            The result is for education.{" "}
            <Link
              href="/scope"
              className="font-medium text-emerald-800 underline-offset-2 hover:underline"
            >
              Check the scope
            </Link>{" "}
            before you rely on it.
          </li>
        </ul>
      </section>
    </ArticlePage>
  );
}
