import { onResize } from "../layout/resize";
import type { EffectHandle } from "../types";

export interface HexGridOptions {
  colors?: string[];
  /** Hexagon radius in px. Default 12. */
  cell?: number;
  /** Pulse speed multiplier. Default 1. */
  speed?: number;
}

interface Hex {
  cx: number;
  cy: number;
  phase: number;
  color: string;
}

/**
 * Honeycomb background: a grid of hexagons pulsing in opacity.
 * Works as a subtle panel filler.
 */
export function createHexGrid(canvas: HTMLCanvasElement, options: HexGridOptions = {}): EffectHandle {
  const { colors = ["#00f6ff", "#2f81f7"], cell = 12, speed = 1 } = options;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("[dv] createHexGrid: 2d context unavailable");

  let hexes: Hex[] = [];
  let rafId = 0;
  let running = false;
  let w = 0;
  let h = 0;

  const hexPath = (cx: number, cy: number, r: number) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    w = rect.width;
    h = rect.height;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    hexes = [];
    const stepX = cell * 1.75;
    const stepY = cell * 1.5;
    for (let row = 0, y = cell; y < h; row++, y += stepY) {
      const offset = row % 2 === 0 ? 0 : stepX / 2;
      for (let x = cell + offset; x < w; x += stepX) {
        hexes.push({
          cx: x,
          cy: y,
          phase: Math.random() * Math.PI * 2,
          color: colors[Math.floor(Math.random() * colors.length)]!,
        });
      }
    }
  };

  const frame = (now: number) => {
    const t = (now / 1000) * speed;
    ctx.clearRect(0, 0, w, h);
    for (const hex of hexes) {
      const pulse = (Math.sin(t * 0.8 + hex.phase) + 1) / 2;
      ctx.globalAlpha = 0.05 + pulse * 0.3;
      ctx.strokeStyle = hex.color;
      ctx.lineWidth = 1;
      hexPath(hex.cx, hex.cy, cell * 0.8);
      ctx.stroke();
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
