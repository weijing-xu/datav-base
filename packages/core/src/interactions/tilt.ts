import type { EffectHandle } from "../types";

export interface TiltOptions {
  /** Max tilt angle in degrees. Default 10. */
  max?: number;
  /** Hover scale. Default 1.02. */
  scale?: number;
  /** Perspective in px. Default 600. */
  perspective?: number;
}

/** Pointer-driven 3D tilt for any element (tilt card wrapper). */
export function createTilt(el: HTMLElement, options: TiltOptions = {}): EffectHandle {
  const { max = 10, scale = 1.02, perspective = 600 } = options;

  const onMove = (e: MouseEvent) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transition = "transform 0.08s ease-out";
    el.style.transform = `perspective(${perspective}px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) scale(${scale})`;
  };
  const onLeave = () => {
    el.style.transition = "transform 0.4s ease";
    el.style.transform = "";
  };

  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseleave", onLeave);
  el.style.willChange = "transform";

  return {
    start() {},
    stop() {},
    resize() {},
    destroy() {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.style.transform = "";
      el.style.willChange = "";
    },
  };
}
