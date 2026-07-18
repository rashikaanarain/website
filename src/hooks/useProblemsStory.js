import { useEffect, useRef, useState } from "react";
import { clamp01, smoothstep } from "./useApproachStory.js";

export function segmentProgress(progress, start = 0, end = 1) {
  return smoothstep((progress - start) / Math.max(0.0001, end - start));
}

export function problemChapterProgress(chapterTop, viewportHeight, compact = false) {
  const viewport = Math.max(1, viewportHeight);
  const start = viewport * (compact ? 0.86 : 0.82);
  const end = viewport * (compact ? 0.34 : 0.28);
  return smoothstep((start - chapterTop) / Math.max(1, start - end));
}

export function problemStoryPosition(rects, viewportHeight, compact = false) {
  if (!rects.length) return 0;

  const focusLine = Math.max(1, viewportHeight) * (compact ? 0.7 : 0.5);
  const centers = rects.map((rect) => rect.top + rect.height * 0.5);

  if (focusLine <= centers[0]) return 0;
  if (focusLine >= centers[centers.length - 1]) return centers.length - 1;

  for (let index = 0; index < centers.length - 1; index += 1) {
    const start = centers[index];
    const end = centers[index + 1];
    if (focusLine >= start && focusLine <= end) {
      return index + clamp01((focusLine - start) / Math.max(1, end - start));
    }
  }

  return centers.length - 1;
}

export function problemSceneWeight(index, storyPosition) {
  const lower = Math.floor(storyPosition);
  const upper = Math.ceil(storyPosition);
  if (lower === upper) return index === lower ? 1 : 0;

  const blend = segmentProgress(storyPosition - lower, 0.38, 0.62);
  if (index === lower) return 1 - blend;
  if (index === upper) return blend;
  return 0;
}

export function problemStoryFrame(rects, viewportHeight, compact = false, reducedMotion = false) {
  const storyPosition = problemStoryPosition(rects, viewportHeight, compact);
  const activeIndex = Math.round(storyPosition);

  return {
    activeIndex,
    storyPosition,
    chapters: rects.map((rect, index) => {
      const progressAnchor = compact ? rect.top + rect.height * 0.52 : rect.top;
      const progress = problemChapterProgress(progressAnchor, viewportHeight, compact);
      const motionProgress = reducedMotion ? 1 : progress;
      return {
        active: index === activeIndex,
        progress,
        motionProgress,
        sceneWeight: reducedMotion ? (index === activeIndex ? 1 : 0) : problemSceneWeight(index, storyPosition),
        enter: segmentProgress(motionProgress, 0, 0.34),
        resolve: segmentProgress(motionProgress, 0.22, 0.72),
        outcome: segmentProgress(motionProgress, 0.58, 1),
      };
    }),
  };
}

function writeMotionFrame(node, chapterFrame) {
  const { motionProgress, enter, resolve, outcome } = chapterFrame;
  node.style.setProperty("--motion-progress", motionProgress.toFixed(4));
  node.style.setProperty("--phase-enter", enter.toFixed(4));
  node.style.setProperty("--phase-resolve", resolve.toFixed(4));
  node.style.setProperty("--phase-outcome", outcome.toFixed(4));
  node.style.setProperty("--release-token-x", `${(-2 + motionProgress * 86).toFixed(2)}%`);
  node.style.setProperty("--wage-coin-x", `${(-122 + motionProgress * 242).toFixed(2)}px`);
  node.style.setProperty("--wage-coin-rotation", `${(-72 + motionProgress * 90).toFixed(2)}deg`);
}

/**
 * Geometry-driven problem storytelling. All values are recalculated from the
 * current layout on every frame, so scrolling upward restores the exact prior
 * state instead of replaying a time-based animation.
 */
export function useProblemsStory(chapterCount = 3, resyncKey = "default") {
  const storyRef = useRef(null);
  const chapterRefs = useRef([]);
  const sceneRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const story = storyRef.current;
    if (!story) return undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = null;

    function currentChapters() {
      return chapterRefs.current.filter(Boolean).slice(0, chapterCount);
    }

    function currentScenes() {
      return sceneRefs.current.filter(Boolean).slice(0, chapterCount);
    }

    function updateStory() {
      frameId = null;
      const chapters = currentChapters();
      const scenes = currentScenes();
      if (!chapters.length) return;

      const viewport = window.innerHeight || 1;
      const compact = window.matchMedia("(max-width: 900px)").matches
        || window.matchMedia("(max-height: 719px)").matches;
      const rects = chapters.map((chapter) => chapter.getBoundingClientRect());
      const frame = problemStoryFrame(rects, viewport, compact, motionQuery.matches);

      chapters.forEach((chapter, index) => {
        const chapterFrame = frame.chapters[index];
        chapter.style.setProperty("--chapter-progress", chapterFrame.progress.toFixed(4));
        writeMotionFrame(chapter, chapterFrame);
        chapter.dataset.active = chapterFrame.active ? "true" : "false";
      });

      scenes.forEach((scene, index) => {
        const chapterFrame = frame.chapters[index];
        writeMotionFrame(scene, chapterFrame);
        scene.style.setProperty("--scene-weight", chapterFrame.sceneWeight.toFixed(4));
        scene.dataset.active = chapterFrame.active ? "true" : "false";
      });

      setActiveIndex((current) => (current === frame.activeIndex ? current : frame.activeIndex));
      story.style.setProperty("--problem-story-position", frame.storyPosition.toFixed(4));
      story.dataset.storyMode = motionQuery.matches ? "static" : "scrub";
      story.dataset.activeProblem = String(frame.activeIndex);
      story.dataset.storyCompact = compact ? "true" : "false";
    }

    function requestUpdate() {
      if (frameId === null) frameId = window.requestAnimationFrame(updateStory);
    }

    function addListeners() {
      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", requestUpdate);
    }

    function removeListeners() {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    }

    function applyMotionPreference() {
      removeListeners();
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      frameId = null;
      addListeners();
      window.requestAnimationFrame(() => window.requestAnimationFrame(requestUpdate));
    }

    applyMotionPreference();
    motionQuery.addEventListener?.("change", applyMotionPreference);

    return () => {
      removeListeners();
      motionQuery.removeEventListener?.("change", applyMotionPreference);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      [...currentChapters(), ...currentScenes()].forEach((node) => {
        [
          "--chapter-progress",
          "--motion-progress",
          "--phase-enter",
          "--phase-resolve",
          "--phase-outcome",
          "--release-token-x",
          "--wage-coin-x",
          "--wage-coin-rotation",
          "--scene-weight",
        ].forEach((name) => node.style.removeProperty(name));
        delete node.dataset.active;
      });
      story.style.removeProperty("--problem-story-position");
      delete story.dataset.storyMode;
      delete story.dataset.activeProblem;
      delete story.dataset.storyCompact;
    };
  }, [chapterCount, resyncKey]);

  return { storyRef, chapterRefs, sceneRefs, activeIndex };
}
