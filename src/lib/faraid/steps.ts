import type { SchoolId } from "./schools";
import { EMPTY_INPUT, type HeirInput, type HeirKey } from "./types";

export const QUESTION_STEP_IDS = [
  "school",
  "spouse",
  "children",
  "grandchildren",
  "parents",
  "grandparents",
  "siblings",
  "extended",
  "estate",
] as const;

export type QuestionStepId = (typeof QUESTION_STEP_IDS)[number];

export type VisibleGrandparentFields = {
  paternalGrandfather: boolean;
  paternalGrandmother: boolean;
  maternalGrandmother: boolean;
};

export type VisibleSiblingFields = {
  fullBrothers: boolean;
  fullSisters: boolean;
  paternalBrothers: boolean;
  paternalSisters: boolean;
  maternalSiblings: boolean;
};

function hasMaleDescendant(heirs: HeirInput): boolean {
  return heirs.sons > 0 || heirs.grandsons > 0;
}

function hasAnyDescendant(heirs: HeirInput): boolean {
  return (
    heirs.sons > 0 ||
    heirs.daughters > 0 ||
    heirs.grandsons > 0 ||
    heirs.granddaughters > 0
  );
}

function hasFemaleDescendant(heirs: HeirInput): boolean {
  return heirs.daughters > 0 || heirs.granddaughters > 0;
}

/** Father and paternal grandfather block siblings and more distant agnates. */
function hasAscendantBlocker(heirs: HeirInput): boolean {
  return heirs.father || heirs.paternalGrandfather;
}

export function visibleGrandparentFields(heirs: HeirInput): VisibleGrandparentFields {
  return {
    paternalGrandfather: !heirs.father,
    paternalGrandmother: !heirs.father && !heirs.mother,
    maternalGrandmother: !heirs.mother,
  };
}

export function visibleSiblingFields(heirs: HeirInput): VisibleSiblingFields {
  const blockedFromInheritance = hasAscendantBlocker(heirs) || hasMaleDescendant(heirs);
  const uterineBlocked = hasAscendantBlocker(heirs) || hasAnyDescendant(heirs);
  if (blockedFromInheritance) {
    // Keep the counters when they still affect the mother's share.
    const neededForMother = heirs.mother && !hasAnyDescendant(heirs);
    return {
      fullBrothers: neededForMother,
      fullSisters: neededForMother,
      paternalBrothers: neededForMother,
      paternalSisters: neededForMother,
      maternalSiblings: neededForMother,
    };
  }
  return {
    fullBrothers: true,
    fullSisters: true,
    paternalBrothers: true,
    paternalSisters: true,
    maternalSiblings: !uterineBlocked,
  };
}

function closerResiduaryThanExtended(heirs: HeirInput): boolean {
  if (hasMaleDescendant(heirs) || hasAscendantBlocker(heirs)) return true;
  if (heirs.fullBrothers > 0) return true;
  if (heirs.fullSisters > 0 && hasFemaleDescendant(heirs)) return true;
  if (heirs.paternalBrothers > 0) return true;
  if (heirs.paternalSisters > 0 && hasFemaleDescendant(heirs)) return true;
  return false;
}

export function isStepVisible(id: QuestionStepId, heirs: HeirInput): boolean {
  switch (id) {
    case "school":
    case "spouse":
    case "children":
    case "parents":
    case "estate":
      return true;
    case "grandchildren":
      return heirs.sons === 0;
    case "grandparents": {
      const fields = visibleGrandparentFields(heirs);
      return fields.paternalGrandfather || fields.paternalGrandmother || fields.maternalGrandmother;
    }
    case "siblings": {
      if (hasMaleDescendant(heirs)) return false;
      if (hasAscendantBlocker(heirs)) {
        return heirs.mother && !hasAnyDescendant(heirs);
      }
      return true;
    }
    case "extended":
      return !closerResiduaryThanExtended(heirs);
  }
}

export function visibleStepIds(
  heirs: HeirInput,
  school: SchoolId | null,
): QuestionStepId[] {
  if (!school) return ["school"];
  return QUESTION_STEP_IDS.filter((id) => isStepVisible(id, heirs));
}

export type CaseStep = QuestionStepId | "results";

export function clampStep(
  step: CaseStep,
  heirs: HeirInput,
  school: SchoolId | null,
): CaseStep {
  if (!school) return "school";
  if (step === "results") return "results";
  const visible = visibleStepIds(heirs, school);
  if (visible.includes(step)) return step;
  const allIndex = QUESTION_STEP_IDS.indexOf(step);
  for (let i = allIndex + 1; i < QUESTION_STEP_IDS.length; i += 1) {
    const candidate = QUESTION_STEP_IDS[i];
    if (visible.includes(candidate)) return candidate;
  }
  for (let i = allIndex - 1; i >= 0; i -= 1) {
    const candidate = QUESTION_STEP_IDS[i];
    if (visible.includes(candidate)) return candidate;
  }
  return visible[0] ?? "school";
}

const EXTENDED_KEYS: HeirKey[] = [
  "fullNephews",
  "paternalNephews",
  "fullUncles",
  "paternalUncles",
  "fullCousins",
  "paternalCousins",
];

function clearKey(heirs: HeirInput, key: HeirKey): void {
  if (typeof heirs[key] === "boolean") {
    (heirs[key] as boolean) = false;
  } else {
    (heirs[key] as number) = 0;
  }
}

/**
 * Zero heirs that the current answers would hide.
 * This keeps skipped counts from changing the result.
 */
export function pruneHiddenHeirs(heirs: HeirInput): HeirInput {
  const next: HeirInput = { ...heirs };

  if (!isStepVisible("grandchildren", next)) {
    next.grandsons = 0;
    next.granddaughters = 0;
  }

  const grandparents = visibleGrandparentFields(next);
  if (!grandparents.paternalGrandfather) next.paternalGrandfather = false;
  if (!grandparents.paternalGrandmother) next.paternalGrandmother = false;
  if (!grandparents.maternalGrandmother) next.maternalGrandmother = false;

  const siblings = visibleSiblingFields(next);
  if (!siblings.fullBrothers) next.fullBrothers = 0;
  if (!siblings.fullSisters) next.fullSisters = 0;
  if (!siblings.paternalBrothers) next.paternalBrothers = 0;
  if (!siblings.paternalSisters) next.paternalSisters = 0;
  if (!siblings.maternalSiblings) next.maternalSiblings = 0;

  if (!isStepVisible("extended", next)) {
    for (const key of EXTENDED_KEYS) clearKey(next, key);
  }

  return next;
}

export function countSelectedHeirs(heirs: HeirInput): number {
  return (Object.keys(EMPTY_INPUT) as HeirKey[]).reduce((sum, key) => {
    const value = heirs[key];
    return sum + (typeof value === "boolean" ? (value ? 1 : 0) : value);
  }, 0);
}
