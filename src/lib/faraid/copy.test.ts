import { describe, expect, it } from "vitest";
import { EMPTY_INPUT, type HeirKey } from "./types";
import { ESTATE_SOURCES, HEIR_SOURCES, STEP_SOURCES } from "./copy";

describe("source maps", () => {
  it("gives every heir at least one source", () => {
    for (const key of Object.keys(EMPTY_INPUT) as HeirKey[]) {
      expect(HEIR_SOURCES[key].length, key).toBeGreaterThan(0);
    }
  });

  it("gives every estate deduction a source except the gross amount field", () => {
    expect(ESTATE_SOURCES.debts.length).toBeGreaterThan(0);
    expect(ESTATE_SOURCES.funeral.length).toBeGreaterThan(0);
    expect(ESTATE_SOURCES.wasiyyah.length).toBeGreaterThan(0);
  });

  it("gives every question step at least one source", () => {
    for (const [step, ids] of Object.entries(STEP_SOURCES)) {
      expect(ids.length, step).toBeGreaterThan(0);
    }
  });
});
