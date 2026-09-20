import CalculatorApp from "@/components/CalculatorApp";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
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
      </main>
    </div>
  );
}
