import { describe, expect, test } from "bun:test";
import {
  problemChapterProgress,
  problemSceneWeight,
  problemStoryFrame,
  problemStoryPosition,
  segmentProgress,
} from "./useProblemsStory.js";

describe("problem story geometry", () => {
  test("chapter progress scrubs from zero to one", () => {
    expect(problemChapterProgress(900, 900)).toBe(0);
    expect(problemChapterProgress(200, 900)).toBe(1);
    expect(problemChapterProgress(500, 900)).toBeGreaterThan(0);
    expect(problemChapterProgress(500, 900)).toBeLessThan(1);
  });

  test("the same geometry always produces the same value in reverse", () => {
    const positions = [850, 620, 400, 620, 850];
    const values = positions.map((top) => problemChapterProgress(top, 900));
    expect(values[1]).toBe(values[3]);
    expect(values[0]).toBe(values[4]);
  });

  test("story position interpolates between chapter centers", () => {
    const rects = [
      { top: 0, height: 500 },
      { top: 500, height: 500 },
      { top: 1000, height: 500 },
    ];
    expect(problemStoryPosition(rects, 1000)).toBeCloseTo(0.5, 5);
  });

  test("adjacent scene weights crossfade without leaving the unit interval", () => {
    expect(problemSceneWeight(0, 0.35)).toBe(1);
    expect(problemSceneWeight(1, 0.35)).toBe(0);
    expect(problemSceneWeight(0, 0.5)).toBeCloseTo(0.5, 5);
    expect(problemSceneWeight(1, 0.5)).toBeCloseTo(0.5, 5);
    expect(problemSceneWeight(0, 0.65)).toBe(0);
    expect(problemSceneWeight(1, 0.65)).toBe(1);
    expect(problemSceneWeight(2, 0.35)).toBe(0);
  });

  test("segment progress respects stagger windows", () => {
    expect(segmentProgress(0.2, 0.3, 0.7)).toBe(0);
    expect(segmentProgress(0.5, 0.3, 0.7)).toBeCloseTo(0.5, 5);
    expect(segmentProgress(0.9, 0.3, 0.7)).toBe(1);
  });

  test("reduced motion completes the selected visual without changing selection", () => {
    const rects = [
      { top: -520, height: 500 },
      { top: -20, height: 500 },
      { top: 480, height: 500 },
    ];
    const moving = problemStoryFrame(rects, 900, false, false);
    const reduced = problemStoryFrame(rects, 900, false, true);

    expect(reduced.activeIndex).toBe(moving.activeIndex);
    expect(reduced.chapters[reduced.activeIndex].motionProgress).toBe(1);
    expect(reduced.chapters[reduced.activeIndex].sceneWeight).toBe(1);
    reduced.chapters.forEach(({ motionProgress, sceneWeight }, index) => {
      expect(motionProgress).toBe(1);
      expect(sceneWeight).toBe(index === reduced.activeIndex ? 1 : 0);
    });
  });

  test("desktop chapters animate while their center crosses the pinned stage", () => {
    const frame = problemStoryFrame([{ top: 520, height: 560 }], 900, false, false);

    expect(frame.chapters[0].motionProgress).toBe(0);

    const centered = problemStoryFrame([{ top: 170, height: 560 }], 900, false, false);
    expect(centered.chapters[0].motionProgress).toBeGreaterThan(0.5);
    expect(centered.chapters[0].motionProgress).toBeLessThan(0.8);
  });

  test("compact chapters keep scrubbing around the inline visual", () => {
    const rects = [{ top: 160, height: 760 }];
    const compact = problemStoryFrame(rects, 844, true, false);

    expect(compact.chapters[0].motionProgress).toBeGreaterThan(0);
    expect(compact.chapters[0].motionProgress).toBeLessThan(1);
  });
});
