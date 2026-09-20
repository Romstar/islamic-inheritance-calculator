import type { Metadata } from "next";
import Link from "next/link";
import CalculatorApp from "@/components/CalculatorApp";
import JsonLd from "@/components/JsonLd";
import { GUIDE_PAGES, HOME_PAGE } from "@/lib/guides";
import { getSiteUrl, LOGO_PATH, OG_IMAGE_PATH, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: HOME_PAGE.title },
  description: HOME_PAGE.description,
  keywords: [
    "Islamic inheritance calculator",
    "Faraid calculator",
    "mirath calculator",
    "Quranic shares",
    "Islamic will",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: HOME_PAGE.title,
    description: HOME_PAGE.description,
    url: getSiteUrl(),
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_PAGE.title,
    description: HOME_PAGE.description,
    images: [OG_IMAGE_PATH],
  },
};

export default function Home() {
  const origin = getSiteUrl();
  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: SITE_NAME,
          url: origin,
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          description: HOME_PAGE.description,
          image: `${origin}${LOGO_PATH}`,
          logo: `${origin}${LOGO_PATH}`,
          publisher: { "@id": `${origin}/#organization` },
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <div className="w-full px-5 py-6 sm:px-10 sm:py-8 lg:px-16">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          Islamic Inheritance Calculator
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-zinc-600">
          First choose a school of thought. Then answer questions about the surviving
          relatives. The tool works out each heir&apos;s share, then shows the fraction,
          percentage, and amount. Debts, funeral costs, and an optional will come out first.
        </p>
      </div>
      <main className="w-full flex-1 px-4 pb-8 sm:px-10 lg:px-16">
        <CalculatorApp />
        <section className="mx-auto mt-10 max-w-3xl space-y-4 pb-4">
          <h2 className="text-lg font-semibold text-zinc-900">Learn Faraid</h2>
          <p className="text-sm text-zinc-600">
            These guides explain Islamic inheritance in plain English. They cover heirs, Quranic
            shares, blocking, &apos;awl, radd, and the will. The pages are for education, not a
            ruling.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {GUIDE_PAGES.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="block rounded-xl border border-zinc-200 bg-white px-4 py-3 hover:border-zinc-300"
                >
                  <span className="block text-sm font-semibold text-zinc-900">{page.title}</span>
                  <span className="mt-1 block text-xs text-zinc-600">{page.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
