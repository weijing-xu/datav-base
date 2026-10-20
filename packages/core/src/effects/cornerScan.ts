import { onResize } from "../layout/resize";
import type { EffectHandle } from "../types";

export interface CornerScanOptions {
  /** Bracket color. Default "#00f6ff". */
  color?: string;
  /** Bracket arm length in px. Default 18. */
  size?: number;
  /** Glow pulse speed in Hz. Default 1.2. */
  speed?: number;
}

/** Four pulsing corner brackets (HUD reticle decoration). */
export function createCornerScan(canvas: HTMLCanvasElement, options: CornerScanOptions = {}): EffectHandle {
  const { color = "#00f6ff", size = 18, speed = 1.2 } = options;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("[dv] createCornerScan: 2d context unavailable");

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

  const draw = (t: number) => {
    ctx.clearRect(0, 0, w, h);
    const s = Math.min(size, w / 4, h / 4);
    const pulse = 0.6 + 0.4 * Math.sin(t * Math.PI * 2 * speed);
    const inset = 3;
    const corners: [number, number, number, number][] = [
      [inset, inset, 1, 1],
      [w - inset, inset, -1, 1],
      [inset, h - inset, 1, -1],
      [w - inset, h - inset, -1, -1],
    ];
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8 * pulse;
    for (const [x, y, dx, dy] of corners) {
      ctx.globalAlpha = pulse;
      ctx.beginPath();
      ctx.moveTo(x + dx * s, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + dy * s);
      ctx.stroke();
      // inner tick
      ctx.globalAlpha = pulse * 0.5;
      ctx.beginPath();
      ctx.moveTo(x + dx * s * 0.55, y);
      ctx.lineTo(x + dx * s * 0.55, y + dy * s * 0.28);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  };

  const frame = (now: number) => {
    draw(now / 1000);
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
