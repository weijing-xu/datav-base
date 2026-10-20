import { onResize } from "../layout/resize";
import type { EffectHandle } from "../types";

export interface DialRingOptions {
  /** Ring color. Default "#00f6ff". */
  color?: string;
  /** Number of outer ticks. Default 60. */
  ticks?: number;
  /** Rotation speed in rad/s. Default 0.4. */
  speed?: number;
  /** Counter-rotate the inner ring. Default true. */
  counter?: boolean;
}

/** Rotating dial ring: ticked outer circle + dashed inner ring spinning opposite ways. */
export function createDialRing(canvas: HTMLCanvasElement, options: DialRingOptions = {}): EffectHandle {
  const { color = "#00f6ff", ticks = 60, speed = 0.4, counter = true } = options;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("[dv] createDialRing: 2d context unavailable");

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
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) / 2 - 4;
    if (r <= 0) return;

    // outer ticks
    const a0 = t * speed;
    ctx.strokeStyle = color;
    for (let i = 0; i < ticks; i++) {
      const a = a0 + (i / ticks) * Math.PI * 2;
      const long = i % 5 === 0;
      const r1 = r - (long ? 8 : 4);
      ctx.globalAlpha = long ? 0.9 : 0.45;
      ctx.lineWidth = long ? 1.6 : 1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.stroke();
    }

    // inner dashed ring, counter-rotating
    const rIn = r * 0.68;
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 8]);
    ctx.lineDashOffset = counter ? -t * speed * rIn : t * speed * rIn;
    ctx.beginPath();
    ctx.arc(cx, cy, rIn, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // glow dot riding the inner ring
    const a1 = -a0 * 1.4;
    const gx = cx + Math.cos(a1) * rIn;
    const gy = cy + Math.sin(a1) * rIn;
    const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, 5);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.4, color);
    grad.addColorStop(1, "transparent");
    ctx.globalAlpha = 1;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(gx, gy, 5, 0, Math.PI * 2);
    ctx.fill();
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
