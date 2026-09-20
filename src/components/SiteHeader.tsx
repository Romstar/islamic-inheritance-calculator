import Link from "next/link";

const links = [
  { href: "/", label: "Calculator" },
  { href: "/scope", label: "Scope" },
];

export default function SiteHeader() {
  return (
    <header className="no-print border-b border-zinc-200 bg-white">
      <div className="flex w-full flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-6 lg:px-16">
        <div>
          <p className="text-sm font-medium text-emerald-700">Islamic inheritance</p>
          <Link href="/" className="text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">
            Inheritance Calculator
          </Link>
        </div>
        <nav aria-label="Main" className="flex gap-2">
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
