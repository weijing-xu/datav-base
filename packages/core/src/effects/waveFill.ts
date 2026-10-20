import { onResize } from "../layout/resize";
import type { EffectHandle } from "../types";

export interface WaveFillOptions {
  /** Fill percentage 0-100. */
  value: number;
  /** [frontWave, backWave] colors. Default cyan shades. */
  colors?: [string, string];
  /** Wave amplitude in px. Default 6. */
  amplitude?: number;
  /** Horizontal phase speed. Default 1. */
  speed?: number;
  /** How many waves ride on the surface. Default 2. */
  waveNum?: number;
}

export interface WaveFillHandle extends EffectHandle {
  setValue: (value: number) => void;
}

/**
 * Water-level-pond style fill: two sine waves clipped inside the canvas,
 * rising to `value`% of the height. Classic DataV water ball look when
 * the canvas sits inside a circular clip container.
 */
export function createWaveFill(canvas: HTMLCanvasElement, options: WaveFillOptions): WaveFillHandle {
  const {
    colors = ["rgba(0,246,255,0.85)", "rgba(47,129,247,0.5)"],
    amplitude = 6,
    speed = 1,
    waveNum = 2,
  } = options;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("[dv] createWaveFill: 2d context unavailable");

  let value = Math.min(Math.max(options.value, 0), 100);
  let display = value; // eased toward value
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

  const drawWave = (levelY: number, phase: number, color: string) => {
    ctx.beginPath();
    ctx.moveTo(0, levelY);
    const k = (Math.PI * 2 * waveNum) / w;
    for (let x = 0; x <= w; x += 4) {
      ctx.lineTo(x, levelY + Math.sin(x * k + phase) * amplitude);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };

  const frame = (now: number) => {
    display += (value - display) * 0.05;
    const levelY = h * (1 - display / 100) + amplitude;
    const t = (now / 1000) * speed;
    ctx.clearRect(0, 0, w, h);
    drawWave(levelY, t * 1.4, colors[1]);
    drawWave(levelY, -t * 1.1, colors[0]);
    if (running) rafId = requestAnimationFrame(frame);
  };

  const offResize = onResize(canvas, resize);
  resize();
  running = true;
  rafId = requestAnimationFrame(frame);

  return {
    setValue(v: number) {
      value = Math.min(Math.max(v, 0), 100);
    },
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
