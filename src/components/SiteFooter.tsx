import Link from "next/link";
import { GUIDE_PAGES, HUB_PAGE, SCOPE_PAGE } from "@/lib/guides";
import { SourceLinks } from "@/components/SourceLinks";

const footerLinks = [
  { href: "/", label: "Calculator" },
  { href: HUB_PAGE.href, label: HUB_PAGE.title },
  { href: SCOPE_PAGE.href, label: "Scope" },
  ...GUIDE_PAGES.map((page) => ({ href: page.href, label: page.title })),
];

export default function SiteFooter() {
  return (
    <footer className="no-print mt-auto border-t border-zinc-200 bg-white">
      <div className="flex w-full flex-col gap-4 px-5 py-6 sm:px-10 lg:px-16">
        <nav aria-label="Guides" className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-600">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium underline-offset-2 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-zinc-500">
          For education only. This is not a religious or legal ruling.
        </p>
        <SourceLinks ids={["quran-4-13", "islamqa-10447"]} />
      </div>
    </footer>
  );
}
