"use client";

import { calculate } from "@/lib/faraid/calculator";
import type { HeirInput } from "@/lib/faraid/types";
import { frac, mul, toPercent, toText, type Fraction } from "@/lib/faraid/fraction";

const METHOD_LABEL: Record<string, string> = {
  normal: "Standard shares",
  awl: "'Awl (shares reduced)",
  radd: "Radd (remainder returned)",
};

const METHOD_STYLE: Record<string, string> = {
  normal: "bg-emerald-100 text-emerald-800",
  awl: "bg-amber-100 text-amber-800",
  radd: "bg-sky-100 text-sky-800",
};

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function Results({
  heirs,
  estate,
}: {
  heirs: HeirInput;
  estate: number;
}) {
  const result = calculate(heirs);
  const showMoney = estate > 0;
  const amountFor = (share: Fraction): number => (share.n / share.d) * estate;

  if (result.errors.length > 0) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <ul className="list-inside list-disc space-y-1">
          {result.errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Inheritance shares</h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${METHOD_STYLE[result.method]}`}
        >
          {METHOD_LABEL[result.method]}
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-3 py-2 font-medium">Heir</th>
              <th className="px-3 py-2 font-medium">Share</th>
              <th className="px-3 py-2 font-medium">Percent</th>
              {showMoney && <th className="px-3 py-2 text-right font-medium">Amount</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {result.shares.map((s) => (
              <tr key={s.key} className="align-top">
                <td className="px-3 py-3">
                  <span className="block font-medium text-zinc-900">
                    {s.label}
                    {s.count > 1 && <span className="ml-1 text-zinc-400">×{s.count}</span>}
                  </span>
                  <span className="block text-xs text-zinc-500">{s.reason}</span>
                </td>
                <td className="whitespace-nowrap px-3 py-3 font-mono text-zinc-900">
                  {toText(s.share)}
                  {s.count > 1 && (
                    <span className="block text-xs text-zinc-400">{toText(s.perPerson)} each</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-zinc-700">
                  {toPercent(s.share)}%
                  {s.count > 1 && (
                    <span className="block text-xs text-zinc-400">
                      {toPercent(s.perPerson)}% each
                    </span>
                  )}
                </td>
                {showMoney && (
                  <td className="whitespace-nowrap px-3 py-3 text-right text-zinc-900">
                    {formatMoney(amountFor(s.share))}
                    {s.count > 1 && (
                      <span className="block text-xs text-zinc-400">
                        {formatMoney(amountFor(mul(s.share, frac(1, s.count))))} each
                      </span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-zinc-50 text-sm font-semibold text-zinc-900">
            <tr>
              <td className="px-3 py-2">Total</td>
              <td className="px-3 py-2">1</td>
              <td className="px-3 py-2">100%</td>
              {showMoney && <td className="px-3 py-2 text-right">{formatMoney(estate)}</td>}
            </tr>
          </tfoot>
        </table>
      </div>

      {result.blocked.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Excluded relatives (hajb)
          </h3>
          <ul className="space-y-1 text-sm text-zinc-600">
            {result.blocked.map((b) => (
              <li key={b.key} className="flex justify-between gap-4">
                <span>
                  {b.label}
                  {b.count > 1 && <span className="ml-1 text-zinc-400">×{b.count}</span>}
                </span>
                <span className="text-right text-xs text-zinc-500">{b.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.notes.length > 0 && (
        <ul className="space-y-1 text-xs text-zinc-500">
          {result.notes.map((n) => (
            <li key={n} className="flex gap-2">
              <span aria-hidden>•</span>
              <span>{n}</span>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-zinc-400">
        Problem base (asl al-mas&apos;ala): {result.baseDenominator}. The grandfather
        follows the Hanafi rule (he blocks siblings). This tool is for education,
        not a religious or legal ruling.
      </p>
    </div>
  );
}
