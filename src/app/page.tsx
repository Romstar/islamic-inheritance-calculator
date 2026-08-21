import InheritanceCalculator from "@/components/InheritanceCalculator";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto w-full max-w-5xl px-6 py-8">
          <p className="text-sm font-medium text-emerald-700">
            Faraid / Mawarith
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
            Islamic Inheritance Calculator
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600">
            Enter the surviving heirs to work out each fixed share (fard) and
            residue (asaba). The calculator applies &apos;awl and radd when the
            shares do not sum to a whole estate.
          </p>
        </div>
      </header>
      <main className="w-full px-6 py-8">
        <InheritanceCalculator />
      </main>
      <footer className="mt-auto border-t border-zinc-200 bg-white">
        <div className="mx-auto w-full max-w-5xl px-6 py-4 text-xs text-zinc-400">
          For education only. Consult a qualified scholar for a binding ruling.
        </div>
      </footer>
    </div>
  );
}
