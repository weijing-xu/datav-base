import { onResize } from "../layout/resize";
import type { EffectHandle } from "../types";

export interface ConicalItem {
  name: string;
  value: number;
}

export interface ConicalChartHandle extends EffectHandle {
  setData(rows: ConicalItem[]): void;
}

export interface ConicalChartOptions {
  rows: ConicalItem[];
  /** Bar gradient [head, tail]. */
  colors?: [string, string];
  unit?: string;
  /** Max bar value; defaults to largest row. */
  max?: number;
  /** Row height in px. Default 30. */
  rowHeight?: number;
}

/** Horizontal cone (trapezoid) bars with labels, animating in on mount. */
export function createConicalChart(canvas: HTMLCanvasElement, options: ConicalChartOptions): ConicalChartHandle {
  const { colors = ["#00f6ff", "rgba(0,246,255,0.08)"], unit = "", rowHeight = 30 } = options;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("[dv] createConicalChart: 2d context unavailable");

  let rows = options.rows;
  let rafId = 0;
  let running = false;
  let w = 0;
  let h = 0;
  let progress = 0;
  let startAt = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    w = rect.width;
    h = rect.height;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const draw = (p: number) => {
    ctx.clearRect(0, 0, w, h);
    const peak = Math.max(options.max ?? 0, ...rows.map((r) => r.value), 1);
    const labelW = 84;
    const valueW = 72;
    const barW = w - labelW - valueW - 16;
    const gap = Math.max(4, (h - rows.length * rowHeight) / Math.max(1, rows.length));

    ctx.font = "12px 'Rajdhani', 'DIN Alternate', sans-serif";
    rows.forEach((row, i) => {
      const y = i * (rowHeight + gap) + gap / 2;
      const bw = (row.value / peak) * barW * p;
      const tip = Math.min(rowHeight * 0.32, bw);

      // cone bar: full height at left, tapering to a point
      const grad = ctx.createLinearGradient(labelW, 0, labelW + Math.max(bw, 1), 0);
      grad.addColorStop(0, colors[0]);
      grad.addColorStop(1, colors[1]);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(labelW, y);
      ctx.lineTo(labelW + Math.max(bw - tip, 0), y);
      ctx.lineTo(labelW + bw, y + rowHeight / 2);
      ctx.lineTo(labelW + Math.max(bw - tip, 0), y + rowHeight);
      ctx.lineTo(labelW, y + rowHeight);
      ctx.closePath();
      ctx.fill();

      // labels
      ctx.fillStyle = "#8fb3cf";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(row.name, 0, y + rowHeight / 2, labelW - 8);
      ctx.fillStyle = colors[0];
      ctx.textAlign = "right";
      ctx.fillText(`${row.value}${unit}`, w, y + rowHeight / 2, valueW);
      ctx.textAlign = "left";
    });
  };

  const frame = (now: number) => {
    if (startAt === 0) startAt = now;
    progress = Math.min(1, (now - startAt) / 900);
    draw(progress * progress); // ease-in
    if (progress < 1 && running) rafId = requestAnimationFrame(frame);
    else running = false;
  };

  const kick = () => {
    cancelAnimationFrame(rafId);
    startAt = 0;
    running = true;
    rafId = requestAnimationFrame(frame);
  };

  const offResize = onResize(canvas, () => {
    resize();
    draw(progress);
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
    setData(next: ConicalItem[]) {
      rows = next;
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
