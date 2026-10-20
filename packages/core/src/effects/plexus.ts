import { onResize } from "../layout/resize";
import type { EffectHandle } from "../types";

export interface PlexusOptions {
  /** Dot color + line color. */
  color?: string;
  /** Number of particles. Default 60. */
  points?: number;
  /** Max distance for connecting lines in px. Default 120. */
  linkDist?: number;
  /** Particle speed px/s. Default 18. */
  speed?: number;
}

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/** Plexus background: drifting particles connected by proximity lines. */
export function createPlexus(canvas: HTMLCanvasElement, options: PlexusOptions = {}): EffectHandle {
  const { color = "#00f6ff", points = 60, linkDist = 120, speed = 18 } = options;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("[dv] createPlexus: 2d context unavailable");

  let rafId = 0;
  let running = false;
  let last = 0;
  let w = 0;
  let h = 0;
  let ps: P[] = [];

  const seed = () => {
    ps = Array.from({ length: points }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * speed * 2,
      vy: (Math.random() - 0.5) * speed * 2,
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
    if (last === 0) last = now;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    ctx.clearRect(0, 0, w, h);

    for (const p of ps) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = 0.7;
    for (let i = 0; i < ps.length; i++) {
      const a = ps[i];
      if (!a) continue;
      for (let j = i + 1; j < ps.length; j++) {
        const b = ps[j];
        if (!b) continue;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < linkDist * linkDist) {
          ctx.globalAlpha = (1 - Math.sqrt(d2) / linkDist) * 0.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.8;
    for (const p of ps) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
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
      last = 0;
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
