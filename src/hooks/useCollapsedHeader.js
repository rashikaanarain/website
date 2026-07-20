import { useEffect, useState } from "react";

const COLLAPSE_AFTER = 64;

/**
 * True once the page has scrolled past the hero top band.
 * Used to collapse the floating header into a compact left cluster.
 */
export function useCollapsedHeader(threshold = COLLAPSE_AFTER) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const next = window.scrollY > threshold;
      setCollapsed((current) => (current === next ? current : next));
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
  }, [threshold]);

  return collapsed;
}
