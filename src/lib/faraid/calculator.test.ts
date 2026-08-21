import { describe, expect, it } from "vitest";
import { calculate } from "./calculator";
import { EMPTY_INPUT, type HeirInput, type HeirKey } from "./types";
import { compare, ONE, sum, toText, type Fraction } from "./fraction";

function input(overrides: Partial<HeirInput>): HeirInput {
  return { ...EMPTY_INPUT, ...overrides };
}

type Result = ReturnType<typeof calculate>;

function shareOf(key: HeirKey, result: Result): string {
  const found = result.shares.find((s) => s.key === key);
  return found ? toText(found.share) : "0";
}

function isBlocked(key: HeirKey, result: Result): boolean {
  return result.blocked.some((b) => b.key === key);
}

function total(result: Result): Fraction {
  return sum(result.shares.map((s) => s.share));
}

function expectSumsToOne(result: Result) {
  expect(result.errors).toHaveLength(0);
  expect(compare(total(result), ONE)).toBe(0);
}

describe("validation", () => {
  it("rejects an empty heir set", () => {
    expect(calculate(EMPTY_INPUT).errors.length).toBeGreaterThan(0);
  });
  it("rejects both husband and wives", () => {
    expect(calculate(input({ husband: true, wives: 1, sons: 1 })).errors.length).toBeGreaterThan(0);
  });
});

describe("spouse", () => {
  it("husband 1/2 without descendants", () => {
    expect(shareOf("husband", calculate(input({ husband: true, father: true })))).toBe("1/2");
  });
  it("husband 1/4 with descendants", () => {
    expect(shareOf("husband", calculate(input({ husband: true, sons: 1 })))).toBe("1/4");
  });
  it("wife 1/8 with descendants, split among wives", () => {
    const r = calculate(input({ wives: 2, sons: 1 }));
    const wife = r.shares.find((s) => s.key === "wives")!;
    expect(toText(wife.share)).toBe("1/8");
    expect(toText(wife.perPerson)).toBe("1/16");
  });
  it("grandchild counts as a descendant for the spouse", () => {
    expect(shareOf("husband", calculate(input({ husband: true, grandsons: 1 })))).toBe("1/4");
  });
});

describe("children and residue", () => {
  it("son takes residue after husband", () => {
    const r = calculate(input({ husband: true, sons: 1 }));
    expect(shareOf("husband", r)).toBe("1/4");
    expect(shareOf("sons", r)).toBe("3/4");
  });
  it("son and daughter split residue 2:1", () => {
    const r = calculate(input({ sons: 1, daughters: 1 }));
    expect(shareOf("sons", r)).toBe("2/3");
    expect(shareOf("daughters", r)).toBe("1/3");
  });
  it("single daughter 1/2, two daughters 2/3", () => {
    expect(shareOf("daughters", calculate(input({ daughters: 1, fullBrothers: 1 })))).toBe("1/2");
    expect(shareOf("daughters", calculate(input({ daughters: 2, father: true })))).toBe("2/3");
  });
});

describe("grandchildren (son's line)", () => {
  it("grandson blocked by a son", () => {
    const r = calculate(input({ sons: 1, grandsons: 1 }));
    expect(isBlocked("grandsons", r)).toBe(true);
  });
  it("granddaughter completes 2/3 with one daughter", () => {
    const r = calculate(input({ daughters: 1, granddaughters: 1, fullBrothers: 1 }));
    expect(shareOf("daughters", r)).toBe("1/2");
    expect(shareOf("granddaughters", r)).toBe("1/6");
    expect(shareOf("fullBrothers", r)).toBe("1/3");
    expectSumsToOne(r);
  });
  it("granddaughter blocked by two daughters", () => {
    const r = calculate(input({ daughters: 2, granddaughters: 1, father: true }));
    expect(isBlocked("granddaughters", r)).toBe(true);
  });
  it("grandson and granddaughter split residue 2:1 when no son", () => {
    const r = calculate(input({ grandsons: 1, granddaughters: 1 }));
    expect(shareOf("grandsons", r)).toBe("2/3");
    expect(shareOf("granddaughters", r)).toBe("1/3");
  });
  it("two daughters plus grandson: daughters 2/3, grandchildren take residue", () => {
    const r = calculate(input({ daughters: 2, grandsons: 1, granddaughters: 1 }));
    expect(shareOf("daughters", r)).toBe("2/3");
    expect(shareOf("grandsons", r)).toBe("2/9");
    expect(shareOf("granddaughters", r)).toBe("1/9");
    expectSumsToOne(r);
  });
});

describe("parents and grandparents", () => {
  it("father and mother each 1/6 with a son", () => {
    const r = calculate(input({ father: true, mother: true, sons: 1 }));
    expect(shareOf("father", r)).toBe("1/6");
    expect(shareOf("mother", r)).toBe("1/6");
    expect(shareOf("sons", r)).toBe("2/3");
  });
  it("father with two daughters: 1/6 + residue = 1/3", () => {
    expect(shareOf("father", calculate(input({ father: true, daughters: 2 })))).toBe("1/3");
  });
  it("grandfather acts as father when father absent", () => {
    const r = calculate(input({ paternalGrandfather: true, mother: true, sons: 1 }));
    expect(shareOf("paternalGrandfather", r)).toBe("1/6");
    expect(shareOf("mother", r)).toBe("1/6");
    expect(shareOf("sons", r)).toBe("2/3");
  });
  it("grandfather blocked by father", () => {
    const r = calculate(input({ father: true, paternalGrandfather: true, sons: 1 }));
    expect(isBlocked("paternalGrandfather", r)).toBe(true);
  });
  it("mother reduced to 1/6 by two siblings even when they are blocked", () => {
    const r = calculate(input({ mother: true, father: true, fullBrothers: 2 }));
    expect(shareOf("mother", r)).toBe("1/6");
    expect(shareOf("father", r)).toBe("5/6");
    expect(isBlocked("fullBrothers", r)).toBe(true);
  });
  it("both grandmothers share 1/6 when mother and father are absent", () => {
    const r = calculate(input({ paternalGrandmother: true, maternalGrandmother: true, sons: 1 }));
    expect(shareOf("paternalGrandmother", r)).toBe("1/12");
    expect(shareOf("maternalGrandmother", r)).toBe("1/12");
    expect(shareOf("sons", r)).toBe("5/6");
  });
  it("paternal grandmother blocked by father; maternal grandmother blocked by mother", () => {
    const r1 = calculate(input({ father: true, paternalGrandmother: true, sons: 1 }));
    expect(isBlocked("paternalGrandmother", r1)).toBe(true);
    const r2 = calculate(input({ mother: true, maternalGrandmother: true, sons: 1 }));
    expect(isBlocked("maternalGrandmother", r2)).toBe(true);
  });
});

describe("Umariyyah (Gharrawayn)", () => {
  it("husband + father + mother", () => {
    const r = calculate(input({ husband: true, father: true, mother: true }));
    expect(shareOf("husband", r)).toBe("1/2");
    expect(shareOf("mother", r)).toBe("1/6");
    expect(shareOf("father", r)).toBe("1/3");
  });
  it("wife + father + mother", () => {
    const r = calculate(input({ wives: 1, father: true, mother: true }));
    expect(shareOf("wives", r)).toBe("1/4");
    expect(shareOf("mother", r)).toBe("1/4");
    expect(shareOf("father", r)).toBe("1/2");
  });
});

describe("'awl (increase)", () => {
  it("husband + two full sisters -> base 6 to 7", () => {
    const r = calculate(input({ husband: true, fullSisters: 2 }));
    expect(r.method).toBe("awl");
    expect(shareOf("husband", r)).toBe("3/7");
    expect(shareOf("fullSisters", r)).toBe("4/7");
    expectSumsToOne(r);
  });
  it("husband + mother + two daughters -> base 12 to 13", () => {
    const r = calculate(input({ husband: true, mother: true, daughters: 2 }));
    expect(r.method).toBe("awl");
    expect(shareOf("husband", r)).toBe("3/13");
    expect(shareOf("mother", r)).toBe("2/13");
    expect(shareOf("daughters", r)).toBe("8/13");
    expectSumsToOne(r);
  });
  it("minbariyya: wife + 2 daughters + both parents -> base 24 to 27", () => {
    const r = calculate(input({ wives: 1, daughters: 2, father: true, mother: true }));
    expect(r.method).toBe("awl");
    expect(shareOf("wives", r)).toBe("1/9"); // 3/27 reduced
    expect(shareOf("daughters", r)).toBe("16/27");
    expect(shareOf("mother", r)).toBe("4/27");
    expect(shareOf("father", r)).toBe("4/27");
    expect(r.baseDenominator).toBe(27);
    expectSumsToOne(r);
  });
});

describe("radd (return)", () => {
  it("mother + daughter, no residuary", () => {
    const r = calculate(input({ mother: true, daughters: 1 }));
    expect(r.method).toBe("radd");
    expect(shareOf("daughters", r)).toBe("3/4");
    expect(shareOf("mother", r)).toBe("1/4");
    expectSumsToOne(r);
  });
  it("radd excludes the spouse", () => {
    const r = calculate(input({ husband: true, mother: true }));
    expect(r.method).toBe("radd");
    expect(shareOf("husband", r)).toBe("1/2");
    expect(shareOf("mother", r)).toBe("1/2");
  });
  it("returns remainder to a lone wife", () => {
    const r = calculate(input({ wives: 1 }));
    expect(r.method).toBe("radd");
    expect(shareOf("wives", r)).toBe("1");
  });
});

describe("full siblings", () => {
  it("full brother and sister split residue 2:1", () => {
    const r = calculate(input({ fullBrothers: 1, fullSisters: 1 }));
    expect(shareOf("fullBrothers", r)).toBe("2/3");
    expect(shareOf("fullSisters", r)).toBe("1/3");
  });
  it("full sister becomes residuary alongside a daughter", () => {
    const r = calculate(input({ daughters: 1, fullSisters: 1 }));
    expect(shareOf("daughters", r)).toBe("1/2");
    expect(shareOf("fullSisters", r)).toBe("1/2");
  });
  it("full siblings blocked by a son", () => {
    const r = calculate(input({ sons: 1, fullBrothers: 2, fullSisters: 1 }));
    expect(isBlocked("fullBrothers", r)).toBe(true);
    expect(isBlocked("fullSisters", r)).toBe(true);
  });
});

describe("consanguine (paternal) siblings", () => {
  it("paternal sister completes 2/3 with one full sister", () => {
    const r = calculate(input({ husband: true, fullSisters: 1, paternalSisters: 1 }));
    expect(r.method).toBe("awl");
    expect(shareOf("husband", r)).toBe("3/7");
    expect(shareOf("fullSisters", r)).toBe("3/7");
    expect(shareOf("paternalSisters", r)).toBe("1/7");
    expectSumsToOne(r);
  });
  it("paternal sisters blocked by two full sisters (no paternal brother)", () => {
    const r = calculate(input({ husband: true, fullSisters: 2, paternalSisters: 1 }));
    expect(isBlocked("paternalSisters", r)).toBe(true);
  });
  it("paternal brother makes paternal sisters residuary after full sisters' 2/3", () => {
    const r = calculate(input({ fullSisters: 2, paternalBrothers: 1, paternalSisters: 1 }));
    expect(shareOf("fullSisters", r)).toBe("2/3");
    expect(shareOf("paternalBrothers", r)).toBe("2/9");
    expect(shareOf("paternalSisters", r)).toBe("1/9");
    expectSumsToOne(r);
  });
  it("paternal siblings blocked by a full brother", () => {
    const r = calculate(input({ fullBrothers: 1, paternalBrothers: 1 }));
    expect(shareOf("fullBrothers", r)).toBe("1");
    expect(isBlocked("paternalBrothers", r)).toBe(true);
  });
});

describe("uterine siblings", () => {
  it("share 1/3 equally; case sums to 1 with husband and mother", () => {
    const r = calculate(input({ husband: true, mother: true, maternalSiblings: 2 }));
    expect(shareOf("husband", r)).toBe("1/2");
    expect(shareOf("mother", r)).toBe("1/6");
    expect(shareOf("maternalSiblings", r)).toBe("1/3");
    expect(r.method).toBe("normal");
  });
  it("blocked by a descendant", () => {
    const r = calculate(input({ sons: 1, maternalSiblings: 2 }));
    expect(isBlocked("maternalSiblings", r)).toBe(true);
  });
  it("blocked by the father", () => {
    const r = calculate(input({ father: true, maternalSiblings: 1 }));
    expect(isBlocked("maternalSiblings", r)).toBe(true);
  });
});

describe("mushtaraka (shared) case", () => {
  it("full brother gets nothing when the residue is zero", () => {
    const r = calculate(input({ husband: true, mother: true, maternalSiblings: 2, fullBrothers: 1 }));
    expect(shareOf("husband", r)).toBe("1/2");
    expect(shareOf("mother", r)).toBe("1/6");
    expect(shareOf("maternalSiblings", r)).toBe("1/3");
    expect(isBlocked("fullBrothers", r)).toBe(true);
    expectSumsToOne(r);
  });
});

describe("extended agnates", () => {
  it("full brother's son inherits residue when no closer agnate exists", () => {
    const r = calculate(input({ daughters: 1, fullNephews: 2 }));
    expect(shareOf("daughters", r)).toBe("1/2");
    expect(shareOf("fullNephews", r)).toBe("1/2");
    expectSumsToOne(r);
  });
  it("paternal uncle inherits when no nephews or siblings", () => {
    const r = calculate(input({ wives: 1, fullUncles: 1 }));
    expect(shareOf("wives", r)).toBe("1/4");
    expect(shareOf("fullUncles", r)).toBe("3/4");
    expectSumsToOne(r);
  });
  it("nearer agnate blocks the more distant one", () => {
    const r = calculate(input({ fullNephews: 1, fullUncles: 1, paternalCousins: 1 }));
    expect(shareOf("fullNephews", r)).toBe("1");
    expect(isBlocked("fullUncles", r)).toBe(true);
    expect(isBlocked("paternalCousins", r)).toBe(true);
  });
  it("agnates blocked by the father", () => {
    const r = calculate(input({ father: true, fullUncles: 1, sons: 0, daughters: 1 }));
    expect(isBlocked("fullUncles", r)).toBe(true);
  });
});

describe("invariant: shares always sum to one", () => {
  const scenarios: Partial<HeirInput>[] = [
    { husband: true, father: true, mother: true, sons: 2, daughters: 3 },
    { wives: 4, daughters: 6, father: true, mother: true },
    { husband: true, fullSisters: 4, maternalSiblings: 2, mother: true },
    { daughters: 2, paternalSisters: 3 },
    { mother: true, fullBrothers: 3, fullSisters: 2 },
    { paternalGrandfather: true, paternalGrandmother: true, maternalGrandmother: true, daughters: 1 },
    { husband: true, mother: true, maternalSiblings: 3, paternalSisters: 2 },
    { wives: 2, grandsons: 2, granddaughters: 3, mother: true },
    { daughters: 1, granddaughters: 2, paternalGrandfather: true },
    { fullNephews: 3 },
    { paternalUncles: 2, wives: 1 },
    { fullCousins: 5 },
    { husband: true, daughters: 1, mother: true, father: true },
  ];
  it.each(scenarios)("sums to 1 for %o", (scenario) => {
    expectSumsToOne(calculate(input(scenario)));
  });
});
