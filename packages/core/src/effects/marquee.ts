import { onResize } from "../layout/resize";
import type { EffectHandle } from "../types";

export interface MarqueeOptions {
  /** Pixels per second. Default 60. */
  speed?: number;
  /** Pause while hovered. Default true. */
  hoverPause?: boolean;
}

/**
 * Horizontal seamless marquee. The track must contain its content rendered
 * TWICE back-to-back (shells do `[...items, ...items]`); the engine translates
 * the track left and wraps at half the track width.
 */
export function createMarquee(track: HTMLElement, options: MarqueeOptions = {}): EffectHandle {
  const { speed = 60, hoverPause = true } = options;

  let rafId = 0;
  let running = false;
  let paused = false;
  let offset = 0;
  let last = 0;
  let half = 0;

  const measure = () => {
    half = track.scrollWidth / 2;
  };

  const frame = (now: number) => {
    if (last === 0) last = now;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    if (!paused && half > 0) {
      offset += speed * dt;
      if (offset >= half) offset -= half;
      track.style.transform = `translateX(${-offset}px)`;
    }
    if (running) rafId = requestAnimationFrame(frame);
  };

  const onEnter = () => {
    if (hoverPause) paused = true;
  };
  const onLeave = () => {
    paused = false;
  };
  const host = track.parentElement ?? track;
  host.addEventListener("mouseenter", onEnter);
  host.addEventListener("mouseleave", onLeave);

  const offResize = onResize(track, measure);
  measure();
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
    resize: measure,
    destroy() {
      running = false;
      cancelAnimationFrame(rafId);
      offResize();
      host.removeEventListener("mouseenter", onEnter);
      host.removeEventListener("mouseleave", onLeave);
      track.style.transform = "";
    },
  };
}
