import type { EffectHandle } from "../types";

export interface TypewriterHandle extends EffectHandle {
  /** Replace the target text and restart typing. */
  setText(text: string): void;
}

export interface TypewriterOptions {
  /** Full text to type. */
  text: string;
  /** Characters per second. Default 20. */
  speed?: number;
  /** Restart from the beginning after finishing. Default false. */
  loop?: boolean;
  /** Pause in ms before restarting when loop is on. Default 1500. */
  loopDelay?: number;
  /** Called with the currently visible text each step. */
  onUpdate: (current: string, done: boolean) => void;
}

/** Character-by-character typing engine (no DOM — the shell renders `onUpdate` output). */
export function createTypewriter(options: TypewriterOptions): TypewriterHandle {
  const { text, speed = 20, loop = false, loopDelay = 1500, onUpdate } = options;

  let current = text;
  let shown = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let running = false;
  let destroyed = false;

  const tick = () => {
    if (!running || destroyed) return;
    shown += 1;
    const done = shown >= current.length;
    onUpdate(current.slice(0, shown), done);
    if (!done) {
      timer = setTimeout(tick, 1000 / speed);
    } else if (loop) {
      timer = setTimeout(() => {
        shown = 0;
        tick();
      }, loopDelay);
    }
  };

  const start = () => {
    if (running || destroyed) return;
    running = true;
    tick();
  };
  const stop = () => {
    running = false;
    if (timer) clearTimeout(timer);
    timer = null;
  };

  start();

  return {
    start,
    stop,
    resize() {},
    setText(next: string) {
      current = next;
      shown = 0;
      if (running) {
        if (timer) clearTimeout(timer);
        tick();
      } else {
        onUpdate("", current.length === 0);
      }
    },
    destroy() {
      destroyed = true;
      stop();
    },
  };
}
