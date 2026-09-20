export const SOURCE_KINDS = ["quran", "hadith", "islamqa"] as const;
export type SourceKind = (typeof SOURCE_KINDS)[number];

export interface Source {
  kind: SourceKind;
  label: string;
  title: string;
  href: string;
}

/**
 * External sources used on the site. Every href must be https and must
 * point to quran.com, sunnah.com, or islamqa.info.
 */
export const SOURCES = {
  "quran-4-7": {
    kind: "quran",
    label: "Quran 4:7",
    title: "Men and women have a share of what parents and close relatives leave",
    href: "https://quran.com/4/7",
  },
  "quran-4-11": {
    kind: "quran",
    label: "Quran 4:11",
    title: "Shares of children and parents, after debts and bequests",
    href: "https://quran.com/4/11",
  },
  "quran-4-12": {
    kind: "quran",
    label: "Quran 4:12",
    title: "Shares of spouses and maternal siblings, after debts and bequests",
    href: "https://quran.com/4/12",
  },
  "quran-4-13": {
    kind: "quran",
    label: "Quran 4:13",
    title: "These are the limits set by Allah",
    href: "https://quran.com/4/13",
  },
  "quran-4-176": {
    kind: "quran",
    label: "Quran 4:176",
    title: "Shares of full or paternal siblings in kalalah",
    href: "https://quran.com/4/176",
  },
  "quran-4-3": {
    kind: "quran",
    label: "Quran 4:3",
    title: "Marriage is limited to four wives",
    href: "https://quran.com/4/3",
  },
  "bukhari-6732": {
    kind: "hadith",
    label: "Sahih al-Bukhari 6732",
    title: "Give the fixed shares; the remainder goes to the closest male relative",
    href: "https://sunnah.com/bukhari:6732",
  },
  "muslim-1615a": {
    kind: "hadith",
    label: "Sahih Muslim 1615a",
    title: "Give the shares to those entitled; the remainder goes to the nearest male heir",
    href: "https://sunnah.com/muslim:1615a",
  },
  "bukhari-2742": {
    kind: "hadith",
    label: "Sahih al-Bukhari 2742",
    title: "A will may not exceed one-third of the estate",
    href: "https://sunnah.com/bukhari:2742",
  },
  "muslim-1628a": {
    kind: "hadith",
    label: "Sahih Muslim 1628a",
    title: "Give one-third in charity; one-third is enough",
    href: "https://sunnah.com/muslim:1628a",
  },
  "abudawud-2870": {
    kind: "hadith",
    label: "Sunan Abi Dawud 2870",
    title: "There is no bequest for an heir",
    href: "https://sunnah.com/abudawud:2870",
  },
  "bukhari-6764": {
    kind: "hadith",
    label: "Sahih al-Bukhari 6764",
    title: "A Muslim and a disbeliever do not inherit from one another",
    href: "https://sunnah.com/bukhari:6764",
  },
  "muslim-1614": {
    kind: "hadith",
    label: "Sahih Muslim 1614",
    title: "A Muslim and a disbeliever do not inherit from one another",
    href: "https://sunnah.com/muslim:1614",
  },
  "tirmidhi-2109": {
    kind: "hadith",
    label: "Jami at-Tirmidhi 2109",
    title: "The killer does not inherit",
    href: "https://sunnah.com/tirmidhi:2109",
  },
  "abudawud-2894": {
    kind: "hadith",
    label: "Sunan Abi Dawud 2894",
    title: "The Prophet gave a grandmother one-sixth",
    href: "https://sunnah.com/abudawud:2894",
  },
  "abudawud-2895": {
    kind: "hadith",
    label: "Sunan Abi Dawud 2895",
    title: "A grandmother takes one-sixth if no mother remains",
    href: "https://sunnah.com/abudawud:2895",
  },
  "bukhari-6736": {
    kind: "hadith",
    label: "Sahih al-Bukhari 6736",
    title: "A son's daughter takes one-sixth with one daughter, completing two-thirds",
    href: "https://sunnah.com/bukhari:6736",
  },
  "bukhari-6742": {
    kind: "hadith",
    label: "Sahih al-Bukhari 6742",
    title: "A sister takes the residue with daughters",
    href: "https://sunnah.com/bukhari:6742",
  },
  "islamqa-225165": {
    kind: "islamqa",
    label: "IslamQA 225165",
    title: "Rules of inheritance: fixed shares, residue, and impediments",
    href: "https://islamqa.info/en/answers/225165",
  },
  "islamqa-10447": {
    kind: "islamqa",
    label: "IslamQA 10447",
    title: "How to write a will in Islam",
    href: "https://islamqa.info/en/answers/10447",
  },
  "islamqa-174421": {
    kind: "islamqa",
    label: "IslamQA 174421",
    title: "A bequest is capped at one-third and is not for an heir",
    href: "https://islamqa.info/en/answers/174421",
  },
  "islamqa-131556": {
    kind: "islamqa",
    label: "IslamQA 131556",
    title: "Awl reduces every Quranic share in proportion",
    href: "https://islamqa.info/en/answers/131556",
  },
  "islamqa-126233": {
    kind: "islamqa",
    label: "IslamQA 126233",
    title: "Awl example: husband, daughters, and grandmother",
    href: "https://islamqa.info/en/answers/126233",
  },
  "islamqa-140167": {
    kind: "islamqa",
    label: "IslamQA 140167",
    title: "Order of the estate, heirs, and blocking",
    href: "https://islamqa.info/en/answers/140167",
  },
  "islamqa-160948": {
    kind: "islamqa",
    label: "IslamQA 160948",
    title: "Radd versus the public treasury by school",
    href: "https://islamqa.info/en/answers/160948",
  },
  "islamqa-135906": {
    kind: "islamqa",
    label: "IslamQA 135906",
    title: "Paternal uncles, blocking, and distant kindred",
    href: "https://islamqa.info/en/answers/135906",
  },
  "islamqa-106599": {
    kind: "islamqa",
    label: "IslamQA 106599",
    title: "A son blocks the deceased person's siblings",
    href: "https://islamqa.info/en/answers/106599",
  },
  "islamqa-131473": {
    kind: "islamqa",
    label: "IslamQA 131473",
    title: "A living son blocks grandchildren in the son's line",
    href: "https://islamqa.info/en/answers/131473",
  },
  "islamqa-130287": {
    kind: "islamqa",
    label: "IslamQA 130287",
    title: "A son or father blocks siblings; mother and wife take reduced shares",
    href: "https://islamqa.info/en/answers/130287",
  },
  "islamqa-12911": {
    kind: "islamqa",
    label: "IslamQA 12911",
    title: "A daughter's share: one-half, two-thirds, or residue with a son",
    href: "https://islamqa.info/en/answers/12911",
  },
  "islamqa-47057": {
    kind: "islamqa",
    label: "IslamQA 47057",
    title: "Funeral costs, debts, and bequests come before heirs",
    href: "https://islamqa.info/en/answers/47057",
  },
  "islamqa-200127": {
    kind: "islamqa",
    label: "IslamQA 200127",
    title: "Pay funeral costs, then debts, then the will, then heirs",
    href: "https://islamqa.info/en/answers/200127",
  },
  "islamqa-44039": {
    kind: "islamqa",
    label: "IslamQA 44039",
    title: "Funeral costs come from the estate first",
    href: "https://islamqa.info/en/answers/44039",
  },
  "islamqa-13772": {
    kind: "islamqa",
    label: "IslamQA 13772",
    title: "A killer, or a difference of religion, blocks inheritance",
    href: "https://islamqa.info/en/answers/13772",
  },
  "islamqa-428": {
    kind: "islamqa",
    label: "IslamQA 428",
    title: "A Muslim does not inherit from a non-Muslim",
    href: "https://islamqa.info/en/answers/428",
  },
  "islamqa-166553": {
    kind: "islamqa",
    label: "IslamQA 166553",
    title: "Maternal siblings share equally; full siblings follow 4:176",
    href: "https://islamqa.info/en/answers/166553",
  },
  "islamqa-83283": {
    kind: "islamqa",
    label: "IslamQA 83283",
    title: "Maternal siblings share one-third equally",
    href: "https://islamqa.info/en/answers/83283",
  },
  "islamqa-85136": {
    kind: "islamqa",
    label: "IslamQA 85136",
    title: "A wife takes one-quarter; residue goes to the closest male agnate",
    href: "https://islamqa.info/en/answers/85136",
  },
  "islamqa-175366": {
    kind: "islamqa",
    label: "IslamQA 175366",
    title: "A grandfather stands in for a missing father; a grandmother for a missing mother",
    href: "https://islamqa.info/en/answers/175366",
  },
  "islamqa-171811": {
    kind: "islamqa",
    label: "IslamQA 171811",
    title: "Wife one-eighth, parents one-sixth each, children take the residue 2:1",
    href: "https://islamqa.info/en/answers/171811",
  },
  "islamqa-185199": {
    kind: "islamqa",
    label: "IslamQA 185199",
    title: "A father blocks siblings; siblings still reduce the mother's share",
    href: "https://islamqa.info/en/answers/185199",
  },
  "islamqa-127945": {
    kind: "islamqa",
    label: "IslamQA 127945",
    title: "An heir must be alive after the deceased",
    href: "https://islamqa.info/en/answers/127945",
  },
  "islamqa-76418": {
    kind: "islamqa",
    label: "IslamQA 76418",
    title: "Sons and daughters share residue with the male taking twice the female",
    href: "https://islamqa.info/en/answers/76418",
  },
  "islamqa-90925": {
    kind: "islamqa",
    label: "IslamQA 90925",
    title: "A son's daughter takes one-sixth with one daughter; two daughters block her",
    href: "https://islamqa.info/en/answers/90925",
  },
  "islamqa-70575": {
    kind: "islamqa",
    label: "IslamQA 70575",
    title: "A daughter's children do not inherit as agnates",
    href: "https://islamqa.info/en/answers/70575",
  },
  "islamqa-20782": {
    kind: "islamqa",
    label: "IslamQA 20782",
    title: "Grandsons inherit only when no living son remains",
    href: "https://islamqa.info/en/answers/20782",
  },
  "islamqa-72571": {
    kind: "islamqa",
    label: "IslamQA 72571",
    title: "A full brother takes residue after a daughter; a maternal brother is blocked by a child",
    href: "https://islamqa.info/en/answers/72571",
  },
  "islamqa-307": {
    kind: "islamqa",
    label: "IslamQA 307",
    title: "A wife takes one-eighth when children survive",
    href: "https://islamqa.info/en/answers/307",
  },
  "islamqa-200453": {
    kind: "islamqa",
    label: "IslamQA 200453",
    title: "Son's children take residue after two daughters",
    href: "https://islamqa.info/en/answers/200453",
  },
} as const satisfies Record<string, Source>;

export type SourceId = keyof typeof SOURCES;

export const ALLOWED_SOURCE_HOSTS = ["quran.com", "sunnah.com", "islamqa.info"] as const;

export function getSources(ids: readonly SourceId[]): Array<Source & { id: SourceId }> {
  return ids.map((id) => ({ id, ...SOURCES[id] }));
}

export function sourceHost(href: string): string {
  return new URL(href).hostname.replace(/^www\./, "");
}
