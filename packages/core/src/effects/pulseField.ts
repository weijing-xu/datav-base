import { onResize } from "../layout/resize";
import type { EffectHandle } from "../types";

export interface PulseFieldOptions {
  /** Dot colors, cycled per dot. Default DataV-ish cyan/blue. */
  colors?: string[];
  /** Number of dots. Default 40. */
  points?: number;
  /** Pulse speed multiplier. Default 1. */
  speed?: number;
  /** Max dot radius in px. Default 3. */
  maxRadius?: number;
}

interface Dot {
  x: number;
  y: number;
  phase: number;
  freq: number;
  radius: number;
  color: string;
}

const DEFAULT_COLORS = ["#00f6ff", "#2f81f7", "#48ffe0"];

/**
 * Canvas field of pulsing dots — the generic engine behind "decoration" components.
 * Owns DPR scaling and resize; framework wrappers mount it on a canvas element.
 */
export function createPulseField(canvas: HTMLCanvasElement, options: PulseFieldOptions = {}): EffectHandle {
  const { colors = DEFAULT_COLORS, points = 40, speed = 1, maxRadius = 3 } = options;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("[dv] createPulseField: 2d context unavailable");

  let dots: Dot[] = [];
  let rafId = 0;
  let running = false;
  let w = 0;
  let h = 0;

  const seed = () => {
    dots = Array.from({ length: points }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      phase: Math.random() * Math.PI * 2,
      freq: 0.6 + Math.random() * 1.4,
      radius: 0.5 + Math.random() * maxRadius,
      color: colors[i % colors.length]!,
    }));
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    w = rect.width;
    h = rect.height;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  };

  const frame = (now: number) => {
    ctx.clearRect(0, 0, w, h);
    const t = (now / 1000) * speed;
    for (const d of dots) {
      const pulse = (Math.sin(t * d.freq + d.phase) + 1) / 2;
      ctx.globalAlpha = 0.25 + pulse * 0.75;
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.radius * (0.4 + pulse * 0.6), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
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
