import { onResize } from "../layout/resize";
import type { EffectHandle } from "../types";

export interface ScanlineOptions {
  color?: string;
  /** Seconds for one left→right→left pass. Default 3. */
  period?: number;
  /** Bar width in px. Default 60. */
  barWidth?: number;
  /** Ping-pong back and forth instead of wrapping. Default true. */
  pingPong?: boolean;
}

/**
 * A soft light bar sweeping horizontally across the canvas —
 * the classic decoration under big-screen titles.
 */
export function createScanline(canvas: HTMLCanvasElement, options: ScanlineOptions = {}): EffectHandle {
  const { color = "#00f6ff", period = 3, barWidth = 60, pingPong = true } = options;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("[dv] createScanline: 2d context unavailable");

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
    const raw = (t % period) / period;
    const p = pingPong ? (raw < 0.5 ? raw * 2 : 2 - raw * 2) : raw;
    const x = p * (w + barWidth) - barWidth / 2;

    ctx.clearRect(0, 0, w, h);
    const grad = ctx.createLinearGradient(x - barWidth / 2, 0, x + barWidth / 2, 0);
    grad.addColorStop(0, "transparent");
    grad.addColorStop(0.5, color);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(x - barWidth / 2, 0, barWidth, h);
    // bright center line
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillRect(x - 0.5, 0, 1, h);

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
