import { onResize } from "../layout/resize";
import type { EffectHandle } from "../types";

export interface FlyPoint {
  /** Normalized x in [0,1]. */
  x: number;
  /** Normalized y in [0,1]. */
  y: number;
  name?: string;
}

export interface FlyLine {
  /** Index into `points`. */
  from: number;
  /** Index into `points`. */
  to: number;
}

export interface FlylinesOptions {
  points: FlyPoint[];
  /**
   * Optional projector: when set, point.x/y are raw geo coordinates (e.g.
   * lng/lat) and are mapped via `project(x, y, w, h)` instead of the
   * normalized [0,1] stretch. Pass `createGeoProjector(geoJson)` to align
   * with a GeoJSON base map.
   */
  project?: (x: number, y: number, w: number, h: number) => [number, number];
  lines: FlyLine[];
  /** Line/head color. Default "#00f6ff". */
  color?: string;
  /** Ripple/endpoint color. Defaults to `color`. */
  accent?: string;
  /** Head-dot travel speed, fraction of a curve per second. Default 0.25. */
  speed?: number;
  /** Draw expanding endpoint ripples. Default true. */
  ripple?: boolean;
  /** Show endpoint labels (point.name). Default false. */
  labels?: boolean;
}

interface Curve {
  x0: number;
  y0: number;
  cx: number;
  cy: number;
  x1: number;
  y1: number;
  phase: number;
}

const quad = (p0: number, c: number, p1: number, t: number) =>
  (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * c + t * t * p1;

/**
 * Migration/flyline engine: quadratic bezier curves with a traveling head dot
 * and pulsing endpoints. Coordinates are normalized so it works over any
 * background layer (map image, grid, GeoJSON renderer).
 */
export function createFlylines(canvas: HTMLCanvasElement, options: FlylinesOptions): EffectHandle {
  const { points, lines, color = "#00f6ff", speed = 0.25, ripple = true, labels = false } = options;
  const project = options.project;
  const px = (p: FlyPoint): [number, number] => (project ? project(p.x, p.y, w, h) : [p.x * w, p.y * h]);
  const accent = options.accent ?? color;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("[dv] createFlylines: 2d context unavailable");

  let curves: Curve[] = [];
  let rafId = 0;
  let running = false;
  let w = 0;
  let h = 0;

  const rebuild = () => {
    curves = lines
      .map((line, i) => {
        const a = points[line.from];
        const b = points[line.to];
        if (!a || !b) return null;
        const [x0, y0] = px(a);
        const [x1, y1] = px(b);
        const mx = (x0 + x1) / 2;
        const my = (y0 + y1) / 2;
        // control point: perpendicular offset, arc height ~ 18% of chord length
        const dx = x1 - x0;
        const dy = y1 - y0;
        const len = Math.hypot(dx, dy) || 1;
        const off = len * 0.18;
        return {
          x0,
          y0,
          cx: mx - (dy / len) * off,
          cy: my - Math.abs(dx / len) * off - off * 0.5,
          x1,
          y1,
          phase: i / Math.max(lines.length, 1),
        };
      })
      .filter((c): c is Curve => c !== null);
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    w = rect.width;
    h = rect.height;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rebuild();
  };

  const drawPoint = (p: FlyPoint, t: number, i: number) => {
    const [x, y] = px(p);
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fill();
    if (ripple) {
      const r = ((t * 0.6 + i * 0.37) % 1) * 14 + 3;
      ctx.globalAlpha = 1 - (r - 3) / 14;
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    if (labels && p.name) {
      ctx.fillStyle = "rgba(213,241,255,0.9)";
      ctx.font = "11px sans-serif";
      ctx.fillText(p.name, x + 6, y - 6);
    }
  };

  const frame = (now: number) => {
    const t = now / 1000;
    ctx.clearRect(0, 0, w, h);
    for (const c of curves) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.moveTo(c.x0, c.y0);
      ctx.quadraticCurveTo(c.cx, c.cy, c.x1, c.y1);
      ctx.stroke();
      ctx.globalAlpha = 1;
      // traveling head dot
      const ht = (t * speed + c.phase) % 1;
      const hx = quad(c.x0, c.cx, c.x1, ht);
      const hy = quad(c.y0, c.cy, c.y1, ht);
      const grad = ctx.createRadialGradient(hx, hy, 0, hx, hy, 5);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.4, color);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(hx, hy, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    points.forEach((p, i) => drawPoint(p, t, i));
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
