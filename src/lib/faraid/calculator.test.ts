import { describe, expect, it } from "vitest";
import { calculate } from "./calculator";
import { EMPTY_INPUT, type HeirInput, type HeirKey } from "./types";
import { compare, ONE, sum, toText, type Fraction } from "./fraction";

function input(overrides: Partial<HeirInput>): HeirInput {
  return { ...EMPTY_INPUT, ...overrides };
}

function shareOf(key: HeirKey, result: ReturnType<typeof calculate>): string {
  const found = result.shares.find((s) => s.key === key);
  return found ? toText(found.share) : "0";
}

function totalShare(result: ReturnType<typeof calculate>): Fraction {
  return sum(result.shares.map((s) => s.share));
}

describe("input validation", () => {
  it("rejects an empty heir set", () => {
    const result = calculate(EMPTY_INPUT);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("rejects both husband and wives", () => {
    const result = calculate(input({ husband: true, wives: 1, sons: 1 }));
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe("spouse shares", () => {
  it("husband gets 1/2 with no children", () => {
    const result = calculate(input({ husband: true, father: true }));
    expect(shareOf("husband", result)).toBe("1/2");
  });

  it("husband gets 1/4 with children", () => {
    const result = calculate(input({ husband: true, sons: 1 }));
    expect(shareOf("husband", result)).toBe("1/4");
  });

  it("wife gets 1/8 with children and splits between wives", () => {
    const result = calculate(input({ wives: 2, sons: 1 }));
    const wife = result.shares.find((s) => s.key === "wives");
    expect(toText(wife!.share)).toBe("1/8");
    expect(toText(wife!.perPerson)).toBe("1/16");
  });
});

describe("children and residue", () => {
  it("son takes all residue after spouse", () => {
    const result = calculate(input({ husband: true, sons: 1 }));
    expect(shareOf("husband", result)).toBe("1/4");
    expect(shareOf("sons", result)).toBe("3/4");
  });

  it("son and daughter split residue 2:1", () => {
    const result = calculate(input({ sons: 1, daughters: 1 }));
    expect(shareOf("sons", result)).toBe("2/3");
    expect(shareOf("daughters", result)).toBe("1/3");
  });

  it("single daughter gets 1/2 fixed", () => {
    const result = calculate(input({ daughters: 1, fullBrothers: 1 }));
    expect(shareOf("daughters", result)).toBe("1/2");
    // Full brother takes the residue as asaba.
    expect(shareOf("fullBrothers", result)).toBe("1/2");
  });

  it("two daughters get 2/3 fixed", () => {
    const result = calculate(input({ daughters: 2, father: true }));
    expect(shareOf("daughters", result)).toBe("2/3");
    // Father: 1/6 fixed + 1/6 residue = 1/3.
    expect(shareOf("father", result)).toBe("1/3");
  });
});

describe("parents", () => {
  it("father + mother + son: father and mother each 1/6", () => {
    const result = calculate(input({ father: true, mother: true, sons: 1 }));
    expect(shareOf("father", result)).toBe("1/6");
    expect(shareOf("mother", result)).toBe("1/6");
    expect(shareOf("sons", result)).toBe("2/3");
  });

  it("mother gets 1/3 with no child and fewer than two siblings", () => {
    const result = calculate(input({ mother: true, father: true }));
    expect(shareOf("mother", result)).toBe("1/3");
    expect(shareOf("father", result)).toBe("2/3");
  });

  it("mother reduced to 1/6 by two or more siblings even when blocked", () => {
    const result = calculate(input({ mother: true, father: true, fullBrothers: 2 }));
    expect(shareOf("mother", result)).toBe("1/6");
    // Father blocks the brothers and takes the residue.
    expect(shareOf("father", result)).toBe("5/6");
    expect(shareOf("fullBrothers", result)).toBe("0");
  });
});

describe("Umariyyah (Gharrawayn) cases", () => {
  it("husband + father + mother", () => {
    const result = calculate(input({ husband: true, father: true, mother: true }));
    expect(shareOf("husband", result)).toBe("1/2");
    expect(shareOf("mother", result)).toBe("1/6");
    expect(shareOf("father", result)).toBe("1/3");
  });

  it("wife + father + mother", () => {
    const result = calculate(input({ wives: 1, father: true, mother: true }));
    expect(shareOf("wives", result)).toBe("1/4");
    expect(shareOf("mother", result)).toBe("1/4");
    expect(shareOf("father", result)).toBe("1/2");
  });
});

describe("'awl (increase)", () => {
  it("husband + two full sisters -> base 6 raised to 7", () => {
    const result = calculate(input({ husband: true, fullSisters: 2 }));
    expect(result.method).toBe("awl");
    expect(shareOf("husband", result)).toBe("3/7");
    expect(shareOf("fullSisters", result)).toBe("4/7");
    expect(compare(totalShare(result), ONE)).toBe(0);
  });

  it("husband + mother + two daughters -> awl", () => {
    const result = calculate(
      input({ husband: true, mother: true, daughters: 2 }),
    );
    expect(result.method).toBe("awl");
    // Base 12 -> 13: husband 3/13, mother 2/13, daughters 8/13.
    expect(shareOf("husband", result)).toBe("3/13");
    expect(shareOf("mother", result)).toBe("2/13");
    expect(shareOf("daughters", result)).toBe("8/13");
    expect(compare(totalShare(result), ONE)).toBe(0);
  });
});

describe("radd (return)", () => {
  it("mother + daughter, no residuary", () => {
    const result = calculate(input({ mother: true, daughters: 1 }));
    expect(result.method).toBe("radd");
    // Base 6 -> 4: daughter 3/4, mother 1/4.
    expect(shareOf("daughters", result)).toBe("3/4");
    expect(shareOf("mother", result)).toBe("1/4");
    expect(compare(totalShare(result), ONE)).toBe(0);
  });

  it("radd excludes the spouse", () => {
    const result = calculate(input({ husband: true, mother: true }));
    expect(result.method).toBe("radd");
    expect(shareOf("husband", result)).toBe("1/2");
    // Remainder returns to the mother only.
    expect(shareOf("mother", result)).toBe("1/2");
  });

  it("returns remainder to a lone spouse", () => {
    const result = calculate(input({ wives: 1 }));
    expect(result.method).toBe("radd");
    expect(shareOf("wives", result)).toBe("1");
  });
});

describe("siblings", () => {
  it("uterine siblings share 1/3 equally", () => {
    const result = calculate(
      input({ husband: true, mother: true, maternalSiblings: 2 }),
    );
    // Husband 1/2, mother 1/6 (2+ siblings), uterine 1/3. Sums to 1.
    expect(shareOf("husband", result)).toBe("1/2");
    expect(shareOf("mother", result)).toBe("1/6");
    expect(shareOf("maternalSiblings", result)).toBe("1/3");
    expect(result.method).toBe("normal");
  });

  it("full brother and sister split residue 2:1", () => {
    const result = calculate(input({ fullBrothers: 1, fullSisters: 1 }));
    expect(shareOf("fullBrothers", result)).toBe("2/3");
    expect(shareOf("fullSisters", result)).toBe("1/3");
  });

  it("full sister becomes residuary alongside a daughter", () => {
    const result = calculate(input({ daughters: 1, fullSisters: 1 }));
    expect(shareOf("daughters", result)).toBe("1/2");
    expect(shareOf("fullSisters", result)).toBe("1/2");
  });
});

describe("share totals never exceed the estate", () => {
  const scenarios: Partial<HeirInput>[] = [
    { husband: true, father: true, mother: true, sons: 2, daughters: 3 },
    { wives: 4, daughters: 6, father: true, mother: true },
    { husband: true, fullSisters: 4, maternalSiblings: 2, mother: true },
    { daughters: 2, fullSisters: 3 },
    { mother: true, fullBrothers: 3, fullSisters: 2 },
  ];

  it.each(scenarios)("total equals 1 for %o", (scenario) => {
    const result = calculate(input(scenario));
    expect(result.errors).toHaveLength(0);
    expect(compare(totalShare(result), ONE)).toBe(0);
  });
});
