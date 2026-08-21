import Questionnaire from "@/components/Questionnaire";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="w-full px-5 py-6 sm:px-10 sm:py-8 lg:px-16">
          <p className="text-sm font-medium text-emerald-700">Faraid / Mawarith</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Islamic Inheritance Calculator
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-zinc-600">
            Answer a short questionnaire about the surviving relatives. The tool
            works out each heir&apos;s share (fard), residue (asaba), and any
            &apos;awl or radd, then shows the percentage for every individual.
          </p>
        </div>
      </header>
      <main className="w-full flex-1 px-4 py-6 sm:px-10 sm:py-8 lg:px-16">
        <Questionnaire />
      </main>
      <footer className="mt-auto border-t border-zinc-200 bg-white">
        <div className="w-full px-5 py-4 text-xs text-zinc-400 sm:px-10 lg:px-16">
          For education only. Consult a qualified scholar for a binding ruling.
        </div>
      </footer>
    </div>
  );
}
