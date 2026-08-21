"use client";

import { useMemo, useState } from "react";
import { calculate } from "@/lib/faraid/calculator";
import { EMPTY_INPUT, type HeirInput } from "@/lib/faraid/types";
import { mul, frac, toPercent, toText, type Fraction } from "@/lib/faraid/fraction";

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

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
        checked
          ? "border-emerald-500 bg-emerald-50"
          : "border-zinc-200 bg-white hover:border-zinc-300"
      }`}
    >
      <span>
        <span className="block text-sm font-medium text-zinc-900">{label}</span>
        <span className="block text-xs text-zinc-500">{hint}</span>
      </span>
      <span
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-emerald-500" : "bg-zinc-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function Stepper({
  label,
  hint,
  value,
  min = 0,
  max = 20,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  const set = (next: number) => onChange(Math.max(min, Math.min(max, next)));
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 ${
        value > 0 ? "border-emerald-500 bg-emerald-50" : "border-zinc-200 bg-white"
      }`}
    >
      <span>
        <span className="block text-sm font-medium text-zinc-900">{label}</span>
        <span className="block text-xs text-zinc-500">{hint}</span>
      </span>
      <span className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => set(value - 1)}
          className="h-8 w-8 rounded-md border border-zinc-300 bg-white text-lg font-medium text-zinc-700 hover:bg-zinc-100"
        >
          -
        </button>
        <span
          aria-label={`${label} count`}
          className="w-6 text-center text-base font-semibold text-zinc-900"
        >
          {value}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => set(value + 1)}
          className="h-8 w-8 rounded-md border border-zinc-300 bg-white text-lg font-medium text-zinc-700 hover:bg-zinc-100"
        >
          +
        </button>
      </span>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function InheritanceCalculator() {
  const [heirs, setHeirs] = useState<HeirInput>({ ...EMPTY_INPUT });
  const [estate, setEstate] = useState<string>("100000");

  const result = useMemo(() => calculate(heirs), [heirs]);
  const estateValue = Number(estate) || 0;

  const update = <K extends keyof HeirInput>(key: K, value: HeirInput[K]) =>
    setHeirs((prev) => ({ ...prev, [key]: value }));

  const reset = () => setHeirs({ ...EMPTY_INPUT });

  const amountFor = (share: Fraction): number =>
    estateValue > 0 ? (share.n / share.d) * estateValue : 0;

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_1.1fr]">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Surviving heirs</h2>
          <button
            type="button"
            onClick={reset}
            className="rounded-md px-3 py-1 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            Reset
          </button>
        </div>

        <div className="space-y-5">
          <Section title="Spouse">
            <Toggle
              label="Husband"
              hint="Surviving husband"
              checked={heirs.husband}
              onChange={(v) => update("husband", v)}
            />
            <Stepper
              label="Wives"
              hint="They share the spouse portion equally (max 4)"
              value={heirs.wives}
              max={4}
              onChange={(v) => update("wives", v)}
            />
          </Section>

          <Section title="Parents">
            <Toggle
              label="Father"
              hint="Surviving father"
              checked={heirs.father}
              onChange={(v) => update("father", v)}
            />
            <Toggle
              label="Mother"
              hint="Surviving mother"
              checked={heirs.mother}
              onChange={(v) => update("mother", v)}
            />
          </Section>

          <Section title="Children">
            <Stepper
              label="Sons"
              hint="Each son takes twice a daughter's share"
              value={heirs.sons}
              onChange={(v) => update("sons", v)}
            />
            <Stepper
              label="Daughters"
              hint="Fixed share when there is no son"
              value={heirs.daughters}
              onChange={(v) => update("daughters", v)}
            />
          </Section>

          <Section title="Siblings">
            <Stepper
              label="Full brothers"
              hint="Blocked by a son or the father"
              value={heirs.fullBrothers}
              onChange={(v) => update("fullBrothers", v)}
            />
            <Stepper
              label="Full sisters"
              hint="Blocked by a son or the father"
              value={heirs.fullSisters}
              onChange={(v) => update("fullSisters", v)}
            />
            <Stepper
              label="Maternal (uterine) siblings"
              hint="Blocked by any child or the father"
              value={heirs.maternalSiblings}
              onChange={(v) => update("maternalSiblings", v)}
            />
          </Section>

          <Section title="Estate value (optional)">
            <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-3">
              <span className="text-sm text-zinc-500">$</span>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                value={estate}
                onChange={(e) => setEstate(e.target.value)}
                className="w-full bg-transparent text-base text-zinc-900 outline-none"
                placeholder="Total estate amount"
                aria-label="Total estate value"
              />
            </div>
          </Section>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Distribution</h2>
          {result.shares.length > 0 && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${METHOD_STYLE[result.method]}`}
            >
              {METHOD_LABEL[result.method]}
            </span>
          )}
        </div>

        {result.errors.length > 0 ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <ul className="list-inside list-disc space-y-1">
              {result.errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-lg border border-zinc-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-3 py-2 font-medium">Heir</th>
                    <th className="px-3 py-2 font-medium">Share</th>
                    <th className="px-3 py-2 font-medium">Percent</th>
                    {estateValue > 0 && (
                      <th className="px-3 py-2 text-right font-medium">Amount</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {result.shares.map((s) => (
                    <tr key={s.key} className="align-top">
                      <td className="px-3 py-3">
                        <span className="block font-medium text-zinc-900">
                          {s.label}
                          {s.count > 1 && (
                            <span className="ml-1 text-zinc-400">×{s.count}</span>
                          )}
                        </span>
                        <span className="block text-xs text-zinc-500">
                          {s.reason}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 font-mono text-zinc-900">
                        {toText(s.share)}
                        {s.count > 1 && (
                          <span className="block text-xs text-zinc-400">
                            {toText(s.perPerson)} each
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-zinc-700">
                        {toPercent(s.share)}%
                      </td>
                      {estateValue > 0 && (
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
                {result.shares.length > 0 && (
                  <tfoot className="bg-zinc-50 text-sm font-semibold text-zinc-900">
                    <tr>
                      <td className="px-3 py-2">Total</td>
                      <td className="px-3 py-2">1</td>
                      <td className="px-3 py-2">100%</td>
                      {estateValue > 0 && (
                        <td className="px-3 py-2 text-right">
                          {formatMoney(estateValue)}
                        </td>
                      )}
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {result.shares.length === 0 && (
              <p className="mt-4 text-sm text-zinc-500">
                Select the surviving heirs to see the distribution.
              </p>
            )}

            {result.notes.length > 0 && (
              <ul className="mt-4 space-y-1 text-xs text-zinc-500">
                {result.notes.map((n) => (
                  <li key={n} className="flex gap-2">
                    <span aria-hidden>•</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-4 text-xs text-zinc-400">
              Problem base (asl al-mas&apos;ala): {result.baseDenominator}. This
              tool covers common heirs and is for education, not a religious or
              legal ruling.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
