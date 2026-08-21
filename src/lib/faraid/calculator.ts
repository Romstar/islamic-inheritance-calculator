import {
  add,
  commonDenominator,
  compare,
  frac,
  Fraction,
  isZero,
  mul,
  ONE,
  sub,
  sum,
  ZERO,
} from "./fraction";
import type {
  CalculationMethod,
  CalculationResult,
  HeirInput,
  HeirKey,
  HeirShare,
  ShareType,
} from "./types";

interface WorkingShare {
  key: HeirKey;
  label: string;
  count: number;
  share: Fraction;
  type: ShareType;
  reason: string;
}

function clampCount(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.floor(value);
}

function normalize(input: HeirInput): HeirInput {
  return {
    husband: Boolean(input.husband),
    wives: Math.min(4, clampCount(input.wives)),
    father: Boolean(input.father),
    mother: Boolean(input.mother),
    sons: clampCount(input.sons),
    daughters: clampCount(input.daughters),
    fullBrothers: clampCount(input.fullBrothers),
    fullSisters: clampCount(input.fullSisters),
    maternalSiblings: clampCount(input.maternalSiblings),
  };
}

/**
 * Calculates Islamic inheritance shares (Faraid) for a common set of heirs.
 *
 * Supported heirs: husband, wives, father, mother, sons, daughters,
 * full (germane) brothers and sisters, and uterine (maternal) siblings.
 * The engine applies fixed shares (furud), residue (asaba), 'awl (increase),
 * and radd (return). It does not cover grandparents, grandchildren, or
 * consanguine siblings.
 */
export function calculate(rawInput: HeirInput): CalculationResult {
  const input = normalize(rawInput);
  const errors: string[] = [];
  const notes: string[] = [];

  if (input.husband && input.wives > 0) {
    errors.push("A deceased person cannot have both a husband and wives.");
  }

  const heirCount =
    (input.husband ? 1 : 0) +
    input.wives +
    (input.father ? 1 : 0) +
    (input.mother ? 1 : 0) +
    input.sons +
    input.daughters +
    input.fullBrothers +
    input.fullSisters +
    input.maternalSiblings;

  if (heirCount === 0) {
    errors.push("Select at least one heir.");
  }

  if (errors.length > 0) {
    return {
      shares: [],
      method: "normal",
      baseDenominator: 1,
      fixedTotalBefore: ZERO,
      notes,
      errors,
    };
  }

  const hasSon = input.sons > 0;
  const hasChild = input.sons > 0 || input.daughters > 0;
  const spousePresent = input.husband || input.wives > 0;
  const siblingCount =
    input.fullBrothers + input.fullSisters + input.maternalSiblings;

  const working: WorkingShare[] = [];

  // --- Spouse ---
  let spouseShare: Fraction = ZERO;
  if (input.husband) {
    spouseShare = hasChild ? frac(1, 4) : frac(1, 2);
    working.push({
      key: "husband",
      label: "Husband",
      count: 1,
      share: spouseShare,
      type: "fixed",
      reason: hasChild
        ? "1/2 reduced to 1/4 because the deceased left children."
        : "1/2 because there are no children.",
    });
  } else if (input.wives > 0) {
    spouseShare = hasChild ? frac(1, 8) : frac(1, 4);
    working.push({
      key: "wives",
      label: input.wives > 1 ? "Wives" : "Wife",
      count: input.wives,
      share: spouseShare,
      type: "fixed",
      reason: hasChild
        ? "1/4 reduced to 1/8 (shared) because the deceased left children."
        : "1/4 (shared) because there are no children.",
    });
  }

  // --- Mother ---
  // The "Umariyyatan" cases: only spouse + both parents survive.
  const isUmariyya =
    input.father &&
    input.mother &&
    !hasChild &&
    siblingCount === 0 &&
    spousePresent;

  if (input.mother) {
    let motherShare: Fraction;
    let reason: string;
    if (isUmariyya) {
      motherShare = mul(sub(ONE, spouseShare), frac(1, 3));
      reason = "1/3 of the remainder after the spouse (Umariyyah rule).";
    } else if (hasChild || siblingCount >= 2) {
      motherShare = frac(1, 6);
      reason = hasChild
        ? "1/6 because the deceased left children."
        : "1/6 because two or more siblings are present.";
    } else {
      motherShare = frac(1, 3);
      reason = "1/3 because there are no children and fewer than two siblings.";
    }
    working.push({
      key: "mother",
      label: "Mother",
      count: 1,
      share: motherShare,
      type: "fixed",
      reason,
    });
  }

  // --- Father (fixed portion) ---
  // Father is a residuary whenever there is no son. He also takes a fixed 1/6
  // whenever any child (son or daughter) is present.
  const fatherIsResiduary = input.father && !hasSon;
  if (input.father && hasChild) {
    working.push({
      key: "father",
      label: "Father",
      count: 1,
      share: frac(1, 6),
      type: hasSon ? "fixed" : "fixed+residuary",
      reason: hasSon
        ? "1/6 fixed because a son is present."
        : "1/6 fixed, plus the remaining estate as residue.",
    });
  }

  // --- Daughters (fixed, only when there is no son) ---
  if (!hasSon && input.daughters > 0) {
    const share = input.daughters === 1 ? frac(1, 2) : frac(2, 3);
    working.push({
      key: "daughters",
      label: input.daughters > 1 ? "Daughters" : "Daughter",
      count: input.daughters,
      share,
      type: "fixed",
      reason:
        input.daughters === 1
          ? "1/2 for a single daughter with no son."
          : "2/3 shared by two or more daughters with no son.",
    });
  }

  // --- Uterine (maternal) siblings: blocked by any child and by the father ---
  const maternalActive =
    input.maternalSiblings > 0 && !hasChild && !input.father;
  if (maternalActive) {
    const share = input.maternalSiblings === 1 ? frac(1, 6) : frac(1, 3);
    working.push({
      key: "maternalSiblings",
      label: "Maternal (uterine) siblings",
      count: input.maternalSiblings,
      share,
      type: "fixed",
      reason:
        input.maternalSiblings === 1
          ? "1/6 for a single uterine sibling."
          : "1/3 shared equally by two or more uterine siblings.",
    });
  }

  // --- Full siblings: blocked by the father and by a son ---
  const fullSiblingsActive =
    !input.father && !hasSon && (input.fullBrothers > 0 || input.fullSisters > 0);

  // Full sisters take a fixed share only with no brothers and no daughters.
  const fullSistersFixed =
    fullSiblingsActive && input.fullBrothers === 0 && input.daughters === 0;
  if (fullSistersFixed) {
    const share = input.fullSisters === 1 ? frac(1, 2) : frac(2, 3);
    working.push({
      key: "fullSisters",
      label: input.fullSisters > 1 ? "Full sisters" : "Full sister",
      count: input.fullSisters,
      share,
      type: "fixed",
      reason:
        input.fullSisters === 1
          ? "1/2 for a single full sister with no brother, child, or father."
          : "2/3 shared by two or more full sisters with no brother, child, or father.",
    });
  }

  // --- Determine the residuary (asaba) heir group ---
  type Residuary =
    | "children"
    | "father"
    | "fullSiblings"
    | "fullSistersWithDaughters"
    | null;
  let residuary: Residuary = null;
  if (hasSon) {
    residuary = "children";
  } else if (fatherIsResiduary) {
    residuary = "father";
  } else if (fullSiblingsActive && input.fullBrothers > 0) {
    residuary = "fullSiblings";
  } else if (fullSiblingsActive && input.fullSisters > 0 && input.daughters > 0) {
    residuary = "fullSistersWithDaughters";
  }

  const fixedTotal = sum(working.map((w) => w.share));
  const residue = sub(ONE, fixedTotal);

  let method: CalculationMethod = "normal";

  if (residuary && compare(residue, ZERO) > 0) {
    distributeResidue(working, input, residuary, residue);
  } else if (residuary && compare(residue, ZERO) <= 0) {
    // Fixed shares already meet or exceed the estate. Residue heirs get nothing.
    if (compare(fixedTotal, ONE) > 0) {
      method = "awl";
      applyAwl(working);
      notes.push(
        "'Awl applied: fixed shares exceed the estate, so all shares are reduced proportionally.",
      );
    }
    if (residuary === "father") {
      // Father keeps only his fixed 1/6; note it for clarity.
      notes.push("The father received only his fixed 1/6; no residue remained.");
    }
  } else {
    // No residuary heir.
    if (compare(fixedTotal, ONE) > 0) {
      method = "awl";
      applyAwl(working);
      notes.push(
        "'Awl applied: fixed shares exceed the estate, so all shares are reduced proportionally.",
      );
    } else if (compare(fixedTotal, ONE) < 0) {
      method = "radd";
      applyRadd(working, spousePresent, notes);
    }
  }

  const shares: HeirShare[] = working.map((w) => ({
    key: w.key,
    label: w.label,
    count: w.count,
    share: w.share,
    perPerson: w.count > 1 ? frac(w.share.n, w.share.d * w.count) : w.share,
    type: w.type,
    reason: w.reason,
  }));

  const baseDenominator = commonDenominator(shares.map((s) => s.share));

  return {
    shares,
    method,
    baseDenominator,
    fixedTotalBefore: fixedTotal,
    notes,
    errors,
  };
}

function distributeResidue(
  working: WorkingShare[],
  input: HeirInput,
  residuary: string,
  residue: Fraction,
): void {
  if (residuary === "children") {
    // Sons and daughters share the residue with a 2:1 male-to-female ratio.
    const totalParts = input.sons * 2 + input.daughters;
    if (input.sons > 0) {
      working.push({
        key: "sons",
        label: input.sons > 1 ? "Sons" : "Son",
        count: input.sons,
        share: mul(residue, frac(input.sons * 2, totalParts)),
        type: "residuary",
        reason: "Residue shared with daughters; each son takes twice a daughter's share.",
      });
    }
    if (input.daughters > 0) {
      working.push({
        key: "daughters",
        label: input.daughters > 1 ? "Daughters" : "Daughter",
        count: input.daughters,
        share: mul(residue, frac(input.daughters, totalParts)),
        type: "residuary",
        reason: "Residue shared with sons; each daughter takes half a son's share.",
      });
    }
    return;
  }

  if (residuary === "father") {
    const existing = working.find((w) => w.key === "father");
    if (existing) {
      existing.share = add(existing.share, residue);
    } else {
      working.push({
        key: "father",
        label: "Father",
        count: 1,
        share: residue,
        type: "residuary",
        reason: "Takes the entire remaining estate as the nearest male relative.",
      });
    }
    return;
  }

  if (residuary === "fullSiblings") {
    const totalParts = input.fullBrothers * 2 + input.fullSisters;
    if (input.fullBrothers > 0) {
      working.push({
        key: "fullBrothers",
        label: input.fullBrothers > 1 ? "Full brothers" : "Full brother",
        count: input.fullBrothers,
        share: mul(residue, frac(input.fullBrothers * 2, totalParts)),
        type: "residuary",
        reason: "Residue shared with sisters; each brother takes twice a sister's share.",
      });
    }
    if (input.fullSisters > 0) {
      working.push({
        key: "fullSisters",
        label: input.fullSisters > 1 ? "Full sisters" : "Full sister",
        count: input.fullSisters,
        share: mul(residue, frac(input.fullSisters, totalParts)),
        type: "residuary",
        reason: "Residue shared with brothers; each sister takes half a brother's share.",
      });
    }
    return;
  }

  if (residuary === "fullSistersWithDaughters") {
    working.push({
      key: "fullSisters",
      label: input.fullSisters > 1 ? "Full sisters" : "Full sister",
      count: input.fullSisters,
      share: residue,
      type: "residuary",
      reason: "Full sisters take the residue as residuaries alongside daughters.",
    });
  }
}

function applyAwl(working: WorkingShare[]): void {
  const total = sum(working.map((w) => w.share));
  for (const w of working) {
    // Scale every share so the shares sum to exactly 1.
    w.share = frac(w.share.n * total.d, w.share.d * total.n);
  }
}

function applyRadd(
  working: WorkingShare[],
  spousePresent: boolean,
  notes: string[],
): void {
  const total = sum(working.map((w) => w.share));
  const remainder = sub(ONE, total);
  if (isZero(remainder)) return;

  const nonSpouse = working.filter(
    (w) => w.key !== "husband" && w.key !== "wives",
  );

  if (nonSpouse.length === 0) {
    // Only a spouse survives. Modern practice returns the remainder to them.
    for (const w of working) {
      w.share = add(w.share, remainder);
      w.type = "radd";
    }
    notes.push(
      "Radd applied: with only a spouse surviving, the remainder returns to the spouse.",
    );
    return;
  }

  const nonSpouseTotal = sum(nonSpouse.map((w) => w.share));
  for (const w of nonSpouse) {
    const extra = mul(remainder, frac(w.share.n * nonSpouseTotal.d, w.share.d * nonSpouseTotal.n));
    w.share = add(w.share, extra);
    w.type = "radd";
  }
  notes.push(
    "Radd applied: leftover estate returns to the fixed-share heirs (excluding the spouse), in proportion to their shares.",
  );
}
