import {
  add,
  commonDenominator,
  compare,
  frac,
  Fraction,
  isZero,
  maxFraction,
  mul,
  ONE,
  sub,
  sum,
  ZERO,
} from "./fraction";
import {
  distantKindredInherit,
  fatherBlocksPaternalGrandmother,
  grandfatherBlocksSiblings,
  raddToLoneSpouse,
  umariyyaWithGrandfather,
  usesMushtaraka,
  usesRadd,
  type SchoolId,
} from "./schools";
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

type AscendantKey = "father" | "paternalGrandfather" | "paternalGreatGrandfather";

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
    paternalGreatGrandfather: Boolean(input.paternalGreatGrandfather),
    paternalGrandmother: Boolean(input.paternalGrandmother),
    maternalGrandmother: Boolean(input.maternalGrandmother),
    sons: clampCount(input.sons),
    daughters: clampCount(input.daughters),
    grandsons: clampCount(input.grandsons),
    granddaughters: clampCount(input.granddaughters),
    greatGrandsons: clampCount(input.greatGrandsons),
    greatGranddaughters: clampCount(input.greatGranddaughters),
    daughtersSons: clampCount(input.daughtersSons),
    daughtersDaughters: clampCount(input.daughtersDaughters),
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

function emptyResult(notes: string[], errors: string[]): CalculationResult {
  return {
    shares: [],
    blocked: [],
    method: "normal",
    baseDenominator: 1,
    fixedTotalBefore: ZERO,
    notes,
    errors,
    treasury: ZERO,
  };
}

export function calculate(
  rawInput: HeirInput,
  school: SchoolId = "hanafi",
): CalculationResult {
  const i = normalize(rawInput);
  const errors: string[] = [];
  const notes: string[] = [];
  const rows: Row[] = [];
  const blocked: BlockedHeir[] = [];
  let treasury: Fraction = ZERO;

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

  if (errors.length > 0) return emptyResult(notes, errors);

  const son = i.sons > 0;
  const grandson = i.grandsons > 0;
  const greatGrandson = i.greatGrandsons > 0;
  const maleDesc = son || grandson || greatGrandson;
  const daughter = i.daughters > 0;
  const granddaughter = i.granddaughters > 0;
  const greatGranddaughter = i.greatGranddaughters > 0;
  const femaleDesc = daughter || granddaughter || greatGranddaughter;
  const agnaticDesc = maleDesc || femaleDesc;
  const spousePresent = i.husband || i.wives > 0;

  const siblingCount =
    i.fullBrothers +
    i.fullSisters +
    i.paternalBrothers +
    i.paternalSisters +
    i.maternalSiblings;

  const livingGrandfather = i.paternalGrandfather || i.paternalGreatGrandfather;
  const fatherBlocksSiblings = i.father;
  const grandfatherBlocks = grandfatherBlocksSiblings(school) && livingGrandfather && !i.father;
  const siblingsBlockedByAscendant = fatherBlocksSiblings || grandfatherBlocks;

  const asabaAscendant: AscendantKey | null = i.father
    ? "father"
    : i.paternalGrandfather
      ? "paternalGrandfather"
      : i.paternalGreatGrandfather
        ? "paternalGreatGrandfather"
        : null;

  if (i.paternalGrandfather && i.father) {
    block("paternalGrandfather", "Blocked by the father.");
  }
  if (i.paternalGreatGrandfather && (i.father || i.paternalGrandfather)) {
    block(
      "paternalGreatGrandfather",
      i.father ? "Blocked by the father." : "Blocked by the paternal grandfather.",
    );
  }

  const fullBrother = i.fullBrothers > 0;
  const fullSister = i.fullSisters > 0;
  const paternalBrother = i.paternalBrothers > 0;
  const paternalSister = i.paternalSisters > 0;
  const competingSiblings =
    fullBrother || fullSister || paternalBrother || paternalSister;
  const akdariyyah = isAkdariyyah(i, school, agnaticDesc);
  const gfCompetes =
    Boolean(asabaAscendant && asabaAscendant !== "father") &&
    !grandfatherBlocksSiblings(school) &&
    !i.father &&
    !maleDesc &&
    competingSiblings &&
    !akdariyyah;

  // Daughter's children do not count as walad for the spouse's Quranic share.
  let spouseShare: Fraction = ZERO;
  if (i.husband) {
    spouseShare = agnaticDesc ? frac(1, 4) : frac(1, 2);
    rows.push({
      key: "husband",
      label: "Husband",
      count: 1,
      share: spouseShare,
      type: "fixed",
      reason: agnaticDesc
        ? "1/4 because the deceased left descendants in the son's line."
        : "1/2 because there are no descendants in the son's line.",
    });
  } else if (i.wives > 0) {
    spouseShare = agnaticDesc ? frac(1, 8) : frac(1, 4);
    rows.push({
      key: "wives",
      label: labelFor("wives", i.wives),
      count: i.wives,
      share: spouseShare,
      type: "fixed",
      reason: agnaticDesc
        ? "1/8 (shared) because the deceased left descendants in the son's line."
        : "1/4 (shared) because there are no descendants in the son's line.",
    });
  }

  const umariyyaFather =
    i.father && i.mother && spousePresent && !agnaticDesc && siblingCount === 0;
  const umariyyaGrandfather =
    umariyyaWithGrandfather(school) &&
    Boolean(asabaAscendant && asabaAscendant !== "father") &&
    !i.father &&
    i.mother &&
    spousePresent &&
    !agnaticDesc &&
    siblingCount === 0;
  const umariyya = umariyyaFather || umariyyaGrandfather;

  if (i.mother) {
    let mShare: Fraction;
    let reason: string;
    if (umariyya) {
      mShare = mul(sub(ONE, spouseShare), frac(1, 3));
      reason = umariyyaGrandfather
        ? "1/3 of the remainder after the spouse (Umariyyah, with the grandfather standing in for the father)."
        : "1/3 of the remainder after the spouse (Umariyyah rule).";
    } else if (agnaticDesc || siblingCount >= 2) {
      mShare = frac(1, 6);
      reason = agnaticDesc
        ? "1/6 because the deceased left descendants."
        : "1/6 because two or more siblings are present.";
    } else {
      mShare = frac(1, 3);
      reason = "1/3 because there are no descendants and fewer than two siblings.";
    }
    rows.push({ key: "mother", label: "Mother", count: 1, share: mShare, type: "fixed", reason });
  }

  const patGmBlocked = i.mother || (fatherBlocksPaternalGrandmother(school) && i.father);
  const matGmBlocked = i.mother;
  const activeGms: HeirKey[] = [];
  if (i.paternalGrandmother) {
    if (patGmBlocked) {
      block(
        "paternalGrandmother",
        i.mother ? "Blocked by the mother." : "Blocked by the father.",
      );
    } else activeGms.push("paternalGrandmother");
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

  if (asabaAscendant && !gfCompetes) {
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
    } else if (akdariyyah) {
      rows.push({
        key: asabaAscendant,
        label,
        count: 1,
        share: frac(1, 6),
        type: "fixed",
        reason: "1/6 in the Akdariyyah case, before sharing with the sister.",
      });
    }
  }

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

  assignFemaleAgnatic(
    rows,
    blocked,
    "granddaughters",
    i.granddaughters,
    son,
    grandson,
    i.daughters,
    0,
    "Blocked by a son.",
    "Blocked by two or more daughters.",
  );
  if (grandson && son) block("grandsons", "Blocked by a son.");

  assignFemaleAgnatic(
    rows,
    blocked,
    "greatGranddaughters",
    i.greatGranddaughters,
    son || grandson,
    greatGrandson,
    i.daughters,
    i.granddaughters,
    son ? "Blocked by a son." : "Blocked by a grandson.",
    "Blocked because daughters and granddaughters already take two-thirds.",
  );
  if (greatGrandson && (son || grandson)) {
    block("greatGrandsons", son ? "Blocked by a son." : "Blocked by a grandson.");
  }

  const siblingsBlocked = siblingsBlockedByAscendant || maleDesc;
  const uterineBlocked = Boolean(i.father || livingGrandfather || agnaticDesc);

  if (i.maternalSiblings > 0) {
    if (uterineBlocked) {
      block(
        "maternalSiblings",
        i.father || livingGrandfather
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

  const fullSisterResiduary =
    !siblingsBlocked &&
    !gfCompetes &&
    ((fullBrother && fullSister) || (fullSister && femaleDesc && !fullBrother));

  if (fullSister && !fullBrother && !siblingsBlocked && !femaleDesc && !gfCompetes) {
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
    const reason = i.father
      ? "Blocked by the father or a male descendant."
      : grandfatherBlocks
        ? "Blocked by the grandfather or a male descendant."
        : "Blocked by a male descendant.";
    if (fullBrother) block("fullBrothers", reason);
    if (fullSister) block("fullSisters", reason);
  }

  const paternalBlockedByFull = fullBrother || fullSisterResiduary;
  const paternalSiblingsBlocked = siblingsBlocked || paternalBlockedByFull;
  const fullSistersTookAllFurud =
    !siblingsBlocked && !fullBrother && !femaleDesc && !gfCompetes && i.fullSisters >= 2;

  if (paternalBrother || paternalSister) {
    if (paternalSiblingsBlocked && !gfCompetes) {
      const reason = siblingsBlocked
        ? i.father
          ? "Blocked by the father or a male descendant."
          : "Blocked by the grandfather or a male descendant."
        : "Blocked by a full brother or a residuary full sister.";
      if (paternalBrother) block("paternalBrothers", reason);
      if (paternalSister) block("paternalSisters", reason);
    } else if (!paternalBrother && !gfCompetes) {
      if (femaleDesc) {
        // ma'a al-ghayr handled in the asaba stage.
      } else if (fullSistersTookAllFurud) {
        block(
          "paternalSisters",
          "Blocked because two or more full sisters take the full two-thirds.",
        );
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
  }

  const mushtaraka = canApplyMushtaraka(i, school, siblingsBlocked, uterineBlocked);

  if (mushtaraka) {
    applyMushtaraka(rows, i, notes);
  }

  const fixedTotal = sum(rows.map((r) => r.share));
  const residue = sub(ONE, fixedTotal);
  let method: CalculationMethod = "normal";

  const residuary = mushtaraka || akdariyyah
    ? null
    : gfCompetes
      ? "grandfatherWithSiblings"
      : resolveResiduary(i, {
          son,
          grandson,
          greatGrandson,
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

  if (residuary === "grandfatherWithSiblings" && asabaAscendant && asabaAscendant !== "father") {
    if (compare(residue, ZERO) > 0) {
      distributeGrandfatherWithSiblings(rows, i, asabaAscendant, residue, notes);
    } else if (compare(fixedTotal, ONE) > 0) {
      method = "awl";
      applyAwl(rows);
      notes.push(
        "'Awl applied: fixed shares exceed the estate, so all shares are reduced proportionally.",
      );
    } else {
      blockCompetingSiblings(i, blocked, "No residue remained after the fixed shares.");
    }
  } else if (residuary && compare(residue, ZERO) > 0) {
    distributeResidue(rows, i, residuary, residue);
  } else if (residuary && compare(fixedTotal, ONE) > 0) {
    method = "awl";
    applyAwl(rows);
    notes.push(
      "'Awl applied: fixed shares exceed the estate, so all shares are reduced proportionally.",
    );
    if (
      residuary === "father" ||
      residuary === "paternalGrandfather" ||
      residuary === "paternalGreatGrandfather"
    ) {
      notes.push("The residuary ascendant received only the fixed 1/6; no residue remained.");
    }
  } else if (!residuary) {
    if (compare(fixedTotal, ONE) > 0) {
      method = "awl";
      applyAwl(rows);
      notes.push(
        "'Awl applied: fixed shares exceed the estate, so all shares are reduced proportionally.",
      );
      if (akdariyyah) applyAkdariyyahResplit(rows, notes);
    } else if (compare(fixedTotal, ONE) < 0) {
      const remainder = sub(ONE, fixedTotal);
      const kindredEligible =
        distantKindredInherit(school) &&
        (i.daughtersSons > 0 || i.daughtersDaughters > 0) &&
        rows.every((r) => r.key === "husband" || r.key === "wives");
      if (kindredEligible) {
        const { male, female } = bilGhayr(remainder, i.daughtersSons, i.daughtersDaughters);
        if (i.daughtersSons > 0) {
          rows.push({
            key: "daughtersSons",
            label: labelFor("daughtersSons", i.daughtersSons),
            count: i.daughtersSons,
            share: male,
            type: "kindred",
            reason: "Distant kindred. Takes the remainder after Quranic heirs when no agnate remains.",
          });
        }
        if (i.daughtersDaughters > 0) {
          rows.push({
            key: "daughtersDaughters",
            label: labelFor("daughtersDaughters", i.daughtersDaughters),
            count: i.daughtersDaughters,
            share: female,
            type: "kindred",
            reason: "Distant kindred. Shares with daughter's sons at half a brother's portion.",
          });
        }
        notes.push("Daughter's children inherit as distant kindred (dhawi al-arham).");
      } else if (usesRadd(school)) {
        method = "radd";
        treasury = applyRadd(rows, notes, school);
      } else {
        treasury = remainder;
        notes.push(
          "Remainder goes to the public treasury. This school does not return leftover shares by radd.",
        );
      }
    }
  }

  if (akdariyyah && method === "normal" && compare(fixedTotal, ONE) > 0) {
    method = "awl";
    applyAwl(rows);
    applyAkdariyyahResplit(rows, notes);
  }

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

  const baseDenominator = commonDenominator([
    ...shares.map((s) => s.share),
    ...(isZero(treasury) ? [] : [treasury]),
  ]);

  return {
    shares,
    blocked,
    method,
    baseDenominator,
    fixedTotalBefore: fixedTotal,
    notes,
    errors,
    treasury,
  };
}

function assignFemaleAgnatic(
  rows: Row[],
  blocked: BlockedHeir[],
  key: "granddaughters" | "greatGranddaughters",
  count: number,
  blockedByHigherMale: boolean,
  withMale: boolean,
  daughters: number,
  granddaughters: number,
  maleBlockReason: string,
  twoThirdsReason: string,
): void {
  if (count <= 0) return;
  const higherFemales = daughters + granddaughters;
  if (blockedByHigherMale) {
    blocked.push({ key, label: labelFor(key, count), count, reason: maleBlockReason });
  } else if (withMale) {
    // Residuary with the male of the same generation.
  } else if (higherFemales >= 2) {
    blocked.push({ key, label: labelFor(key, count), count, reason: twoThirdsReason });
  } else if (higherFemales === 1) {
    rows.push({
      key,
      label: labelFor(key, count),
      count,
      share: frac(1, 6),
      type: "fixed",
      reason: "1/6 to complete two-thirds with the nearer female descendant.",
    });
  } else {
    rows.push({
      key,
      label: labelFor(key, count),
      count,
      share: count === 1 ? frac(1, 2) : frac(2, 3),
      type: "fixed",
      reason:
        count === 1
          ? "1/2 as the single female descendant of this generation."
          : "2/3 shared, standing in for absent daughters.",
    });
  }
}

function isAkdariyyah(i: HeirInput, school: SchoolId, agnaticDesc: boolean): boolean {
  if (grandfatherBlocksSiblings(school)) return false;
  if (!i.paternalGrandfather && !i.paternalGreatGrandfather) return false;
  if (i.father || agnaticDesc) return false;
  if (!i.husband || !i.mother) return false;
  if (i.fullSisters !== 1 || i.fullBrothers > 0) return false;
  if (i.paternalBrothers > 0 || i.paternalSisters > 0) return false;
  if (i.maternalSiblings > 0) return false;
  return true;
}

function canApplyMushtaraka(
  i: HeirInput,
  school: SchoolId,
  siblingsBlocked: boolean,
  uterineBlocked: boolean,
): boolean {
  if (!usesMushtaraka(school) || siblingsBlocked || uterineBlocked) return false;
  if (!i.husband) return false;
  if (i.maternalSiblings < 2 || i.fullBrothers === 0) return false;
  if (i.father) return false;
  return i.mother || i.paternalGrandmother || i.maternalGrandmother;
}

function applyMushtaraka(rows: Row[], i: HeirInput, notes: string[]): void {
  const uterine = rows.find((r) => r.key === "maternalSiblings");
  if (!uterine) return;
  const pool = uterine.share;
  const people = i.maternalSiblings + i.fullBrothers + i.fullSisters;
  const each = frac(pool.n, pool.d * people);
  uterine.share = mul(each, frac(i.maternalSiblings, 1));
  uterine.reason =
    "Shares the uterine third equally with full siblings (mushtaraka).";
  if (i.fullBrothers > 0) {
    rows.push({
      key: "fullBrothers",
      label: labelFor("fullBrothers", i.fullBrothers),
      count: i.fullBrothers,
      share: mul(each, frac(i.fullBrothers, 1)),
      type: "fixed",
      reason: "Shares the uterine third equally (mushtaraka). Each person takes the same amount.",
    });
  }
  if (i.fullSisters > 0) {
    rows.push({
      key: "fullSisters",
      label: labelFor("fullSisters", i.fullSisters),
      count: i.fullSisters,
      share: mul(each, frac(i.fullSisters, 1)),
      type: "fixed",
      reason: "Shares the uterine third equally with brothers (mushtaraka).",
    });
  }
  notes.push(
    "Mushtaraka applied: full siblings share the uterine third equally, person by person.",
  );
}

function applyAkdariyyahResplit(rows: Row[], notes: string[]): void {
  const gf = rows.find(
    (r) => r.key === "paternalGrandfather" || r.key === "paternalGreatGrandfather",
  );
  const sister = rows.find((r) => r.key === "fullSisters");
  if (!gf || !sister) return;
  const combined = add(gf.share, sister.share);
  gf.share = mul(combined, frac(2, 3));
  sister.share = mul(combined, frac(1, 3));
  gf.type = "residuary";
  sister.type = "residuary";
  gf.reason = "Akdariyyah: shares the combined remainder with the sister, taking twice her portion.";
  sister.reason = "Akdariyyah: shares the combined remainder with the grandfather.";
  notes.push(
    "Akdariyyah applied: the grandfather and the sister join their shares and split them 2:1.",
  );
}

interface ResiduaryFlags {
  son: boolean;
  grandson: boolean;
  greatGrandson: boolean;
  femaleDesc: boolean;
  siblingsBlocked: boolean;
  paternalSiblingsBlocked: boolean;
  fullBrother: boolean;
  fullSister: boolean;
  fullSisterResiduary: boolean;
  paternalBrother: boolean;
  paternalSister: boolean;
  asabaAscendant: AscendantKey | null;
}

type ResiduaryGroup =
  | "children"
  | "grandchildren"
  | "greatGrandchildren"
  | "father"
  | "paternalGrandfather"
  | "paternalGreatGrandfather"
  | "grandfatherWithSiblings"
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
  if (f.greatGrandson) return "greatGrandchildren";
  if (f.asabaAscendant === "father") return "father";
  if (f.asabaAscendant === "paternalGrandfather") return "paternalGrandfather";
  if (f.asabaAscendant === "paternalGreatGrandfather") return "paternalGreatGrandfather";
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

function distributeGrandfatherWithSiblings(
  rows: Row[],
  i: HeirInput,
  gfKey: "paternalGrandfather" | "paternalGreatGrandfather",
  residue: Fraction,
  notes: string[],
): void {
  const countedBrothers = i.fullBrothers + i.paternalBrothers;
  const countedSisters = i.fullSisters + i.paternalSisters;
  const parts = countedBrothers * 2 + 2 + countedSisters;
  const muqasamah = parts > 0 ? mul(residue, frac(2, parts)) : residue;
  const thirdOfRemainder = mul(residue, frac(1, 3));
  const sixthOfEstate = frac(1, 6);
  const furudPresent = compare(residue, ONE) < 0;
  const gfShare = furudPresent
    ? maxFraction(muqasamah, thirdOfRemainder, sixthOfEstate)
    : maxFraction(muqasamah, frac(1, 3));
  const capped = compare(gfShare, residue) > 0 ? residue : gfShare;

  rows.push({
    key: gfKey,
    label: labelFor(gfKey, 1),
    count: 1,
    share: capped,
    type: "residuary",
    reason: furudPresent
      ? "Best of muqasamah, one-third of the remainder, or one-sixth of the estate (Zayd's method)."
      : "Best of muqasamah with the siblings or one-third of the estate (Zayd's method).",
  });

  const siblingResidue = sub(residue, capped);
  const hasFull = i.fullBrothers > 0 || i.fullSisters > 0;
  const hasPaternal = i.paternalBrothers > 0 || i.paternalSisters > 0;
  if (compare(siblingResidue, ZERO) <= 0) {
    blockCompetingSiblings(i, [], "No residue remained after the grandfather's share.");
    notes.push("The grandfather took the remainder. No residue remained for the siblings.");
    return;
  }

  if (hasFull) {
    const { male, female } = bilGhayr(siblingResidue, i.fullBrothers, i.fullSisters);
    if (i.fullBrothers > 0) {
      rows.push({
        key: "fullBrothers",
        label: labelFor("fullBrothers", i.fullBrothers),
        count: i.fullBrothers,
        share: male,
        type: "residuary",
        reason: "Residue after the grandfather; each brother takes twice a sister's share.",
      });
    }
    if (i.fullSisters > 0) {
      rows.push({
        key: "fullSisters",
        label: labelFor("fullSisters", i.fullSisters),
        count: i.fullSisters,
        share: female,
        type: "residuary",
        reason: i.fullBrothers > 0
          ? "Residue after the grandfather, shared with full brothers."
          : "Residue after the grandfather.",
      });
    }
    notes.push(
      hasPaternal
        ? "Mu'addah: paternal siblings were counted against the grandfather, then excluded by the full siblings."
        : "The grandfather shared with siblings by Zayd's method.",
    );
  } else {
    const { male, female } = bilGhayr(siblingResidue, i.paternalBrothers, i.paternalSisters);
    if (i.paternalBrothers > 0) {
      rows.push({
        key: "paternalBrothers",
        label: labelFor("paternalBrothers", i.paternalBrothers),
        count: i.paternalBrothers,
        share: male,
        type: "residuary",
        reason: "Residue after the grandfather; each brother takes twice a sister's share.",
      });
    }
    if (i.paternalSisters > 0) {
      rows.push({
        key: "paternalSisters",
        label: labelFor("paternalSisters", i.paternalSisters),
        count: i.paternalSisters,
        share: female,
        type: "residuary",
        reason: "Residue after the grandfather.",
      });
    }
    notes.push("The grandfather shared with paternal siblings by Zayd's method.");
  }
}

function blockCompetingSiblings(i: HeirInput, blocked: BlockedHeir[], reason: string): void {
  const push = (key: HeirKey) => {
    const count = countOf(i, key);
    if (count > 0) blocked.push({ key, label: labelFor(key, count), count, reason });
  };
  push("fullBrothers");
  push("fullSisters");
  push("paternalBrothers");
  push("paternalSisters");
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
      rows.push({
        key: maleKey,
        label: labelFor(maleKey, males),
        count: males,
        share: male,
        type: "residuary",
        reason: maleReason,
      });
    if (females > 0)
      rows.push({
        key: femaleKey,
        label: labelFor(femaleKey, females),
        count: females,
        share: female,
        type: "residuary",
        reason: femaleReason,
      });
  };

  const pushEqual = (key: HeirKey, count: number, reason: string) => {
    rows.push({
      key,
      label: labelFor(key, count),
      count,
      share: residue,
      type: "residuary",
      reason,
    });
  };

  const addToAscendant = (key: AscendantKey) => {
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
    case "greatGrandchildren":
      pushMaleFemale(
        "greatGrandsons",
        i.greatGrandsons,
        "greatGranddaughters",
        i.greatGranddaughters,
        "Residue as agnate; each great-grandson takes twice a great-granddaughter's share.",
        "Residue shared with great-grandsons.",
      );
      break;
    case "father":
      addToAscendant("father");
      break;
    case "paternalGrandfather":
      addToAscendant("paternalGrandfather");
      break;
    case "paternalGreatGrandfather":
      addToAscendant("paternalGreatGrandfather");
      break;
    case "grandfatherWithSiblings":
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
      pushEqual(
        "fullSisters",
        i.fullSisters,
        "Residue as agnate alongside the daughters (asaba ma'a al-ghayr).",
      );
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
      pushEqual(
        "paternalSisters",
        i.paternalSisters,
        "Residue as agnate alongside the daughters (asaba ma'a al-ghayr).",
      );
      break;
    case "fullNephews":
      pushEqual("fullNephews", i.fullNephews, "Residue shared equally as the nearest agnates.");
      break;
    case "paternalNephews":
      pushEqual(
        "paternalNephews",
        i.paternalNephews,
        "Residue shared equally as the nearest agnates.",
      );
      break;
    case "fullUncles":
      pushEqual("fullUncles", i.fullUncles, "Residue shared equally as the nearest agnates.");
      break;
    case "paternalUncles":
      pushEqual(
        "paternalUncles",
        i.paternalUncles,
        "Residue shared equally as the nearest agnates.",
      );
      break;
    case "fullCousins":
      pushEqual("fullCousins", i.fullCousins, "Residue shared equally as the nearest agnates.");
      break;
    case "paternalCousins":
      pushEqual(
        "paternalCousins",
        i.paternalCousins,
        "Residue shared equally as the nearest agnates.",
      );
      break;
  }
}

function applyAwl(rows: Row[]): void {
  const total = sum(rows.map((r) => r.share));
  for (const r of rows) {
    r.share = frac(r.share.n * total.d, r.share.d * total.n);
  }
}

function applyRadd(rows: Row[], notes: string[], school: SchoolId): Fraction {
  const total = sum(rows.map((r) => r.share));
  const remainder = sub(ONE, total);
  if (isZero(remainder)) return ZERO;

  const nonSpouse = rows.filter((r) => r.key !== "husband" && r.key !== "wives");
  if (nonSpouse.length === 0) {
    if (raddToLoneSpouse(school)) {
      for (const r of rows) {
        r.share = add(r.share, remainder);
        r.type = "radd";
      }
      notes.push(
        "Radd applied: with only a spouse surviving, the remainder returns to the spouse.",
      );
      return ZERO;
    }
    notes.push("The spouse keeps the fixed share. Remainder goes to the public treasury.");
    return remainder;
  }

  const nonSpouseTotal = sum(nonSpouse.map((r) => r.share));
  for (const r of nonSpouse) {
    const extra = mul(
      remainder,
      frac(r.share.n * nonSpouseTotal.d, r.share.d * nonSpouseTotal.n),
    );
    r.share = add(r.share, extra);
    r.type = "radd";
  }
  notes.push(
    "Radd applied: leftover estate returns to the fixed-share heirs (excluding the spouse), in proportion to their shares.",
  );
  return ZERO;
}

function recordBlockedRemaining(i: HeirInput, rows: Row[], blocked: BlockedHeir[]): void {
  const inheriting = new Set(rows.map((r) => r.key));
  const alreadyBlocked = new Set(blocked.map((b) => b.key));
  const someoneTookResidue = rows.some(
    (r) => r.type === "residuary" || r.type === "fixed+residuary" || r.type === "kindred",
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
