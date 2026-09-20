import { describe, expect, it } from "vitest";
import { settleEstate } from "./estate";

describe("settleEstate", () => {
  it("passes the full gross amount when there are no deductions", () => {
    const result = settleEstate({ gross: 90000, debts: 0, funeral: 0, wasiyyah: 0 });
    expect(result.net).toBe(90000);
    expect(result.distributable).toBe(90000);
    expect(result.wasiyyahAllowed).toBe(0);
    expect(result.wasiyyahCapped).toBe(false);
  });

  it("subtracts debts and funeral costs first", () => {
    const result = settleEstate({ gross: 100000, debts: 20000, funeral: 5000, wasiyyah: 0 });
    expect(result.net).toBe(75000);
    expect(result.distributable).toBe(75000);
  });

  it("leaves nothing when debts and funeral exceed the estate", () => {
    const result = settleEstate({ gross: 10000, debts: 8000, funeral: 4000, wasiyyah: 1000 });
    expect(result.net).toBe(0);
    expect(result.wasiyyahAllowed).toBe(0);
    expect(result.distributable).toBe(0);
    expect(result.wasiyyahCapped).toBe(false);
  });

  it("allows a will up to one-third of the net estate", () => {
    const result = settleEstate({ gross: 90000, debts: 0, funeral: 0, wasiyyah: 20000 });
    expect(result.wasiyyahCap).toBe(30000);
    expect(result.wasiyyahAllowed).toBe(20000);
    expect(result.distributable).toBe(70000);
    expect(result.wasiyyahCapped).toBe(false);
  });

  it("caps a will at one-third of the net estate", () => {
    const result = settleEstate({ gross: 90000, debts: 0, funeral: 0, wasiyyah: 50000 });
    expect(result.wasiyyahAllowed).toBe(30000);
    expect(result.distributable).toBe(60000);
    expect(result.wasiyyahCapped).toBe(true);
  });

  it("computes the one-third cap after debts and funeral costs", () => {
    const result = settleEstate({ gross: 120000, debts: 20000, funeral: 10000, wasiyyah: 40000 });
    expect(result.net).toBe(90000);
    expect(result.wasiyyahCap).toBe(30000);
    expect(result.wasiyyahAllowed).toBe(30000);
    expect(result.distributable).toBe(60000);
  });

  it("treats negative values as zero", () => {
    const result = settleEstate({ gross: -10, debts: -5, funeral: -1, wasiyyah: -2 });
    expect(result.gross).toBe(0);
    expect(result.distributable).toBe(0);
  });
});
