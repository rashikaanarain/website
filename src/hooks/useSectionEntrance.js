import { useEffect } from "react";

/**
 * One-time scroll entrance for major page beats.
 * Adds `is-visible` to elements carrying `data-entrance` when they enter the viewport.
 * Disabled entirely for reduced motion; content is visible by default.
 */
export function useSectionEntrance() {
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return undefined;

    const nodes = [...document.querySelectorAll("[data-entrance]")];
    if (!nodes.length) return undefined;

    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);
}
