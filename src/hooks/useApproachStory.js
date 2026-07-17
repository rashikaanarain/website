import { useEffect, useRef, useState } from "react";

export function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

export function smoothstep(value) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

/** Map a 0–1 value into a later window so marks finish after copy arrives. */
export function remapProgress(value, start = 0.12, end = 0.78) {
  return smoothstep((value - start) / Math.max(0.0001, end - start));
}

/**
 * Continuous scroll storytelling for the approach section.
 * Writes CSS custom properties so the sticky diagram and step copy scrub
 * with geometry (and reverse cleanly on scroll-up).
 */
export function useApproachStory(stepCount = 3) {
  const flowRef = useRef(null);
  const stepRefs = useRef([]);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const flow = flowRef.current;
    const steps = stepRefs.current.filter(Boolean).slice(0, stepCount);
    if (!flow || steps.length === 0) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = null;

    function setStaticStory() {
      const last = Math.max(0, steps.length - 1);
      setActiveStage(last);
      steps.forEach((step) => {
        step.style.setProperty("--step-progress", "1");
        step.style.setProperty("--mark-progress", "1");
      });
      flow.style.setProperty("--story-progress", "1");
      flow.style.setProperty("--story-phase", String(steps.length));
      flow.style.setProperty("--find", "1");
      flow.style.setProperty("--scope", "1");
      flow.style.setProperty("--solve", "1");
      flow.style.setProperty("--field-shift", "0px");
      flow.style.setProperty("--scope-shift", "0px");
      flow.style.setProperty("--outcome-shift", "0px");
      flow.style.setProperty("--backdrop-x", "0px");
      flow.style.setProperty("--backdrop-y", "0px");
      flow.dataset.storyMode = "static";
    }

    function updateFlow() {
      frameId = null;
      const viewport = window.innerHeight || 1;
      const focusLine = viewport * 0.46;
      // Enter lower in the viewport so scrub has a long, readable run.
      const scrubStart = viewport * 0.92;
      const scrubFull = viewport * 0.34;
      const scrubRange = Math.max(1, scrubStart - scrubFull);

      let closest = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      const progresses = [];

      steps.forEach((step, index) => {
        const rect = step.getBoundingClientRect();
        const anchor = rect.top + Math.min(rect.height * 0.38, 140);
        const distance = Math.abs(anchor - focusLine);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = index;
        }

        const stepProgress = smoothstep((scrubStart - anchor) / scrubRange);
        const markProgress = remapProgress(stepProgress, 0.18, 0.82);
        progresses[index] = stepProgress;
        step.style.setProperty("--step-progress", stepProgress.toFixed(4));
        step.style.setProperty("--mark-progress", markProgress.toFixed(4));
      });

      const find = progresses[0] ?? 0;
      const scope = progresses[1] ?? 0;
      const solve = progresses[2] ?? 0;
      // Continuous 0→3 phase from cumulative chapter progress.
      const storyPhase = clamp01(find) + clamp01(scope) + clamp01(solve);

      setActiveStage((current) => (current === closest ? current : closest));

      flow.style.setProperty("--find", find.toFixed(4));
      flow.style.setProperty("--scope", scope.toFixed(4));
      flow.style.setProperty("--solve", solve.toFixed(4));
      flow.style.setProperty("--story-phase", storyPhase.toFixed(4));

      const flowRect = flow.getBoundingClientRect();
      const travel = Math.max(1, flowRect.height + viewport * 0.35);
      const storyProgress = clamp01((viewport - flowRect.top) / travel);
      // Keep parallax within the design system 48px ceiling.
      const offset = (storyProgress - 0.5) * 2;
      flow.style.setProperty("--story-progress", storyProgress.toFixed(4));
      flow.style.setProperty("--field-shift", `${(offset * -16).toFixed(2)}px`);
      flow.style.setProperty("--scope-shift", `${(offset * 10).toFixed(2)}px`);
      flow.style.setProperty("--outcome-shift", `${(offset * 14).toFixed(2)}px`);
      flow.style.setProperty("--backdrop-x", `${(offset * 22).toFixed(2)}px`);
      flow.style.setProperty("--backdrop-y", `${(offset * -30).toFixed(2)}px`);
      flow.dataset.storyMode = "scrub";
      flow.dataset.activeStage = String(closest);
    }

    function requestUpdate() {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updateFlow);
      }
    }

    function addMotionListeners() {
      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", requestUpdate);
    }

    function removeMotionListeners() {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    }

    function applyMotionPreference() {
      removeMotionListeners();
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      frameId = null;

      if (reduceMotion.matches) {
        setStaticStory();
        return;
      }

      addMotionListeners();
      requestUpdate();
    }

    applyMotionPreference();
    reduceMotion.addEventListener?.("change", applyMotionPreference);

    return () => {
      removeMotionListeners();
      reduceMotion.removeEventListener?.("change", applyMotionPreference);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      steps.forEach((step) => {
        step.style.removeProperty("--step-progress");
        step.style.removeProperty("--mark-progress");
      });
      [
        "--story-progress",
        "--story-phase",
        "--find",
        "--scope",
        "--solve",
        "--field-shift",
        "--scope-shift",
        "--outcome-shift",
        "--backdrop-x",
        "--backdrop-y",
      ].forEach((name) => flow.style.removeProperty(name));
      delete flow.dataset.storyMode;
      delete flow.dataset.activeStage;
    };
  }, [stepCount]);

  return { flowRef, stepRefs, activeStage };
}
