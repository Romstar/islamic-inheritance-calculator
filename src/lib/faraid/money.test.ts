import { describe, expect, it } from "vitest";
import { allocateAmounts, parseMoneyField } from "./money";
import { frac } from "./fraction";

describe("parseMoneyField", () => {
  it("treats empty as zero", () => {
    expect(parseMoneyField("")).toEqual({ amount: 0, invalid: false });
    expect(parseMoneyField("  ")).toEqual({ amount: 0, invalid: false });
  });
  it("accepts numbers and commas", () => {
    expect(parseMoneyField("1000")).toEqual({ amount: 1000, invalid: false });
    expect(parseMoneyField("1,250.50")).toEqual({ amount: 1250.5, invalid: false });
  });
  it("rejects negatives and non-numbers", () => {
    expect(parseMoneyField("-1").invalid).toBe(true);
    expect(parseMoneyField("abc").invalid).toBe(true);
  });
});

describe("allocateAmounts", () => {
  it("splits a total so cents sum exactly", () => {
    const amounts = allocateAmounts([frac(1, 3), frac(1, 3), frac(1, 3)], 100);
    const cents = amounts.map((value) => Math.round(value * 100));
    expect(cents.reduce((sum, value) => sum + value, 0)).toBe(10000);
  });
  it("returns empty for no shares", () => {
    expect(allocateAmounts([], 50)).toEqual([]);
  });
});
