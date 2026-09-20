import { describe, expect, it } from "vitest";
import { EMPTY_INPUT, type HeirInput } from "./types";
import {
  clampStep,
  isStepVisible,
  pruneHiddenHeirs,
  visibleGrandparentFields,
  visibleSiblingFields,
  visibleStepIds,
} from "./steps";

function heirs(overrides: Partial<HeirInput>): HeirInput {
  return { ...EMPTY_INPUT, ...overrides };
}

describe("visible steps", () => {
  it("shows only the school step until a school is chosen", () => {
    expect(visibleStepIds(EMPTY_INPUT, null)).toEqual(["school"]);
    expect(clampStep("results", EMPTY_INPUT, null)).toBe("school");
    expect(clampStep("spouse", EMPTY_INPUT, null)).toBe("school");
  });

  it("always includes school, spouse, children, parents, and estate after a school is chosen", () => {
    const ids = visibleStepIds(EMPTY_INPUT, "hanafi");
    expect(ids[0]).toBe("school");
    expect(ids).toContain("spouse");
    expect(ids).toContain("children");
    expect(ids).toContain("parents");
    expect(ids).toContain("estate");
  });

  it("hides grandchildren when a son is present", () => {
    expect(isStepVisible("grandchildren", heirs({ sons: 1 }))).toBe(false);
    expect(isStepVisible("grandchildren", heirs({ daughters: 1 }))).toBe(true);
  });

  it("hides grandparents when both parents are alive", () => {
    expect(isStepVisible("grandparents", heirs({ father: true, mother: true }))).toBe(false);
    expect(visibleGrandparentFields(heirs({ father: true }))).toEqual({
      paternalGrandfather: false,
      paternalGrandmother: false,
      maternalGrandmother: true,
    });
    expect(visibleGrandparentFields(heirs({ mother: true }))).toEqual({
      paternalGrandfather: true,
      paternalGrandmother: false,
      maternalGrandmother: false,
    });
  });

  it("hides siblings when a son is present", () => {
    expect(isStepVisible("siblings", heirs({ sons: 1, mother: true }))).toBe(false);
  });

  it("keeps siblings when the father and mother are alive and there is no descendant", () => {
    expect(isStepVisible("siblings", heirs({ father: true, mother: true }))).toBe(true);
  });

  it("hides siblings when the father is alive and the mother is not", () => {
    expect(isStepVisible("siblings", heirs({ father: true }))).toBe(false);
  });

  it("hides maternal siblings when a daughter is present", () => {
    expect(visibleSiblingFields(heirs({ daughters: 1 })).maternalSiblings).toBe(false);
    expect(visibleSiblingFields(heirs({ daughters: 1 })).fullSisters).toBe(true);
  });

  it("hides extended relatives when a closer residuary exists", () => {
    expect(isStepVisible("extended", heirs({ sons: 1 }))).toBe(false);
    expect(isStepVisible("extended", heirs({ father: true }))).toBe(false);
    expect(isStepVisible("extended", heirs({ fullBrothers: 1 }))).toBe(false);
    expect(isStepVisible("extended", heirs({ daughters: 1, fullSisters: 1 }))).toBe(false);
  });

  it("keeps extended relatives when sisters take a fixed share only", () => {
    expect(isStepVisible("extended", heirs({ fullSisters: 2 }))).toBe(true);
  });

  it("moves a hidden step forward to the next visible step", () => {
    expect(clampStep("grandchildren", heirs({ sons: 1 }), "hanafi")).toBe("parents");
    expect(clampStep("results", heirs({ sons: 1 }), "hanafi")).toBe("results");
  });
});

describe("pruneHiddenHeirs", () => {
  it("clears grandchildren when a son is added", () => {
    const result = pruneHiddenHeirs(heirs({ sons: 1, grandsons: 2, granddaughters: 1 }));
    expect(result.grandsons).toBe(0);
    expect(result.granddaughters).toBe(0);
  });

  it("clears blocked grandparents", () => {
    const result = pruneHiddenHeirs(
      heirs({
        father: true,
        mother: true,
        paternalGrandfather: true,
        paternalGrandmother: true,
        maternalGrandmother: true,
      }),
    );
    expect(result.paternalGrandfather).toBe(false);
    expect(result.paternalGrandmother).toBe(false);
    expect(result.maternalGrandmother).toBe(false);
  });

  it("keeps sibling counts that reduce the mother's share", () => {
    const result = pruneHiddenHeirs(heirs({ father: true, mother: true, fullBrothers: 2 }));
    expect(result.fullBrothers).toBe(2);
  });

  it("clears extended relatives when the father is present", () => {
    const result = pruneHiddenHeirs(heirs({ father: true, fullUncles: 2, fullCousins: 1 }));
    expect(result.fullUncles).toBe(0);
    expect(result.fullCousins).toBe(0);
  });
});
