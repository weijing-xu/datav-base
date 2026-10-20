import { onResize } from "../layout/resize";
import type { EffectHandle } from "../types";

export interface LoadingRingOptions {
  color?: string;
  /** Seconds per revolution. Default 1.2. */
  period?: number;
  /** Arc length as fraction of circle. Default 0.75. */
  arc?: number;
  /** Ring thickness in px. Default 4. */
  thickness?: number;
}

/** Spinning arc ring used by the DvLoading component (text is a slot overlay). */
export function createLoadingRing(canvas: HTMLCanvasElement, options: LoadingRingOptions = {}): EffectHandle {
  const { color = "#00f6ff", period = 1.2, arc = 0.75, thickness = 4 } = options;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("[dv] createLoadingRing: 2d context unavailable");

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
    const r = Math.min(w, h) / 2 - thickness;
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = thickness;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    const angle = (t / period) * Math.PI * 2;
    ctx.globalAlpha = 1;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(cx, cy, r, angle, angle + Math.PI * 2 * arc);
    ctx.stroke();

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
