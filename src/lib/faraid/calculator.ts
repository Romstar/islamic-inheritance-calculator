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
import {
  type BlockedHeir,
  type CalculationMethod,
  type CalculationResult,
  type HeirInput,
  type HeirKey,
  type HeirShare,
  type ShareType,
  labelFor,
} from "./types";

interface Row {
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
    paternalGrandfather: Boolean(input.paternalGrandfather),
    paternalGrandmother: Boolean(input.paternalGrandmother),
    maternalGrandmother: Boolean(input.maternalGrandmother),
    sons: clampCount(input.sons),
    daughters: clampCount(input.daughters),
    grandsons: clampCount(input.grandsons),
    granddaughters: clampCount(input.granddaughters),
    fullBrothers: clampCount(input.fullBrothers),
    fullSisters: clampCount(input.fullSisters),
    paternalBrothers: clampCount(input.paternalBrothers),
    paternalSisters: clampCount(input.paternalSisters),
    maternalSiblings: clampCount(input.maternalSiblings),
    fullNephews: clampCount(input.fullNephews),
    paternalNephews: clampCount(input.paternalNephews),
    fullUncles: clampCount(input.fullUncles),
    paternalUncles: clampCount(input.paternalUncles),
    fullCousins: clampCount(input.fullCousins),
    paternalCousins: clampCount(input.paternalCousins),
  };
}

/** Distributes a residue between a male and female sub-group with a 2:1 ratio. */
function bilGhayr(
  residue: Fraction,
  males: number,
  females: number,
): { male: Fraction; female: Fraction } {
  const parts = males * 2 + females;
  return {
    male: males > 0 ? mul(residue, frac(males * 2, parts)) : ZERO,
    female: females > 0 ? mul(residue, frac(females, parts)) : ZERO,
  };
}

export function calculate(rawInput: HeirInput): CalculationResult {
  const i = normalize(rawInput);
  const errors: string[] = [];
  const notes: string[] = [];
  const rows: Row[] = [];
  const blocked: BlockedHeir[] = [];

  const block = (key: HeirKey, reason: string) => {
    const count = countOf(i, key);
    if (count > 0) blocked.push({ key, label: labelFor(key, count), count, reason });
  };

  if (i.husband && i.wives > 0) {
    errors.push("A deceased person cannot have both a husband and wives.");
  }

  const totalHeirs = Object.keys(i).reduce(
    (acc, k) => acc + countOf(i, k as HeirKey),
    0,
  );
  if (totalHeirs === 0) errors.push("Select at least one heir.");

  if (errors.length > 0) {
    return {
      shares: [],
      blocked: [],
      method: "normal",
      baseDenominator: 1,
      fixedTotalBefore: ZERO,
      notes,
      errors,
    };
  }

  // --- Flags ---
  const son = i.sons > 0;
  const grandson = i.grandsons > 0;
  const maleDesc = son || grandson;
  const daughter = i.daughters > 0;
  const granddaughter = i.granddaughters > 0;
  const femaleDesc = daughter || granddaughter;
  const desc = maleDesc || femaleDesc;
  const spousePresent = i.husband || i.wives > 0;

  const siblingCount =
    i.fullBrothers +
    i.fullSisters +
    i.paternalBrothers +
    i.paternalSisters +
    i.maternalSiblings;

  // Under the Hanafi position, the father and paternal grandfather both block
  // all siblings and every more distant agnate.
  const ascendantBlocker = i.father || i.paternalGrandfather;

  // --- Spouse ---
  let spouseShare: Fraction = ZERO;
  if (i.husband) {
    spouseShare = desc ? frac(1, 4) : frac(1, 2);
    rows.push({
      key: "husband",
      label: "Husband",
      count: 1,
      share: spouseShare,
      type: "fixed",
      reason: desc ? "1/4 because the deceased left descendants." : "1/2 because there are no descendants.",
    });
  } else if (i.wives > 0) {
    spouseShare = desc ? frac(1, 8) : frac(1, 4);
    rows.push({
      key: "wives",
      label: labelFor("wives", i.wives),
      count: i.wives,
      share: spouseShare,
      type: "fixed",
      reason: desc
        ? "1/8 (shared) because the deceased left descendants."
        : "1/4 (shared) because there are no descendants.",
    });
  }

  // --- Mother ---
  const umariyya =
    i.father && i.mother && spousePresent && !desc && siblingCount === 0;
  if (i.mother) {
    let mShare: Fraction;
    let reason: string;
    if (umariyya) {
      mShare = mul(sub(ONE, spouseShare), frac(1, 3));
      reason = "1/3 of the remainder after the spouse (Umariyyah rule).";
    } else if (desc || siblingCount >= 2) {
      mShare = frac(1, 6);
      reason = desc
        ? "1/6 because the deceased left descendants."
        : "1/6 because two or more siblings are present.";
    } else {
      mShare = frac(1, 3);
      reason = "1/3 because there are no descendants and fewer than two siblings.";
    }
    rows.push({ key: "mother", label: "Mother", count: 1, share: mShare, type: "fixed", reason });
  }

  // --- Grandmothers (1/6 shared; blocked by mother; paternal also by father) ---
  const patGmBlocked = i.mother || i.father;
  const matGmBlocked = i.mother;
  const activeGms: HeirKey[] = [];
  if (i.paternalGrandmother) {
    if (patGmBlocked) block("paternalGrandmother", i.mother ? "Blocked by the mother." : "Blocked by the father.");
    else activeGms.push("paternalGrandmother");
  }
  if (i.maternalGrandmother) {
    if (matGmBlocked) block("maternalGrandmother", "Blocked by the mother.");
    else activeGms.push("maternalGrandmother");
  }
  if (activeGms.length > 0) {
    const each = frac(1, 6 * activeGms.length);
    for (const key of activeGms) {
      rows.push({
        key,
        label: labelFor(key, 1),
        count: 1,
        share: each,
        type: "fixed",
        reason:
          activeGms.length > 1
            ? "Shares 1/6 equally with the other grandmother."
            : "1/6 as the surviving grandmother.",
      });
    }
  }

  // --- Father / paternal grandfather fixed portions ---
  // The grandfather stands in for the father only when the father is absent.
  const asabaAscendant: "father" | "paternalGrandfather" | null = i.father
    ? "father"
    : i.paternalGrandfather
      ? "paternalGrandfather"
      : null;
  if (i.paternalGrandfather && i.father) {
    block("paternalGrandfather", "Blocked by the father.");
  }
  if (asabaAscendant) {
    const label = labelFor(asabaAscendant, 1);
    if (maleDesc) {
      rows.push({
        key: asabaAscendant,
        label,
        count: 1,
        share: frac(1, 6),
        type: "fixed",
        reason: "1/6 fixed because a male descendant is present.",
      });
    } else if (femaleDesc) {
      rows.push({
        key: asabaAscendant,
        label,
        count: 1,
        share: frac(1, 6),
        type: "fixed+residuary",
        reason: "1/6 fixed, plus the remaining estate as residue.",
      });
    }
    // With no descendant the ascendant is a pure residuary (added later).
  }

  // --- Descendants: fixed shares (residue handled in the asaba stage) ---
  // Daughters (fixed only when there is no son).
  if (!son && daughter) {
    rows.push({
      key: "daughters",
      label: labelFor("daughters", i.daughters),
      count: i.daughters,
      share: i.daughters === 1 ? frac(1, 2) : frac(2, 3),
      type: "fixed",
      reason:
        i.daughters === 1
          ? "1/2 for a single daughter with no son."
          : "2/3 shared by two or more daughters with no son.",
    });
  }

  // Granddaughters (son's daughters).
  if (i.granddaughters > 0) {
    if (son) {
      block("granddaughters", "Blocked by a son.");
    } else if (grandson) {
      // Residuary with grandsons; handled in the asaba stage.
    } else if (i.daughters >= 2) {
      block("granddaughters", "Blocked by two or more daughters.");
    } else if (i.daughters === 1) {
      rows.push({
        key: "granddaughters",
        label: labelFor("granddaughters", i.granddaughters),
        count: i.granddaughters,
        share: frac(1, 6),
        type: "fixed",
        reason: "1/6 to complete two-thirds with the single daughter.",
      });
    } else {
      rows.push({
        key: "granddaughters",
        label: labelFor("granddaughters", i.granddaughters),
        count: i.granddaughters,
        share: i.granddaughters === 1 ? frac(1, 2) : frac(2, 3),
        type: "fixed",
        reason:
          i.granddaughters === 1
            ? "1/2 as the single granddaughter with no children of the deceased."
            : "2/3 shared, standing in for absent daughters.",
      });
    }
  }
  if (grandson && son) block("grandsons", "Blocked by a son.");

  // --- Siblings ---
  const siblingsBlocked = ascendantBlocker || maleDesc;
  const uterineBlocked = ascendantBlocker || desc;

  // Maternal (uterine) siblings.
  if (i.maternalSiblings > 0) {
    if (uterineBlocked) {
      block(
        "maternalSiblings",
        ascendantBlocker
          ? "Blocked by the father or grandfather."
          : "Blocked by a descendant.",
      );
    } else {
      rows.push({
        key: "maternalSiblings",
        label: labelFor("maternalSiblings", i.maternalSiblings),
        count: i.maternalSiblings,
        share: i.maternalSiblings === 1 ? frac(1, 6) : frac(1, 3),
        type: "fixed",
        reason:
          i.maternalSiblings === 1
            ? "1/6 for a single uterine sibling."
            : "1/3 shared equally by two or more uterine siblings.",
      });
    }
  }

  // Full siblings.
  const fullBrother = i.fullBrothers > 0;
  const fullSister = i.fullSisters > 0;
  // Does a full sister act as a residuary (bil-ghayr or ma'a al-ghayr)?
  const fullSisterResiduary =
    !siblingsBlocked && ((fullBrother && fullSister) || (fullSister && femaleDesc && !fullBrother));

  if (fullSister && !fullBrother && !siblingsBlocked && !femaleDesc) {
    // Full sisters take a fixed share.
    rows.push({
      key: "fullSisters",
      label: labelFor("fullSisters", i.fullSisters),
      count: i.fullSisters,
      share: i.fullSisters === 1 ? frac(1, 2) : frac(2, 3),
      type: "fixed",
      reason:
        i.fullSisters === 1
          ? "1/2 for a single full sister acting as a Quranic heir."
          : "2/3 shared by two or more full sisters acting as Quranic heirs.",
    });
  }
  if ((fullBrother || fullSister) && siblingsBlocked) {
    if (fullBrother) block("fullBrothers", "Blocked by the father, grandfather, or a male descendant.");
    if (fullSister) block("fullSisters", "Blocked by the father, grandfather, or a male descendant.");
  }

  // Paternal (consanguine) siblings.
  const paternalBrother = i.paternalBrothers > 0;
  const paternalSister = i.paternalSisters > 0;
  // Blocked by father/gf/male descendant, by any full brother, or by a full
  // sister who inherits as a residuary.
  const paternalBlockedByFull = fullBrother || fullSisterResiduary;
  const paternalSiblingsBlocked = siblingsBlocked || paternalBlockedByFull;
  // Two or more full sisters take the whole 2/3, leaving no Quranic share for
  // paternal sisters (unless a paternal brother makes them residuary).
  const fullSistersTookAllFurud =
    !siblingsBlocked && !fullBrother && !femaleDesc && i.fullSisters >= 2;

  if (paternalBrother || paternalSister) {
    if (paternalSiblingsBlocked) {
      const reason = siblingsBlocked
        ? "Blocked by the father, grandfather, or a male descendant."
        : "Blocked by a full brother or a residuary full sister.";
      if (paternalBrother) block("paternalBrothers", reason);
      if (paternalSister) block("paternalSisters", reason);
    } else if (!paternalBrother) {
      // Paternal sisters only.
      if (femaleDesc) {
        // ma'a al-ghayr handled in the asaba stage (unless full sister took it).
        // fullSisterResiduary would have blocked them above.
      } else if (fullSistersTookAllFurud) {
        block("paternalSisters", "Blocked because two or more full sisters take the full two-thirds.");
      } else if (i.fullSisters === 1) {
        rows.push({
          key: "paternalSisters",
          label: labelFor("paternalSisters", i.paternalSisters),
          count: i.paternalSisters,
          share: frac(1, 6),
          type: "fixed",
          reason: "1/6 to complete two-thirds with the single full sister.",
        });
      } else {
        rows.push({
          key: "paternalSisters",
          label: labelFor("paternalSisters", i.paternalSisters),
          count: i.paternalSisters,
          share: i.paternalSisters === 1 ? frac(1, 2) : frac(2, 3),
          type: "fixed",
          reason:
            i.paternalSisters === 1
              ? "1/2 for a single paternal half-sister as a Quranic heir."
              : "2/3 shared by two or more paternal half-sisters as Quranic heirs.",
        });
      }
    }
    // Paternal brother (with sisters) is residuary; handled in the asaba stage.
  }

  // --- Residuary (asaba) resolution ---
  const fixedTotal = sum(rows.map((r) => r.share));
  const residue = sub(ONE, fixedTotal);
  let method: CalculationMethod = "normal";

  const residuary = resolveResiduary(i, {
    son,
    grandson,
    femaleDesc,
    siblingsBlocked,
    paternalSiblingsBlocked,
    fullBrother,
    fullSister,
    fullSisterResiduary,
    paternalBrother,
    paternalSister,
    asabaAscendant,
  });

  if (residuary && compare(residue, ZERO) > 0) {
    distributeResidue(rows, i, residuary, residue);
  } else if (residuary && compare(fixedTotal, ONE) > 0) {
    method = "awl";
    applyAwl(rows);
    notes.push("'Awl applied: fixed shares exceed the estate, so all shares are reduced proportionally.");
    if (residuary === "father" || residuary === "paternalGrandfather") {
      notes.push("The residuary ascendant received only the fixed 1/6; no residue remained.");
    }
  } else if (!residuary) {
    if (compare(fixedTotal, ONE) > 0) {
      method = "awl";
      applyAwl(rows);
      notes.push("'Awl applied: fixed shares exceed the estate, so all shares are reduced proportionally.");
    } else if (compare(fixedTotal, ONE) < 0) {
      method = "radd";
      applyRadd(rows, notes);
    }
  }

  // Record any present heir that ends up with no share (excluded, or a
  // residuary group for which no residue remained).
  recordBlockedRemaining(i, rows, blocked);

  const shares: HeirShare[] = rows.map((r) => ({
    key: r.key,
    label: r.label,
    count: r.count,
    share: r.share,
    perPerson: r.count > 1 ? frac(r.share.n, r.share.d * r.count) : r.share,
    type: r.type,
    reason: r.reason,
  }));

  const baseDenominator = commonDenominator(shares.map((s) => s.share));

  return {
    shares,
    blocked,
    method,
    baseDenominator,
    fixedTotalBefore: fixedTotal,
    notes,
    errors,
  };
}

interface ResiduaryFlags {
  son: boolean;
  grandson: boolean;
  femaleDesc: boolean;
  siblingsBlocked: boolean;
  paternalSiblingsBlocked: boolean;
  fullBrother: boolean;
  fullSister: boolean;
  fullSisterResiduary: boolean;
  paternalBrother: boolean;
  paternalSister: boolean;
  asabaAscendant: "father" | "paternalGrandfather" | null;
}

type ResiduaryGroup =
  | "children"
  | "grandchildren"
  | "father"
  | "paternalGrandfather"
  | "fullSiblings"
  | "fullSistersMaaGhayr"
  | "paternalSiblings"
  | "paternalSistersMaaGhayr"
  | "fullNephews"
  | "paternalNephews"
  | "fullUncles"
  | "paternalUncles"
  | "fullCousins"
  | "paternalCousins";

function resolveResiduary(i: HeirInput, f: ResiduaryFlags): ResiduaryGroup | null {
  if (f.son) return "children";
  if (f.grandson) return "grandchildren";
  if (f.asabaAscendant === "father") return "father";
  if (f.asabaAscendant === "paternalGrandfather") return "paternalGrandfather";
  if (f.fullBrother && !f.siblingsBlocked) return "fullSiblings";
  if (f.fullSister && f.fullSisterResiduary && f.femaleDesc && !f.fullBrother)
    return "fullSistersMaaGhayr";
  if (f.paternalBrother && !f.paternalSiblingsBlocked) return "paternalSiblings";
  if (f.paternalSister && !f.paternalSiblingsBlocked && f.femaleDesc)
    return "paternalSistersMaaGhayr";
  if (i.fullNephews > 0 && !f.siblingsBlocked) return "fullNephews";
  if (i.paternalNephews > 0 && !f.siblingsBlocked) return "paternalNephews";
  if (i.fullUncles > 0 && !f.siblingsBlocked) return "fullUncles";
  if (i.paternalUncles > 0 && !f.siblingsBlocked) return "paternalUncles";
  if (i.fullCousins > 0 && !f.siblingsBlocked) return "fullCousins";
  if (i.paternalCousins > 0 && !f.siblingsBlocked) return "paternalCousins";
  return null;
}

function distributeResidue(
  rows: Row[],
  i: HeirInput,
  group: ResiduaryGroup,
  residue: Fraction,
): void {
  const pushMaleFemale = (
    maleKey: HeirKey,
    males: number,
    femaleKey: HeirKey,
    females: number,
    maleReason: string,
    femaleReason: string,
  ) => {
    const { male, female } = bilGhayr(residue, males, females);
    if (males > 0)
      rows.push({ key: maleKey, label: labelFor(maleKey, males), count: males, share: male, type: "residuary", reason: maleReason });
    if (females > 0)
      rows.push({ key: femaleKey, label: labelFor(femaleKey, females), count: females, share: female, type: "residuary", reason: femaleReason });
  };

  const pushEqual = (key: HeirKey, count: number, reason: string) => {
    rows.push({ key, label: labelFor(key, count), count, share: residue, type: "residuary", reason });
  };

  const addToAscendant = (key: "father" | "paternalGrandfather") => {
    const existing = rows.find((r) => r.key === key);
    if (existing) {
      existing.share = add(existing.share, residue);
    } else {
      rows.push({
        key,
        label: labelFor(key, 1),
        count: 1,
        share: residue,
        type: "residuary",
        reason: "Takes the entire remaining estate as the nearest agnate.",
      });
    }
  };

  switch (group) {
    case "children":
      pushMaleFemale(
        "sons",
        i.sons,
        "daughters",
        i.daughters,
        "Residue as agnate; each son takes twice a daughter's share.",
        "Residue shared with sons; each daughter takes half a son's share.",
      );
      break;
    case "grandchildren":
      pushMaleFemale(
        "grandsons",
        i.grandsons,
        "granddaughters",
        i.granddaughters,
        "Residue as agnate; each grandson takes twice a granddaughter's share.",
        "Residue shared with grandsons; each granddaughter takes half a grandson's share.",
      );
      break;
    case "father":
      addToAscendant("father");
      break;
    case "paternalGrandfather":
      addToAscendant("paternalGrandfather");
      break;
    case "fullSiblings":
      pushMaleFemale(
        "fullBrothers",
        i.fullBrothers,
        "fullSisters",
        i.fullSisters,
        "Residue as agnate; each brother takes twice a sister's share.",
        "Residue shared with brothers; each sister takes half a brother's share.",
      );
      break;
    case "fullSistersMaaGhayr":
      pushEqual("fullSisters", i.fullSisters, "Residue as agnate alongside the daughters (asaba ma'a al-ghayr).");
      break;
    case "paternalSiblings":
      pushMaleFemale(
        "paternalBrothers",
        i.paternalBrothers,
        "paternalSisters",
        i.paternalSisters,
        "Residue as agnate; each brother takes twice a sister's share.",
        "Residue shared with brothers; each sister takes half a brother's share.",
      );
      break;
    case "paternalSistersMaaGhayr":
      pushEqual("paternalSisters", i.paternalSisters, "Residue as agnate alongside the daughters (asaba ma'a al-ghayr).");
      break;
    case "fullNephews":
      pushEqual("fullNephews", i.fullNephews, "Residue shared equally as the nearest agnates.");
      break;
    case "paternalNephews":
      pushEqual("paternalNephews", i.paternalNephews, "Residue shared equally as the nearest agnates.");
      break;
    case "fullUncles":
      pushEqual("fullUncles", i.fullUncles, "Residue shared equally as the nearest agnates.");
      break;
    case "paternalUncles":
      pushEqual("paternalUncles", i.paternalUncles, "Residue shared equally as the nearest agnates.");
      break;
    case "fullCousins":
      pushEqual("fullCousins", i.fullCousins, "Residue shared equally as the nearest agnates.");
      break;
    case "paternalCousins":
      pushEqual("paternalCousins", i.paternalCousins, "Residue shared equally as the nearest agnates.");
      break;
  }
}

function applyAwl(rows: Row[]): void {
  const total = sum(rows.map((r) => r.share));
  for (const r of rows) {
    r.share = frac(r.share.n * total.d, r.share.d * total.n);
  }
}

function applyRadd(rows: Row[], notes: string[]): void {
  const total = sum(rows.map((r) => r.share));
  const remainder = sub(ONE, total);
  if (isZero(remainder)) return;

  const nonSpouse = rows.filter((r) => r.key !== "husband" && r.key !== "wives");
  if (nonSpouse.length === 0) {
    for (const r of rows) {
      r.share = add(r.share, remainder);
      r.type = "radd";
    }
    notes.push("Radd applied: with only a spouse surviving, the remainder returns to the spouse.");
    return;
  }

  const nonSpouseTotal = sum(nonSpouse.map((r) => r.share));
  for (const r of nonSpouse) {
    const extra = mul(remainder, frac(r.share.n * nonSpouseTotal.d, r.share.d * nonSpouseTotal.n));
    r.share = add(r.share, extra);
    r.type = "radd";
  }
  notes.push("Radd applied: leftover estate returns to the fixed-share heirs (excluding the spouse), in proportion to their shares.");
}

/** Records any present heir that gets no share and was not already blocked. */
function recordBlockedRemaining(i: HeirInput, rows: Row[], blocked: BlockedHeir[]): void {
  const inheriting = new Set(rows.map((r) => r.key));
  const alreadyBlocked = new Set(blocked.map((b) => b.key));
  const someoneTookResidue = rows.some(
    (r) => r.type === "residuary" || r.type === "fixed+residuary",
  );
  const allKeys = Object.keys(i) as HeirKey[];
  for (const key of allKeys) {
    const count = countOf(i, key);
    if (count > 0 && !inheriting.has(key) && !alreadyBlocked.has(key)) {
      blocked.push({
        key,
        label: labelFor(key, count),
        count,
        reason: someoneTookResidue
          ? "Excluded by a nearer heir (a closer relative takes the residue)."
          : "No residue remained after the fixed shares.",
      });
    }
  }
}

function countOf(i: HeirInput, key: HeirKey): number {
  const value = i[key];
  if (typeof value === "boolean") return value ? 1 : 0;
  return value;
}
