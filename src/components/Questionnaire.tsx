"use client";

import { useMemo, useState } from "react";
import { EMPTY_INPUT, type HeirInput } from "@/lib/faraid/types";
import { Choice, Stepper, Toggle } from "./ui";
import Results from "./Results";

type SpouseChoice = "none" | "husband" | "wife";

interface StepDef {
  id: string;
  title: string;
  subtitle: string;
  render: () => React.ReactNode;
}

export default function Questionnaire() {
  const [heirs, setHeirs] = useState<HeirInput>({ ...EMPTY_INPUT });
  const [spouse, setSpouse] = useState<SpouseChoice>("none");
  const [estate, setEstate] = useState<string>("100000");
  const [step, setStep] = useState<number>(0);

  const set = <K extends keyof HeirInput>(key: K, value: HeirInput[K]) =>
    setHeirs((prev) => ({ ...prev, [key]: value }));

  const chooseSpouse = (choice: SpouseChoice) => {
    setSpouse(choice);
    setHeirs((prev) => ({
      ...prev,
      husband: choice === "husband",
      wives: choice === "wife" ? Math.max(1, prev.wives) : 0,
    }));
  };

  const restart = () => {
    setHeirs({ ...EMPTY_INPUT });
    setSpouse("none");
    setStep(0);
  };

  const steps: StepDef[] = [
    {
      id: "spouse",
      title: "Spouse",
      subtitle: "Did the deceased leave a surviving spouse?",
      render: () => (
        <div className="space-y-4">
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
              hint="They share the spouse portion equally (max 4)"
              value={heirs.wives}
              min={1}
              max={4}
              onChange={(v) => set("wives", v)}
            />
          )}
        </div>
      ),
    },
    {
      id: "children",
      title: "Children",
      subtitle: "How many surviving sons and daughters?",
      render: () => (
        <div className="space-y-3">
          <Stepper label="Sons" hint="Each son takes twice a daughter's share" value={heirs.sons} onChange={(v) => set("sons", v)} />
          <Stepper label="Daughters" value={heirs.daughters} onChange={(v) => set("daughters", v)} />
        </div>
      ),
    },
    {
      id: "grandchildren",
      title: "Grandchildren",
      subtitle: "Children of a son (the son's line). Skip if not applicable.",
      render: () => (
        <div className="space-y-3">
          <Stepper label="Grandsons (son's sons)" value={heirs.grandsons} onChange={(v) => set("grandsons", v)} />
          <Stepper label="Granddaughters (son's daughters)" value={heirs.granddaughters} onChange={(v) => set("granddaughters", v)} />
        </div>
      ),
    },
    {
      id: "parents",
      title: "Parents",
      subtitle: "Which parents survive the deceased?",
      render: () => (
        <div className="space-y-3">
          <Toggle label="Father" checked={heirs.father} onChange={(v) => set("father", v)} />
          <Toggle label="Mother" checked={heirs.mother} onChange={(v) => set("mother", v)} />
        </div>
      ),
    },
    {
      id: "grandparents",
      title: "Grandparents",
      subtitle: "Surviving grandparents. A parent blocks the grandparent on that side.",
      render: () => (
        <div className="space-y-3">
          <Toggle label="Paternal grandfather (father's father)" checked={heirs.paternalGrandfather} onChange={(v) => set("paternalGrandfather", v)} />
          <Toggle label="Paternal grandmother (father's mother)" checked={heirs.paternalGrandmother} onChange={(v) => set("paternalGrandmother", v)} />
          <Toggle label="Maternal grandmother (mother's mother)" checked={heirs.maternalGrandmother} onChange={(v) => set("maternalGrandmother", v)} />
        </div>
      ),
    },
    {
      id: "siblings",
      title: "Siblings",
      subtitle: "Full, paternal half, and maternal (uterine) siblings.",
      render: () => (
        <div className="space-y-3">
          <Stepper label="Full brothers" value={heirs.fullBrothers} onChange={(v) => set("fullBrothers", v)} />
          <Stepper label="Full sisters" value={heirs.fullSisters} onChange={(v) => set("fullSisters", v)} />
          <Stepper label="Paternal half-brothers (same father)" value={heirs.paternalBrothers} onChange={(v) => set("paternalBrothers", v)} />
          <Stepper label="Paternal half-sisters (same father)" value={heirs.paternalSisters} onChange={(v) => set("paternalSisters", v)} />
          <Stepper label="Maternal (uterine) siblings (same mother)" value={heirs.maternalSiblings} onChange={(v) => set("maternalSiblings", v)} />
        </div>
      ),
    },
    {
      id: "extended",
      title: "Extended relatives",
      subtitle: "Distant male relatives. They inherit only when no closer heir does.",
      render: () => (
        <div className="space-y-3">
          <Stepper label="Full brothers' sons (nephews)" value={heirs.fullNephews} onChange={(v) => set("fullNephews", v)} />
          <Stepper label="Paternal half-brothers' sons" value={heirs.paternalNephews} onChange={(v) => set("paternalNephews", v)} />
          <Stepper label="Full paternal uncles" value={heirs.fullUncles} onChange={(v) => set("fullUncles", v)} />
          <Stepper label="Paternal half-uncles" value={heirs.paternalUncles} onChange={(v) => set("paternalUncles", v)} />
          <Stepper label="Full paternal uncles' sons (cousins)" value={heirs.fullCousins} onChange={(v) => set("fullCousins", v)} />
          <Stepper label="Paternal half-uncles' sons" value={heirs.paternalCousins} onChange={(v) => set("paternalCousins", v)} />
        </div>
      ),
    },
  ];

  const totalQuestions = steps.length;
  const onResults = step >= totalQuestions;

  const anyHeir = useMemo(
    () => Object.values(heirs).some((v) => (typeof v === "boolean" ? v : v > 0)),
    [heirs],
  );

  const estateValue = Number(estate) || 0;

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-zinc-500">
          <span>{onResults ? "Results" : `Step ${step + 1} of ${totalQuestions}`}</span>
          <span>{onResults ? "Done" : steps[step].title}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${((onResults ? totalQuestions : step) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        {!onResults ? (
          <>
            <h2 className="text-lg font-semibold text-zinc-900">{steps[step].title}</h2>
            <p className="mt-1 mb-5 text-sm text-zinc-500">{steps[step].subtitle}</p>
            {steps[step].render()}

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 disabled:opacity-40"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                {step === totalQuestions - 1 ? "See results" : "Next"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-5">
              <label htmlFor="estate" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Estate value (optional)
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-3">
                <span className="text-sm text-zinc-500">$</span>
                <input
                  id="estate"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={estate}
                  onChange={(e) => setEstate(e.target.value)}
                  className="w-full bg-transparent text-base text-zinc-900 outline-none"
                  placeholder="Total estate amount"
                />
              </div>
            </div>

            {anyHeir ? (
              <Results heirs={heirs} estate={estateValue} />
            ) : (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                No heirs selected. Go back and add at least one heir.
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(totalQuestions - 1)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
              >
                Edit answers
              </button>
              <button
                type="button"
                onClick={restart}
                className="rounded-lg border border-emerald-600 px-5 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Start over
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
