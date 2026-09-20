import { describe, expect, it } from "vitest";
import {
  ALLOWED_SOURCE_HOSTS,
  SOURCES,
  getSources,
  sourceHost,
  type SourceId,
} from "./sources";

const ids = Object.keys(SOURCES) as SourceId[];

describe("source catalog", () => {
  it("gives every source an https URL on an allowed host", () => {
    for (const id of ids) {
      const source = SOURCES[id];
      expect(source.href.startsWith("https://"), id).toBe(true);
      expect(ALLOWED_SOURCE_HOSTS, id).toContain(sourceHost(source.href));
      expect(source.label.length, id).toBeGreaterThan(3);
      expect(source.title.length, id).toBeGreaterThan(8);
    }
  });

  it("keeps source ids unique and hrefs unique", () => {
    const hrefs = ids.map((id) => SOURCES[id].href);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("uses quran.com verse URLs for Quran sources", () => {
    for (const id of ids) {
      const source = SOURCES[id];
      if (source.kind !== "quran") continue;
      expect(source.href).toMatch(/^https:\/\/quran\.com\/\d+\/\d+$/);
    }
  });

  it("uses sunnah.com hadith URLs for Hadith sources", () => {
    for (const id of ids) {
      const source = SOURCES[id];
      if (source.kind !== "hadith") continue;
      expect(source.href.startsWith("https://sunnah.com/")).toBe(true);
    }
  });

  it("uses islamqa.info answer URLs for IslamQA sources", () => {
    for (const id of ids) {
      const source = SOURCES[id];
      if (source.kind !== "islamqa") continue;
      expect(source.href).toMatch(/^https:\/\/islamqa\.info\/en\/answers\/\d+$/);
    }
  });

  it("returns sources in the requested order", () => {
    const found = getSources(["quran-4-11", "bukhari-6732", "islamqa-225165"]);
    expect(found.map((item) => item.id)).toEqual([
      "quran-4-11",
      "bukhari-6732",
      "islamqa-225165",
    ]);
  });
});
