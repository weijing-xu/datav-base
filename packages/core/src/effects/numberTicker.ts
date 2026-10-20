export interface NumberTickerOptions {
  /** Starting value. Default 0. */
  from?: number;
  /** Target value. */
  to: number;
  /** Animation duration in ms. Default 2000. */
  duration?: number;
  /** Decimal places to keep. Default 0. */
  decimals?: number;
  /** Thousands separator. Pass "" to disable. Default ",". */
  separator?: string;
  /** Easing (t in [0,1] -> [0,1]). Default easeOutCubic. */
  easing?: (t: number) => number;
  /** Called every frame with the formatted string. */
  onUpdate: (formatted: string, raw: number) => void;
}

export interface NumberTicker {
  /** Animate to a new value from the current one. */
  setValue: (to: number) => void;
  stop: () => void;
  destroy: () => void;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function formatNumber(value: number, decimals = 0, separator = ","): string {
  const fixed = value.toFixed(decimals);
  if (!separator) return fixed;
  const [int, frac] = fixed.split(".");
  const grouped = int!.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return frac === undefined ? grouped : `${grouped}.${frac}`;
}

/** rAF-driven number ticker; the framework wrapper only feeds onUpdate into its render. */
export function createNumberTicker(options: NumberTickerOptions): NumberTicker {
  const {
    from = 0,
    duration = 2000,
    decimals = 0,
    separator = ",",
    easing = easeOutCubic,
    onUpdate,
  } = options;

  let current = from;
  let rafId = 0;
  let startAt = 0;
  let fromAt = from;
  let toAt = options.to;
  let running = false;

  const frame = (now: number) => {
    const t = Math.min((now - startAt) / duration, 1);
    current = fromAt + (toAt - fromAt) * easing(t);
    onUpdate(formatNumber(current, decimals, separator), current);
    if (t < 1) {
      rafId = requestAnimationFrame(frame);
    } else {
      running = false;
    }
  };

  const start = () => {
    cancelAnimationFrame(rafId);
    startAt = performance.now();
    running = true;
    rafId = requestAnimationFrame(frame);
  };

  start();

  return {
    setValue(to: number) {
      fromAt = current;
      toAt = to;
      if (running) {
        startAt = performance.now();
      } else {
        start();
      }
    },
    stop() {
      running = false;
      cancelAnimationFrame(rafId);
    },
    destroy() {
      running = false;
      cancelAnimationFrame(rafId);
    },
  };
}
