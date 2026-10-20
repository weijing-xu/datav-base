import { onResize } from "../layout/resize";
import type { EffectHandle } from "../types";

export interface StripeFlowOptions {
  color?: string;
  /** Diagonal stripe spacing in px. Default 14. */
  spacing?: number;
  /** Stripe width in px. Default 4. */
  thickness?: number;
  /** Pixels per second of diagonal travel. Default 30. */
  speed?: number;
  /** Stripe angle in degrees. Default 45. */
  angle?: number;
}

/** Decoration7: diagonal stripes flowing across the panel (HUD texture). */
export function createStripeFlow(canvas: HTMLCanvasElement, options: StripeFlowOptions = {}): EffectHandle {
  const { color = "#00f6ff", spacing = 14, thickness = 4, speed = 30, angle = 45 } = options;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("[dv] createStripeFlow: 2d context unavailable");

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
    const rad = (angle * Math.PI) / 180;
    const diag = Math.sqrt(w * w + h * h);
    const offset = (t * speed) % spacing;
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(rad);
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.12;
    ctx.lineWidth = thickness;
    for (let x = -diag / 2 - spacing + offset; x < diag / 2 + spacing; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, -diag / 2);
      ctx.lineTo(x, diag / 2);
      ctx.stroke();
    }
    ctx.restore();

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
