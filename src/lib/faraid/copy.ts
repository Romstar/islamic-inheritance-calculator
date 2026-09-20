import type { HeirKey } from "./types";
import type { QuestionStepId } from "./steps";

export const HEIR_HELP: Record<HeirKey, string> = {
  husband: "The surviving husband of a deceased wife.",
  wives: "Surviving wives of a deceased husband. They share one portion. Maximum 4.",
  father: "The deceased person's own father.",
  mother: "The deceased person's own mother.",
  paternalGrandfather: "The father's father. One generation only. He stands in for the father if the father has died.",
  paternalGrandmother: "The father's mother. Blocked by the father or the mother.",
  maternalGrandmother: "The mother's mother. Blocked by the mother.",
  sons: "Sons of the deceased. Each son takes twice a daughter's share of the residue.",
  daughters: "Daughters of the deceased.",
  grandsons: "Sons of a son. Not children of a daughter. A living son blocks them.",
  granddaughters: "Daughters of a son. Not children of a daughter. A living son blocks them.",
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
    subtitle: "Count only children of a son. The tool covers one generation.",
  },
  parents: {
    title: "Parents",
    subtitle: "Which of the deceased person's own parents are alive?",
  },
  grandparents: {
    title: "Grandparents",
    subtitle: "The tool covers one generation. A living parent blocks the grandparent on that side.",
  },
  siblings: {
    title: "Siblings",
    subtitle: "Full siblings share both parents. Paternal half share the father. Maternal half share the mother.",
  },
  extended: {
    title: "Extended relatives",
    subtitle: "Male relatives through the father. They inherit only when no closer male heir takes the residue.",
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
