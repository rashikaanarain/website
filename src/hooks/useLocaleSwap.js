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

/**
 * Client-side locale swap with a polished crossfade + height morph.
 * Keeps real language URLs via history, so share links and back/forward work.
 * Uses the View Transitions API when available; otherwise FLIP-style height + fade.
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

  const morphHeightAndFade = useCallback(async (nextLocale) => {
    const stage = stageRef.current;
    if (!stage) {
      commitLocale(nextLocale);
      return;
    }

    const fromHeight = stage.getBoundingClientRect().height;
    stage.dataset.localeSwap = "exit";
    stage.style.height = `${fromHeight}px`;
    stage.style.overflow = "clip";

    await wait(170);
    commitLocale(nextLocale);

    // Let React paint the new locale at the locked height, then measure natural size.
    stage.dataset.localeSwap = "measure";
    stage.style.height = "auto";
    const toHeight = stage.getBoundingClientRect().height;
    stage.style.height = `${fromHeight}px`;
    // Force layout so the enter transition starts from the previous height.
    void stage.offsetHeight;
    stage.dataset.localeSwap = "enter";
    stage.style.height = `${toHeight}px`;

    await wait(380);
    stage.style.height = "";
    stage.style.overflow = "";
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

      if (typeof document.startViewTransition === "function") {
        try {
          const transition = document.startViewTransition(() => {
            commitLocale(nextLocale);
          });
          await transition.finished;
          return;
        } catch {
          // Fall through to the CSS morph path when View Transitions aborts.
        }
      }

      await morphHeightAndFade(nextLocale);
    } finally {
      busyRef.current = false;
      setIsSwapping(false);
    }
  }, [commitLocale, locale, morphHeightAndFade]);

  return {
    locale,
    isSwapping,
    stageRef,
    switchLocale,
    pathForLocale,
  };
}
