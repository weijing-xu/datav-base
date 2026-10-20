import { onResize } from "../layout/resize";
import type { EffectHandle } from "../types";

export interface RadarSweepOptions {
  color?: string;
  /** Seconds per revolution. Default 4. */
  period?: number;
  /** Number of concentric rings. Default 3. */
  rings?: number;
}

/**
 * Radar sweep: concentric circles + crosshair + a rotating gradient wedge.
 * Decoration component behind map/radar panels.
 */
export function createRadarSweep(canvas: HTMLCanvasElement, options: RadarSweepOptions = {}): EffectHandle {
  const { color = "#00f6ff", period = 4, rings = 3 } = options;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("[dv] createRadarSweep: 2d context unavailable");

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
    const r = Math.min(w, h) / 2 - 4;
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = color;
    for (let i = 1; i <= rings; i++) {
      ctx.globalAlpha = 0.15 + (i / rings) * 0.25;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, (r / rings) * i, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(cx - r, cy);
    ctx.lineTo(cx + r, cy);
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx, cy + r);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // rotating wedge
    const angle = (t / period) * Math.PI * 2;
    const spread = Math.PI / 3;
    const grad = ctx.createConicGradient
      ? ctx.createConicGradient(angle - spread, cx, cy)
      : null;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle - spread, angle);
    ctx.closePath();
    if (grad) {
      grad.addColorStop(0, "transparent");
      grad.addColorStop(1, color);
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.35;
    } else {
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.15;
    }
    ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;

    // leading edge
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
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
