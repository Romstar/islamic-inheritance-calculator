import {
  distantKindredInherit,
  fatherBlocksPaternalGrandmother,
  grandfatherBlocksSiblings,
  type SchoolId,
} from "./schools";
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
  "kindred",
  "estate",
] as const;

export type QuestionStepId = (typeof QUESTION_STEP_IDS)[number];

export type VisibleGrandparentFields = {
  paternalGrandfather: boolean;
  paternalGreatGrandfather: boolean;
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
  return heirs.sons > 0 || heirs.grandsons > 0 || heirs.greatGrandsons > 0;
}

function hasAnyDescendant(heirs: HeirInput): boolean {
  return (
    heirs.sons > 0 ||
    heirs.daughters > 0 ||
    heirs.grandsons > 0 ||
    heirs.granddaughters > 0 ||
    heirs.greatGrandsons > 0 ||
    heirs.greatGranddaughters > 0
  );
}

function hasFemaleDescendant(heirs: HeirInput): boolean {
  return heirs.daughters > 0 || heirs.granddaughters > 0 || heirs.greatGranddaughters > 0;
}

function livingGrandfather(heirs: HeirInput): boolean {
  return heirs.paternalGrandfather || heirs.paternalGreatGrandfather;
}

/** Father always blocks siblings. The grandfather does so only in Hanafi. */
function hasAscendantBlocker(heirs: HeirInput, school: SchoolId): boolean {
  if (heirs.father) return true;
  return grandfatherBlocksSiblings(school) && livingGrandfather(heirs);
}

export function visibleGrandparentFields(
  heirs: HeirInput,
  school: SchoolId = "hanafi",
): VisibleGrandparentFields {
  return {
    paternalGrandfather: !heirs.father,
    paternalGreatGrandfather: !heirs.father && !heirs.paternalGrandfather,
    paternalGrandmother: !heirs.mother && !(fatherBlocksPaternalGrandmother(school) && heirs.father),
    maternalGrandmother: !heirs.mother,
  };
}

export function visibleSiblingFields(
  heirs: HeirInput,
  school: SchoolId = "hanafi",
): VisibleSiblingFields {
  const blockedFromInheritance = hasAscendantBlocker(heirs, school) || hasMaleDescendant(heirs);
  const uterineBlocked = hasAscendantBlocker(heirs, school) || hasAnyDescendant(heirs) || livingGrandfather(heirs);
  if (blockedFromInheritance) {
    const neededForMother = heirs.mother && !hasAnyDescendant(heirs);
    return {
      fullBrothers: neededForMother,
      fullSisters: neededForMother,
      paternalBrothers: neededForMother,
      paternalSisters: neededForMother,
      maternalSiblings: neededForMother && !uterineBlocked ? neededForMother : neededForMother,
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

function closerResiduaryThanExtended(heirs: HeirInput, school: SchoolId): boolean {
  if (hasMaleDescendant(heirs) || heirs.father) return true;
  if (livingGrandfather(heirs) && grandfatherBlocksSiblings(school)) return true;
  if (livingGrandfather(heirs)) return true;
  if (heirs.fullBrothers > 0) return true;
  if (heirs.fullSisters > 0 && hasFemaleDescendant(heirs)) return true;
  if (heirs.paternalBrothers > 0) return true;
  if (heirs.paternalSisters > 0 && hasFemaleDescendant(heirs)) return true;
  return false;
}

export function isStepVisible(
  id: QuestionStepId,
  heirs: HeirInput,
  school: SchoolId | null = "hanafi",
): boolean {
  const activeSchool = school ?? "hanafi";
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
      const fields = visibleGrandparentFields(heirs, activeSchool);
      return (
        fields.paternalGrandfather ||
        fields.paternalGreatGrandfather ||
        fields.paternalGrandmother ||
        fields.maternalGrandmother
      );
    }
    case "siblings": {
      if (hasMaleDescendant(heirs)) return false;
      if (hasAscendantBlocker(heirs, activeSchool)) {
        return heirs.mother && !hasAnyDescendant(heirs);
      }
      return true;
    }
    case "extended":
      return !closerResiduaryThanExtended(heirs, activeSchool);
    case "kindred":
      return (
        distantKindredInherit(activeSchool) &&
        !hasMaleDescendant(heirs) &&
        !heirs.father &&
        !livingGrandfather(heirs)
      );
  }
}

export function visibleStepIds(
  heirs: HeirInput,
  school: SchoolId | null,
): QuestionStepId[] {
  if (!school) return ["school"];
  return QUESTION_STEP_IDS.filter((id) => isStepVisible(id, heirs, school));
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
export function pruneHiddenHeirs(heirs: HeirInput, school: SchoolId | null = "hanafi"): HeirInput {
  const activeSchool = school ?? "hanafi";
  const next: HeirInput = { ...heirs };

  if (!isStepVisible("grandchildren", next, activeSchool)) {
    next.grandsons = 0;
    next.granddaughters = 0;
    next.greatGrandsons = 0;
    next.greatGranddaughters = 0;
  } else if (next.grandsons > 0) {
    next.greatGrandsons = 0;
    next.greatGranddaughters = 0;
  }

  const grandparents = visibleGrandparentFields(next, activeSchool);
  if (!grandparents.paternalGrandfather) next.paternalGrandfather = false;
  if (!grandparents.paternalGreatGrandfather) next.paternalGreatGrandfather = false;
  if (!grandparents.paternalGrandmother) next.paternalGrandmother = false;
  if (!grandparents.maternalGrandmother) next.maternalGrandmother = false;

  const siblings = visibleSiblingFields(next, activeSchool);
  if (!siblings.fullBrothers) next.fullBrothers = 0;
  if (!siblings.fullSisters) next.fullSisters = 0;
  if (!siblings.paternalBrothers) next.paternalBrothers = 0;
  if (!siblings.paternalSisters) next.paternalSisters = 0;
  if (!siblings.maternalSiblings) next.maternalSiblings = 0;

  if (!isStepVisible("extended", next, activeSchool)) {
    for (const key of EXTENDED_KEYS) clearKey(next, key);
  }

  if (!isStepVisible("kindred", next, activeSchool)) {
    next.daughtersSons = 0;
    next.daughtersDaughters = 0;
  }

  return next;
}

export function countSelectedHeirs(heirs: HeirInput): number {
  return (Object.keys(EMPTY_INPUT) as HeirKey[]).reduce((sum, key) => {
    const value = heirs[key];
    return sum + (typeof value === "boolean" ? (value ? 1 : 0) : value);
  }, 0);
}
