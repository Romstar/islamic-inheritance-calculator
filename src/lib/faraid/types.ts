import type { Fraction } from "./fraction";

/**
 * Full classic set of heirs (Sunni Faraid). Grandparents cover one level.
 * Grandchildren cover the son's line (agnatic). Extended agnates cover
 * brothers' sons, paternal uncles, and their sons.
 *
 * Notes on the disputed grandfather + siblings case: Hanafi treats the
 * grandfather like the father. Maliki, Shafi'i, and Hanbali share by
 * Zayd's method (muqasamah).
 */
export interface HeirInput {
  // Spouse
  husband: boolean;
  wives: number;

  // Ascendants
  father: boolean;
  mother: boolean;
  paternalGrandfather: boolean; // father's father
  paternalGreatGrandfather: boolean; // father's father's father
  paternalGrandmother: boolean; // father's mother
  maternalGrandmother: boolean; // mother's mother

  // Descendants
  sons: number;
  daughters: number;
  grandsons: number; // son's sons
  granddaughters: number; // son's daughters
  greatGrandsons: number; // son's son's sons
  greatGranddaughters: number; // son's son's daughters
  daughtersSons: number; // daughter's sons (distant kindred)
  daughtersDaughters: number; // daughter's daughters (distant kindred)

  // Siblings
  fullBrothers: number;
  fullSisters: number;
  paternalBrothers: number; // consanguine (same father only)
  paternalSisters: number;
  maternalSiblings: number; // uterine (same mother only), male and female combined

  // Extended agnates
  fullNephews: number; // full brother's sons
  paternalNephews: number; // consanguine brother's sons
  fullUncles: number; // father's full brothers
  paternalUncles: number; // father's consanguine brothers
  fullCousins: number; // full paternal uncle's sons
  paternalCousins: number; // consanguine paternal uncle's sons
}

export type HeirKey = keyof HeirInput;

export type ShareType =
  | "fixed" // ashab al-furud
  | "residuary" // asaba bi nafsihi / bil-ghayr / ma'a al-ghayr
  | "fixed+residuary" // father or grandfather: 1/6 plus residue
  | "radd" // fixed share increased by radd
  | "kindred"; // distant kindred (dhawi al-arham)

export interface HeirShare {
  key: HeirKey;
  label: string;
  count: number;
  /** Total share of the estate for this group of heirs. */
  share: Fraction;
  /** Share for one heir in the group (share / count). */
  perPerson: Fraction;
  type: ShareType;
  reason: string;
}

export interface BlockedHeir {
  key: HeirKey;
  label: string;
  count: number;
  reason: string;
}

export type CalculationMethod = "normal" | "awl" | "radd";

export interface CalculationResult {
  shares: HeirShare[];
  blocked: BlockedHeir[];
  method: CalculationMethod;
  /** Problem base (asl al-mas'ala), after 'awl or radd when applied. */
  baseDenominator: number;
  fixedTotalBefore: Fraction;
  notes: string[];
  errors: string[];
  /** Remainder sent to the public treasury when this school does not apply radd. */
  treasury: Fraction;
}

export const EMPTY_INPUT: HeirInput = {
  husband: false,
  wives: 0,
  father: false,
  mother: false,
  paternalGrandfather: false,
  paternalGreatGrandfather: false,
  paternalGrandmother: false,
  maternalGrandmother: false,
  sons: 0,
  daughters: 0,
  grandsons: 0,
  granddaughters: 0,
  greatGrandsons: 0,
  greatGranddaughters: 0,
  daughtersSons: 0,
  daughtersDaughters: 0,
  fullBrothers: 0,
  fullSisters: 0,
  paternalBrothers: 0,
  paternalSisters: 0,
  maternalSiblings: 0,
  fullNephews: 0,
  paternalNephews: 0,
  fullUncles: 0,
  paternalUncles: 0,
  fullCousins: 0,
  paternalCousins: 0,
};

export const HEIR_LABELS: Record<HeirKey, { singular: string; plural: string }> =
  {
    husband: { singular: "Husband", plural: "Husband" },
    wives: { singular: "Wife", plural: "Wives" },
    father: { singular: "Father", plural: "Father" },
    mother: { singular: "Mother", plural: "Mother" },
    paternalGrandfather: {
      singular: "Paternal grandfather",
      plural: "Paternal grandfather",
    },
    paternalGreatGrandfather: {
      singular: "Paternal great-grandfather",
      plural: "Paternal great-grandfather",
    },
    paternalGrandmother: {
      singular: "Paternal grandmother",
      plural: "Paternal grandmother",
    },
    maternalGrandmother: {
      singular: "Maternal grandmother",
      plural: "Maternal grandmother",
    },
    sons: { singular: "Son", plural: "Sons" },
    daughters: { singular: "Daughter", plural: "Daughters" },
    grandsons: { singular: "Grandson (son's son)", plural: "Grandsons (son's sons)" },
    granddaughters: {
      singular: "Granddaughter (son's daughter)",
      plural: "Granddaughters (son's daughters)",
    },
    greatGrandsons: {
      singular: "Great-grandson (son's son's son)",
      plural: "Great-grandsons (son's son's sons)",
    },
    greatGranddaughters: {
      singular: "Great-granddaughter (son's son's daughter)",
      plural: "Great-granddaughters (son's son's daughters)",
    },
    daughtersSons: {
      singular: "Daughter's son",
      plural: "Daughter's sons",
    },
    daughtersDaughters: {
      singular: "Daughter's daughter",
      plural: "Daughter's daughters",
    },
    fullBrothers: { singular: "Full brother", plural: "Full brothers" },
    fullSisters: { singular: "Full sister", plural: "Full sisters" },
    paternalBrothers: {
      singular: "Paternal half-brother",
      plural: "Paternal half-brothers",
    },
    paternalSisters: {
      singular: "Paternal half-sister",
      plural: "Paternal half-sisters",
    },
    maternalSiblings: {
      singular: "Maternal (uterine) sibling",
      plural: "Maternal (uterine) siblings",
    },
    fullNephews: {
      singular: "Full brother's son",
      plural: "Full brothers' sons",
    },
    paternalNephews: {
      singular: "Paternal half-brother's son",
      plural: "Paternal half-brothers' sons",
    },
    fullUncles: { singular: "Full paternal uncle", plural: "Full paternal uncles" },
    paternalUncles: {
      singular: "Paternal half-uncle",
      plural: "Paternal half-uncles",
    },
    fullCousins: {
      singular: "Full paternal uncle's son",
      plural: "Full paternal uncles' sons",
    },
    paternalCousins: {
      singular: "Paternal half-uncle's son",
      plural: "Paternal half-uncles' sons",
    },
  };

export function labelFor(key: HeirKey, count: number): string {
  const l = HEIR_LABELS[key];
  return count > 1 ? l.plural : l.singular;
}
