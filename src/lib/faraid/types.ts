import type { Fraction } from "./fraction";

export interface HeirInput {
  husband: boolean;
  /** Number of surviving wives (0-4). They share the spouse portion equally. */
  wives: number;
  father: boolean;
  mother: boolean;
  sons: number;
  daughters: number;
  fullBrothers: number;
  fullSisters: number;
  /** Uterine (maternal) siblings, males and females combined. They share equally. */
  maternalSiblings: number;
}

export type HeirKey =
  | "husband"
  | "wives"
  | "father"
  | "mother"
  | "sons"
  | "daughters"
  | "fullBrothers"
  | "fullSisters"
  | "maternalSiblings";

export type ShareType = "fixed" | "residuary" | "fixed+residuary" | "radd";

export interface HeirShare {
  key: HeirKey;
  label: string;
  count: number;
  /** Total share of the estate for this group of heirs. */
  share: Fraction;
  /** Share for a single heir in the group (share / count). */
  perPerson: Fraction;
  type: ShareType;
  reason: string;
}

export type CalculationMethod = "normal" | "awl" | "radd";

export interface CalculationResult {
  shares: HeirShare[];
  method: CalculationMethod;
  /** Denominator of the problem (asl al-mas'ala), after 'awl or radd when applied. */
  baseDenominator: number;
  /** Sum of fixed shares before 'awl or radd. */
  fixedTotalBefore: Fraction;
  notes: string[];
  errors: string[];
}

export const EMPTY_INPUT: HeirInput = {
  husband: false,
  wives: 0,
  father: false,
  mother: false,
  sons: 0,
  daughters: 0,
  fullBrothers: 0,
  fullSisters: 0,
  maternalSiblings: 0,
};
