import { describe, expect, test } from "bun:test";
import { shouldLoadHeroVideo } from "./HeroMedia.jsx";

describe("hero media loading policy", () => {
  test("loads motion media on a compact viewport when the user has not requested a fallback", () => {
    expect(shouldLoadHeroVideo({
      effectiveType: "4g",
      prefersReducedMotion: false,
      saveData: false,
    })).toBe(true);
  });

  test("keeps the poster for reduced motion and constrained data connections", () => {
    expect(shouldLoadHeroVideo({
      effectiveType: "4g",
      prefersReducedMotion: true,
      saveData: false,
    })).toBe(false);

    expect(shouldLoadHeroVideo({
      effectiveType: "2g",
      prefersReducedMotion: false,
      saveData: false,
    })).toBe(false);
  });
});
