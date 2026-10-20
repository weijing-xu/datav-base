import { onResize } from "../layout/resize";
import type { EffectHandle } from "../types";

export interface GaugeHandle extends EffectHandle {
  /** Animate the needle to a new value. */
  setValue(value: number): void;
}

export interface GaugeOptions {
  value: number;
  min?: number;
  max?: number;
  /** [track, arc, needle] colors. */
  colors?: [string, string, string];
  /** Number of major ticks. Default 10. */
  ticks?: number;
  /** Sweep angle in degrees centered on 12 o'clock. Default 240. */
  sweep?: number;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Dashboard gauge: arc track + glowing needle animating to the value. */
export function createGauge(canvas: HTMLCanvasElement, options: GaugeOptions): GaugeHandle {
  const { min = 0, max = 100, colors = ["rgba(0,246,255,0.15)", "#00f6ff", "#ffffff"], ticks = 10, sweep = 240 } = options;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("[dv] createGauge: 2d context unavailable");

  const clamp = (v: number) => Math.max(min, Math.min(max, v));

  let rafId = 0;
  let running = false;
  let w = 0;
  let h = 0;
  let from = min;
  let shown = min;
  let target = clamp(options.value);
  let animStart = 0;
  const duration = 900;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    w = rect.width;
    h = rect.height;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const angleOf = (v: number) => {
    const p = (v - min) / (max - min);
    const start = (-sweep / 2 - 90) * (Math.PI / 180);
    return start + p * sweep * (Math.PI / 180);
  };

  const draw = (v: number) => {
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) / 2 - 10;
    ctx.clearRect(0, 0, w, h);

    const startA = angleOf(min);
    const endA = angleOf(max);
    const valA = angleOf(v);

    // track arc
    ctx.strokeStyle = colors[0];
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(cx, cy, r, startA, endA);
    ctx.stroke();

    // value arc
    if (v > min) {
      ctx.strokeStyle = colors[1];
      ctx.shadowColor = colors[1];
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(cx, cy, r, startA, valA);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // ticks
    ctx.strokeStyle = colors[1];
    for (let i = 0; i <= ticks; i++) {
      const a = startA + (i / ticks) * (endA - startA);
      const inner = r - 14;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
      ctx.lineTo(cx + Math.cos(a) * (inner - 6), cy + Math.sin(a) * (inner - 6));
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // needle
    ctx.strokeStyle = colors[2];
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx - Math.cos(valA) * r * 0.12, cy - Math.sin(valA) * r * 0.12);
    ctx.lineTo(cx + Math.cos(valA) * (r - 22), cy + Math.sin(valA) * (r - 22));
    ctx.stroke();
    ctx.fillStyle = colors[1];
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();
  };

  const frame = (now: number) => {
    if (animStart === 0) animStart = now;
    const p = Math.min(1, (now - animStart) / duration);
    shown = from + (target - from) * easeOut(p);
    draw(shown);
    if (p < 1 && running) rafId = requestAnimationFrame(frame);
    else running = false;
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
