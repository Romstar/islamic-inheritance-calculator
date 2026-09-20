import type { SourceId } from "@/lib/sources";
import type { QuestionStepId } from "./steps";
import type { HeirKey } from "./types";

export const HEIR_HELP: Record<HeirKey, string> = {
  husband: "The surviving husband of a deceased wife.",
  wives: "Surviving wives of a deceased husband. They share one portion. Maximum 4.",
  father: "The deceased person's own father.",
  mother: "The deceased person's own mother.",
  paternalGrandfather: "The father's father. In Hanafi he stands in for the father. In the other schools he shares with siblings.",
  paternalGreatGrandfather: "The father's father's father. He stands in only if the father and grandfather have died.",
  paternalGrandmother: "The father's mother. The mother blocks her. The Hanafi school also lets the father block her.",
  maternalGrandmother: "The mother's mother. Blocked by the mother.",
  sons: "Sons of the deceased. Each son takes twice a daughter's share of the residue.",
  daughters: "Daughters of the deceased.",
  grandsons: "Sons of a son. Not children of a daughter. A living son blocks them.",
  granddaughters: "Daughters of a son. Not children of a daughter. A living son blocks them.",
  greatGrandsons: "Sons of a son's son. A living son or grandson blocks them.",
  greatGranddaughters: "Daughters of a son's son. A living son or grandson blocks them.",
  daughtersSons: "Sons of a daughter. Distant kindred. They inherit only when no nearer heir takes the residue.",
  daughtersDaughters: "Daughters of a daughter. Distant kindred. They share with daughter's sons at half a brother's portion.",
  fullBrothers: "Brothers who share both parents with the deceased.",
  fullSisters: "Sisters who share both parents with the deceased.",
  paternalBrothers: "Brothers who share only the father with the deceased.",
  paternalSisters: "Sisters who share only the father with the deceased.",
  maternalSiblings: "Brothers and sisters who share only the mother. Males and females share equally.",
  fullNephews: "Sons of a full brother. Not sister's sons.",
  paternalNephews: "Sons of a paternal half-brother.",
  fullUncles: "Full brothers of the deceased person's father.",
  paternalUncles: "Paternal half-brothers of the deceased person's father.",
  fullCousins: "Sons of a full paternal uncle.",
  paternalCousins: "Sons of a paternal half-uncle.",
};

export const STEP_COPY: Record<QuestionStepId, { title: string; subtitle: string }> = {
  school: {
    title: "School of thought",
    subtitle: "What school of thought do you want to follow?",
  },
  spouse: {
    title: "Spouse",
    subtitle: "Did the deceased leave a surviving husband or wife?",
  },
  children: {
    title: "Children",
    subtitle: "How many surviving sons and daughters of the deceased?",
  },
  grandchildren: {
    title: "Grandchildren",
    subtitle: "Count children of a son, and great-grandchildren in that same male line.",
  },
  parents: {
    title: "Parents",
    subtitle: "Which of the deceased person's own parents are alive?",
  },
  grandparents: {
    title: "Grandparents",
    subtitle: "A living parent blocks the grandparent on that side. The great-grandfather appears if the grandfather has died.",
  },
  siblings: {
    title: "Siblings",
    subtitle: "Full siblings share both parents. Paternal half share the father. Maternal half share the mother.",
  },
  extended: {
    title: "Extended relatives",
    subtitle: "Male relatives through the father. They inherit only when no closer male heir takes the residue.",
  },
  kindred: {
    title: "Daughter's children",
    subtitle: "These are distant kindred. This school gives them a share only when no agnate remains.",
  },
  estate: {
    title: "Estate",
    subtitle: "Amounts are optional. Shares still appear as fractions if you leave money blank.",
  },
};

export const ESTATE_HELP = {
  gross: "Total value of the estate before any deductions. Use one currency.",
  debts: "Debts of the deceased. These come out before any heir or will.",
  funeral: "Funeral and burial costs. These also come out before heirs.",
  wasiyyah: "Optional bequest (will). The cap is one-third of the estate after debts and funeral costs.",
};

export const HEIR_SOURCES: Record<HeirKey, readonly SourceId[]> = {
  husband: ["quran-4-12", "islamqa-85136"],
  wives: ["quran-4-12", "quran-4-3", "islamqa-140167"],
  father: ["quran-4-11", "islamqa-171811"],
  mother: ["quran-4-11", "islamqa-130287"],
  paternalGrandfather: ["islamqa-175366", "islamqa-225165"],
  paternalGreatGrandfather: ["islamqa-225165", "islamqa-175366"],
  paternalGrandmother: ["abudawud-2894", "abudawud-2895", "islamqa-175366"],
  maternalGrandmother: ["abudawud-2894", "abudawud-2895", "islamqa-175366"],
  sons: ["quran-4-11", "islamqa-12911", "islamqa-76418"],
  daughters: ["quran-4-11", "islamqa-12911"],
  grandsons: ["islamqa-131473", "islamqa-20782", "bukhari-6732"],
  granddaughters: ["bukhari-6736", "islamqa-90925"],
  greatGrandsons: ["islamqa-225165", "islamqa-131473"],
  greatGranddaughters: ["islamqa-225165", "bukhari-6736"],
  daughtersSons: ["islamqa-70575", "islamqa-135906"],
  daughtersDaughters: ["islamqa-70575", "islamqa-135906"],
  fullBrothers: ["quran-4-176", "islamqa-130287", "bukhari-6732"],
  fullSisters: ["quran-4-176", "bukhari-6742", "islamqa-90925"],
  paternalBrothers: ["quran-4-176", "islamqa-166553"],
  paternalSisters: ["quran-4-176", "islamqa-166553"],
  maternalSiblings: ["quran-4-12", "islamqa-166553", "islamqa-83283"],
  fullNephews: ["bukhari-6732", "islamqa-85136"],
  paternalNephews: ["bukhari-6732", "islamqa-85136"],
  fullUncles: ["islamqa-135906", "bukhari-6732"],
  paternalUncles: ["islamqa-135906", "bukhari-6732"],
  fullCousins: ["islamqa-135906", "bukhari-6732"],
  paternalCousins: ["islamqa-135906", "bukhari-6732"],
};

export const ESTATE_SOURCES = {
  gross: [] as readonly SourceId[],
  debts: ["quran-4-11", "islamqa-200127", "islamqa-47057"],
  funeral: ["islamqa-44039", "islamqa-200127", "quran-4-11"],
  wasiyyah: ["bukhari-2742", "muslim-1628a", "islamqa-174421"],
} as const;

export const STEP_SOURCES: Record<QuestionStepId, readonly SourceId[]> = {
  school: ["islamqa-140167", "islamqa-160948", "islamqa-225165"],
  spouse: ["quran-4-12", "islamqa-85136"],
  children: ["quran-4-11", "islamqa-12911"],
  grandchildren: ["islamqa-131473", "islamqa-20782", "bukhari-6736"],
  parents: ["quran-4-11", "islamqa-171811"],
  grandparents: ["islamqa-175366", "abudawud-2894", "abudawud-2895"],
  siblings: ["quran-4-12", "quran-4-176", "islamqa-166553"],
  extended: ["bukhari-6732", "muslim-1615a", "islamqa-135906"],
  kindred: ["islamqa-135906", "islamqa-70575"],
  estate: ["quran-4-11", "islamqa-200127", "bukhari-2742"],
};
