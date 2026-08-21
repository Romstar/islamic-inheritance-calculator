import Questionnaire from "@/components/Questionnaire";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto w-full max-w-2xl px-6 py-8">
          <p className="text-sm font-medium text-emerald-700">Faraid / Mawarith</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
            Islamic Inheritance Calculator
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Answer a short questionnaire about the surviving relatives. The tool
            works out each heir&apos;s share (fard), residue (asaba), and any
            &apos;awl or radd, then shows the percentage for every individual.
          </p>
        </div>
      </header>
      <main className="w-full px-6 py-8">
        <Questionnaire />
      </main>
      <footer className="mt-auto border-t border-zinc-200 bg-white">
        <div className="mx-auto w-full max-w-2xl px-6 py-4 text-xs text-zinc-400">
          For education only. Consult a qualified scholar for a binding ruling.
        </div>
      </footer>
    </div>
  );
}
