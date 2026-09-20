import { describe, expect, it } from "vitest";
import { decodeCase, encodeCase, EMPTY_CASE, spouseChoiceFromHeirs, type CaseSnapshot } from "./caseState";
import { EMPTY_INPUT } from "./types";

describe("case URL encoding", () => {
  it("round-trips a typical case", () => {
    const snapshot: CaseSnapshot = {
      school: "hanafi",
      heirs: {
        ...EMPTY_INPUT,
        husband: true,
        mother: true,
        daughters: 2,
        fullBrothers: 1,
      },
      gross: "100000",
      debts: "5000",
      funeral: "2000",
      wasiyyah: "10000",
      step: "results",
    };
    const encoded = encodeCase(snapshot);
    const decoded = decodeCase(encoded);
    expect(decoded.school).toBe("hanafi");
    expect(decoded.heirs.husband).toBe(true);
    expect(decoded.heirs.mother).toBe(true);
    expect(decoded.heirs.daughters).toBe(2);
    expect(decoded.heirs.fullBrothers).toBe(1);
    expect(decoded.gross).toBe("100000");
    expect(decoded.debts).toBe("5000");
    expect(decoded.funeral).toBe("2000");
    expect(decoded.wasiyyah).toBe("10000");
    expect(decoded.step).toBe("results");
  });

  it("omits empty default values", () => {
    expect(encodeCase(EMPTY_CASE)).toBe("");
  });

  it("stores the school in the URL", () => {
    expect(encodeCase({ ...EMPTY_CASE, school: "hanbali" })).toBe("md=hanbali");
  });

  it("ignores unknown parameters", () => {
    const decoded = decodeCase("md=shafii&s=2&unknown=yes&r=1");
    expect(decoded.school).toBe("shafii");
    expect(decoded.heirs.sons).toBe(2);
    expect(decoded.step).toBe("results");
    expect(decodeCase("md=maliki&st=parents").step).toBe("parents");
  });

  it("keeps the user on the school step until a school is chosen", () => {
    const decoded = decodeCase("s=2&r=1");
    expect(decoded.school).toBeNull();
    expect(decoded.step).toBe("school");
    expect(decoded.heirs.sons).toBe(2);
  });

  it("clamps wives to 4 and drops wives when a husband is set", () => {
    const decoded = decodeCase("h=1&w=9");
    expect(decoded.heirs.husband).toBe(true);
    expect(decoded.heirs.wives).toBe(0);
    const wivesOnly = decodeCase("w=9");
    expect(wivesOnly.heirs.wives).toBe(4);
  });

  it("keeps a Maliki paternal grandmother with the father", () => {
    const decoded = decodeCase("md=maliki&f=1&pgm=1");
    expect(decoded.heirs.father).toBe(true);
    expect(decoded.heirs.paternalGrandmother).toBe(true);
  });

  it("prunes heirs that skip logic would hide", () => {
    const decoded = decodeCase("s=1&gs=3&fu=2");
    expect(decoded.heirs.sons).toBe(1);
    expect(decoded.heirs.grandsons).toBe(0);
    expect(decoded.heirs.fullUncles).toBe(0);
  });
});

describe("spouseChoiceFromHeirs", () => {
  it("maps husband, wives, and none", () => {
    expect(spouseChoiceFromHeirs(EMPTY_INPUT)).toBe("none");
    expect(spouseChoiceFromHeirs({ ...EMPTY_INPUT, husband: true })).toBe("husband");
    expect(spouseChoiceFromHeirs({ ...EMPTY_INPUT, wives: 2 })).toBe("wife");
  });
});
