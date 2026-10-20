import type { EffectHandle } from "../types";

export interface ScrollLoopOptions {
  /** Scroll speed in px/s. Default 30. */
  speed?: number;
  /** Pause on hover. Default true. */
  hoverPause?: boolean;
}

/**
 * Vertically loops a track element by translating it upward.
 * The caller must render the content TWICE inside `track`; the loop wraps
 * at half the track height. Framework shells own the data/rows.
 */
export function createScrollLoop(track: HTMLElement, options: ScrollLoopOptions = {}): EffectHandle {
  const { speed = 30, hoverPause = true } = options;

  let offset = 0;
  let last = 0;
  let paused = false;
  let running = false;
  let rafId = 0;

  const frame = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.1); // clamp tab-switch jumps
    last = now;
    if (!paused) {
      const half = track.scrollHeight / 2;
      if (half > 0) {
        offset += speed * dt;
        if (offset >= half) offset -= half;
        track.style.transform = `translateY(${-offset}px)`;
      }
    }
    if (running) rafId = requestAnimationFrame(frame);
  };

  const onEnter = () => {
    if (hoverPause) paused = true;
  };
  const onLeave = () => {
    paused = false;
  };
  track.addEventListener("mouseenter", onEnter);
  track.addEventListener("mouseleave", onLeave);

  const start = () => {
    if (running) return;
    running = true;
    last = performance.now();
    rafId = requestAnimationFrame(frame);
  };
  start();

  return {
    start,
    stop() {
      running = false;
      cancelAnimationFrame(rafId);
    },
    resize() {
      /* height is re-read each frame; nothing cached */
    },
    destroy() {
      running = false;
      cancelAnimationFrame(rafId);
      track.removeEventListener("mouseenter", onEnter);
      track.removeEventListener("mouseleave", onLeave);
      track.style.transform = "";
    },
  };
}
