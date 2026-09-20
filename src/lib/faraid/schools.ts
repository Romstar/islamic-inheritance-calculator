export const SCHOOL_IDS = ["hanafi", "maliki", "shafii", "hanbali"] as const;

export type SchoolId = (typeof SCHOOL_IDS)[number];

export interface SchoolInfo {
  id: SchoolId;
  label: string;
  founder: string;
  summary: string;
}

export const SCHOOLS: Record<SchoolId, SchoolInfo> = {
  hanafi: {
    id: "hanafi",
    label: "Hanafi",
    founder: "Abu Hanifa",
    summary: "The school of Abu Hanifa. Common in South Asia, Turkey, and Central Asia.",
  },
  maliki: {
    id: "maliki",
    label: "Maliki",
    founder: "Malik ibn Anas",
    summary: "The school of Malik ibn Anas. Common in North and West Africa.",
  },
  shafii: {
    id: "shafii",
    label: "Shafi'i",
    founder: "al-Shafi'i",
    summary: "The school of al-Shafi'i. Common in East Africa, Egypt, and Southeast Asia.",
  },
  hanbali: {
    id: "hanbali",
    label: "Hanbali",
    founder: "Ahmad ibn Hanbal",
    summary: "The school of Ahmad ibn Hanbal. Common in parts of the Arabian Peninsula.",
  },
};

export const SCHOOL_LIST: SchoolInfo[] = SCHOOL_IDS.map((id) => SCHOOLS[id]);

export function isSchoolId(value: string): value is SchoolId {
  return (SCHOOL_IDS as readonly string[]).includes(value);
}

export function parseSchool(raw: string | null): SchoolId | null {
  if (!raw) return null;
  const value = raw.trim().toLowerCase().replace(/['’]/g, "");
  if (value === "shafi") return "shafii";
  if (isSchoolId(value)) return value;
  return null;
}

export function schoolLabel(school: SchoolId | null): string {
  return school ? SCHOOLS[school].label : "No school selected";
}

export function calculatorTitle(school: SchoolId): string {
  return `${SCHOOLS[school].label} calculator`;
}
