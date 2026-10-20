import { onResize } from "../layout/resize";
import type { EffectHandle } from "../types";

export interface OrbitDotsOptions {
  color?: string;
  /** Number of orbiting dots. Default 12. */
  count?: number;
  /** Radians per second. Default 0.6. */
  speed?: number;
  /** Dot radius in px. Default 2.5. */
  dotRadius?: number;
}

/** Decoration5: glowing dots orbiting an elliptical ring. */
export function createOrbitDots(canvas: HTMLCanvasElement, options: OrbitDotsOptions = {}): EffectHandle {
  const { color = "#00f6ff", count = 12, speed = 0.6, dotRadius = 2.5 } = options;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("[dv] createOrbitDots: 2d context unavailable");

  let rafId = 0;
  let running = false;
  let w = 0;
  let h = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    w = rect.width;
    h = rect.height;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const frame = (now: number) => {
    const t = now / 1000;
    const cx = w / 2;
    const cy = h / 2;
    const rx = Math.max(1, w / 2 - dotRadius * 3);
    const ry = Math.max(1, Math.min(h / 2 - dotRadius * 3, rx * 0.42));
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.18;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < count; i++) {
      const a = t * speed + (i / count) * Math.PI * 2;
      const x = cx + Math.cos(a) * rx;
      const y = cy + Math.sin(a) * ry;
      const depth = (Math.sin(a) + 1) / 2; // front dots brighter/larger
      ctx.globalAlpha = 0.35 + depth * 0.65;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, dotRadius * (0.7 + depth * 0.6), 0, Math.PI * 2);
      ctx.fill();
    }

    if (running) rafId = requestAnimationFrame(frame);
  };

  const offResize = onResize(canvas, resize);
  resize();
  running = true;
  rafId = requestAnimationFrame(frame);

  return {
    start() {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(rafId);
    },
    resize,
    destroy() {
      running = false;
      cancelAnimationFrame(rafId);
      offResize();
      ctx.clearRect(0, 0, w, h);
    },
  };
}
