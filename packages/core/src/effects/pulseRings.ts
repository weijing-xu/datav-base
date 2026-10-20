import { onResize } from "../layout/resize";
import type { EffectHandle } from "../types";

export interface PulseRingsOptions {
  color?: string;
  /** Number of concentric rings rippling outward. Default 3. */
  rings?: number;
  /** Seconds for one ring to expand fully. Default 3. */
  period?: number;
}

/** Decoration6: concentric rings expanding outward like a sonar pulse. */
export function createPulseRings(canvas: HTMLCanvasElement, options: PulseRingsOptions = {}): EffectHandle {
  const { color = "#00f6ff", rings = 3, period = 3 } = options;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("[dv] createPulseRings: 2d context unavailable");

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
    const maxR = Math.min(w, h) / 2 - 2;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = color;

    // solid center dot
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(2, maxR * 0.08), 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < rings; i++) {
      const p = ((t / period) + i / rings) % 1;
      ctx.globalAlpha = (1 - p) * 0.7;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(1, p * maxR), 0, Math.PI * 2);
      ctx.stroke();
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
