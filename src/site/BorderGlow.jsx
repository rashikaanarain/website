import { useCallback, useEffect, useRef, useState } from "react";

function parseHSL(hslStr) {
  const match = String(hslStr).match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 330, s: 58, l: 66 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildBoxShadow(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const layers = [
    [0, 0, 0, 1, 100, true],
    [0, 0, 1, 0, 60, true],
    [0, 0, 3, 0, 50, true],
    [0, 0, 6, 0, 40, true],
    [0, 0, 15, 0, 30, true],
    [0, 0, 25, 2, 20, true],
    [0, 0, 50, 2, 10, true],
    [0, 0, 1, 0, 60, false],
    [0, 0, 3, 0, 50, false],
    [0, 0, 6, 0, 40, false],
    [0, 0, 15, 0, 30, false],
    [0, 0, 25, 2, 20, false],
    [0, 0, 50, 2, 10, false],
  ];
  return layers.map(([x, y, blur, spread, alpha, inset]) => {
    const a = Math.min(alpha * intensity, 100);
    return `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${a}%)`;
  }).join(", ");
}

function easeOutCubic(x) {
  return 1 - (1 - x) ** 3;
}

function easeInCubic(x) {
  return x * x * x;
}

function animateValue({
  start = 0,
  end = 100,
  duration = 1000,
  delay = 0,
  ease = easeOutCubic,
  onUpdate,
  onEnd,
}) {
  const t0 = performance.now() + delay;
  function tick(now) {
    const elapsed = now - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) requestAnimationFrame(tick);
    else onEnd?.();
  }
  if (delay > 0) {
    window.setTimeout(() => requestAnimationFrame(tick), delay);
  } else {
    requestAnimationFrame(tick);
  }
}

const GRADIENT_POSITIONS = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildMeshGradients(colors) {
  const gradients = [];
  for (let i = 0; i < 7; i += 1) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    gradients.push(`radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`);
  }
  gradients.push(`linear-gradient(${colors[0]} 0 100%)`);
  return gradients;
}

/**
 * React Bits BorderGlow — pointer-reactive edge glow.
 * Ported without Tailwind; brand-friendly defaults for OpenNyAI.
 */
export function BorderGlow({
  children,
  className = "",
  edgeSensitivity = 30,
  glowColor = "330 58 66",
  backgroundColor = "#da6eaa",
  borderRadius = 999,
  glowRadius = 28,
  glowIntensity = 0.85,
  coneSpread = 25,
  animated = false,
  colors = ["#e58dbb", "#da6eaa", "#8fe1bd"],
  fillOpacity = 0.42,
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorAngle, setCursorAngle] = useState(45);
  const [edgeProximity, setEdgeProximity] = useState(0);
  const [sweepActive, setSweepActive] = useState(false);
  const [allowMotion, setAllowMotion] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAllowMotion(!query.matches);
    sync();
    query.addEventListener?.("change", sync);
    return () => query.removeEventListener?.("change", sync);
  }, []);

  const getCenterOfElement = useCallback((el) => {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback((el, x, y) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }, [getCenterOfElement]);

  const getCursorAngle = useCallback((el, x, y) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }, [getCenterOfElement]);

  const handlePointerMove = useCallback((event) => {
    if (!allowMotion) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setEdgeProximity(getEdgeProximity(card, x, y));
    setCursorAngle(getCursorAngle(card, x, y));
  }, [allowMotion, getCursorAngle, getEdgeProximity]);

  useEffect(() => {
    if (!animated || !allowMotion) return undefined;
    const angleStart = 110;
    const angleEnd = 465;
    setSweepActive(true);
    setCursorAngle(angleStart);

    animateValue({ duration: 500, onUpdate: (v) => setEdgeProximity(v / 100) });
    animateValue({
      ease: easeInCubic,
      duration: 1500,
      end: 50,
      onUpdate: (v) => {
        setCursorAngle((angleEnd - angleStart) * (v / 100) + angleStart);
      },
    });
    animateValue({
      ease: easeOutCubic,
      delay: 1500,
      duration: 2250,
      start: 50,
      end: 100,
      onUpdate: (v) => {
        setCursorAngle((angleEnd - angleStart) * (v / 100) + angleStart);
      },
    });
    animateValue({
      ease: easeInCubic,
      delay: 2500,
      duration: 1500,
      start: 100,
      end: 0,
      onUpdate: (v) => setEdgeProximity(v / 100),
      onEnd: () => setSweepActive(false),
    });

    return undefined;
  }, [allowMotion, animated]);

  const colorSensitivity = edgeSensitivity + 20;
  const isVisible = isHovered || sweepActive;
  const borderOpacity = isVisible
    ? Math.max(0, (edgeProximity * 100 - colorSensitivity) / (100 - colorSensitivity))
    : 0;
  const glowOpacity = isVisible
    ? Math.max(0, (edgeProximity * 100 - edgeSensitivity) / (100 - edgeSensitivity))
    : 0;

  const meshGradients = buildMeshGradients(colors);
  const borderBg = meshGradients.map((g) => `${g} border-box`);
  const fillBg = meshGradients.map((g) => `${g} padding-box`);
  const angleDeg = `${cursorAngle.toFixed(3)}deg`;
  const radius = `${borderRadius}px`;

  return (
    <div
      ref={cardRef}
      className={`border-glow${className ? ` ${className}` : ""}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => {
        setIsHovered(false);
        if (!sweepActive) setEdgeProximity(0);
      }}
      style={{
        background: backgroundColor,
        borderRadius: radius,
      }}
    >
      <div
        className="border-glow-mesh border-glow-mesh-border"
        aria-hidden="true"
        style={{
          borderRadius: "inherit",
          background: [
            `linear-gradient(${backgroundColor} 0 100%) padding-box`,
            "linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box",
            ...borderBg,
          ].join(", "),
          opacity: allowMotion ? borderOpacity : 0,
          maskImage: `conic-gradient(from ${angleDeg} at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
          WebkitMaskImage: `conic-gradient(from ${angleDeg} at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
          transition: isVisible ? "opacity 0.25s ease-out" : "opacity 0.75s ease-in-out",
        }}
      />

      <div
        className="border-glow-mesh border-glow-mesh-fill"
        aria-hidden="true"
        style={{
          borderRadius: "inherit",
          background: fillBg.join(", "),
          maskImage: [
            "linear-gradient(to bottom, black, black)",
            "radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)",
            "radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)",
            "radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)",
            "radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)",
            "radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)",
            `conic-gradient(from ${angleDeg} at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
          ].join(", "),
          WebkitMaskImage: [
            "linear-gradient(to bottom, black, black)",
            "radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)",
            "radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)",
            "radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)",
            "radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)",
            "radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)",
            `conic-gradient(from ${angleDeg} at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
          ].join(", "),
          maskComposite: "subtract, add, add, add, add, add",
          WebkitMaskComposite: "source-out, source-over, source-over, source-over, source-over, source-over",
          opacity: allowMotion ? borderOpacity * fillOpacity : 0,
          transition: isVisible ? "opacity 0.25s ease-out" : "opacity 0.75s ease-in-out",
        }}
      />

      <span
        className="border-glow-outer"
        aria-hidden="true"
        style={{
          inset: `${-glowRadius}px`,
          borderRadius: "inherit",
          maskImage: `conic-gradient(from ${angleDeg} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
          WebkitMaskImage: `conic-gradient(from ${angleDeg} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
          opacity: allowMotion ? glowOpacity : 0,
          transition: isVisible ? "opacity 0.25s ease-out" : "opacity 0.75s ease-in-out",
        }}
      >
        <span
          className="border-glow-outer-core"
          style={{
            inset: `${glowRadius}px`,
            borderRadius: "inherit",
            boxShadow: buildBoxShadow(glowColor, glowIntensity),
          }}
        />
      </span>

      <div className="border-glow-content">
        {children}
      </div>
    </div>
  );
}

/** Accent CTA shell — Assembly Pink field with brand mesh glow. */
export function GlowAccentButton({
  children,
  className = "",
  animated = false,
  glowRadius = 20,
  glowIntensity = 0.7,
  fillOpacity = 0.28,
}) {
  return (
    <BorderGlow
      className={`border-glow-btn border-glow-btn-accent${className ? ` ${className}` : ""}`}
      backgroundColor="#da6eaa"
      borderRadius={999}
      glowRadius={glowRadius}
      glowIntensity={glowIntensity}
      edgeSensitivity={28}
      coneSpread={22}
      glowColor="330 58 66"
      colors={["#e58dbb", "#da6eaa", "#f6f1e6"]}
      fillOpacity={fillOpacity}
      animated={animated}
    >
      {children}
    </BorderGlow>
  );
}

/** Primary CTA shell — Civic Forest field with restrained pink edge. */
export function GlowPrimaryButton({ children, className = "", animated = false }) {
  return (
    <BorderGlow
      className={`border-glow-btn border-glow-btn-primary${className ? ` ${className}` : ""}`}
      backgroundColor="#111f26"
      borderRadius={999}
      glowRadius={22}
      glowIntensity={0.75}
      edgeSensitivity={30}
      coneSpread={22}
      glowColor="330 45 55"
      colors={["#da6eaa", "#1c3540", "#8fe1bd"]}
      fillOpacity={0.28}
      animated={animated}
    >
      {children}
    </BorderGlow>
  );
}

export default BorderGlow;
