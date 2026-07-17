import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

export function localeFromPath(pathname = window.location.pathname) {
  return pathname === "/hi" || pathname.startsWith("/hi/") ? "hi" : "en";
}

export function pathForLocale(locale) {
  return locale === "hi" ? "/hi/" : "/";
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function nextFrame() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

/**
 * Client-side locale swap with a height morph only.
 * Content stays fully opaque so the page never flashes through to white.
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
    const fromHeight = Math.round(stage.getBoundingClientRect().height);

    // Lock size first so the text rewrite cannot collapse the page to white gaps.
    stage.dataset.localeSwap = "morph";
    stage.style.height = `${fromHeight}px`;
    stage.style.overflow = "clip";

    commitLocale(nextLocale);

    // Two frames: one for React commit, one for layout of the longer/shorter copy.
    await nextFrame();
    await nextFrame();

    const toHeight = Math.round(
      layer?.getBoundingClientRect().height || stage.scrollHeight,
    );

    if (Math.abs(toHeight - fromHeight) < 2) {
      stage.style.height = "";
      stage.style.overflow = "";
      delete stage.dataset.localeSwap;
      return;
    }

    // Restart the height transition from the locked start value.
    stage.style.transition = "none";
    stage.style.height = `${fromHeight}px`;
    void stage.offsetHeight;
    stage.style.transition = "height 420ms cubic-bezier(0.22, 1, 0.36, 1)";
    stage.style.height = `${toHeight}px`;

    await wait(420);
    stage.style.height = "";
    stage.style.overflow = "";
    stage.style.transition = "";
    delete stage.dataset.localeSwap;
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
