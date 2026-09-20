import Link from "next/link";
import ArticlePage from "@/components/ArticlePage";
import JsonLd from "@/components/JsonLd";
import { guidePage } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

const page = guidePage("/faq");

const FAQS = [
  {
    question: "Is this calculator a fatwa or a court ruling?",
    answer:
      "No. The tool is for education. Ask a qualified scholar or lawyer for a binding result.",
  },
  {
    question: "Which school of thought does it follow?",
    answer:
      "You choose Hanafi, Maliki, Shafi'i, or Hanbali first. Each school uses its own rules for the grandfather with siblings, mushtaraka, radd, and distant kindred.",
  },
  {
    question: "Do I need to enter money amounts?",
    answer:
      "No. Leave money blank to see fractions and percentages only. Enter amounts if you also want a currency split.",
  },
  {
    question: "What is Faraid?",
    answer:
      "Faraid is Islamic inheritance law. Close relatives take Quranic shares. Residue goes to agnates. Closer heirs can block farther heirs.",
  },
  {
    question: "Can a will give away the whole estate?",
    answer:
      "Not in Faraid. A wasiyyah is capped at one-third of the net estate after debts and funeral costs. Heirs take the rest.",
  },
  {
    question: "Why does a son take more than a daughter?",
    answer:
      "When sons and daughters inherit together as residuaries, the classic rule gives a son twice a daughter's share. Daughters also take fixed Quranic shares when no son survives.",
  },
  {
    question: "What does the results page mean by 'awl or radd?",
    answer:
      "'Awl reduces every Quranic share when the fractions add up to more than the estate. Radd returns leftover estate to blood relatives who already took a fixed share.",
  },
  {
    question: "Which relatives are missing?",
    answer:
      "This version does not cover every distant kindred class, unborn children, missing persons, or a difference of religion. It does cover daughter's children, great-grandchildren in the son's line, and one successive death.",
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
            <p className="text-sm text-zinc-600">{item.answer}</p>
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
    </ArticlePage>
  );
}
