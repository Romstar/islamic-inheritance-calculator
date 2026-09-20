import { parseSchool, type SchoolId } from "./schools";
import {
  clampStep,
  pruneHiddenHeirs,
  QUESTION_STEP_IDS,
  type CaseStep,
} from "./steps";
import { EMPTY_INPUT, type HeirInput, type HeirKey } from "./types";

export interface CaseSnapshot {
  school: SchoolId | null;
  heirs: HeirInput;
  gross: string;
  debts: string;
  funeral: string;
  wasiyyah: string;
  step: CaseStep;
}

export const EMPTY_CASE: CaseSnapshot = {
  school: null,
  heirs: { ...EMPTY_INPUT },
  gross: "",
  debts: "",
  funeral: "",
  wasiyyah: "",
  step: "school",
};

export type SpouseChoice = "none" | "husband" | "wife";

const BOOL_KEYS = [
  "husband",
  "father",
  "mother",
  "paternalGrandfather",
  "paternalGreatGrandfather",
  "paternalGrandmother",
  "maternalGrandmother",
] as const satisfies readonly HeirKey[];

const COUNT_KEYS = [
  "wives",
  "sons",
  "daughters",
  "grandsons",
  "granddaughters",
  "greatGrandsons",
  "greatGranddaughters",
  "daughtersSons",
  "daughtersDaughters",
  "fullBrothers",
  "fullSisters",
  "paternalBrothers",
  "paternalSisters",
  "maternalSiblings",
  "fullNephews",
  "paternalNephews",
  "fullUncles",
  "paternalUncles",
  "fullCousins",
  "paternalCousins",
] as const satisfies readonly HeirKey[];

const PARAM: Record<string, string> = {
  husband: "h",
  wives: "w",
  father: "f",
  mother: "m",
  paternalGrandfather: "pgf",
  paternalGreatGrandfather: "pggf",
  paternalGrandmother: "pgm",
  maternalGrandmother: "mgm",
  sons: "s",
  daughters: "d",
  grandsons: "gs",
  granddaughters: "gd",
  greatGrandsons: "ggs",
  greatGranddaughters: "ggd",
  daughtersSons: "ds",
  daughtersDaughters: "dd",
  fullBrothers: "fb",
  fullSisters: "fs",
  paternalBrothers: "pb",
  paternalSisters: "ps",
  maternalSiblings: "ms",
  fullNephews: "fnp",
  paternalNephews: "pnp",
  fullUncles: "fu",
  paternalUncles: "pu",
  fullCousins: "fc",
  paternalCousins: "pc",
  gross: "g",
  debts: "db",
  funeral: "fn",
  wasiyyah: "wy",
  school: "md",
  step: "st",
  showResults: "r",
};

const FROM_PARAM = Object.fromEntries(
  Object.entries(PARAM).map(([key, value]) => [value, key]),
) as Record<string, string>;

function parseCount(raw: string | null, max = 99): number {
  if (raw === null || raw === "") return 0;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(max, Math.floor(value));
}

export function spouseChoiceFromHeirs(heirs: HeirInput): SpouseChoice {
  if (heirs.husband) return "husband";
  if (heirs.wives > 0) return "wife";
  return "none";
}

export function applySpouseChoice(heirs: HeirInput, choice: SpouseChoice): HeirInput {
  return {
    ...heirs,
    husband: choice === "husband",
    wives: choice === "wife" ? Math.max(1, heirs.wives) : 0,
  };
}

export function encodeCase(snapshot: CaseSnapshot): string {
  const params = new URLSearchParams();
  const heirs = pruneHiddenHeirs(snapshot.heirs, snapshot.school);
  const school = snapshot.school;

  if (school) params.set(PARAM.school, school);

  for (const key of BOOL_KEYS) {
    if (heirs[key]) params.set(PARAM[key], "1");
  }
  for (const key of COUNT_KEYS) {
    const count = heirs[key];
    if (count > 0) params.set(PARAM[key], String(count));
  }
  if (snapshot.gross.trim()) params.set(PARAM.gross, snapshot.gross.trim());
  if (snapshot.debts.trim()) params.set(PARAM.debts, snapshot.debts.trim());
  if (snapshot.funeral.trim()) params.set(PARAM.funeral, snapshot.funeral.trim());
  if (snapshot.wasiyyah.trim()) params.set(PARAM.wasiyyah, snapshot.wasiyyah.trim());
  const step = clampStep(snapshot.step, heirs, school);
  if (step === "results") params.set(PARAM.showResults, "1");
  else if (step !== "school") params.set(PARAM.step, step);

  return params.toString();
}

export function decodeCase(search: string): CaseSnapshot {
  const query = search.startsWith("?") ? search.slice(1) : search;
  const params = new URLSearchParams(query);
  const heirs: HeirInput = { ...EMPTY_INPUT };
  const school = parseSchool(params.get(PARAM.school));

  for (const [param, raw] of params.entries()) {
    const key = FROM_PARAM[param];
    if (!key || key === "school") continue;
    if ((BOOL_KEYS as readonly string[]).includes(key)) {
      (heirs[key as (typeof BOOL_KEYS)[number]] as boolean) = raw === "1" || raw === "true";
    } else if ((COUNT_KEYS as readonly string[]).includes(key)) {
      const max = key === "wives" ? 4 : 99;
      (heirs[key as (typeof COUNT_KEYS)[number]] as number) = parseCount(raw, max);
    }
  }

  if (heirs.husband) heirs.wives = 0;
  const pruned = pruneHiddenHeirs(heirs, school);

  let step: CaseStep = "school";
  if (params.get(PARAM.showResults) === "1") step = "results";
  else {
    const rawStep = params.get(PARAM.step);
    if (rawStep && (QUESTION_STEP_IDS as readonly string[]).includes(rawStep)) {
      step = rawStep as CaseStep;
    }
  }

  return {
    school,
    heirs: pruned,
    gross: params.get(PARAM.gross) ?? "",
    debts: params.get(PARAM.debts) ?? "",
    funeral: params.get(PARAM.funeral) ?? "",
    wasiyyah: params.get(PARAM.wasiyyah) ?? "",
    step: clampStep(step, pruned, school),
  };
}

export function caseHasHeirs(heirs: HeirInput): boolean {
  return (Object.keys(heirs) as HeirKey[]).some((key) => {
    const value = heirs[key];
    return typeof value === "boolean" ? value : value > 0;
  });
}
