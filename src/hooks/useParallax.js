import { useEffect } from "react";

const MAX_TRAVEL = 48;

export function useParallax() {
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const layers = [...document.querySelectorAll("[data-parallax]")];

    if (motionQuery.matches || layers.length === 0) return undefined;

    let frame = 0;

    const update = () => {
      const viewportCenter = window.innerHeight / 2;

      layers.forEach((layer) => {
        const rect = layer.getBoundingClientRect();
        const distance = rect.top + rect.height / 2 - viewportCenter;
        const speed = Number(layer.dataset.parallax || 0.08);
        const travel = Math.max(-MAX_TRAVEL, Math.min(MAX_TRAVEL, distance * -speed));
        layer.style.setProperty("--parallax-y", `${travel.toFixed(2)}px`);
      });

      frame = 0;
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
}
