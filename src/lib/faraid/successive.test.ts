import { describe, expect, it } from "vitest";
import { calculate } from "./calculator";
import { add, compare, ONE, sum, toText } from "./fraction";
import { EMPTY_INPUT } from "./types";
import { applySuccessiveDeath } from "./successive";

describe("successive death", () => {
  it("passes a son's share to his two sons", () => {
    const first = calculate({ ...EMPTY_INPUT, husband: true, sons: 1 }, "hanafi");
    const combined = applySuccessiveDeath(
      first,
      "sons",
      { ...EMPTY_INPUT, sons: 2 },
      "hanafi",
    );
    expect(combined.errors).toHaveLength(0);
    expect(toText(combined.transferred)).toBe("3/4");
    const husband = combined.shares.find((share) => share.key === "husband");
    const nextSons = combined.shares.filter((share) => share.key === "sons");
    expect(husband ? toText(husband.share) : "0").toBe("1/4");
    expect(nextSons).toHaveLength(1);
    expect(toText(nextSons[0].share)).toBe("3/4");
    expect(compare(add(sum(combined.shares.map((s) => s.share)), combined.treasury), ONE)).toBe(0);
  });

  it("reduces a group when one of several wives later dies", () => {
    const first = calculate({ ...EMPTY_INPUT, wives: 2, father: true }, "maliki");
    const combined = applySuccessiveDeath(
      first,
      "wives",
      { ...EMPTY_INPUT, sons: 1 },
      "maliki",
    );
    const remainingWives = combined.shares.find(
      (share) => share.key === "wives" && share.label.startsWith("Wife"),
    );
    expect(remainingWives?.count).toBe(1);
    expect(toText(combined.transferred)).toBe("1/8");
  });
});
