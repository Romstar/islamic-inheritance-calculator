import { calculate } from "./calculator";
import { add, frac, isZero, mul, sub, ZERO, type Fraction } from "./fraction";
import type { SchoolId } from "./schools";
import {
  labelFor,
  type CalculationResult,
  type HeirInput,
  type HeirKey,
  type HeirShare,
} from "./types";

export function deceasedPersonShare(result: CalculationResult, key: HeirKey): Fraction {
  const row = result.shares.find((share) => share.key === key);
  if (!row) return ZERO;
  return row.count > 1 ? frac(row.share.n, row.share.d * row.count) : row.share;
}

function scaleShare(share: HeirShare, factor: Fraction, deceasedKey: HeirKey): HeirShare {
  return {
    ...share,
    share: mul(share.share, factor),
    perPerson: mul(share.perPerson, factor),
    reason: `From the share of the deceased ${labelFor(deceasedKey, 1).toLowerCase()}. ${share.reason}`,
    label: `${share.label} of the deceased ${labelFor(deceasedKey, 1).toLowerCase()}`,
  };
}

function reduceDeceased(result: CalculationResult, key: HeirKey): HeirShare[] {
  const transferred = deceasedPersonShare(result, key);
  return result.shares.flatMap((share) => {
    if (share.key !== key) return [share];
    if (share.count <= 1) return [];
    const remaining = sub(share.share, transferred);
    if (isZero(remaining)) return [];
    const count = share.count - 1;
    return [
      {
        ...share,
        count,
        share: remaining,
        perPerson: count > 1 ? frac(remaining.n, remaining.d * count) : remaining,
        label: labelFor(key, count),
      },
    ];
  });
}

export interface SuccessiveResult {
  shares: HeirShare[];
  treasury: Fraction;
  second: CalculationResult;
  transferred: Fraction;
  notes: string[];
  errors: string[];
}

export function applySuccessiveDeath(
  first: CalculationResult,
  deceasedKey: HeirKey,
  secondHeirs: HeirInput,
  school: SchoolId,
): SuccessiveResult {
  const transferred = deceasedPersonShare(first, deceasedKey);
  const notes: string[] = [];
  if (isZero(transferred)) {
    return {
      shares: first.shares,
      treasury: first.treasury,
      second: first,
      transferred,
      notes: ["That relative did not inherit, so there is nothing to pass on."],
      errors: ["Select an heir who received a share."],
    };
  }

  const second = calculate(secondHeirs, school);
  if (second.errors.length > 0) {
    return {
      shares: first.shares,
      treasury: first.treasury,
      second,
      transferred,
      notes,
      errors: second.errors,
    };
  }

  const remainingFirst = reduceDeceased(first, deceasedKey);
  const passedOn = second.shares.map((share) => scaleShare(share, transferred, deceasedKey));
  const secondTreasury = mul(second.treasury, transferred);
  notes.push(
    `One ${labelFor(deceasedKey, 1).toLowerCase()} died before distribution. That person's share is split among their heirs.`,
  );

  return {
    shares: [...remainingFirst, ...passedOn],
    treasury: add(first.treasury, secondTreasury),
    second,
    transferred,
    notes,
    errors: [],
  };
}
