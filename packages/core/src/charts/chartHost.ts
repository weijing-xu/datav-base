import { onResize } from "../layout/resize";

/** Minimal echarts-compatible surface so @dv/core stays dependency-free. */
export interface EChartInstanceLike {
  setOption(option: unknown, opts?: unknown): void;
  resize(): void;
  dispose(): void;
}

export interface EChartsLike {
  init(el: HTMLElement, theme?: string, opts?: { renderer?: "canvas" | "svg" }): EChartInstanceLike;
  registerTheme?(name: string, theme: object): void;
}

export interface ChartHostOptions {
  /** Registered theme name. Default "dv-dark". */
  theme?: string;
  /** Theme object passed to echarts.registerTheme (e.g. dvDarkTheme). */
  themeObject?: object;
  renderer?: "canvas" | "svg";
}

export interface ChartHost {
  setOption: (option: unknown, opts?: unknown) => void;
  resize: () => void;
  destroy: () => void;
  /** Escape hatch to the underlying echarts instance. */
  chart: EChartInstanceLike;
}

/**
 * Owns chart lifecycle: init with the dv theme, ResizeObserver-driven resize,
 * dispose on destroy. The shell passes its `echarts` module in so the core
 * never hard-depends on it.
 */
export function createChartHost(
  el: HTMLElement,
  echarts: EChartsLike,
  options: ChartHostOptions = {},
): ChartHost {
  const { theme = "dv-dark", themeObject, renderer } = options;
  if (themeObject && echarts.registerTheme) {
    echarts.registerTheme(theme, themeObject);
  }
  const chart = echarts.init(el, theme, { renderer });
  const off = onResize(el, () => chart.resize());

  return {
    chart,
    setOption(option, opts) {
      chart.setOption(option, opts);
    },
    resize() {
      chart.resize();
    },
    destroy() {
      off();
      chart.dispose();
    },
  };
}
