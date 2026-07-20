import { describe, expect, test } from "bun:test";
import { clamp01, remapProgress, smoothstep, titleMarkProgress } from "./useApproachStory.js";

describe("approach story scrub math", () => {
  test("clamp01 bounds values", () => {
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(0.4)).toBe(0.4);
    expect(clamp01(2)).toBe(1);
  });

  test("smoothstep eases edges", () => {
    expect(smoothstep(0)).toBe(0);
    expect(smoothstep(1)).toBe(1);
    expect(smoothstep(0.5)).toBeCloseTo(0.5, 5);
    expect(smoothstep(0.25)).toBeLessThan(0.25);
    expect(smoothstep(0.75)).toBeGreaterThan(0.75);
  });

  test("remapProgress delays mark fill until copy is underway", () => {
    expect(remapProgress(0)).toBe(0);
    expect(remapProgress(0.1)).toBe(0);
    expect(remapProgress(0.5)).toBeGreaterThan(0.2);
    expect(remapProgress(0.5)).toBeLessThan(0.9);
    expect(remapProgress(1)).toBe(1);
  });

  test("title underline scrubs reversibly through desktop and mobile viewports", () => {
    expect(titleMarkProgress(900, 1000, false)).toBe(0);
    expect(titleMarkProgress(480, 1000, false)).toBe(1);
    expect(titleMarkProgress(680, 1000, false)).toBeGreaterThan(0);
    expect(titleMarkProgress(680, 1000, false)).toBeLessThan(1);

    expect(titleMarkProgress(920, 1000, true)).toBe(0);
    expect(titleMarkProgress(360, 1000, true)).toBe(1);
    expect(titleMarkProgress(680, 1000, true)).toBeGreaterThan(0);
    expect(titleMarkProgress(680, 1000, true)).toBeLessThan(1);
  });
});
