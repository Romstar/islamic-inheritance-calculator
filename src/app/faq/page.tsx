import Link from "next/link";
import ArticlePage from "@/components/ArticlePage";
import JsonLd from "@/components/JsonLd";
import { Cited, SourceLinks } from "@/components/SourceLinks";
import { guidePage } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import type { SourceId } from "@/lib/sources";

const page = guidePage("/faq");

const FAQS: Array<{
  question: string;
  answer: string;
  sources: readonly SourceId[];
}> = [
  {
    question: "Is this calculator a fatwa or a court ruling?",
    answer:
      "No. The tool is for education. The Quran treats these shares as set limits. Ask a qualified scholar or lawyer for a binding result.",
    sources: ["quran-4-13", "islamqa-10447"],
  },
  {
    question: "Which school of thought does it follow?",
    answer:
      "You choose Hanafi, Maliki, Shafi'i, or Hanbali first. IslamQA notes that scholars differ on a small set of issues, such as leftover estate after fixed shares.",
    sources: ["islamqa-140167", "islamqa-160948"],
  },
  {
    question: "Do I need to enter money amounts?",
    answer:
      "No. Leave money blank to see fractions and percentages only. Enter amounts if you also want a currency split. The Quran names shares as fractions, not as a currency amount.",
    sources: ["quran-4-11", "quran-4-12"],
  },
  {
    question: "What is Faraid?",
    answer:
      "Faraid is Islamic inheritance law. Close relatives take Quranic shares. Residue goes to agnates. Closer heirs can block farther heirs.",
    sources: ["quran-4-11", "bukhari-6732", "islamqa-225165", "islamqa-140167"],
  },
  {
    question: "Can a will give away the whole estate?",
    answer:
      "Not in Faraid. A wasiyyah is capped at one-third of the net estate after debts and funeral costs. Heirs take the rest. There is no bequest for an heir unless the other heirs agree.",
    sources: ["bukhari-2742", "abudawud-2870", "islamqa-174421", "islamqa-200127"],
  },
  {
    question: "Why does a son take more than a daughter?",
    answer:
      "When sons and daughters inherit together as residuaries, the Quran gives a son twice a daughter's share. Daughters also take fixed Quranic shares when no son survives.",
    sources: ["quran-4-11", "islamqa-12911", "islamqa-76418"],
  },
  {
    question: "What does the results page mean by 'awl or radd?",
    answer:
      "'Awl reduces every Quranic share when the fractions add up to more than the estate. Radd returns leftover estate to blood relatives who already took a fixed share.",
    sources: ["islamqa-131556", "islamqa-126233", "islamqa-160948"],
  },
  {
    question: "Which relatives are missing?",
    answer:
      "This version does not cover every distant kindred class, unborn children, missing persons, a killer, or a difference of religion. The Sunnah blocks a killer, and it blocks inheritance between a Muslim and a disbeliever.",
    sources: ["islamqa-13772", "islamqa-428", "bukhari-6764", "tirmidhi-2109", "islamqa-135906"],
  },
];

export const metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: page.href,
  keywords: page.keywords,
});

export default function FaqPage() {
  return (
    <ArticlePage title={page.title} lead={page.description} href={page.href}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
          url: `${getSiteUrl()}${page.href}`,
        }}
      />
      <div className="space-y-6">
        {FAQS.map((item) => (
          <section key={item.question} className="space-y-2">
            <h2 className="text-lg font-semibold text-zinc-900">{item.question}</h2>
            <Cited sources={item.sources}>{item.answer}</Cited>
          </section>
        ))}
      </div>
      <p className="text-sm text-zinc-600">
        For the full list of heirs and gaps,{" "}
        <Link href="/scope" className="font-medium text-emerald-800 underline-offset-2 hover:underline">
          read the scope page
        </Link>
        . For the order of distribution,{" "}
        <Link
          href="/how-it-works"
          className="font-medium text-emerald-800 underline-offset-2 hover:underline"
        >
          read how Islamic inheritance works
        </Link>
        .
      </p>
      <SourceLinks ids={["quran-4-7", "islamqa-225165"]} />
    </ArticlePage>
  );
}
