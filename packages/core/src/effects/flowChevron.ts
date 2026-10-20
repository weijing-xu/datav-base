import { onResize } from "../layout/resize";
import type { EffectHandle } from "../types";

export interface FlowChevronOptions {
  /** Chevron color. Default "#00f6ff". */
  color?: string;
  /** Chevron count. Default 5. */
  count?: number;
  /** Flow direction. Default "right". */
  direction?: "left" | "right";
  /** Speed in cycles/s. Default 0.35. */
  speed?: number;
}

/** Flowing chevron arrows (>>>>) sweeping across the box, alpha-waved. */
export function createFlowChevron(canvas: HTMLCanvasElement, options: FlowChevronOptions = {}): EffectHandle {
  const { color = "#00f6ff", count = 5, direction = "right", speed = 0.35 } = options;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("[dv] createFlowChevron: 2d context unavailable");

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
    const cy = h / 2;
    const ch = h * 0.42;
    const gap = w / count;
    const phase = (t * speed) % 1;
    const dir = direction === "right" ? 1 : -1;

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.6;
    ctx.lineCap = "round";
    for (let i = 0; i < count; i++) {
      const u = (i / count + phase) % 1;
      const x = direction === "right" ? u * w : (1 - u) * w;
      // fade in/out along travel
      const alpha = Math.sin(u * Math.PI) * 0.85;
      ctx.globalAlpha = Math.max(0.05, alpha);
      ctx.beginPath();
      ctx.moveTo(x - dir * gap * 0.28, cy - ch);
      ctx.lineTo(x, cy);
      ctx.lineTo(x - dir * gap * 0.28, cy + ch);
      ctx.stroke();
    }
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
