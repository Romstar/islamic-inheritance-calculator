import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <main className="w-full flex-1 px-5 py-16 sm:px-10 lg:px-16">
        <h1 className="text-2xl font-bold text-zinc-900">Page not found</h1>
        <p className="mt-2 text-sm text-zinc-600">This address is not part of the calculator.</p>
        <p className="mt-6">
          <Link href="/" className="font-medium text-emerald-800 underline-offset-2 hover:underline">
            Go to the calculator
          </Link>
        </p>
      </main>
    </div>
  );
}
