import Link from "next/link";
import SiteLogo from "@/components/SiteLogo";

const links = [
  { href: "/", label: "Calculator" },
  { href: "/guides", label: "Guides" },
  { href: "/faq", label: "FAQ" },
  { href: "/scope", label: "Scope" },
];

export default function SiteHeader() {
  return (
    <header className="no-print border-b border-zinc-200 bg-white">
      <div className="flex w-full flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-6 lg:px-16">
        <Link href="/" className="flex items-center gap-3">
          <SiteLogo />
          <span>
            <span className="block text-sm font-medium text-emerald-700">
              Islamic inheritance
            </span>
            <span className="block text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">
              Inheritance Calculator
            </span>
          </span>
        </Link>
        <nav aria-label="Main" className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
