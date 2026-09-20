import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="no-print mt-auto border-t border-zinc-200 bg-white">
      <div className="flex w-full flex-col gap-2 px-5 py-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
        <p>For education only. This is not a religious or legal ruling.</p>
        <p>
          <Link href="/scope" className="font-medium text-zinc-600 underline-offset-2 hover:underline">
            What this version covers
          </Link>
        </p>
      </div>
    </footer>
  );
}
