"use client";

import dynamic from "next/dynamic";

const Questionnaire = dynamic(() => import("./Questionnaire"), {
  ssr: false,
  loading: () => (
    <div
      className="h-48 animate-pulse rounded-2xl border border-zinc-200 bg-white"
      aria-hidden
    />
  ),
});

export default function CalculatorApp() {
  return <Questionnaire />;
}
