import { onResize } from "../layout/resize";
import type { EffectHandle } from "../types";

export interface RingProgressHandle extends EffectHandle {
  /** Animate the ring to a new percentage (0-100). */
  setValue(value: number): void;
}

export interface RingProgressOptions {
  /** Percent 0-100. */
  value: number;
  /** [start, end] gradient colors. */
  colors?: [string, string];
  /** Ring thickness in px. Default 8. */
  thickness?: number;
  /** Seconds for a 0→100 sweep. Default 1.5. */
  duration?: number;
  /** Draw a glowing head dot on the arc tip. Default true. */
  head?: boolean;
}

const clamp = (v: number) => Math.max(0, Math.min(100, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Percentage ring with gradient arc, glow head and animated transitions. */
export function createRingProgress(canvas: HTMLCanvasElement, options: RingProgressOptions): RingProgressHandle {
  const { colors = ["#00f6ff", "#39d0ff"], thickness = 8, duration = 1.5, head = true } = options;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("[dv] createRingProgress: 2d context unavailable");

  let rafId = 0;
  let running = false;
  let w = 0;
  let h = 0;

  let from = 0;
  let shown = 0;
  let target = clamp(options.value);
  let animStart = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    w = rect.width;
    h = rect.height;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const draw = (pct: number) => {
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) / 2 - thickness;
    const a0 = -Math.PI / 2;
    const a1 = a0 + (pct / 100) * Math.PI * 2;
    ctx.clearRect(0, 0, w, h);

    // track
    ctx.strokeStyle = colors[0];
    ctx.globalAlpha = 0.12;
    ctx.lineWidth = thickness;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    if (pct > 0.2) {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, colors[0]);
      grad.addColorStop(1, colors[1]);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = grad;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(cx, cy, r, a0, a1);
      ctx.stroke();

      if (head) {
        const hx = cx + Math.cos(a1) * r;
        const hy = cy + Math.sin(a1) * r;
        ctx.shadowColor = colors[1];
        ctx.shadowBlur = thickness * 1.5;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(hx, hy, thickness * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  };

  const frame = (now: number) => {
    if (animStart === 0) animStart = now;
    const span = (Math.abs(target - from) / 100) * duration * 1000;
    const p = span <= 0 ? 1 : Math.min(1, (now - animStart) / span);
    shown = from + (target - from) * easeOut(p);
    draw(shown);
    if (p < 1 && running) {
      rafId = requestAnimationFrame(frame);
    } else {
      running = false;
    }
  };

  const kick = () => {
    cancelAnimationFrame(rafId);
    animStart = 0;
    running = true;
    rafId = requestAnimationFrame(frame);
  };

  const offResize = onResize(canvas, () => {
    resize();
    draw(shown);
  });
  resize();
  kick();

  return {
    start: kick,
    stop() {
      running = false;
      cancelAnimationFrame(rafId);
    },
    resize,
    setValue(value: number) {
      from = shown;
      target = clamp(value);
      kick();
    },
    destroy() {
      running = false;
      cancelAnimationFrame(rafId);
      offResize();
      ctx.clearRect(0, 0, w, h);
    },
  };
}
