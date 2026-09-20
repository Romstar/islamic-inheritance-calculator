"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  applySpouseChoice,
  caseHasHeirs,
  decodeCase,
  encodeCase,
  spouseChoiceFromHeirs,
  type SpouseChoice,
} from "@/lib/faraid/caseState";
import { ESTATE_HELP, HEIR_HELP, STEP_COPY } from "@/lib/faraid/copy";
import { parseMoneyField } from "@/lib/faraid/money";
import { calculatorTitle, type SchoolId } from "@/lib/faraid/schools";
import {
  clampStep,
  pruneHiddenHeirs,
  visibleGrandparentFields,
  visibleSiblingFields,
  visibleStepIds,
  type CaseStep,
  type QuestionStepId,
} from "@/lib/faraid/steps";
import { EMPTY_INPUT, type HeirInput } from "@/lib/faraid/types";
import AnswerSummary from "./AnswerSummary";
import Results from "./Results";
import SchoolPicker from "./SchoolPicker";
import { Choice, MoneyField, Stepper, Toggle } from "./ui";

function readBrowserCase() {
  return decodeCase(window.location.search);
}

export default function Questionnaire() {
  const [initial] = useState(readBrowserCase);
  const [heirs, setHeirs] = useState<HeirInput>(initial.heirs);
  const [school, setSchool] = useState<SchoolId | null>(initial.school);
  const [spouse, setSpouse] = useState<SpouseChoice>(spouseChoiceFromHeirs(initial.heirs));
  const [gross, setGross] = useState(initial.gross);
  const [debts, setDebts] = useState(initial.debts);
  const [funeral, setFuneral] = useState(initial.funeral);
  const [wasiyyah, setWasiyyah] = useState(initial.wasiyyah);
  const [stepId, setStepId] = useState<CaseStep>(initial.step);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const query = encodeCase({
      school,
      heirs,
      gross,
      debts,
      funeral,
      wasiyyah,
      step: stepId,
    });
    const next = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState(null, "", next);
  }, [school, heirs, gross, debts, funeral, wasiyyah, stepId]);

  const setHeir = <K extends keyof HeirInput>(key: K, value: HeirInput[K]) => {
    setHeirs((prev) => pruneHiddenHeirs({ ...prev, [key]: value }));
  };

  const chooseSpouse = (choice: SpouseChoice) => {
    setSpouse(choice);
    setHeirs((prev) => pruneHiddenHeirs(applySpouseChoice(prev, choice)));
  };

  const visible = useMemo(() => visibleStepIds(heirs, school), [heirs, school]);
  const currentStep: CaseStep = clampStep(stepId, heirs, school);
  const onResults = currentStep === "results";
  const questionId = onResults ? null : currentStep;
  const stepIndex = questionId ? Math.max(0, visible.indexOf(questionId)) : visible.length;
  const question = questionId ? STEP_COPY[questionId] : null;

  const goNext = () => {
    if (!questionId) return;
    if (questionId === "school" && !school) return;
    const index = visible.indexOf(questionId);
    if (index >= visible.length - 1) setStepId("results");
    else setStepId(visible[index + 1]);
  };

  const goBack = () => {
    if (onResults) {
      setStepId(visible[visible.length - 1] ?? "estate");
      return;
    }
    const index = visible.indexOf(currentStep);
    if (index > 0) setStepId(visible[index - 1]);
  };

  const restart = () => {
    setSchool(null);
    setHeirs({ ...EMPTY_INPUT });
    setSpouse("none");
    setGross("");
    setDebts("");
    setFuneral("");
    setWasiyyah("");
    setStepId("school");
  };

  const chooseSchool = (next: SchoolId) => {
    setSchool(next);
  };

  const copyLink = useCallback(async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy this link", url);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, []);

  const grandparents = visibleGrandparentFields(heirs);
  const siblings = visibleSiblingFields(heirs);
  const anyHeir = caseHasHeirs(heirs);

  const renderStep = (id: QuestionStepId) => {
    switch (id) {
      case "school":
        return <SchoolPicker value={school} onChange={chooseSchool} />;
      case "spouse":
        return (
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
                hint={HEIR_HELP.wives}
                value={heirs.wives}
                min={1}
                max={4}
                onChange={(value) => setHeir("wives", value)}
              />
            )}
          </div>
        );
      case "children":
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            <Stepper
              label="Sons"
              hint={HEIR_HELP.sons}
              value={heirs.sons}
              onChange={(value) => setHeir("sons", value)}
            />
            <Stepper
              label="Daughters"
              hint={HEIR_HELP.daughters}
              value={heirs.daughters}
              onChange={(value) => setHeir("daughters", value)}
            />
          </div>
        );
      case "grandchildren":
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            <Stepper
              label="Grandsons (son's sons)"
              hint={HEIR_HELP.grandsons}
              value={heirs.grandsons}
              onChange={(value) => setHeir("grandsons", value)}
            />
            <Stepper
              label="Granddaughters (son's daughters)"
              hint={HEIR_HELP.granddaughters}
              value={heirs.granddaughters}
              onChange={(value) => setHeir("granddaughters", value)}
            />
          </div>
        );
      case "parents":
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle
              label="Father"
              hint={HEIR_HELP.father}
              checked={heirs.father}
              onChange={(value) => setHeir("father", value)}
            />
            <Toggle
              label="Mother"
              hint={HEIR_HELP.mother}
              checked={heirs.mother}
              onChange={(value) => setHeir("mother", value)}
            />
          </div>
        );
      case "grandparents":
        return (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {grandparents.paternalGrandfather && (
              <Toggle
                label="Paternal grandfather (father's father)"
                hint={HEIR_HELP.paternalGrandfather}
                checked={heirs.paternalGrandfather}
                onChange={(value) => setHeir("paternalGrandfather", value)}
              />
            )}
            {grandparents.paternalGrandmother && (
              <Toggle
                label="Paternal grandmother (father's mother)"
                hint={HEIR_HELP.paternalGrandmother}
                checked={heirs.paternalGrandmother}
                onChange={(value) => setHeir("paternalGrandmother", value)}
              />
            )}
            {grandparents.maternalGrandmother && (
              <Toggle
                label="Maternal grandmother (mother's mother)"
                hint={HEIR_HELP.maternalGrandmother}
                checked={heirs.maternalGrandmother}
                onChange={(value) => setHeir("maternalGrandmother", value)}
              />
            )}
          </div>
        );
      case "siblings":
        return (
          <div className="space-y-3">
            {heirs.father || heirs.paternalGrandfather ? (
              <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
                These siblings do not inherit while the father or paternal grandfather is alive.
                Two or more siblings still reduce the mother&apos;s share from one-third to
                one-sixth.
              </p>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.fullBrothers && (
                <Stepper
                  label="Full brothers"
                  hint={HEIR_HELP.fullBrothers}
                  value={heirs.fullBrothers}
                  onChange={(value) => setHeir("fullBrothers", value)}
                />
              )}
              {siblings.fullSisters && (
                <Stepper
                  label="Full sisters"
                  hint={HEIR_HELP.fullSisters}
                  value={heirs.fullSisters}
                  onChange={(value) => setHeir("fullSisters", value)}
                />
              )}
              {siblings.paternalBrothers && (
                <Stepper
                  label="Paternal half-brothers (same father)"
                  hint={HEIR_HELP.paternalBrothers}
                  value={heirs.paternalBrothers}
                  onChange={(value) => setHeir("paternalBrothers", value)}
                />
              )}
              {siblings.paternalSisters && (
                <Stepper
                  label="Paternal half-sisters (same father)"
                  hint={HEIR_HELP.paternalSisters}
                  value={heirs.paternalSisters}
                  onChange={(value) => setHeir("paternalSisters", value)}
                />
              )}
              {siblings.maternalSiblings && (
                <Stepper
                  label="Maternal (uterine) siblings (same mother)"
                  hint={HEIR_HELP.maternalSiblings}
                  value={heirs.maternalSiblings}
                  onChange={(value) => setHeir("maternalSiblings", value)}
                />
              )}
            </div>
          </div>
        );
      case "extended":
        return (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Stepper
              label="Full brothers' sons (nephews)"
              hint={HEIR_HELP.fullNephews}
              value={heirs.fullNephews}
              onChange={(value) => setHeir("fullNephews", value)}
            />
            <Stepper
              label="Paternal half-brothers' sons"
              hint={HEIR_HELP.paternalNephews}
              value={heirs.paternalNephews}
              onChange={(value) => setHeir("paternalNephews", value)}
            />
            <Stepper
              label="Full paternal uncles"
              hint={HEIR_HELP.fullUncles}
              value={heirs.fullUncles}
              onChange={(value) => setHeir("fullUncles", value)}
            />
            <Stepper
              label="Paternal half-uncles"
              hint={HEIR_HELP.paternalUncles}
              value={heirs.paternalUncles}
              onChange={(value) => setHeir("paternalUncles", value)}
            />
            <Stepper
              label="Full paternal uncles' sons (cousins)"
              hint={HEIR_HELP.fullCousins}
              value={heirs.fullCousins}
              onChange={(value) => setHeir("fullCousins", value)}
            />
            <Stepper
              label="Paternal half-uncles' sons"
              hint={HEIR_HELP.paternalCousins}
              value={heirs.paternalCousins}
              onChange={(value) => setHeir("paternalCousins", value)}
            />
          </div>
        );
      case "estate":
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <MoneyField
              id="gross"
              label="Gross estate (optional)"
              hint={ESTATE_HELP.gross}
              value={gross}
              invalid={parseMoneyField(gross).invalid}
              onChange={setGross}
            />
            <MoneyField
              id="debts"
              label="Debts"
              hint={ESTATE_HELP.debts}
              value={debts}
              invalid={parseMoneyField(debts).invalid}
              onChange={setDebts}
            />
            <MoneyField
              id="funeral"
              label="Funeral costs"
              hint={ESTATE_HELP.funeral}
              value={funeral}
              invalid={parseMoneyField(funeral).invalid}
              onChange={setFuneral}
            />
            <MoneyField
              id="wasiyyah"
              label="Will / bequest"
              hint={ESTATE_HELP.wasiyyah}
              value={wasiyyah}
              invalid={parseMoneyField(wasiyyah).invalid}
              onChange={setWasiyyah}
            />
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 no-print">
        <div className="mb-2 flex items-center justify-between gap-2 text-xs font-medium text-zinc-500">
          <span className="shrink-0">
            {onResults ? "Results" : `Step ${stepIndex + 1} of ${visible.length}`}
          </span>
          <span className="truncate text-right">{onResults ? "Done" : question?.title}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{
              width: `${((onResults ? visible.length : stepIndex) / visible.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
        {school && questionId !== "school" && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-4">
            <p className="text-sm font-semibold text-zinc-900">{calculatorTitle(school)}</p>
            <button
              type="button"
              onClick={() => setStepId("school")}
              className="text-sm font-medium text-emerald-800 underline-offset-2 hover:underline"
            >
              Change school
            </button>
          </div>
        )}
        {!onResults && question ? (
          <>
            <h2 className="text-lg font-semibold text-zinc-900">{question.title}</h2>
            <p className="mt-1 mb-5 text-sm text-zinc-500">{question.subtitle}</p>
            {questionId && renderStep(questionId)}

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={goBack}
                disabled={stepIndex === 0}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 disabled:opacity-40"
              >
                Back
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={questionId === "school" && !school}
                className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {questionId === "estate" ? "See results" : "Next"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-5 grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <AnswerSummary
                  school={school}
                  heirs={heirs}
                  gross={gross}
                  debts={debts}
                  funeral={funeral}
                  wasiyyah={wasiyyah}
                />
              </div>
              <div className="no-print flex flex-col gap-2 sm:flex-row lg:flex-col">
                <button
                  type="button"
                  onClick={copyLink}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  {copied ? "Link copied" : "Copy link"}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  Print
                </button>
              </div>
            </div>

            {anyHeir && school ? (
              <Results
                school={school}
                heirs={heirs}
                gross={gross}
                debts={debts}
                funeral={funeral}
                wasiyyah={wasiyyah}
              />
            ) : (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                No heirs selected. Go back and add at least one heir.
              </div>
            )}

            <div className="mt-6 flex items-center justify-between no-print">
              <button
                type="button"
                onClick={goBack}
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
