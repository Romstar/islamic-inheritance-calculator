import { describe, expect, it } from "vitest";
import {
  calculatorTitle,
  parseSchool,
  SCHOOL_IDS,
  schoolLabel,
} from "./schools";

describe("parseSchool", () => {
  it("accepts each school id", () => {
    for (const id of SCHOOL_IDS) {
      expect(parseSchool(id)).toBe(id);
    }
  });

  it("accepts Shafi'i spellings", () => {
    expect(parseSchool("shafi'i")).toBe("shafii");
    expect(parseSchool("Shafi")).toBe("shafii");
  });

  it("rejects empty and unknown values", () => {
    expect(parseSchool(null)).toBeNull();
    expect(parseSchool("")).toBeNull();
    expect(parseSchool("jaafari")).toBeNull();
  });
});

describe("school labels", () => {
  it("names a selected school", () => {
    expect(schoolLabel("hanbali")).toBe("Hanbali");
    expect(calculatorTitle("maliki")).toBe("Maliki calculator");
  });

  it("names a missing school", () => {
    expect(schoolLabel(null)).toBe("No school selected");
  });
});
