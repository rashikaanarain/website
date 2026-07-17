import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

const MORPH_MS = 520;
const MORPH_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export function localeFromPath(pathname = window.location.pathname) {
  return pathname === "/hi" || pathname.startsWith("/hi/") ? "hi" : "en";
}

export function pathForLocale(locale) {
  return locale === "hi" ? "/hi/" : "/";
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function nextFrame() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

/** Read the natural content height, even while the stage is height-locked. */
export function measureNaturalHeight(stage, layer = stage.querySelector(".locale-swap-layer")) {
  const previous = {
    height: stage.style.height,
    maxHeight: stage.style.maxHeight,
    overflow: stage.style.overflow,
    transition: stage.style.transition,
  };

  stage.style.transition = "none";
  stage.style.height = "auto";
  stage.style.maxHeight = "none";
  stage.style.overflow = "visible";

  const height = Math.ceil(Math.max(
    stage.scrollHeight,
    stage.getBoundingClientRect().height,
    layer?.scrollHeight ?? 0,
    layer?.getBoundingClientRect().height ?? 0,
  ));

  stage.style.height = previous.height;
  stage.style.maxHeight = previous.maxHeight;
  stage.style.overflow = previous.overflow;
  stage.style.transition = previous.transition;

  return height;
}

function clearStageInline(stage) {
  stage.style.height = "";
  stage.style.maxHeight = "";
  stage.style.overflow = "";
  stage.style.transition = "";
  stage.style.overflowAnchor = "";
  delete stage.dataset.localeSwap;
}

function animateHeight(stage, fromHeight, toHeight) {
  // Prefer WAAPI — more reliable than CSS transitions after inline height locks.
  if (typeof stage.animate === "function") {
    return new Promise((resolve) => {
      const animation = stage.animate(
        [
          { height: `${fromHeight}px` },
          { height: `${toHeight}px` },
        ],
        {
          duration: MORPH_MS,
          easing: MORPH_EASE,
          fill: "forwards",
        },
      );

      const finish = () => {
        animation.cancel();
        resolve();
      };

      animation.addEventListener("finish", finish, { once: true });
      animation.addEventListener("cancel", finish, { once: true });
    });
  }

  return new Promise((resolve) => {
    stage.style.transition = "none";
    stage.style.height = `${fromHeight}px`;
    void stage.offsetHeight;
    stage.style.transition = `height ${MORPH_MS}ms ${MORPH_EASE}`;
    stage.style.height = `${toHeight}px`;

    let done = false;
    const complete = () => {
      if (done) return;
      done = true;
      stage.removeEventListener("transitionend", onEnd);
      window.clearTimeout(fallback);
      resolve();
    };
    const onEnd = (event) => {
      if (event.target === stage && event.propertyName === "height") complete();
    };

    stage.addEventListener("transitionend", onEnd);
    const fallback = window.setTimeout(complete, MORPH_MS + 80);
  });
}

/**
 * Client-side locale swap with a smooth expand/collapse of page height.
 * Content stays fully opaque so the canvas never flashes through.
 * Real locale URLs stay in history for share links and back/forward.
 */
export function useLocaleSwap(initialLocale) {
  const [locale, setLocale] = useState(
    () => initialLocale || localeFromPath(),
  );
  const [isSwapping, setIsSwapping] = useState(false);
  const stageRef = useRef(null);
  const busyRef = useRef(false);

  useEffect(() => {
    function onPopState() {
      setLocale(localeFromPath());
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const commitLocale = useCallback((nextLocale) => {
    flushSync(() => {
      setLocale(nextLocale);
    });

    const nextPath = pathForLocale(nextLocale);
    const current = window.location.pathname;
    const normalized = current.endsWith("/") || current === "" ? current : `${current}/`;
    if (normalized !== nextPath && current !== nextPath.replace(/\/$/, "")) {
      window.history.pushState({ locale: nextLocale }, "", nextPath);
    }
  }, []);

  const morphToLocale = useCallback(async (nextLocale) => {
    const stage = stageRef.current;
    if (!stage) {
      commitLocale(nextLocale);
      return;
    }

    const layer = stage.querySelector(".locale-swap-layer");
    const fromHeight = Math.ceil(stage.getBoundingClientRect().height);

    stage.dataset.localeSwap = "morph";
    stage.style.overflowAnchor = "none";
    stage.style.transition = "none";
    stage.style.height = `${fromHeight}px`;
    stage.style.overflow = "clip";
    void stage.offsetHeight;

    commitLocale(nextLocale);

    // Let React paint the new copy, then measure its natural height.
    await nextFrame();
    await nextFrame();

    const toHeight = measureNaturalHeight(stage, layer);

    if (Math.abs(toHeight - fromHeight) < 1) {
      clearStageInline(stage);
      return;
    }

    // Re-assert the start height so the animation always has a real delta.
    stage.style.transition = "none";
    stage.style.height = `${fromHeight}px`;
    stage.style.overflow = "clip";
    void stage.offsetHeight;

    await animateHeight(stage, fromHeight, toHeight);
    clearStageInline(stage);
  }, [commitLocale]);

  const switchLocale = useCallback(async (nextLocale) => {
    if (busyRef.current || nextLocale === locale) return;
    busyRef.current = true;
    setIsSwapping(true);

    try {
      if (prefersReducedMotion()) {
        commitLocale(nextLocale);
        return;
      }

      await morphToLocale(nextLocale);
    } finally {
      busyRef.current = false;
      setIsSwapping(false);
    }
  }, [commitLocale, locale, morphToLocale]);

  return {
    locale,
    isSwapping,
    stageRef,
    switchLocale,
    pathForLocale,
  };
}
