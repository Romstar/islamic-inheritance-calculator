"use client";

import { useMemo, useState } from "react";
import { applySuccessiveDeath } from "@/lib/faraid/successive";
import { HEIR_HELP, HEIR_SOURCES } from "@/lib/faraid/copy";
import { toPercent, toText, isZero } from "@/lib/faraid/fraction";
import type { SchoolId } from "@/lib/faraid/schools";
import { EMPTY_INPUT, type CalculationResult, type HeirInput, type HeirKey } from "@/lib/faraid/types";
import { Choice, Stepper, Toggle } from "./ui";

type SpouseChoice = "none" | "husband" | "wife";

export default function SuccessiveDeath({
  school,
  first,
}: {
  school: SchoolId;
  first: CalculationResult;
}) {
  const inheriting = first.shares.filter((share) => !isZero(share.share));
  const [enabled, setEnabled] = useState(false);
  const [deceasedKey, setDeceasedKey] = useState<HeirKey | "">(inheriting[0]?.key ?? "");
  const [spouse, setSpouse] = useState<SpouseChoice>("none");
  const [heirs, setHeirs] = useState<HeirInput>({ ...EMPTY_INPUT });

  const setHeir = <K extends keyof HeirInput>(key: K, value: HeirInput[K]) => {
    setHeirs((prev) => ({ ...prev, [key]: value }));
  };

  const chooseSpouse = (choice: SpouseChoice) => {
    setSpouse(choice);
    setHeirs((prev) => ({
      ...prev,
      husband: choice === "husband",
      wives: choice === "wife" ? Math.max(1, prev.wives) : 0,
    }));
  };

  const combined = useMemo(() => {
    if (!enabled || !deceasedKey) return null;
    return applySuccessiveDeath(first, deceasedKey, heirs, school);
  }, [enabled, deceasedKey, heirs, school, first]);

  if (inheriting.length === 0) return null;

  return (
    <div className="rounded-lg border border-zinc-200 p-4">
      <Toggle
        label="An heir later died before the estate was split"
        hint="This applies successive death (munasakha). The deceased heir's share is split among that person's own heirs."
        sources={["islamqa-127945"]}
        checked={enabled}
        onChange={setEnabled}
      />
      {enabled && (
        <div className="mt-4 space-y-4">
          <Choice<HeirKey | "">
            options={inheriting.map((share) => ({
              value: share.key,
              label: share.count > 1 ? `${share.label} (one of ${share.count})` : share.label,
            }))}
            value={deceasedKey}
            onChange={setDeceasedKey}
          />
          <p className="text-xs text-zinc-500">Who survived that person?</p>
          <Choice<SpouseChoice>
            options={[
              { value: "none", label: "No spouse" },
              { value: "husband", label: "Husband" },
              { value: "wife", label: "Wife / wives" },
            ]}
            value={spouse}
            onChange={chooseSpouse}
          />
          {spouse === "wife" && (
            <Stepper
              label="Number of wives"
              hint={HEIR_HELP.wives}
              sources={HEIR_SOURCES.wives}
              value={heirs.wives}
              min={1}
              max={4}
              onChange={(value) => setHeir("wives", value)}
            />
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <Stepper
              label="Sons"
              hint={HEIR_HELP.sons}
              sources={HEIR_SOURCES.sons}
              value={heirs.sons}
              onChange={(value) => setHeir("sons", value)}
            />
            <Stepper
              label="Daughters"
              hint={HEIR_HELP.daughters}
              sources={HEIR_SOURCES.daughters}
              value={heirs.daughters}
              onChange={(value) => setHeir("daughters", value)}
            />
            <Toggle
              label="Father"
              hint={HEIR_HELP.father}
              sources={HEIR_SOURCES.father}
              checked={heirs.father}
              onChange={(value) => setHeir("father", value)}
            />
            <Toggle
              label="Mother"
              hint={HEIR_HELP.mother}
              sources={HEIR_SOURCES.mother}
              checked={heirs.mother}
              onChange={(value) => setHeir("mother", value)}
            />
            <Stepper
              label="Full brothers"
              hint={HEIR_HELP.fullBrothers}
              sources={HEIR_SOURCES.fullBrothers}
              value={heirs.fullBrothers}
              onChange={(value) => setHeir("fullBrothers", value)}
            />
            <Stepper
              label="Full sisters"
              hint={HEIR_HELP.fullSisters}
              sources={HEIR_SOURCES.fullSisters}
              value={heirs.fullSisters}
              onChange={(value) => setHeir("fullSisters", value)}
            />
          </div>
          {combined && combined.errors.length > 0 && (
            <p className="text-sm text-amber-800">{combined.errors[0]}</p>
          )}
          {combined && combined.errors.length === 0 && combined.shares.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-zinc-200">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Shares after successive death</caption>
                <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-3 py-2 font-medium">Heir</th>
                    <th className="px-3 py-2 font-medium">Share of original estate</th>
                    <th className="px-3 py-2 font-medium">Percent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {combined.shares.map((share, index) => (
                    <tr key={`${share.key}-${share.label}-${index}`}>
                      <td className="px-3 py-2 font-medium text-zinc-900">
                        {share.label}
                        {share.count > 1 && (
                          <span className="ml-1 text-zinc-400">×{share.count}</span>
                        )}
                      </td>
                      <td className="px-3 py-2 font-mono">{toText(share.share)}</td>
                      <td className="px-3 py-2">{toPercent(share.share)}%</td>
                    </tr>
                  ))}
                  {!isZero(combined.treasury) && (
                    <tr>
                      <td className="px-3 py-2 font-medium text-zinc-900">Public treasury</td>
                      <td className="px-3 py-2 font-mono">{toText(combined.treasury)}</td>
                      <td className="px-3 py-2">{toPercent(combined.treasury)}%</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <p className="px-3 py-2 text-xs text-zinc-500">{combined.notes[0]}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
