export interface GuidePage {
  href: `/${string}`;
  title: string;
  description: string;
  keywords: string[];
}

export const GUIDE_PAGES: GuidePage[] = [
  {
    href: "/how-it-works",
    title: "How Islamic inheritance works",
    description:
      "Learn Faraid in order: debts, funeral costs, the will, Quranic shares, residue, blocking, 'awl, and radd.",
    keywords: ["Faraid", "Islamic inheritance law", "mirath", "how Faraid works"],
  },
  {
    href: "/heirs",
    title: "Who inherits in Islam",
    description:
      "See which surviving relatives inherit in Sunni Faraid: spouse, parents, children, siblings, and extended agnates.",
    keywords: ["who inherits in Islam", "Islamic heirs", "ashab al-furud", "asaba"],
  },
  {
    href: "/quranic-shares",
    title: "Quranic inheritance shares",
    description:
      "A table of classic fixed shares (furud) for husband, wife, parents, daughters, sisters, and maternal siblings.",
    keywords: ["Quranic shares", "furud", "Islamic inheritance fractions", "1/2 1/3 1/4 1/6 1/8"],
  },
  {
    href: "/hajb",
    title: "Blocking of heirs (hajb)",
    description:
      "How a closer relative blocks a farther relative from a share, or reduces that share, in Islamic inheritance.",
    keywords: ["hajb", "blocking heirs", "Islamic inheritance blocking"],
  },
  {
    href: "/awl-and-radd",
    title: "'Awl and radd",
    description:
      "What happens when Quranic shares exceed the estate ('awl) or leave a remainder (radd).",
    keywords: ["awl", "radd", "Islamic inheritance remainder", "awl calculator"],
  },
  {
    href: "/wasiyyah",
    title: "Islamic will (wasiyyah)",
    description:
      "How a will works in Faraid: debts first, then a bequest capped at one-third of the net estate.",
    keywords: ["wasiyyah", "Islamic will", "one-third bequest", "wasiyyah calculator"],
  },
  {
    href: "/schools",
    title: "Sunni schools of inheritance",
    description:
      "How Hanafi, Maliki, Shafi'i, and Hanbali approaches differ in Islamic inheritance, and what this calculator covers.",
    keywords: [
      "Hanafi inheritance",
      "Maliki inheritance",
      "Shafi'i inheritance",
      "Hanbali inheritance",
    ],
  },
  {
    href: "/how-to-use",
    title: "How to use the calculator",
    description:
      "A short walkthrough of the Islamic inheritance calculator: school, relatives, estate amounts, and results.",
    keywords: ["how to use Faraid calculator", "Islamic inheritance calculator guide"],
  },
  {
    href: "/faq",
    title: "Islamic inheritance FAQ",
    description:
      "Answers to common questions about Faraid shares, schools of law, wills, and this calculator.",
    keywords: ["Islamic inheritance FAQ", "Faraid questions", "mirath FAQ"],
  },
];

export const HUB_PAGE: GuidePage = {
  href: "/guides",
  title: "Inheritance guides",
  description:
    "Plain-English guides to Islamic inheritance: heirs, Quranic shares, blocking, 'awl, radd, and the will.",
  keywords: ["Islamic inheritance guides", "Faraid explained"],
};

export const SCOPE_PAGE: GuidePage = {
  href: "/scope",
  title: "Scope of version 1.0",
  description:
    "What version 1.0 of the Islamic Inheritance Calculator covers, and what it does not cover.",
  keywords: ["calculator scope", "Faraid coverage"],
};

export const HOME_PAGE = {
  href: "/",
  title: "Islamic Inheritance Calculator",
  description:
    "Calculate Islamic inheritance shares for surviving relatives. Covers fixed shares, residue, blocking, 'awl, and radd. For education only.",
} as const;

export function guidePage(href: GuidePage["href"]): GuidePage {
  const page = GUIDE_PAGES.find((item) => item.href === href);
  if (!page) {
    throw new Error(`Unknown guide: ${href}`);
  }
  return page;
}

export function relatedGuides(currentHref: string, count = 3): GuidePage[] {
  const currentIndex = GUIDE_PAGES.findIndex((page) => page.href === currentHref);
  if (currentIndex < 0) return GUIDE_PAGES.slice(0, count);
  const related: GuidePage[] = [];
  for (let offset = 1; related.length < count && offset < GUIDE_PAGES.length; offset += 1) {
    related.push(GUIDE_PAGES[(currentIndex + offset) % GUIDE_PAGES.length]);
  }
  return related;
}
